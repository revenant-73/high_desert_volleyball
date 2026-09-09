export interface EventLike {
  name: string;
  date: string;
  age: string;
  start_date?: string | null;
}

const monthIndexes: Record<string, number> = {
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

function eventStartTime(date: string) {
  const match = date.match(/^([A-Za-z]+)\s+(\d{1,2})(?:-\d{1,2})?,\s*(\d{4})/);
  if (!match) return Number.MAX_SAFE_INTEGER;

  const month = monthIndexes[match[1].toLowerCase()];
  const day = Number(match[2]);
  const year = Number(match[3]);

  if (month === undefined || Number.isNaN(day) || Number.isNaN(year)) {
    return Number.MAX_SAFE_INTEGER;
  }

  return Date.UTC(year, month, day);
}

function structuredEventStartTime(event: EventLike) {
  if (event.start_date) {
    const parsed = Date.parse(`${event.start_date}T00:00:00Z`);
    if (!Number.isNaN(parsed)) return parsed;
  }

  return eventStartTime(event.date || '');
}

export function sortEventsByStartDate<T extends EventLike>(events: T[]) {
  return [...events].sort((a, b) => {
    const byDate = structuredEventStartTime(a) - structuredEventStartTime(b);
    if (byDate !== 0) return byDate;

    const byName = a.name.localeCompare(b.name);
    if (byName !== 0) return byName;

    return a.age.localeCompare(b.age);
  });
}
