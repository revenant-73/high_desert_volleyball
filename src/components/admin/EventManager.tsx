import React, { useState } from 'react';
import { Pencil, Trash2, Plus, X, Save } from 'lucide-react';
import { sortEventsByStartDate } from '@/lib/eventSorting';

type EventStatus = 'planned' | 'registration_open' | 'registration_closed' | 'canceled';

interface Event {
  id: number;
  created_at?: string;
  name: string;
  date: string;
  age: string;
  price: string;
  description: string;
  start_date?: string | null;
  end_date?: string | null;
  registration_url?: string | null;
  status?: EventStatus;
  division?: string | null;
  venue_id?: number | null;
  venue_name?: string | null;
  venue_address?: string | null;
}

interface Venue {
  id: number;
  name: string;
  address: string;
}

interface FormData {
  name: string;
  date: string;
  age: string;
  price: string;
  description: string;
  start_date: string;
  end_date: string;
  registration_url: string;
  status: EventStatus;
  division: string;
  venue_id: string;
}

const statusLabels: Record<EventStatus, string> = {
  planned: 'Planned',
  registration_open: 'Registration Open',
  registration_closed: 'Registration Closed',
  canceled: 'Canceled',
};

const statusClasses: Record<EventStatus, string> = {
  planned: 'bg-zinc-800 text-zinc-300 border-zinc-700',
  registration_open: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
  registration_closed: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
  canceled: 'bg-red-500/10 text-red-300 border-red-500/20',
};

const emptyFormData: FormData = {
  name: '',
  date: '',
  age: '',
  price: '',
  description: '',
  start_date: '',
  end_date: '',
  registration_url: '',
  status: 'planned',
  division: '',
  venue_id: '',
};

function eventToFormData(event: Event): FormData {
  return {
    name: event.name,
    date: event.date,
    age: event.age,
    price: event.price,
    description: event.description,
    start_date: event.start_date || '',
    end_date: event.end_date || '',
    registration_url: event.registration_url || '',
    status: event.status || 'planned',
    division: event.division || event.age,
    venue_id: event.venue_id ? String(event.venue_id) : '',
  };
}

function toSubmissionData(formData: FormData) {
  return {
    ...formData,
    name: formData.name.trim(),
    date: formData.date.trim(),
    age: formData.age.trim(),
    price: formData.price.trim(),
    description: formData.description.trim(),
    registration_url: formData.registration_url.trim() || null,
    start_date: formData.start_date || null,
    end_date: formData.end_date || null,
    division: formData.division.trim() || formData.age.trim(),
    venue_id: formData.venue_id || null,
  };
}

