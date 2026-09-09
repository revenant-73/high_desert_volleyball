"use client";

import { useState } from "react";
import { Calendar, DollarSign, ChevronDown, ExternalLink, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

type EventStatus = 'planned' | 'registration_open' | 'registration_closed' | 'canceled';

interface Event {
  name: string;
  date: string;
  age: string;
  price: string;
  description: string;
  registration_url?: string | null;
  status?: EventStatus;
  division?: string | null;
  venue_name?: string | null;
  venue_address?: string | null;
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

export function Events({ events }: { events: Event[] }) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleEvent = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section id="events" className="py-24 bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Upcoming Events</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
            Join us for our 2025-2026 season. Click an event to view full details and pricing.
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
          <div className="space-y-4 sm:space-y-6">
            {events.map((event, index) => {
            const isExpanded = expandedIndex === index;
            const status = event.status || 'planned';
            const registrationOpen = status === 'registration_open' && event.registration_url;
            return (
              <div
                key={`${event.name}-${index}`}
                className={cn(
                  "bg-gray-950 rounded-2xl sm:rounded-3xl border border-gray-800 transition-all duration-300 overflow-hidden",
                  isExpanded ? "shadow-2xl ring-2 ring-blue-500/20 border-blue-500/30" : "hover:border-gray-700"
                )}
              >
                <button
                  onClick={() => toggleEvent(index)}
                  className="w-full text-left px-5 sm:px-8 py-6 sm:py-8 flex items-center justify-between gap-4 focus:outline-none group active:bg-gray-900 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-8 flex-1">
                    <div className="flex items-center gap-3 min-w-[140px]">
                      <div className={cn("p-2 rounded-lg transition-colors", isExpanded ? "bg-blue-500/20" : "bg-gray-900")}>
                        <Calendar className={cn("h-5 w-5 shrink-0 transition-colors", isExpanded ? "text-blue-400" : "text-gray-500")} />
                      </div>
                      <span className={cn("text-sm sm:text-base font-bold whitespace-nowrap tracking-tight", isExpanded ? "text-blue-400" : "text-gray-400")}>
                        {event.date}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 flex-1">
                      <span className="text-[10px] sm:text-[11px] font-black text-blue-400 bg-blue-900/30 px-2.5 py-1 rounded-lg uppercase tracking-widest shrink-0 border border-blue-800/50">
                        {event.division || event.age}
                      </span>
                      <span className={cn("text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-widest shrink-0 border", statusClasses[status])}>
                        {statusLabels[status]}
                      </span>
                      <h3 className="text-lg sm:text-xl font-black text-white leading-tight">{event.name}</h3>
                      {event.venue_name && (
                        <span className="flex basis-full items-center gap-1.5 text-xs text-gray-500 sm:basis-auto">
                          <MapPin className="h-3.5 w-3.5" />
                          {event.venue_name}
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
                  isExpanded ? "pb-8 sm:pb-12 max-h-[1000px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
                )}>
                  <div className="pt-6 sm:pt-8 border-t border-gray-800 space-y-6 sm:space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                      <div className="bg-blue-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-900/40 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
                        <div className="relative z-10">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="bg-white/20 p-2.5 rounded-xl">
                              <DollarSign className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-blue-100">Entry Fee</span>
                          </div>
                          <span className="text-4xl sm:text-5xl font-black">{event.price}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col justify-center gap-6">
                        <h4 className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">Event Details</h4>
                        <p className="text-gray-400 text-base sm:text-lg leading-relaxed font-medium">
                          {event.description}
                        </p>
                        {event.venue_name && (
                          <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-4">
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
                              <MapPin className="h-4 w-4 text-blue-500" />
                              Venue
                            </div>
                            <div className="mt-3 text-sm font-bold text-white">{event.venue_name}</div>
                            {event.venue_address && (
                              <div className="mt-1 text-sm text-gray-500">{event.venue_address}</div>
                            )}
                          </div>
                        )}
                        {registrationOpen ? (
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
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
