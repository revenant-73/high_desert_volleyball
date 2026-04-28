import { turso } from './turso';

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

export async function getEvents() {
  try {
    const result = await turso.execute('SELECT * FROM events ORDER BY date ASC');
    return result.rows as any[];
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

export async function createEvent(event: { name: string, date: string, age: string, price: string, description: string }) {
  try {
    await turso.execute({
      sql: 'INSERT INTO events (name, date, age, price, description) VALUES (?, ?, ?, ?, ?)',
      args: [event.name, event.date, event.age, event.price, event.description]
    });
    return { success: true };
  } catch (error) {
    console.error('Error creating event:', error);
    return { success: false, error };
  }
}

export async function updateEvent(id: number, event: { name: string, date: string, age: string, price: string, description: string }) {
  try {
    await turso.execute({
      sql: 'UPDATE events SET name = ?, date = ?, age = ?, price = ?, description = ? WHERE id = ?',
      args: [event.name, event.date, event.age, event.price, event.description, id]
    });
    return { success: true };
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

export async function getVenues() {
  try {
    const result = await turso.execute('SELECT * FROM venues ORDER BY name ASC');
    // Parse rules string back to array if needed (SQLite doesn't have array type)
    return result.rows.map((row: any) => {
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
        rules: Array.isArray(rules) ? rules : []
      };
    });
  } catch (error) {
    console.error('Error fetching venues:', error);
    return [];
  }
}

export async function createVenue(venue: { name: string, address: string, rules: string[] }) {
  try {
    await turso.execute({
      sql: 'INSERT INTO venues (name, address, rules) VALUES (?, ?, ?)',
      args: [venue.name, venue.address, JSON.stringify(venue.rules)]
    });
    return { success: true };
  } catch (error) {
    console.error('Error creating venue:', error);
    return { success: false, error };
  }
}

export async function updateVenue(id: number, venue: { name: string, address: string, rules: string[] }) {
  try {
    await turso.execute({
      sql: 'UPDATE venues SET name = ?, address = ?, rules = ? WHERE id = ?',
      args: [venue.name, venue.address, JSON.stringify(venue.rules), id]
    });
    return { success: true };
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
