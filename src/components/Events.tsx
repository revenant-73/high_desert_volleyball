"use client";

import { useState } from "react";
import { Calendar, DollarSign, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Event {
  name: string;
  date: string;
  age: string;
  price: string;
  description: string;
}

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

        <div className="space-y-4 sm:space-y-6">
          {events.map((event, index) => {
            const isExpanded = expandedIndex === index;
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
                        {event.age}
                      </span>
                      <h3 className="text-lg sm:text-xl font-black text-white leading-tight">{event.name}</h3>
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
                  isExpanded ? "pb-8 sm:pb-12 max-h-[800px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
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
                      
                      <div className="flex flex-col justify-center">
                        <h4 className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">Event Details</h4>
                        <p className="text-gray-400 text-base sm:text-lg leading-relaxed font-medium">
                          {event.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
