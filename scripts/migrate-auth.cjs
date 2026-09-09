const fs = require('fs');
const path = require('path');
const { createClient } = require('@libsql/client');

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

function splitSql(sql) {
  return sql
    .split(';')
    .map((statement) => statement.trim())
    .filter(Boolean);
}

async function ensureAdminRoles(db) {
  const tableInfo = await db.execute('PRAGMA table_info(admins)');
  const columns = new Set(tableInfo.rows.map((column) => column.name));

  if (!columns.has('role')) {
    await db.execute("ALTER TABLE admins ADD COLUMN role TEXT NOT NULL DEFAULT 'admin'");
  }

  if (!columns.has('active')) {
    await db.execute("ALTER TABLE admins ADD COLUMN active INTEGER NOT NULL DEFAULT 1");
  }

  if (!columns.has('password_updated_at')) {
    await db.execute("ALTER TABLE admins ADD COLUMN password_updated_at DATETIME");
  }

  await db.execute({
    sql: `
      UPDATE admins
      SET role = 'super_admin',
        active = 1,
        updated_at = CURRENT_TIMESTAMP
      WHERE lower(email) IN (?, ?)
    `,
    args: ['loren@tualatinvalleyvb.com', 'steve@risevolleyballacademy.net'],
  });
}

async function ensureLoginAttemptTable(db) {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS admin_login_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      ip_address TEXT,
      success INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.execute(`
    CREATE INDEX IF NOT EXISTS idx_admin_login_attempts_email_created_at
    ON admin_login_attempts(lower(email), created_at)
  `);

  await db.execute(`
    CREATE INDEX IF NOT EXISTS idx_admin_login_attempts_ip_created_at
    ON admin_login_attempts(ip_address, created_at)
  `);
}

(async () => {
  loadEnv();

  const db = createClient({
    url: requireEnv('TURSO_DATABASE_URL'),
    authToken: requireEnv('TURSO_AUTH_TOKEN'),
  });

  const sql = fs.readFileSync(path.join(process.cwd(), 'migrations/admin-auth.sql'), 'utf8');

  for (const statement of splitSql(sql)) {
    await db.execute(statement);
  }

  await ensureAdminRoles(db);
  await ensureLoginAttemptTable(db);

  console.log('Admin auth migration applied.');
})().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
