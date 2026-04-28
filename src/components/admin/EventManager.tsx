import React, { useState } from 'react';
import { Pencil, Trash2, Plus, X, Save } from 'lucide-react';

interface Event {
  id: number;
  name: string;
  date: string;
  age: string;
  price: string;
  description: string;
}

export default function EventManager({ initialEvents }: { initialEvents: Event[] }) {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    age: '',
    price: '',
    description: ''
  });

  const showStatus = (type: 'success' | 'error', message: string) => {
    setStatus({ type, message });
    setTimeout(() => setStatus(null), 3000);
  };

  const handleEdit = (event: Event) => {
    setFormData({
      name: event.name,
      date: event.date,
      age: event.age,
      price: event.price,
      description: event.description
    });
    setIsEditing(event.id);
    setIsAdding(false);
  };

  const handleAdd = () => {
    setFormData({
      name: '',
      date: '',
      age: '',
      price: '',
      description: ''
    });
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
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        const result = await res.json();
        if (isEditing) {
          setEvents(events.map(e => e.id === isEditing ? { ...formData, id: isEditing } : e));
          showStatus('success', 'Event updated successfully');
        } else {
          setEvents([...events, { ...formData, id: result.id }]);
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
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Events ({events.length})</h2>
        {!isAdding && !isEditing && (
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={18} />
            Add Event
          </button>
        )}
      </div>

      {status && (
        <div className={`fixed bottom-8 right-8 px-6 py-3 rounded-lg shadow-2xl border transition-all animate-in fade-in slide-in-from-bottom-4 ${
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
                <label className="text-sm text-zinc-400">Date</label>
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
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/50">
                <th className="px-6 py-4 text-sm font-medium text-zinc-400">Name</th>
                <th className="px-6 py-4 text-sm font-medium text-zinc-400">Date</th>
                <th className="px-6 py-4 text-sm font-medium text-zinc-400">Age</th>
                <th className="px-6 py-4 text-sm font-medium text-zinc-400">Price</th>
                <th className="px-6 py-4 text-sm font-medium text-zinc-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-zinc-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium">{event.name}</div>
                  </td>
                  <td className="px-6 py-4 text-zinc-400">{event.date}</td>
                  <td className="px-6 py-4 text-zinc-400">{event.age}</td>
                  <td className="px-6 py-4 text-zinc-400">{event.price}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(event)}
                        className="p-2 text-zinc-400 hover:text-blue-500 transition-colors"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                    No events found. Click "Add Event" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
