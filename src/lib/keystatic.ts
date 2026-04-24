import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../keystatic.config';

export const reader = createReader(process.cwd(), keystaticConfig);

export async function getSiteConfig() {
  return await reader.singletons.siteConfig.read();
}

export async function getEvents() {
  const events = await reader.collections.events.all();
  return events.map(e => e.entry);
}

export async function getVenues() {
  const venues = await reader.collections.venues.all();
  return venues.map(v => v.entry);
}
