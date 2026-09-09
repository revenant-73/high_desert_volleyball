import { turso } from './turso';
import { sortEventsByStartDate } from './eventSorting';

export interface Event {
  id: number;
  created_at?: string;
  name: string;
  date: string;
  age: string;
  price: string;
  description: string;
  start_date?: string | null;
  end_date?: string | null;
  registration_url?: string | null;
  schedule_url?: string | null;
  status?: EventStatus;
  division?: string | null;
  venue_id?: number | null;
  venue_name?: string | null;
  venue_address?: string | null;
  venues?: EventVenue[];
  venue_ids?: number[];
  tournament_format?: TournamentFormat;
  featured?: number | boolean;
  featured_order?: number | null;
}

export type EventStatus = 'planned' | 'registration_open' | 'registration_closed' | 'canceled';
export type TournamentFormat = 'one_day' | 'two_day';

export interface EventVenue {
  id: number;
  name: string;
  address: string;
}

export interface EventInput {
  name: string;
  date: string;
  age: string;
  price: string;
  description: string;
  start_date?: string | null;
  end_date?: string | null;
  registration_url?: string | null;
  schedule_url?: string | null;
  status?: EventStatus | string | null;
  division?: string | null;
  venue_id?: number | string | null;
  venue_ids?: Array<number | string> | null;
  tournament_format?: TournamentFormat | string | null;
  featured?: boolean | number | string | null;
  featured_order?: number | string | null;
}

export interface Venue {
  id: number;
  created_at?: string;
  name: string;
  address: string;
  rules: string[];
}

export const siteConfig = {
  name: "High Desert Volleyball League",
  shortName: "HDVL",
  tagline: "Southwest Idaho's First Choice for Youth Volleyball",
  email: "highdesertvball@gmail.com",
  description: "HDVL is the only JVA sanctioned league in Southern Idaho, ensuring a high level of coaching education, player safety, and officiating. Open to teams of all ages (12u-18u) and affiliations (USA, AAU, or none).",
  links: {
    register: "/register-guide",
    waiver: "https://highdesertvball.com/waivers",
  },
};

function parseVenue(row: any): Venue {
  let rules = row.rules;
  if (typeof rules === 'string') {
    try {
      rules = JSON.parse(rules);
    } catch (e) {
      rules = [];
    }
  }

  return {
    ...row,
    rules: Array.isArray(rules) ? rules : [],
  };
}

function normalizeText(value: unknown) {
  return String(value || '').trim();
}

function normalizeOptionalText(value: unknown) {
  const text = normalizeText(value);
  return text || null;
}

function normalizeEventStatus(value: unknown): EventStatus {
  const status = normalizeText(value);
  if (['planned', 'registration_open', 'registration_closed', 'canceled'].includes(status)) {
    return status as EventStatus;
  }

  return 'planned';
}

function normalizeTournamentFormat(value: unknown): TournamentFormat {
  const format = normalizeText(value);
  if (format === 'one_day' || format === 'two_day') {
    return format;
  }

  return 'two_day';
}

