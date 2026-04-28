CREATE TABLE IF NOT EXISTS events (
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

INSERT INTO events (name, date, age, price, description) VALUES ('Battle in Boise', 'Jan 9-10, 2026', '15-18u', '$400', 'Friday evening pool play, Saturday morning pool play based on previous finish, followed by single elimination bracket play.');
INSERT INTO events (name, date, age, price, description) VALUES ('Battle in Boise', 'Jan 16-17, 2026', '12-14u', '$400', 'Friday evening pool play, Saturday morning pool play based on previous finish, followed by single elimination bracket play.');
INSERT INTO events (name, date, age, price, description) VALUES ('February Fever', 'Feb 6-7, 2026', '15-18u', '$400', 'Friday evening pool play, Saturday morning pool play based on previous finish, followed by single elimination bracket play.');
INSERT INTO events (name, date, age, price, description) VALUES ('February Fever', 'Feb 20-21, 2026', '12-14u', '$400', 'Friday evening pool play, Saturday morning pool play based on previous finish, followed by single elimination bracket play.');
INSERT INTO events (name, date, age, price, description) VALUES ('HDVL Championship', 'Apr 10-11, 2026', '12-14u', '$400', 'Friday evening pool play, Saturday morning pool play based on previous finish, followed by single elimination bracket play.');
INSERT INTO events (name, date, age, price, description) VALUES ('HDVL Championship', 'Apr 17-18, 2026', '15-18u', '$400', 'Friday evening pool play, Saturday morning pool play based on previous finish, followed by single elimination bracket play.');
INSERT INTO events (name, date, age, price, description) VALUES ('Icebreaker', 'Dec 13, 2025', '15-18u', '$175/TEAM', 'Informal opportunity for teams to play in December. Official jerseys not required. No officials or official scoresheets. Coaches will officiate. Pool play only with AM & PM waves.');
INSERT INTO events (name, date, age, price, description) VALUES ('March Madness', 'Mar 6-7, 2026', '15-18u', '$400', 'Friday evening pool play, Saturday morning pool play based on previous finish, followed by single elimination bracket play.');
INSERT INTO events (name, date, age, price, description) VALUES ('March Madness', 'Mar 27-28, 2026', '12-14u', '$400', 'Friday evening pool play, Saturday morning pool play based on previous finish, followed by single elimination bracket play.');

INSERT INTO venues (name, address, rules) VALUES ('Homedale Schools (HS & MS)', '203 E Idaho Ave / 3437 Johnstone Rd, Homedale, ID', '["Spectators: Bleachers provided. $5 gate fee PER day.","Players & Spectators: Must leave gym when not playing/officiating.","Food & Drink: Only water allowed in the gyms."]');
INSERT INTO venues (name, address, rules) VALUES ('Meridian Middle School', '1507 W 8th St, Meridian, ID 83642', '["Spectators: Bring your own chair.","Food & Drink: Only water allowed in the gyms."]');
INSERT INTO venues (name, address, rules) VALUES ('Middleton Schools (HS & MS)', '200 S Piccadilly Ave / 1538 Emmett Rd, Middleton, ID', '["Spectators: Bring your own chair.","Food & Drink: Only water allowed in the gyms.","MHS Note: Use EAST entrance only. No gathering in hallways."]');
INSERT INTO venues (name, address, rules) VALUES ('Rise Volleyball Academy', '719 N Principle Pl #110, Meridian, ID 83642', '["Spectators: Bring your own chair.","Spectators need to leave the gym when their team is not playing.","Parking: Rear loading dock side preferred on Friday. Front/Back okay on Saturday.","Food & Drink: Allowed inside, but kept off the courts."]');
INSERT INTO venues (name, address, rules) VALUES ('The Forge International School', '208 S Hartley Ln, Middleton, ID 83644', '["Spectators: TWO spectators per player. Bring your own chair.","Players: Must leave gym when not playing/officiating.","Food & Drink: Only water allowed in the gyms."]');
INSERT INTO venues (name, address, rules) VALUES ('Treasure Valley Athletic Center (TVAC)', '1251 E Piper Ct, Meridian, ID 83642', '["Spectators: $5 gate fee. Bleachers available.","Parking: Park ONLY in TVAC lot or on the road. Towed at owner expense otherwise."]');
