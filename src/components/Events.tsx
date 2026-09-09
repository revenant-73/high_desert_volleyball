"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  CircleDollarSign,
  ExternalLink,
  ListFilter,
  MapPin,
  Medal,
  Star,
  Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { sortEventsByStartDate } from "@/lib/eventSorting";

type EventStatus = "planned" | "registration_open" | "registration_closed" | "canceled";
type TournamentFormat = "one_day" | "two_day";
type EventFilter = "all" | "featured" | "one_day" | "two_day";

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
  planned: "Schedule Posted",
  registration_open: "Registration Open",
  registration_closed: "Registration Closed",
  canceled: "Canceled",
};

const statusClasses: Record<EventStatus, string> = {
  planned: "border-slate-600/60 bg-slate-800/80 text-slate-200",
  registration_open: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  registration_closed: "border-amber-400/30 bg-amber-400/10 text-amber-200",
  canceled: "border-red-400/30 bg-red-400/10 text-red-200",
};

const statusDotClasses: Record<EventStatus, string> = {
  planned: "bg-slate-300",
  registration_open: "bg-emerald-300",
  registration_closed: "bg-amber-300",
  canceled: "bg-red-300",
};

const formatLabels: Record<TournamentFormat, string> = {
  one_day: "1-Day Tournament",
  two_day: "2-Day Tournament",
};

const shortFormatLabels: Record<TournamentFormat, string> = {
  one_day: "1-Day",
  two_day: "2-Day",
};

function isFeatured(event: Event) {
  return event.featured === true || event.featured === 1;
}

function eventFormat(event: Event): TournamentFormat {
  return event.tournament_format === "one_day" ? "one_day" : "two_day";
}

function eventKey(event: Event, index: number) {
  return `${event.id ?? `${event.name}-${event.date}`}-${index}`;
}

