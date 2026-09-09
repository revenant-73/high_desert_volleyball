import { randomBytes, scrypt, timingSafeEqual, createHash } from 'node:crypto';
import { promisify } from 'node:util';
import { turso } from './turso';

const scryptAsync = promisify(scrypt);

export const ADMIN_SESSION_COOKIE = 'admin_session';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;
const VALID_ADMIN_ROLES = ['admin', 'super_admin'] as const;
const MAX_FAILED_LOGIN_ATTEMPTS = 5;
const LOGIN_RATE_LIMIT_WINDOW_MINUTES = 15;

export type AdminRole = (typeof VALID_ADMIN_ROLES)[number];

interface AdminRow {
  id: number;
  email: string;
  name?: string | null;
  role: AdminRole;
  active?: number | boolean;
  password_hash: string;
}

export interface SafeAdmin {
  id: number;
  email: string;
  name: string | null;
  role: AdminRole;
  active: number | boolean;
  created_at?: string;
  updated_at?: string;
  last_login_at?: string | null;
  password_updated_at?: string | null;
}

interface CookieJar {
  get(name: string): { value: string } | undefined;
  set(name: string, value: string, options: Record<string, unknown>): void;
  delete(name: string, options: Record<string, unknown>): void;
}

function normalizeEmail(email: FormDataEntryValue | string | null) {
  return String(email || '').trim().toLowerCase();
}

function hashSessionToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

function normalizeRole(role: FormDataEntryValue | string | null): AdminRole {
  const value = String(role || 'admin');
  return VALID_ADMIN_ROLES.includes(value as AdminRole) ? (value as AdminRole) : 'admin';
}

function getRowCount(row: Record<string, unknown> | undefined) {
  return Number(row?.count || row?.['COUNT(*)'] || 0);
}

function normalizePositiveInteger(value: FormDataEntryValue | string | number | null) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function isActiveAdmin(admin: Pick<AdminRow, 'active'>) {
  return admin.active === undefined || admin.active === 1 || admin.active === true;
}

async function pruneOldLoginAttempts() {
  await turso.execute("DELETE FROM admin_login_attempts WHERE created_at < datetime('now', '-1 day')");
}

async function isLoginRateLimited(email: string, ipAddress?: string | null) {
  const args: Array<string> = [email];
  let scopeSql = 'lower(email) = ?';

  if (ipAddress) {
    scopeSql = `(${scopeSql} OR ip_address = ?)`;
    args.push(ipAddress);
  }

  const result = await turso.execute({
    sql: `
      SELECT COUNT(*) AS count
      FROM admin_login_attempts
      WHERE success = 0
        AND created_at >= datetime('now', '-${LOGIN_RATE_LIMIT_WINDOW_MINUTES} minutes')
        AND ${scopeSql}
    `,
    args,
  });

  return getRowCount(result.rows[0] as Record<string, unknown> | undefined) >= MAX_FAILED_LOGIN_ATTEMPTS;
}

async function recordLoginAttempt(email: string, success: boolean, ipAddress?: string | null) {
  await turso.execute({
    sql: 'INSERT INTO admin_login_attempts (email, ip_address, success) VALUES (?, ?, ?)',
    args: [email, ipAddress || null, success ? 1 : 0],
  });

  await pruneOldLoginAttempts();
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('base64url');
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  return `scrypt:v1:${salt}:${derivedKey.toString('base64url')}`;
}

export async function verifyPassword(password: string, passwordHash: string) {
  const [algorithm, version, salt, storedKey] = passwordHash.split(':');
  if (algorithm !== 'scrypt' || version !== 'v1' || !salt || !storedKey) {
    return false;
  }

  const storedBuffer = Buffer.from(storedKey, 'base64url');
  const derivedKey = (await scryptAsync(password, salt, storedBuffer.length)) as Buffer;

  return storedBuffer.length === derivedKey.length && timingSafeEqual(storedBuffer, derivedKey);
}

export class AdminLoginRateLimitError extends Error {
  constructor() {
    super(`Too many failed sign-in attempts. Try again in ${LOGIN_RATE_LIMIT_WINDOW_MINUTES} minutes.`);
    this.name = 'AdminLoginRateLimitError';
  }
}

