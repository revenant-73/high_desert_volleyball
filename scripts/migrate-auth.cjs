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
  const hasRole = tableInfo.rows.some((column) => column.name === 'role');

  if (!hasRole) {
    await db.execute("ALTER TABLE admins ADD COLUMN role TEXT NOT NULL DEFAULT 'admin'");
  }

  await db.execute({
    sql: `
      UPDATE admins
      SET role = 'super_admin', updated_at = CURRENT_TIMESTAMP
      WHERE lower(email) IN (?, ?)
    `,
    args: ['loren@tualatinvalleyvb.com', 'steve@risevolleyballacademy.net'],
  });
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

  console.log('Admin auth migration applied.');
})().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
