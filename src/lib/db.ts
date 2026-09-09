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

export async function getEvents(): Promise<Event[]> {
  try {
    const result = await turso.execute('SELECT * FROM events');
    return sortEventsByStartDate(result.rows as unknown as Event[]);
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

export async function createEvent(event: { name: string, date: string, age: string, price: string, description: string }) {
  try {
    const result = await turso.execute({
      sql: 'INSERT INTO events (name, date, age, price, description) VALUES (?, ?, ?, ?, ?) RETURNING *',
      args: [event.name, event.date, event.age, event.price, event.description]
    });

    return { success: true, event: result.rows[0] as unknown as Event };
  } catch (error) {
    console.error('Error creating event:', error);
    return { success: false, error };
  }
}

export async function updateEvent(id: number, event: { name: string, date: string, age: string, price: string, description: string }) {
  try {
    const result = await turso.execute({
      sql: 'UPDATE events SET name = ?, date = ?, age = ?, price = ?, description = ? WHERE id = ? RETURNING *',
      args: [event.name, event.date, event.age, event.price, event.description, id]
    });

    if (!result.rows[0]) {
      return { success: false, error: new Error('Event not found') };
    }

    return { success: true, event: result.rows[0] as unknown as Event };
  } catch (error) {
    console.error('Error updating event:', error);
    return { success: false, error };
  }
}

export async function deleteEvent(id: number) {
  try {
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