export async function authenticateAdmin(
  emailInput: FormDataEntryValue | string | null,
  passwordInput: FormDataEntryValue | string | null,
  options: { ipAddress?: string | null } = {},
) {
  const email = normalizeEmail(emailInput);
  const password = String(passwordInput || '');

  if (!email || !password) {
    return null;
  }

  if (await isLoginRateLimited(email, options.ipAddress)) {
    throw new AdminLoginRateLimitError();
  }

  const adminResult = await turso.execute({
    sql: 'SELECT id, email, name, role, active, password_hash FROM admins WHERE lower(email) = ? LIMIT 1',
    args: [email],
  });

  const admin = adminResult.rows[0] as unknown as AdminRow | undefined;
  if (!admin || !isActiveAdmin(admin) || !(await verifyPassword(password, admin.password_hash))) {
    await recordLoginAttempt(email, false, options.ipAddress);
    return null;
  }

  await turso.execute({
    sql: 'UPDATE admins SET last_login_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    args: [admin.id],
  });

  await recordLoginAttempt(email, true, options.ipAddress);

  return createAdminSession(admin);
}

async function createAdminSession(admin: Pick<AdminRow, 'id' | 'email'>) {
  const token = randomBytes(32).toString('base64url');
  const tokenHash = hashSessionToken(token);
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000);

  await turso.execute({
    sql: 'INSERT INTO admin_sessions (admin_id, token_hash, expires_at) VALUES (?, ?, ?)',
    args: [admin.id, tokenHash, expiresAt.toISOString()],
  });

  return {
    token,
    admin: {
      id: admin.id,
      email: admin.email,
    },
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}

export function setAdminSessionCookie(cookies: CookieJar, token: string, maxAge = SESSION_MAX_AGE_SECONDS) {
  cookies.set(ADMIN_SESSION_COOKIE, token, {
    path: '/',
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'strict',
    maxAge,
  });
}

export async function getAdminFromCookies(cookies: CookieJar) {
  const session = cookies.get(ADMIN_SESSION_COOKIE);
  if (!session?.value) {
    return null;
  }

  const tokenHash = hashSessionToken(session.value);
  const result = await turso.execute({
    sql: `
      SELECT admins.id, admins.email
        , admins.name
        , admins.role
        , admins.active
      FROM admin_sessions
      INNER JOIN admins ON admins.id = admin_sessions.admin_id
      WHERE admin_sessions.token_hash = ?
        AND admin_sessions.expires_at > ?
        AND admins.active = 1
      LIMIT 1
    `,
    args: [tokenHash, new Date().toISOString()],
  });

  return result.rows[0] || null;
}

export async function requireAdmin(cookies: CookieJar) {
  const admin = await getAdminFromCookies(cookies);
  return Boolean(admin);
}

export async function requireSuperAdmin(cookies: CookieJar) {
  const admin = await getAdminFromCookies(cookies);
  return admin?.role === 'super_admin' ? admin : null;
}

export async function listAdmins() {
  const result = await turso.execute(`
    SELECT id, email, name, role, active, created_at, updated_at, last_login_at, password_updated_at
    FROM admins
    ORDER BY
      active DESC,
      CASE role WHEN 'super_admin' THEN 0 ELSE 1 END,
      lower(email)
  `);

  return result.rows as unknown as SafeAdmin[];
}

async function countActiveSuperAdminsExcluding(adminId?: number) {
  const args: Array<number> = [];
  let exclusionSql = '';

  if (adminId) {
    exclusionSql = 'AND id != ?';
    args.push(adminId);
  }

  const result = await turso.execute({
    sql: `
      SELECT COUNT(*) AS count
      FROM admins
      WHERE role = 'super_admin'
        AND active = 1
        ${exclusionSql}
    `,
    args,
  });

  return getRowCount(result.rows[0] as Record<string, unknown> | undefined);
}

async function getAdminById(adminId: number) {
  const result = await turso.execute({
    sql: 'SELECT id, email, name, role, active, password_hash FROM admins WHERE id = ? LIMIT 1',
    args: [adminId],
  });

  return result.rows[0] as unknown as AdminRow | undefined;
}

export async function createOrUpdateAdminAccount(options: {
  email: FormDataEntryValue | string | null;
  password: FormDataEntryValue | string | null;
  name?: FormDataEntryValue | string | null;
  role?: FormDataEntryValue | string | null;
}) {
  const email = normalizeEmail(options.email);
  const password = String(options.password || '');
  const name = String(options.name || '').trim() || null;
  const role = normalizeRole(options.role || 'admin');

  if (!email || !email.includes('@')) {
    return { success: false, error: 'Enter a valid email address.' };
  }

  if (password.length < 12) {
    return { success: false, error: 'Password must be at least 12 characters.' };
  }

  const passwordHash = await hashPassword(password);

  await turso.execute({
    sql: `
      INSERT INTO admins (email, password_hash, name, role, active, password_updated_at)
      VALUES (?, ?, ?, ?, 1, CURRENT_TIMESTAMP)
      ON CONFLICT(email) DO UPDATE SET
        password_hash = excluded.password_hash,
        name = excluded.name,
        role = excluded.role,
        active = 1,
        password_updated_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
    `,
    args: [email, passwordHash, name, role],
  });

  return { success: true };
}

