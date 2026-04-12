"use client";

import { useState } from "react";
import { events } from "@/data/site-config";
import { Calendar, DollarSign, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function Events() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleEvent = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section id="events" className="py-24 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Upcoming Events</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join us for our 2025-2026 season. Click an event to view full details and pricing.
          </p>
        </div>

        <div className="space-y-4">
          {events.map((event, index) => {
            const isExpanded = expandedIndex === index;
            return (
              <div
                key={`${event.name}-${index}`}
                className={cn(
                  "bg-white rounded-2xl border border-gray-100 transition-all duration-200 overflow-hidden",
                  isExpanded ? "shadow-md ring-1 ring-blue-500/10" : "hover:shadow-sm"
                )}
              >
                <button
                  onClick={() => toggleEvent(index)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 focus:outline-none group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 flex-1">
                    <div className="flex items-center gap-3 min-w-[140px]">
                      <Calendar className={cn("h-5 w-5 shrink-0 transition-colors", isExpanded ? "text-blue-600" : "text-gray-400")} />
                      <span className={cn("text-sm font-semibold whitespace-nowrap", isExpanded ? "text-blue-600" : "text-gray-600")}>
                        {event.date}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider shrink-0">
                        {event.age}
                      </span>
                      <h3 className="text-lg font-bold text-gray-900 leading-tight">{event.name}</h3>
                    </div>
                  </div>
                  <div className={cn(
                    "h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center transition-all duration-200 shrink-0",
                    isExpanded ? "rotate-180 bg-blue-50" : "group-hover:bg-gray-100"
                  )}>
                    <ChevronDown className={cn("h-5 w-5 text-gray-400", isExpanded && "text-blue-600")} />
                  </div>
                </button>

                <div className={cn(
                  "px-6 transition-all duration-300 ease-in-out",
                  isExpanded ? "pb-8 max-h-[800px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
                )}>
                  <div className="pt-6 border-t border-gray-50 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="bg-blue-600 rounded-2xl p-5 text-white shadow-lg shadow-blue-200">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="bg-white/20 p-2 rounded-lg">
                            <DollarSign className="h-5 w-5 text-white" />
                          </div>
                          <span className="text-xs font-bold uppercase tracking-widest text-blue-100">Event Price</span>
                        </div>
                        <span className="text-3xl font-black">{event.price}</span>
                      </div>
                      
                      <div className="flex flex-col justify-center">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Description</h4>
                        <p className="text-gray-600 text-sm leading-relaxed">
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
