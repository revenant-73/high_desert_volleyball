"use client";

import { useMemo, useState } from "react";
import { Calendar, DollarSign, ChevronDown, ExternalLink, MapPin, Star, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { sortEventsByStartDate } from "@/lib/eventSorting";

type EventStatus = 'planned' | 'registration_open' | 'registration_closed' | 'canceled';
type TournamentFormat = 'one_day' | 'two_day';

interface EventVenue {
  id: number;
  name: string;
  address: string;
}

interface Event {
  id?: number;
  name: string;
  date: string;
  age: string;
  price: string;
  description: string;
  start_date?: string | null;
  registration_url?: string | null;
  schedule_url?: string | null;
  status?: EventStatus;
  division?: string | null;
  venue_name?: string | null;
  venue_address?: string | null;
  venues?: EventVenue[];
  tournament_format?: TournamentFormat;
  featured?: number | boolean;
  featured_order?: number | null;
}

const statusLabels: Record<EventStatus, string> = {
  planned: 'Schedule Posted',
  registration_open: 'Registration Open',
  registration_closed: 'Registration Closed',
  canceled: 'Canceled',
};

const statusClasses: Record<EventStatus, string> = {
  planned: 'bg-gray-800 text-gray-300 border-gray-700',
  registration_open: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
  registration_closed: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
  canceled: 'bg-red-500/10 text-red-300 border-red-500/20',
};

const formatLabels: Record<TournamentFormat, string> = {
  one_day: '1-Day Tournament',
  two_day: '2-Day Tournament',
};

function isFeatured(event: Event) {
  return event.featured === true || event.featured === 1;
}

function eventFormat(event: Event): TournamentFormat {
  return event.tournament_format === 'one_day' ? 'one_day' : 'two_day';
}

function eventKey(event: Event, section: string, index: number) {
  return `${section}-${event.id ?? `${event.name}-${index}`}`;
}

function eventVenues(event: Event) {
  if (event.venues?.length) {
    return event.venues;
  }

  if (event.venue_name) {
    return [{
      id: 0,
      name: event.venue_name,
      address: event.venue_address || '',
    }];
  }

  return [];
}

function sortFeaturedEvents(events: Event[]) {
  return [...events].sort((a, b) => {
    const aOrder = a.featured_order ?? Number.MAX_SAFE_INTEGER;
    const bOrder = b.featured_order ?? Number.MAX_SAFE_INTEGER;
    if (aOrder !== bOrder) return aOrder - bOrder;

    return sortEventsByStartDate([a, b])[0] === a ? -1 : 1;
  });
}

function EventCard({
  event,
  eventKey,
  isExpanded,
  onToggle,
}: {
  event: Event;
  eventKey: string;
  isExpanded: boolean;
  onToggle: (key: string) => void;
}) {
  const status = event.status || 'planned';
  const canRegister = Boolean(event.registration_url) && status !== 'registration_closed' && status !== 'canceled';
  const venues = eventVenues(event);
  const format = eventFormat(event);

  return (
    <div
      className={cn(
        "bg-gray-950 rounded-2xl sm:rounded-3xl border border-gray-800 transition-all duration-300 overflow-hidden",
        isExpanded ? "shadow-2xl ring-2 ring-blue-500/20 border-blue-500/30" : "hover:border-gray-700"
      )}
    >
      <button
        onClick={() => onToggle(eventKey)}
        className="w-full text-left px-5 sm:px-8 py-6 sm:py-8 flex items-center justify-between gap-4 focus:outline-none group active:bg-gray-900 transition-colors"
        aria-expanded={isExpanded}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-8 flex-1">
          <div className="flex items-center gap-3 min-w-[140px]">
            <div className={cn("p-2 rounded-lg transition-colors", isExpanded ? "bg-blue-500/20" : "bg-gray-900")}>
              <Calendar className={cn("h-5 w-5 shrink-0 transition-colors", isExpanded ? "text-blue-400" : "text-gray-500")} />
            </div>
            <span className={cn("text-sm sm:text-base font-bold whitespace-nowrap", isExpanded ? "text-blue-400" : "text-gray-400")}>
              {event.date}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3 flex-1">
            {isFeatured(event) && (
              <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-black text-yellow-200 bg-yellow-500/10 px-2.5 py-1 rounded-lg uppercase border border-yellow-400/20">
                <Star className="h-3 w-3 fill-yellow-200" />
                Featured
              </span>
            )}
            <span className="text-[10px] sm:text-[11px] font-black text-blue-300 bg-blue-900/30 px-2.5 py-1 rounded-lg uppercase shrink-0 border border-blue-800/50">
              {formatLabels[format]}
            </span>
            <span className="text-[10px] sm:text-[11px] font-black text-blue-400 bg-blue-900/30 px-2.5 py-1 rounded-lg uppercase shrink-0 border border-blue-800/50">
              {event.division || event.age}
            </span>
            <span className={cn("text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-lg uppercase shrink-0 border", statusClasses[status])}>
              {statusLabels[status]}
            </span>
            <h3 className="text-lg sm:text-xl font-black text-white leading-tight">{event.name}</h3>
            {venues.length > 0 && (
              <span className="flex basis-full items-center gap-1.5 text-xs text-gray-500 sm:basis-auto">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                {venues.map((venue) => venue.name).join(', ')}
              </span>
            )}
          </div>
        </div>
        <div className={cn(
          "h-10 w-10 rounded-xl bg-gray-900 flex items-center justify-center transition-all duration-300 shrink-0 border border-gray-800",
          isExpanded ? "rotate-180 bg-blue-500/20 border-blue-500/30" : "group-hover:border-gray-600"
        )}>
          <ChevronDown className={cn("h-6 w-6 text-gray-500", isExpanded && "text-blue-400")} />
        </div>
      </button>

      <div className={cn(
        "px-5 sm:px-8 transition-all duration-300 ease-in-out",
        isExpanded ? "pb-8 sm:pb-12 max-h-[1200px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
      )}>
        <div className="pt-6 sm:pt-8 border-t border-gray-800 space-y-6 sm:space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-6 sm:gap-8">
            <div className="bg-blue-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-900/40">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-white/20 p-2.5 rounded-xl">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
                <span className="text-xs sm:text-sm font-bold uppercase text-blue-100">Entry Fee</span>
              </div>
              <span className="text-4xl sm:text-5xl font-black">{event.price}</span>
            </div>

            <div className="flex flex-col justify-center gap-6">
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-gray-500 uppercase mb-4">Event Details</h4>
                <p className="text-gray-400 text-base sm:text-lg leading-relaxed font-medium">
                  {event.description}
                </p>
              </div>

              {venues.length > 0 && (
                <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase text-gray-500">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    {venues.length === 1 ? 'Venue' : 'Venues'}
                  </div>
                  <div className="mt-3 space-y-3">
                    {venues.map((venue) => (
                      <div key={`${eventKey}-${venue.id}-${venue.name}`}>
                        <div className="text-sm font-bold text-white">{venue.name}</div>
                        {venue.address && (
                          <div className="mt-1 text-sm text-gray-500">{venue.address}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {canRegister ? (
                  <a
                    href={event.registration_url || undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-700"
                  >
                    Register Team <ExternalLink className="h-4 w-4" />
                  </a>
                ) : (
                  <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-4 text-sm text-gray-400">
                    {status === 'registration_closed'
                      ? 'Registration is closed for this event.'
                      : status === 'canceled'
                        ? 'This event has been canceled.'
                        : 'Registration details will be posted when available.'}
                  </div>
                )}

                {event.schedule_url && (
                  <a
                    href={event.schedule_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-700 bg-gray-900 px-6 py-3 text-sm font-bold text-white transition-colors hover:border-blue-500 hover:text-blue-300"
                  >
                    Live Schedule <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EventSection({
  title,
  subtitle,
  events,
  sectionKey,
  expandedKey,
  onToggle,
}: {
  title: string;
  subtitle: string;
  events: Event[];
  sectionKey: string;
  expandedKey: string | null;
  onToggle: (key: string) => void;
}) {
  if (events.length === 0) return null;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-2xl font-black text-white">{title}</h3>
          <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
        </div>
        <span className="text-xs font-bold uppercase text-gray-500">
          {events.length} {events.length === 1 ? 'event' : 'events'}
        </span>
      </div>
      <div className="space-y-4 sm:space-y-6">
        {events.map((event, index) => {
          const key = eventKey(event, sectionKey, index);
          return (
            <EventCard
              key={key}
              event={event}
              eventKey={key}
              isExpanded={expandedKey === key}
              onToggle={onToggle}
            />
          );
        })}
      </div>
    </div>
  );
}

export function Events({ events }: { events: Event[] }) {
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  const groupedEvents = useMemo(() => {
    const sortedEvents = sortEventsByStartDate(events);
    return {
      featured: sortFeaturedEvents(sortedEvents.filter(isFeatured)),
      oneDay: sortedEvents.filter((event) => eventFormat(event) === 'one_day'),
      twoDay: sortedEvents.filter((event) => eventFormat(event) === 'two_day'),
    };
  }, [events]);

  const toggleEvent = (key: string) => {
    setExpandedKey(expandedKey === key ? null : key);
  };

  return (
    <section id="events" className="py-24 bg-gray-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10">
            <Trophy className="h-6 w-6 text-blue-300" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Upcoming Events</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
            Join us for our 2025-2026 season. Featured events, 1-day tournaments, and 2-day tournaments are organized below.
          </p>
        </div>

        {events.length === 0 ? (
          <div className="rounded-2xl border border-gray-800 bg-gray-950 px-6 py-10 text-center">
            <h3 className="text-xl font-black text-white mb-3">Tournament schedule coming soon</h3>
            <p className="text-sm sm:text-base text-gray-400 max-w-xl mx-auto">
              Event dates and registration details will be posted here as soon as they are confirmed.
            </p>
          </div>
        ) : (
          <div className="space-y-14">
            <EventSection
              title="Featured Events"
              subtitle="Larger HDVL-hosted tournaments and spotlight events."
              events={groupedEvents.featured}
              sectionKey="featured"
              expandedKey={expandedKey}
              onToggle={toggleEvent}
            />
            <EventSection
              title="1-Day Tournaments"
              subtitle="Single-day events for a focused competition schedule."
              events={groupedEvents.oneDay}
              sectionKey="one-day"
              expandedKey={expandedKey}
              onToggle={toggleEvent}
            />
            <EventSection
              title="2-Day Tournaments"
              subtitle="Full weekend events with expanded match schedules."
              events={groupedEvents.twoDay}
              sectionKey="two-day"
              expandedKey={expandedKey}
              onToggle={toggleEvent}
            />
          </div>
        )}
      </div>
    </section>
  );
}
