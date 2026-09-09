const fs = require('fs');
const path = require('path');
const { randomBytes, scrypt } = require('node:crypto');
const { promisify } = require('node:util');
const { createClient } = require('@libsql/client');

const scryptAsync = promisify(scrypt);

function loadEnv() {
  const envPath = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) return;

  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (!match) continue;

    const key = match[1].trim();
    const value = match[2].trim().replace(/^"|"$/g, '');
    if (!process.env[key]) process.env[key] = value;
  }
}

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
}

async function hashPassword(password) {
  const salt = randomBytes(16).toString('base64url');
  const derivedKey = await scryptAsync(password, salt, 64);
  return `scrypt:v1:${salt}:${derivedKey.toString('base64url')}`;
}

(async () => {
  loadEnv();

  const email = requireEnv('ADMIN_EMAIL').trim().toLowerCase();
  const password = requireEnv('ADMIN_ACCOUNT_PASSWORD');
  const name = process.env.ADMIN_NAME || null;
  const role = process.env.ADMIN_ROLE || 'admin';

  if (password.length < 12) {
    throw new Error('ADMIN_ACCOUNT_PASSWORD must be at least 12 characters.');
  }

  if (!['admin', 'super_admin'].includes(role)) {
    throw new Error('ADMIN_ROLE must be admin or super_admin.');
  }

  const db = createClient({
    url: requireEnv('TURSO_DATABASE_URL'),
    authToken: requireEnv('TURSO_AUTH_TOKEN'),
  });

  const passwordHash = await hashPassword(password);
  await db.execute({
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

  console.log(`Admin account ready for ${email}.`);
})().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
