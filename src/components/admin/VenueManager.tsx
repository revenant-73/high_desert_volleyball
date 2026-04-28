import React, { useState } from 'react';
import { Pencil, Trash2, Plus, X, Save, GripVertical } from 'lucide-react';

interface Venue {
  id: number;
  name: string;
  address: string;
  rules: string[];
}

export default function VenueManager({ initialVenues }: { initialVenues: Venue[] }) {
  const [venues, setVenues] = useState<Venue[]>(initialVenues);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const showStatus = (type: 'success' | 'error', message: string) => {
    setStatus({ type, message });
    setTimeout(() => setStatus(null), 3000);
  };

  const handleEdit = (venue: Venue) => {
    setFormData({
      name: venue.name,
      address: venue.address,
      rules: venue.rules.length > 0 ? [...venue.rules] : ['']
    });
    setIsEditing(venue.id);
    setIsAdding(false);
  };

  const handleAdd = () => {
    setFormData({
      name: '',
      address: '',
      rules: ['']
    });
    setIsAdding(true);
    setIsEditing(null);
  };

  const handleRuleChange = (index: number, value: string) => {
    const newRules = [...formData.rules];
    newRules[index] = value;
    setFormData({ ...formData, rules: newRules });
  };

  const addRule = () => {
    setFormData({ ...formData, rules: [...formData.rules, ''] });
  };

  const removeRule = (index: number) => {
    const newRules = formData.rules.filter((_, i) => i !== index);
    setFormData({ ...formData, rules: newRules.length > 0 ? newRules : [''] });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this venue?')) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/venues/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setVenues(venues.filter(v => v.id !== id));
        showStatus('success', 'Venue deleted successfully');
      } else {
        showStatus('error', 'Failed to delete venue');
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

    // Filter out empty rules
    const submissionData = {
      ...formData,
      rules: formData.rules.filter(r => r.trim() !== '')
    };

    try {
      const url = isEditing ? `/api/venues/${isEditing}` : '/api/venues';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
      });

      if (res.ok) {
        const result = await res.json();
        if (isEditing) {
          setVenues(venues.map(v => v.id === isEditing ? { ...submissionData, id: isEditing } : v));
          showStatus('success', 'Venue updated successfully');
        } else {
          setVenues([...venues, { ...submissionData, id: result.id }]);
          showStatus('success', 'Venue created successfully');
        }
        setIsEditing(null);
        setIsAdding(false);
      } else {
        showStatus('error', 'Failed to save venue');
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
        <h2 className="text-xl font-semibold">Venues ({venues.length})</h2>
        {!isAdding && !isEditing && (
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={18} />
            Add Venue
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
              {isEditing !== null ? 'Edit Venue' : 'New Venue'}
            </h3>
            <button onClick={() => { setIsEditing(null); setIsAdding(false); }} className="text-zinc-500 hover:text-white">
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-zinc-400">Venue Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-zinc-400">Address</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm text-zinc-400">Venue Rules & Info</label>
                <button
                  type="button"
                  onClick={addRule}
                  className="text-sm text-blue-500 hover:text-blue-400 flex items-center gap-1"
                >
                  <Plus size={16} /> Add Rule
                </button>
              </div>
              <div className="space-y-3">
                {formData.rules.map((rule, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={rule}
                      onChange={e => handleRuleChange(index, e.target.value)}
                      placeholder="e.g. Only water allowed in the gyms."
                      className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeRule(index)}
                      className="p-2 text-zinc-500 hover:text-red-500"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
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
                {loading ? 'Saving...' : 'Save Venue'}
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
                <th className="px-6 py-4 text-sm font-medium text-zinc-400">Address</th>
                <th className="px-6 py-4 text-sm font-medium text-zinc-400">Rules</th>
                <th className="px-6 py-4 text-sm font-medium text-zinc-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {venues.map((venue) => (
                <tr key={venue.id} className="hover:bg-zinc-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium">{venue.name}</div>
                  </td>
                  <td className="px-6 py-4 text-zinc-400 max-w-xs truncate">{venue.address}</td>
                  <td className="px-6 py-4 text-zinc-400">
                    <span className="bg-zinc-800 px-2 py-1 rounded text-xs">
                      {venue.rules.length} rules
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(venue)}
                        className="p-2 text-zinc-400 hover:text-blue-500 transition-colors"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(venue.id)}
                        className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {venues.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-zinc-500">
                    No venues found. Click "Add Venue" to create one.
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