export default function EventManager({ initialEvents, venues }: { initialEvents: Event[], venues: Venue[] }) {
  const [events, setEvents] = useState<Event[]>(sortEventsByStartDate(initialEvents));
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyFormData);

  const showStatus = (type: 'success' | 'error', message: string) => {
    setStatus({ type, message });
    setTimeout(() => setStatus(null), 3000);
  };

  const withVenueDetails = (event: Event): Event => {
    const venue = venues.find((venue) => venue.id === event.venue_id);
    return {
      ...event,
      venue_name: venue?.name || event.venue_name || null,
      venue_address: venue?.address || event.venue_address || null,
    };
  };

  const handleEdit = (event: Event) => {
    setFormData(eventToFormData(event));
    setIsEditing(event.id);
    setIsAdding(false);
  };

  const handleAdd = () => {
    setFormData(emptyFormData);
    setIsAdding(true);
    setIsEditing(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/events/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setEvents(events.filter(e => e.id !== id));
        showStatus('success', 'Event deleted successfully');
      } else {
        showStatus('error', 'Failed to delete event');
      }
    } catch (err) {
      console.error(err);
      showStatus('error', 'An error occurred while deleting');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEditing ? `/api/events/${isEditing}` : '/api/events';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toSubmissionData(formData))
      });

      if (res.ok) {
        const result = await res.json();
        const savedEvent = withVenueDetails(result.event as Event);
        if (isEditing) {
          setEvents(sortEventsByStartDate(events.map(e => e.id === isEditing ? savedEvent : e)));
          showStatus('success', 'Event updated successfully');
        } else {
          setEvents(sortEventsByStartDate([...events, savedEvent]));
          showStatus('success', 'Event created successfully');
        }
        setIsEditing(null);
        setIsAdding(false);
      } else {
        showStatus('error', 'Failed to save event');
      }
    } catch (err) {
      console.error(err);
      showStatus('error', 'An error occurred while saving');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold">Events ({events.length})</h2>
        {!isAdding && !isEditing && (
          <button
            onClick={handleAdd}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={18} />
            Add Event
          </button>
        )}
      </div>

      {status && (
        <div className={`fixed bottom-8 right-8 z-50 px-6 py-3 rounded-lg shadow-2xl border transition-all animate-in fade-in slide-in-from-bottom-4 ${
          status.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'
        }`}>
          {status.message}
        </div>
      )}

      {(isAdding || isEditing !== null) && (
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium">
              {isEditing !== null ? 'Edit Event' : 'New Event'}
            </h3>
            <button onClick={() => { setIsEditing(null); setIsAdding(false); }} className="text-zinc-500 hover:text-white">
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-zinc-400">Event Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-zinc-400">Display Date</label>
                <input
                  type="text"
                  required
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Jan 9-10, 2026"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-zinc-400">Start Date</label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={e => setFormData({ ...formData, start_date: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-zinc-400">End Date</label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={e => setFormData({ ...formData, end_date: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-zinc-400">Age Groups</label>
                <input
                  type="text"
                  required
                  value={formData.age}
                  onChange={e => setFormData({ ...formData, age: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. 15-18u"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-zinc-400">Division Label</label>
                <input
                  type="text"
                  value={formData.division}
                  onChange={e => setFormData({ ...formData, division: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Defaults to age groups"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-zinc-400">Price</label>
                <input
                  type="text"
                  required
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. $400"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-zinc-400">Status</label>
                <select
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value as EventStatus })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="planned">Planned</option>
                  <option value="registration_open">Registration Open</option>
                  <option value="registration_closed">Registration Closed</option>
                  <option value="canceled">Canceled</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-zinc-400">Venue</label>
                <select
                  value={formData.venue_id}
                  onChange={e => setFormData({ ...formData, venue_id: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">No venue assigned</option>
                  {venues.map((venue) => (
                    <option key={venue.id} value={venue.id}>{venue.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm text-zinc-400">Registration URL</label>
                <input
                  type="url"
                  value={formData.registration_url}
                  onChange={e => setFormData({ ...formData, registration_url: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://tm2sign.com/..."
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-zinc-400">Description</label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => { setIsEditing(null); setIsAdding(false); }}
                className="px-4 py-2 text-zinc-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg transition-colors"
              >
                <Save size={18} />
                {loading ? 'Saving...' : 'Save Event'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/50">
                <th className="px-5 py-4 text-sm font-medium text-zinc-400">Name</th>
                <th className="px-5 py-4 text-sm font-medium text-zinc-400">Date</th>
                <th className="px-5 py-4 text-sm font-medium text-zinc-400">Division</th>
                <th className="px-5 py-4 text-sm font-medium text-zinc-400">Status</th>
                <th className="px-5 py-4 text-sm font-medium text-zinc-400">Venue</th>
                <th className="px-5 py-4 text-sm font-medium text-zinc-400">Price</th>
                <th className="px-5 py-4 text-sm font-medium text-zinc-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-zinc-800/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-medium">{event.name}</div>
                  </td>
                  <td className="px-5 py-4 text-zinc-400">{event.date}</td>
                  <td className="px-5 py-4 text-zinc-400">{event.division || event.age}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${statusClasses[event.status || 'planned']}`}>
                      {statusLabels[event.status || 'planned']}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-zinc-400">{event.venue_name || 'Unassigned'}</td>
                  <td className="px-5 py-4 text-zinc-400">{event.price}</td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(event)}
                        className="p-2 text-zinc-400 hover:text-blue-500 transition-colors"
                        aria-label={`Edit ${event.name}`}
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                        aria-label={`Delete ${event.name}`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="lg:hidden divide-y divide-zinc-800">
          {events.map((event) => (
            <div key={event.id} className="p-4 space-y-3">
              <div className="flex justify-between items-start gap-3">
                <div>
                  <div className="font-bold text-lg">{event.name}</div>
                  <div className="text-blue-500 text-sm font-medium">{event.date}</div>
                  <div className="text-zinc-500 text-xs">{event.venue_name || 'Unassigned venue'}</div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(event)}
                    className="p-2 text-zinc-400 hover:text-blue-500 transition-colors"
                    aria-label={`Edit ${event.name}`}
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                    aria-label={`Delete ${event.name}`}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 text-sm">
                <div className="bg-zinc-800 px-2 py-1 rounded text-zinc-300">
                  <span className="text-zinc-500 mr-1">Division:</span> {event.division || event.age}
                </div>
                <div className="bg-zinc-800 px-2 py-1 rounded text-zinc-300">
                  <span className="text-zinc-500 mr-1">Price:</span> {event.price}
                </div>
                <span className={`inline-flex rounded border px-2 py-1 text-xs font-medium ${statusClasses[event.status || 'planned']}`}>
                  {statusLabels[event.status || 'planned']}
                </span>
              </div>
              {event.description && (
                <div className="text-sm text-zinc-400 line-clamp-2">
                  {event.description}
                </div>
              )}
            </div>
          ))}
        </div>

        {events.length === 0 && (
          <div className="px-6 py-12 text-center text-zinc-500">
            No events found. Click "Add Event" to create one.
          </div>
        )}
      </div>
    </div>
  );
}
