import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../keystatic.config';

export const reader = createReader(process.cwd(), keystaticConfig);

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
  const events = await reader.collections.events.all();
  return events.map(e => e.entry);
}

export async function getVenues() {
  const venues = await reader.collections.venues.all();
  return venues.map(v => v.entry);
}