function eventVenues(event: Event) {
  if (event.venues?.length) {
    return event.venues;
  }

  if (event.venue_name) {
    return [
      {
        id: 0,
        name: event.venue_name,
        address: event.venue_address || "",
      },
    ];
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

function venueSummary(venues: EventVenue[]) {
  if (venues.length === 0) return "Venue TBA";
  if (venues.length === 1) return venues[0].name;
  if (venues.length === 2) return `${venues[0].name} + ${venues[1].name}`;
  return `${venues[0].name} + ${venues.length - 1} more`;
}

function registrationUnavailableText(status: EventStatus) {
  if (status === "registration_closed") return "Registration closed";
  if (status === "canceled") return "Event canceled";
  return "Registration details coming";
}

function EventActionLink({
  href,
  label,
  variant,
}: {
  href: string;
  label: string;
  variant: "primary" | "secondary";
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(event) => event.stopPropagation()}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-black transition focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-gray-950 active:scale-[0.98]",
        variant === "primary"
          ? "bg-blue-500 text-white shadow-lg shadow-blue-950/30 hover:bg-blue-400"
          : "border border-white/20 bg-white/[0.04] text-white hover:border-blue-300 hover:bg-blue-500/10 hover:text-blue-200"
      )}
    >
      {label}
      <ExternalLink className="h-4 w-4" aria-hidden="true" />
    </a>
  );
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
  const status = event.status || "planned";
  const canRegister = Boolean(event.registration_url) && status !== "registration_closed" && status !== "canceled";
  const venues = eventVenues(event);
  const format = eventFormat(event);
  const division = event.division || event.age;
  const detailsId = `event-details-${eventKey}`;

  return (
    <article
      className={cn(
        "overflow-hidden rounded-2xl border bg-gray-950/90 shadow-xl shadow-black/20 transition",
        isExpanded ? "border-blue-400/40 ring-2 ring-blue-400/15" : "border-white/10 hover:border-blue-400/30"
      )}
    >
      <div className="p-4 sm:p-5 lg:p-6">
        <button
          type="button"
          onClick={() => onToggle(eventKey)}
          className="group w-full rounded-xl text-left focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-gray-950"
          aria-expanded={isExpanded}
          aria-controls={detailsId}
        >
          <div className="grid gap-4 lg:grid-cols-[9.5rem_minmax(0,1fr)_12rem_2.75rem] lg:items-center">
            <div className="flex items-center gap-3 lg:block">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-blue-400/25 bg-blue-500/10 lg:mb-3">
                <CalendarDays className="h-5 w-5 text-blue-300" aria-hidden="true" />
              </div>
              <div>
                <div className="text-base font-black text-blue-200 sm:text-lg">{event.date}</div>
                <div className="mt-1 text-[11px] font-black uppercase tracking-[0.12em] text-gray-500">
                  {shortFormatLabels[format]} event
                </div>
              </div>
            </div>

            <div className="min-w-0">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                {isFeatured(event) && (
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300/25 bg-amber-300/10 px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.08em] text-amber-200">
                    <Star className="h-3.5 w-3.5 fill-amber-200" aria-hidden="true" />
                    Featured
                  </span>
                )}
                <span className="rounded-lg border border-blue-400/25 bg-blue-500/10 px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.08em] text-blue-200">
                  {formatLabels[format]}
                </span>
                <span className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.08em] text-white">
                  {division}
                </span>
              </div>
              <h3 className="text-xl font-black leading-tight text-white sm:text-2xl">{event.name}</h3>
              <div className="mt-3 flex items-start gap-2 text-sm text-gray-400">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" aria-hidden="true" />
                <span>{venueSummary(venues)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:max-w-md lg:grid-cols-1">
              <div className={cn("inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-black uppercase tracking-[0.08em]", statusClasses[status])}>
                <span className={cn("h-2 w-2 rounded-full", statusDotClasses[status])} aria-hidden="true" />
                {statusLabels[status]}
              </div>
              <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-black text-white">
                <CircleDollarSign className="h-4 w-4 text-amber-200" aria-hidden="true" />
                {event.price}
              </div>
            </div>

            <div
              className={cn(
                "hidden h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] transition lg:flex",
                isExpanded ? "rotate-180 border-blue-400/30 bg-blue-500/10" : "group-hover:border-blue-400/30"
              )}
            >
              <ChevronDown className={cn("h-5 w-5 text-gray-400", isExpanded && "text-blue-200")} aria-hidden="true" />
            </div>
          </div>
        </button>

        <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-gray-500">
            <Medal className="h-4 w-4 text-blue-300" aria-hidden="true" />
            {venues.length > 1 ? `${venues.length} venues assigned` : venues.length === 1 ? "Venue assigned" : "Venue pending"}
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {canRegister ? (
              <EventActionLink href={event.registration_url || ""} label="Register" variant="primary" />
            ) : (
              <div className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-center text-sm font-bold text-gray-400">
                {registrationUnavailableText(status)}
              </div>
            )}
            {event.schedule_url && (
              <EventActionLink href={event.schedule_url} label="Live Schedule" variant="secondary" />
            )}
          </div>
        </div>
      </div>

      <div
        id={detailsId}
        aria-hidden={!isExpanded}
        className={cn(
          "grid transition-all duration-300 ease-in-out",
          isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="border-t border-white/10 bg-gray-900/70 px-4 py-5 sm:px-5 lg:px-6 lg:py-6">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(17rem,0.55fr)]">
              <div>
                <h4 className="text-xs font-black uppercase tracking-[0.14em] text-gray-500">Event Details</h4>
                <p className="mt-3 text-base font-medium leading-7 text-gray-300">{event.description}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-gray-950/70 p-4">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-gray-500">
                  <MapPin className="h-4 w-4 text-blue-300" aria-hidden="true" />
                  {venues.length === 1 ? "Venue" : "Venues"}
                </div>
                {venues.length > 0 ? (
                  <div className="mt-4 space-y-4">
                    {venues.map((venue) => (
                      <div key={`${eventKey}-${venue.id}-${venue.name}`}>
                        <div className="text-sm font-black text-white">{venue.name}</div>
                        {venue.address && <div className="mt-1 text-sm leading-6 text-gray-400">{venue.address}</div>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-gray-400">Venue information will be posted when available.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function SummaryStat({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: number;
  tone?: "default" | "featured";
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
      <div className={cn("text-2xl font-black", tone === "featured" ? "text-amber-200" : "text-white")}>
        {value}
      </div>
      <div className="mt-1 text-[11px] font-black uppercase tracking-[0.12em] text-gray-500">{label}</div>
    </div>
  );
}

export function Events({ events }: { events: Event[] }) {
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<EventFilter>("all");

  const schedule = useMemo(() => {
    const sortedEvents = sortEventsByStartDate(events);
    const featured = sortFeaturedEvents(sortedEvents.filter(isFeatured));
    const oneDay = sortedEvents.filter((event) => eventFormat(event) === "one_day");
    const twoDay = sortedEvents.filter((event) => eventFormat(event) === "two_day");

    return {
      all: sortedEvents,
      featured,
      one_day: oneDay,
      two_day: twoDay,
      counts: {
        total: sortedEvents.length,
        featured: featured.length,
        oneDay: oneDay.length,
        twoDay: twoDay.length,
      },
    };
  }, [events]);

  const filterOptions: Array<{ id: EventFilter; label: string; count: number }> = [
    { id: "all", label: "All", count: schedule.counts.total },
    { id: "featured", label: "Featured", count: schedule.counts.featured },
    { id: "one_day", label: "1-Day", count: schedule.counts.oneDay },
    { id: "two_day", label: "2-Day", count: schedule.counts.twoDay },
  ];

  const filteredEvents = schedule[activeFilter];

  const toggleEvent = (key: string) => {
    setExpandedKey((current) => (current === key ? null : key));
  };

  const setFilter = (filter: EventFilter) => {
    setActiveFilter(filter);
    setExpandedKey(null);
  };

  return (
    <section id="events" className="scroll-mt-32 bg-gray-950 py-16 sm:scroll-mt-36 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.86fr)_minmax(25rem,0.58fr)] lg:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-xl border border-blue-400/20 bg-blue-500/10 px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-blue-200">
              <Trophy className="h-4 w-4" aria-hidden="true" />
              HDVL Tournament Schedule
            </div>
            <h2 className="max-w-3xl text-3xl font-black leading-tight tracking-normal text-white sm:text-4xl lg:text-5xl">
              Find the right event, confirm the venue, and act fast.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg">
              Featured events, 1-day tournaments, and 2-day tournaments are organized for quick scanning by coaches and families.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
            <SummaryStat label="Total Events" value={schedule.counts.total} />
            <SummaryStat label="Featured" value={schedule.counts.featured} tone="featured" />
            <SummaryStat label="1-Day" value={schedule.counts.oneDay} />
            <SummaryStat label="2-Day" value={schedule.counts.twoDay} />
          </div>
        </div>

        {events.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-white/10 bg-gray-900/60 px-6 py-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-blue-400/25 bg-blue-500/10">
              <CalendarDays className="h-6 w-6 text-blue-300" aria-hidden="true" />
            </div>
            <h3 className="mt-5 text-xl font-black text-white">Tournament schedule coming soon</h3>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-400 sm:text-base">
              Event dates and registration details will be posted here as soon as they are confirmed.
            </p>
          </div>
        ) : (
          <div className="mt-10 space-y-6">
            <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-gray-900/60 p-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 px-1 text-xs font-black uppercase tracking-[0.14em] text-gray-500">
                <ListFilter className="h-4 w-4 text-blue-300" aria-hidden="true" />
                Filter Events
              </div>
              <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-end">
                {filterOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setFilter(option.id)}
                    aria-pressed={activeFilter === option.id}
                    className={cn(
                      "inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-black transition focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-gray-950",
                      activeFilter === option.id
                        ? "bg-blue-500 text-white shadow-lg shadow-blue-950/30"
                        : "border border-white/10 bg-white/[0.04] text-gray-300 hover:border-blue-400/30 hover:text-white"
                    )}
                  >
                    {option.label}
                    <span
                      className={cn(
                        "rounded-md px-1.5 py-0.5 text-[11px]",
                        activeFilter === option.id ? "bg-white/20 text-white" : "bg-gray-950 text-gray-400"
                      )}
                    >
                      {option.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event, index) => {
                  const key = eventKey(event, index);
                  return (
                    <EventCard
                      key={key}
                      event={event}
                      eventKey={key}
                      isExpanded={expandedKey === key}
                      onToggle={toggleEvent}
                    />
                  );
                })
              ) : (
                <div className="rounded-2xl border border-white/10 bg-gray-900/60 px-6 py-10 text-center">
                  <h3 className="text-lg font-black text-white">No events in this view</h3>
                  <p className="mt-2 text-sm text-gray-400">Try another filter to see the full HDVL schedule.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
