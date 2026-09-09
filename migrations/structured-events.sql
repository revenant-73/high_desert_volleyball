ALTER TABLE events ADD COLUMN start_date TEXT;
ALTER TABLE events ADD COLUMN end_date TEXT;
ALTER TABLE events ADD COLUMN registration_url TEXT;
ALTER TABLE events ADD COLUMN status TEXT NOT NULL DEFAULT 'planned';
ALTER TABLE events ADD COLUMN division TEXT;
ALTER TABLE events ADD COLUMN venue_id INTEGER;

CREATE INDEX IF NOT EXISTS idx_events_start_date
  ON events(start_date);

CREATE INDEX IF NOT EXISTS idx_events_status
  ON events(status);

CREATE INDEX IF NOT EXISTS idx_events_venue_id
  ON events(venue_id);
