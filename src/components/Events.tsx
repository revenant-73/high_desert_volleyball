import { events } from "@/data/site-config";
import { Calendar, DollarSign } from "lucide-react";

export function Events() {
  return (
    <section id="events" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Upcoming Events</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join us for our 2025-2026 season. We offer competitive tournaments for all age groups and skill levels.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <div
              key={`${event.name}-${index}`}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="bg-blue-50 p-3 rounded-xl group-hover:bg-blue-600 transition-colors">
                  <Calendar className="h-6 w-6 text-blue-600 group-hover:text-white" />
                </div>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">
                  {event.age}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">{event.name}</h3>
              <p className="text-sm text-blue-600 font-semibold mb-4">{event.date}</p>
              <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                {event.description}
              </p>

              <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                <div className="flex items-center gap-2 text-gray-900 font-bold">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  {event.price}
                </div>
                <button className="text-blue-600 text-sm font-bold hover:underline">
                  Event Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