function normalizeVenueId(value: unknown) {
  if (value === null || value === undefined || value === '') return null;

  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function normalizeVenueIds(event: EventInput) {
  const values = Array.isArray(event.venue_ids) ? event.venue_ids : [event.venue_id];
  const ids = values
    .map(normalizeVenueId)
    .filter((id): id is number => id !== null);

  return [...new Set(ids)];
}

function normalizeFeatured(value: unknown) {
  return value === true || value === 1 || value === '1' || value === 'true' || value === 'on' ? 1 : 0;
}

function normalizeOptionalInteger(value: unknown) {
  if (value === null || value === undefined || value === '') return null;

  const number = Number(value);
  return Number.isInteger(number) ? number : null;
}

function normalizeEventInput(event: EventInput) {
  const venueIds = normalizeVenueIds(event);
  const primaryVenueId = venueIds[0] ?? normalizeVenueId(event.venue_id);
  const featured = normalizeFeatured(event.featured);
  const args = [
    normalizeText(event.name),
    normalizeText(event.date),
    normalizeText(event.age),
    normalizeText(event.price),
    normalizeText(event.description),
    normalizeOptionalText(event.start_date),
    normalizeOptionalText(event.end_date),
    normalizeOptionalText(event.registration_url),
    normalizeOptionalText(event.schedule_url),
    normalizeEventStatus(event.status),
    normalizeOptionalText(event.division) || normalizeText(event.age),
    primaryVenueId,
    normalizeTournamentFormat(event.tournament_format),
    featured,
    featured ? normalizeOptionalInteger(event.featured_order) : null,
  ];

  return { args, venueIds };
}

async function saveEventVenues(eventId: number, venueIds: number[]) {
  await turso.execute({
    sql: 'DELETE FROM event_venues WHERE event_id = ?',
    args: [eventId],
  });

  for (const [index, venueId] of venueIds.entries()) {
    await turso.execute({
      sql: 'INSERT OR IGNORE INTO event_venues (event_id, venue_id, sort_order) VALUES (?, ?, ?)',
      args: [eventId, venueId, index],
    });
  }
}

async function attachEventVenues(events: Event[]) {
  if (events.length === 0) {
    return events;
  }

  const placeholders = events.map(() => '?').join(', ');
  const venueResult = await turso.execute({
    sql: `
      SELECT event_venues.event_id,
        venues.id,
        venues.name,
        venues.address
      FROM event_venues
      INNER JOIN venues ON venues.id = event_venues.venue_id
      WHERE event_venues.event_id IN (${placeholders})
      ORDER BY event_venues.sort_order ASC, venues.name ASC
    `,
    args: events.map((event) => event.id),
  });

  const venuesByEventId = new Map<number, EventVenue[]>();
  for (const row of venueResult.rows as unknown as Array<EventVenue & { event_id: number }>) {
    const venues = venuesByEventId.get(row.event_id) || [];
    venues.push({
      id: row.id,
      name: row.name,
      address: row.address,
    });
    venuesByEventId.set(row.event_id, venues);
  }

  return events.map((event) => {
    const venues = venuesByEventId.get(event.id) || [];

    return {
      ...event,
      venues,
      venue_ids: venues.map((venue) => venue.id),
      venue_id: venues[0]?.id ?? event.venue_id ?? null,
      venue_name: venues.length > 0 ? venues.map((venue) => venue.name).join(', ') : event.venue_name ?? null,
      venue_address: venues.length === 1 ? venues[0].address : event.venue_address ?? null,
    };
  });
}

async function getEventById(id: number) {
  const result = await turso.execute({
    sql: 'SELECT * FROM events WHERE id = ? LIMIT 1',
    args: [id],
  });

  const event = result.rows[0] as unknown as Event | undefined;
  if (!event) return null;

  return (await attachEventVenues([event]))[0];
}

export async function getEvents(): Promise<Event[]> {
  try {
    const result = await turso.execute('SELECT * FROM events');
    const events = await attachEventVenues(result.rows as unknown as Event[]);
    return sortEventsByStartDate(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

export async function createEvent(event: EventInput) {
  try {
    const { args, venueIds } = normalizeEventInput(event);
    const result = await turso.execute({
      sql: `
        INSERT INTO events (
          name,
          date,
          age,
          price,
          description,
          start_date,
          end_date,
          registration_url,
          schedule_url,
          status,
          division,
          venue_id,
          tournament_format,
          featured,
          featured_order
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        RETURNING *
      `,
      args
    });

    const savedEvent = result.rows[0] as unknown as Event;
    await saveEventVenues(savedEvent.id, venueIds);

    return { success: true, event: await getEventById(savedEvent.id) };
  } catch (error) {
    console.error('Error creating event:', error);
    return { success: false, error };
  }
}

export async function updateEvent(id: number, event: EventInput) {
  try {
    const { args, venueIds } = normalizeEventInput(event);
    const result = await turso.execute({
      sql: `
        UPDATE events
        SET name = ?,
          date = ?,
          age = ?,
          price = ?,
          description = ?,
          start_date = ?,
          end_date = ?,
          registration_url = ?,
          schedule_url = ?,
          status = ?,
          division = ?,
          venue_id = ?,
          tournament_format = ?,
          featured = ?,
          featured_order = ?
        WHERE id = ?
        RETURNING *
      `,
      args: [...args, id]
    });

    const savedEvent = result.rows[0] as unknown as Event | undefined;
    if (!savedEvent) {
      return { success: false, error: new Error('Event not found') };
    }

    await saveEventVenues(id, venueIds);

    return { success: true, event: await getEventById(id) };
  } catch (error) {
    console.error('Error updating event:', error);
    return { success: false, error };
  }
}

export async function deleteEvent(id: number) {
  try {
    await turso.execute({
      sql: 'DELETE FROM event_venues WHERE event_id = ?',
      args: [id]
    });

    await turso.execute({
      sql: 'DELETE FROM events WHERE id = ?',
      args: [id]
    });
    return { success: true };
  } catch (error) {
    console.error('Error deleting event:', error);
    return { success: false, error };
  }
}

export async function getVenues(): Promise<Venue[]> {
  try {
    const result = await turso.execute('SELECT * FROM venues ORDER BY name ASC');
    return result.rows.map(parseVenue);
  } catch (error) {
    console.error('Error fetching venues:', error);
    return [];
  }
}

export async function createVenue(venue: { name: string, address: string, rules: string[] }) {
  try {
    const result = await turso.execute({
      sql: 'INSERT INTO venues (name, address, rules) VALUES (?, ?, ?) RETURNING *',
      args: [venue.name, venue.address, JSON.stringify(venue.rules)]
    });

    return { success: true, venue: parseVenue(result.rows[0]) };
  } catch (error) {
    console.error('Error creating venue:', error);
    return { success: false, error };
  }
}

export async function updateVenue(id: number, venue: { name: string, address: string, rules: string[] }) {
  try {
    const result = await turso.execute({
      sql: 'UPDATE venues SET name = ?, address = ?, rules = ? WHERE id = ? RETURNING *',
      args: [venue.name, venue.address, JSON.stringify(venue.rules), id]
    });

    if (!result.rows[0]) {
      return { success: false, error: new Error('Venue not found') };
    }

    return { success: true, venue: parseVenue(result.rows[0]) };
  } catch (error) {
    console.error('Error updating venue:', error);
    return { success: false, error };
  }
}

export async function deleteVenue(id: number) {
  try {
    await turso.execute({
      sql: 'DELETE FROM venues WHERE id = ?',
      args: [id]
    });
    return { success: true };
  } catch (error) {
    console.error('Error deleting venue:', error);
    return { success: false, error };
  }
}
