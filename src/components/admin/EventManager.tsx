import React, { useState } from 'react';
import { Pencil, Trash2, Plus, X, Save, Star } from 'lucide-react';
import { sortEventsByStartDate } from '@/lib/eventSorting';

type EventStatus = 'planned' | 'registration_open' | 'registration_closed' | 'canceled';
type TournamentFormat = 'one_day' | 'two_day';

interface EventVenue {
  id: number;
  name: string;
  address: string;
}

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
  schedule_url?: string | null;
  status?: EventStatus;
  division?: string | null;
  venue_id?: number | null;
  venue_name?: string | null;
  venue_address?: string | null;
  venues?: EventVenue[];
  venue_ids?: number[];
  tournament_format?: TournamentFormat;
  featured?: number | boolean;
  featured_order?: number | null;
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
  schedule_url: string;
  status: EventStatus;
  division: string;
  venue_ids: string[];
  tournament_format: TournamentFormat;
  featured: boolean;
  featured_order: string;
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

const formatLabels: Record<TournamentFormat, string> = {
  one_day: '1-Day',
  two_day: '2-Day',
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
  schedule_url: '',
  status: 'planned',
  division: '',
  venue_ids: [],
  tournament_format: 'two_day',
  featured: false,
  featured_order: '',
};

function isFeatured(event: Event) {
  return event.featured === true || event.featured === 1;
}

function eventVenueIds(event: Event) {
  if (event.venue_ids?.length) {
    return event.venue_ids.map(String);
  }

  if (event.venues?.length) {
    return event.venues.map((venue) => String(venue.id));
  }

  return event.venue_id ? [String(event.venue_id)] : [];
}

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
    schedule_url: event.schedule_url || '',
    status: event.status || 'planned',
    division: event.division || event.age,
    venue_ids: eventVenueIds(event),
    tournament_format: event.tournament_format || 'two_day',
    featured: isFeatured(event),
    featured_order: event.featured_order ? String(event.featured_order) : '',
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
    schedule_url: formData.schedule_url.trim() || null,
    start_date: formData.start_date || null,
    end_date: formData.end_date || null,
    division: formData.division.trim() || formData.age.trim(),
    venue_id: formData.venue_ids[0] || null,
    venue_ids: formData.venue_ids,
    featured: formData.featured,
    featured_order: formData.featured_order || null,
  };
}

function venueSummary(event: Event) {
  if (event.venues?.length) {
    return event.venues.map((venue) => venue.name).join(', ');
  }

  return event.venue_name || 'Unassigned';
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
    const selectedVenues = event.venue_ids
      ?.map((venueId) => venues.find((venue) => venue.id === venueId))
      .filter((venue): venue is Venue => Boolean(venue));

    if (selectedVenues?.length) {
      return {
        ...event,
        venues: selectedVenues,
        venue_name: selectedVenues.map((venue) => venue.name).join(', '),
        venue_address: selectedVenues.length === 1 ? selectedVenues[0].address : null,
      };
    }

    return event;
  };

  const handleVenueToggle = (venueId: string) => {
    setFormData((current) => ({
      ...current,
      venue_ids: current.venue_ids.includes(venueId)
        ? current.venue_ids.filter((id) => id !== venueId)
        : [...current.venue_ids, venueId],
    }));
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
          <form onSubmit={handleSubmit} className="space-y-5">
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
                <label className="text-sm text-zinc-400">Tournament Format</label>
                <select
                  value={formData.tournament_format}
                  onChange={e => setFormData({ ...formData, tournament_format: e.target.value as TournamentFormat })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="one_day">1-Day Tournament</option>
                  <option value="two_day">2-Day Tournament</option>
                </select>
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
                <label className="text-sm text-zinc-400">Featured Order</label>
                <input
                  type="number"
                  min="1"
                  value={formData.featured_order}
                  onChange={e => setFormData({ ...formData, featured_order: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="1, 2, or 3"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="inline-flex items-center gap-3 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-zinc-200">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                    className="h-4 w-4 rounded border-zinc-600 bg-zinc-900 text-blue-600 focus:ring-blue-500"
                  />
                  Feature this event on the public site
                </label>
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
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm text-zinc-400">Live Schedule URL</label>
                <input
                  type="url"
                  value={formData.schedule_url}
                  onChange={e => setFormData({ ...formData, schedule_url: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://..."
                />
              </div>
            </div>

            <fieldset className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
              <legend className="px-1 text-sm font-medium text-zinc-300">Venues</legend>
              {venues.length === 0 ? (
                <p className="text-sm text-zinc-500">Add venues before assigning them to events.</p>
              ) : (
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {venues.map((venue) => {
                    const venueId = String(venue.id);
                    return (
                      <label key={venue.id} className="flex items-start gap-3 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-3 text-sm">
                        <input
                          type="checkbox"
                          checked={formData.venue_ids.includes(venueId)}
                          onChange={() => handleVenueToggle(venueId)}
                          className="mt-1 h-4 w-4 rounded border-zinc-600 bg-zinc-900 text-blue-600 focus:ring-blue-500"
                        />
                        <span>
                          <span className="block font-medium text-zinc-200">{venue.name}</span>
                          <span className="block text-xs text-zinc-500">{venue.address}</span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </fieldset>

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
        <div className="hidden xl:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/50">
                <th className="px-5 py-4 text-sm font-medium text-zinc-400">Name</th>
                <th className="px-5 py-4 text-sm font-medium text-zinc-400">Date</th>
                <th className="px-5 py-4 text-sm font-medium text-zinc-400">Format</th>
                <th className="px-5 py-4 text-sm font-medium text-zinc-400">Division</th>
                <th className="px-5 py-4 text-sm font-medium text-zinc-400">Status</th>
                <th className="px-5 py-4 text-sm font-medium text-zinc-400">Venues</th>
                <th className="px-5 py-4 text-sm font-medium text-zinc-400">Price</th>
                <th className="px-5 py-4 text-sm font-medium text-zinc-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-zinc-800/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 font-medium">
                      {isFeatured(event) && <Star size={16} className="fill-blue-400 text-blue-400" />}
                      {event.name}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-zinc-400">{event.date}</td>
                  <td className="px-5 py-4 text-zinc-400">{formatLabels[event.tournament_format || 'two_day']}</td>
                  <td className="px-5 py-4 text-zinc-400">{event.division || event.age}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${statusClasses[event.status || 'planned']}`}>
                      {statusLabels[event.status || 'planned']}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-zinc-400">{venueSummary(event)}</td>
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

        <div className="xl:hidden divide-y divide-zinc-800">
          {events.map((event) => (
            <div key={event.id} className="p-4 space-y-3">
              <div className="flex justify-between items-start gap-3">
                <div>
                  <div className="flex items-center gap-2 font-bold text-lg">
                    {isFeatured(event) && <Star size={16} className="fill-blue-400 text-blue-400" />}
                    {event.name}
                  </div>
                  <div className="text-blue-500 text-sm font-medium">{event.date}</div>
                  <div className="text-zinc-500 text-xs">{venueSummary(event)}</div>
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
                  <span className="text-zinc-500 mr-1">Format:</span> {formatLabels[event.tournament_format || 'two_day']}
                </div>
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
