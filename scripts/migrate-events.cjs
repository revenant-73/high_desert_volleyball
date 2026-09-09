const fs = require('fs');
const path = require('path');
const { createClient } = require('@libsql/client');

const monthIndexes = {
  jan: 0,
  january: 0,
  feb: 1,
  february: 1,
  mar: 2,
  march: 2,
  apr: 3,
  april: 3,
  may: 4,
  jun: 5,
  june: 5,
  jul: 6,
  july: 6,
  aug: 7,
  august: 7,
  sep: 8,
  sept: 8,
  september: 8,
  oct: 9,
  october: 9,
  nov: 10,
  november: 10,
  dec: 11,
  december: 11,
};

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

function toIsoDate(year, month, day) {
  if (month === undefined || Number.isNaN(year) || Number.isNaN(day)) {
    return null;
  }

  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function parseDateRange(dateText) {
  const match = String(dateText || '').match(/^([A-Za-z]+)\s+(\d{1,2})(?:-(\d{1,2}))?,\s*(\d{4})/);
  if (!match) {
    return { startDate: null, endDate: null };
  }

  const month = monthIndexes[match[1].toLowerCase()];
  const startDay = Number(match[2]);
  const endDay = Number(match[3] || match[2]);
  const year = Number(match[4]);

  return {
    startDate: toIsoDate(year, month, startDay),
    endDate: toIsoDate(year, month, endDay),
  };
}

async function ensureStructuredEventColumns(db) {
  const tableInfo = await db.execute('PRAGMA table_info(events)');
  const columns = new Set(tableInfo.rows.map((column) => column.name));
  const columnStatements = splitSql(fs.readFileSync(path.join(process.cwd(), 'migrations/structured-events.sql'), 'utf8'))
    .filter((statement) => statement.toUpperCase().startsWith('ALTER TABLE EVENTS ADD COLUMN'));

  for (const statement of columnStatements) {
    const match = statement.match(/ADD COLUMN\s+([a-zA-Z0-9_]+)/i);
    const columnName = match?.[1];

    if (columnName && !columns.has(columnName)) {
      await db.execute(statement);
    }
  }

  await db.execute('CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date)');
  await db.execute('CREATE INDEX IF NOT EXISTS idx_events_status ON events(status)');
  await db.execute('CREATE INDEX IF NOT EXISTS idx_events_venue_id ON events(venue_id)');
  await db.execute('CREATE INDEX IF NOT EXISTS idx_events_tournament_format ON events(tournament_format)');
  await db.execute('CREATE INDEX IF NOT EXISTS idx_events_featured ON events(featured, featured_order)');
}

async function ensureEventVenues(db) {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS event_venues (
      event_id INTEGER NOT NULL,
      venue_id INTEGER NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (event_id, venue_id),
      FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
      FOREIGN KEY (venue_id) REFERENCES venues(id) ON DELETE CASCADE
    )
  `);

  await db.execute('CREATE INDEX IF NOT EXISTS idx_event_venues_event_id ON event_venues(event_id)');
  await db.execute('CREATE INDEX IF NOT EXISTS idx_event_venues_venue_id ON event_venues(venue_id)');

  await db.execute(`
    INSERT OR IGNORE INTO event_venues (event_id, venue_id, sort_order)
    SELECT id, venue_id, 0
    FROM events
    WHERE venue_id IS NOT NULL
  `);
}

async function backfillStructuredDates(db) {
  const result = await db.execute(`
    SELECT id, date, age
    FROM events
    WHERE start_date IS NULL
      OR end_date IS NULL
      OR division IS NULL
  `);

  for (const row of result.rows) {
    const { startDate, endDate } = parseDateRange(row.date);
    await db.execute({
      sql: `
        UPDATE events
        SET start_date = COALESCE(start_date, ?),
          end_date = COALESCE(end_date, ?),
          division = COALESCE(division, ?)
        WHERE id = ?
      `,
      args: [startDate, endDate, row.age || null, row.id],
    });
  }

  await db.execute(`
    UPDATE events
    SET tournament_format = 'one_day'
    WHERE start_date IS NOT NULL
      AND end_date IS NOT NULL
      AND start_date = end_date
      AND tournament_format = 'two_day'
  `);
}

(async () => {
  loadEnv();

  const db = createClient({
    url: requireEnv('TURSO_DATABASE_URL'),
    authToken: requireEnv('TURSO_AUTH_TOKEN'),
  });

  await ensureStructuredEventColumns(db);
  await ensureEventVenues(db);
  await backfillStructuredDates(db);

  console.log('Structured event migration applied.');
})().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
