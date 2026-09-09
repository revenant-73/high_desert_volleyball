import { randomBytes, scrypt, timingSafeEqual, createHash } from 'node:crypto';
import { promisify } from 'node:util';
import { turso } from './turso';

const scryptAsync = promisify(scrypt);

export const ADMIN_SESSION_COOKIE = 'admin_session';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;
const VALID_ADMIN_ROLES = ['admin', 'super_admin'] as const;

export type AdminRole = (typeof VALID_ADMIN_ROLES)[number];

interface AdminRow {
  id: number;
  email: string;
  name?: string | null;
  role: AdminRole;
  password_hash: string;
}

export interface SafeAdmin {
  id: number;
  email: string;
  name: string | null;
  role: AdminRole;
  created_at?: string;
  updated_at?: string;
  last_login_at?: string | null;
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

export async function authenticateAdmin(emailInput: FormDataEntryValue | string | null, passwordInput: FormDataEntryValue | string | null) {
  const email = normalizeEmail(emailInput);
  const password = String(passwordInput || '');

  if (!email || !password) {
    return null;
  }

  const adminResult = await turso.execute({
    sql: 'SELECT id, email, name, role, password_hash FROM admins WHERE lower(email) = ? LIMIT 1',
    args: [email],
  });

  const admin = adminResult.rows[0] as unknown as AdminRow | undefined;
  if (!admin || !(await verifyPassword(password, admin.password_hash))) {
    return null;
  }

  await turso.execute({
    sql: 'UPDATE admins SET last_login_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    args: [admin.id],
  });

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
      FROM admin_sessions
      INNER JOIN admins ON admins.id = admin_sessions.admin_id
      WHERE admin_sessions.token_hash = ?
        AND admin_sessions.expires_at > ?
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
    SELECT id, email, name, role, created_at, updated_at, last_login_at
    FROM admins
    ORDER BY
      CASE role WHEN 'super_admin' THEN 0 ELSE 1 END,
      lower(email)
  `);

  return result.rows as unknown as SafeAdmin[];
}

export async function createAdminAccount(options: {
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
      INSERT INTO admins (email, password_hash, name, role)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(email) DO UPDATE SET
        password_hash = excluded.password_hash,
        name = excluded.name,
        role = excluded.role,
        updated_at = CURRENT_TIMESTAMP
    `,
    args: [email, passwordHash, name, role],
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
