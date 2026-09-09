import { randomBytes, scrypt, timingSafeEqual, createHash } from 'node:crypto';
import { promisify } from 'node:util';
import { turso } from './turso';

const scryptAsync = promisify(scrypt);

export const ADMIN_SESSION_COOKIE = 'admin_session';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

interface AdminRow {
  id: number;
  email: string;
  password_hash: string;
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
    sql: 'SELECT id, email, password_hash FROM admins WHERE lower(email) = ? LIMIT 1',
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
