const fs = require('fs');
const path = require('path');

const eventsDir = path.join(__dirname, 'src/content/events');
const venuesDir = path.join(__dirname, 'src/content/venues');

function getFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).map(f => path.join(dir, f));
}

function escape(str) {
  if (typeof str !== 'string') return "''";
  return `'${str.replace(/'/g, "''")}'`;
}

let sql = `CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  name TEXT NOT NULL,
  date TEXT,
  age TEXT,
  price TEXT,
  description TEXT
);

CREATE TABLE IF NOT EXISTS venues (
  id INTEGER PRIMARY KEY,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  name TEXT NOT NULL,
  address TEXT,
  rules TEXT
);

`;

// Migrate Events
const eventFolders = getFiles(eventsDir);
eventFolders.forEach(folder => {
  const jsonPath = path.join(folder, 'index.json');
  if (fs.existsSync(jsonPath)) {
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    sql += `INSERT INTO events (name, date, age, price, description) VALUES (${escape(data.name)}, ${escape(data.date)}, ${escape(data.age)}, ${escape(data.price)}, ${escape(data.description)});\n`;
  }
});

sql += '\n';

// Migrate Venues
const venueFolders = getFiles(venuesDir);
venueFolders.forEach(folder => {
  const jsonPath = path.join(folder, 'index.json');
  if (fs.existsSync(jsonPath)) {
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    sql += `INSERT INTO venues (name, address, rules) VALUES (${escape(data.name)}, ${escape(data.address)}, ${escape(JSON.stringify(data.rules))});\n`;
  }
});

fs.writeFileSync('migration_data.sql', sql);
console.log('Migration SQL updated with single quotes and clean schema.');
