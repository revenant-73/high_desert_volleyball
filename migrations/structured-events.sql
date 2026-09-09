ALTER TABLE events ADD COLUMN start_date TEXT;
ALTER TABLE events ADD COLUMN end_date TEXT;
ALTER TABLE events ADD COLUMN registration_url TEXT;
ALTER TABLE events ADD COLUMN schedule_url TEXT;
ALTER TABLE events ADD COLUMN status TEXT NOT NULL DEFAULT 'planned';
ALTER TABLE events ADD COLUMN division TEXT;
ALTER TABLE events ADD COLUMN venue_id INTEGER;
ALTER TABLE events ADD COLUMN tournament_format TEXT NOT NULL DEFAULT 'two_day';
ALTER TABLE events ADD COLUMN featured INTEGER NOT NULL DEFAULT 0;
ALTER TABLE events ADD COLUMN featured_order INTEGER;

CREATE INDEX IF NOT EXISTS idx_events_start_date
  ON events(start_date);

CREATE INDEX IF NOT EXISTS idx_events_status
  ON events(status);

CREATE INDEX IF NOT EXISTS idx_events_venue_id
  ON events(venue_id);

CREATE INDEX IF NOT EXISTS idx_events_tournament_format
  ON events(tournament_format);

CREATE INDEX IF NOT EXISTS idx_events_featured
  ON events(featured, featured_order);

CREATE TABLE IF NOT EXISTS event_venues (
  event_id INTEGER NOT NULL,
  venue_id INTEGER NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (event_id, venue_id),
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (venue_id) REFERENCES venues(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_event_venues_event_id
  ON event_venues(event_id);

CREATE INDEX IF NOT EXISTS idx_event_venues_venue_id
  ON event_venues(venue_id);