export const createAdminAccount = createOrUpdateAdminAccount;

export async function updateAdminPassword(
  adminIdInput: FormDataEntryValue | string | number | null,
  passwordInput: FormDataEntryValue | string | null,
) {
  const adminId = normalizePositiveInteger(adminIdInput);
  const password = String(passwordInput || '');

  if (!adminId) {
    return { success: false, error: 'Choose a valid admin account.' };
  }

  if (password.length < 12) {
    return { success: false, error: 'Password must be at least 12 characters.' };
  }

  const admin = await getAdminById(adminId);
  if (!admin) {
    return { success: false, error: 'Admin account not found.' };
  }

  const passwordHash = await hashPassword(password);
  await turso.execute({
    sql: `
      UPDATE admins
      SET password_hash = ?,
        password_updated_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    args: [passwordHash, adminId],
  });

  await turso.execute({
    sql: 'DELETE FROM admin_sessions WHERE admin_id = ?',
    args: [adminId],
  });

  return { success: true };
}

export async function changeOwnAdminPassword(
  adminIdInput: FormDataEntryValue | string | number | null,
  currentPasswordInput: FormDataEntryValue | string | null,
  newPasswordInput: FormDataEntryValue | string | null,
) {
  const adminId = normalizePositiveInteger(adminIdInput);
  const currentPassword = String(currentPasswordInput || '');
  const newPassword = String(newPasswordInput || '');

  if (!adminId) {
    return { success: false, error: 'Admin account not found.' };
  }

  if (newPassword.length < 12) {
    return { success: false, error: 'New password must be at least 12 characters.' };
  }

  const admin = await getAdminById(adminId);
  if (!admin || !isActiveAdmin(admin)) {
    return { success: false, error: 'Admin account not found.' };
  }

  if (!(await verifyPassword(currentPassword, admin.password_hash))) {
    return { success: false, error: 'Current password is incorrect.' };
  }

  const passwordHash = await hashPassword(newPassword);
  await turso.execute({
    sql: `
      UPDATE admins
      SET password_hash = ?,
        password_updated_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    args: [passwordHash, adminId],
  });

  await turso.execute({
    sql: 'DELETE FROM admin_sessions WHERE admin_id = ?',
    args: [adminId],
  });

  return { success: true };
}

export async function setAdminActive(
  adminIdInput: FormDataEntryValue | string | number | null,
  active: boolean,
  currentAdminId: number,
) {
  const adminId = normalizePositiveInteger(adminIdInput);

  if (!adminId) {
    return { success: false, error: 'Choose a valid admin account.' };
  }

  if (!active && adminId === currentAdminId) {
    return { success: false, error: 'You cannot deactivate your own account.' };
  }

  const admin = await getAdminById(adminId);
  if (!admin) {
    return { success: false, error: 'Admin account not found.' };
  }

  if (!active && admin.role === 'super_admin' && isActiveAdmin(admin)) {
    const remainingSuperAdmins = await countActiveSuperAdminsExcluding(adminId);
    if (remainingSuperAdmins < 1) {
      return { success: false, error: 'At least one active super admin is required.' };
    }
  }

  await turso.execute({
    sql: 'UPDATE admins SET active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    args: [active ? 1 : 0, adminId],
  });

  if (!active) {
    await turso.execute({
      sql: 'DELETE FROM admin_sessions WHERE admin_id = ?',
      args: [adminId],
    });
  }

  return { success: true };
}

export async function deleteAdminAccount(
  adminIdInput: FormDataEntryValue | string | number | null,
  currentAdminId: number,
) {
  const adminId = normalizePositiveInteger(adminIdInput);

  if (!adminId) {
    return { success: false, error: 'Choose a valid admin account.' };
  }

  if (adminId === currentAdminId) {
    return { success: false, error: 'You cannot delete your own account.' };
  }

  const admin = await getAdminById(adminId);
  if (!admin) {
    return { success: false, error: 'Admin account not found.' };
  }

  if (admin.role === 'super_admin' && isActiveAdmin(admin)) {
    const remainingSuperAdmins = await countActiveSuperAdminsExcluding(adminId);
    if (remainingSuperAdmins < 1) {
      return { success: false, error: 'At least one active super admin is required.' };
    }
  }

  await turso.execute({
    sql: 'DELETE FROM admins WHERE id = ?',
    args: [adminId],
  });

  return { success: true };
}

export async function deleteAdminSession(cookies: CookieJar) {
  const session = cookies.get(ADMIN_SESSION_COOKIE);
  if (session?.value) {
    await turso.execute({
      sql: 'DELETE FROM admin_sessions WHERE token_hash = ?',
      args: [hashSessionToken(session.value)],
    });
  }

  cookies.delete(ADMIN_SESSION_COOKIE, { path: '/' });
}
