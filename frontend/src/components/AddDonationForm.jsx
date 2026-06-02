import { useState, useEffect } from 'react';
import { createDonation } from '../services/api';
import { getNearbyNGOs } from '../services/osm';
import { haversineDistance, formatDistance } from '../utils/haversine';

const CATEGORIES = [
  { value: 'food', label: '🍲 Food' },
  { value: 'clothes', label: '👕 Clothes' },
  { value: 'books', label: '📚 Books' },
  { value: 'electronics', label: '💻 Electronics' },
  { value: 'furniture', label: '🪑 Furniture' },
  { value: 'medicine', label: '💊 Medicine' },
  { value: 'toys', label: '🧸 Toys' },
  { value: 'other', label: '📦 Other' },
];

const URGENCY_LEVELS = [
  { value: 'low', label: 'Low', color: 'bg-emerald-500' },
  { value: 'medium', label: 'Medium', color: 'bg-amber-500' },
  { value: 'high', label: 'High', color: 'bg-red-500' },
];

/**
 * AddDonationForm
 * Floating modal form for creating a new donation.
 *
 * Props:
 *   lat, lng   – auto-filled from map click
 *   onClose    – callback to close the modal
 *   onCreated  – callback after successful creation (receives new donation)
 */
export default function AddDonationForm({ lat, lng, onClose, onCreated }) {
  const [form, setForm] = useState({
    title: '',
    category: 'food',
    quantity: 1,
    urgency: 'low',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [nearestNgo, setNearestNgo] = useState(null);
  const [linkedNgo, setLinkedNgo] = useState(null);

  useEffect(() => {
    async function loadNGOs() {
      try {
        const ngos = await getNearbyNGOs(lat, lng, 5000);
        if (ngos.length > 0) {
          let nearest = null;
          let minD = Infinity;
          ngos.forEach(n => {
            const d = haversineDistance(lat, lng, n.lat, n.lon);
            if (d < minD) { minD = d; nearest = { ...n, distance: d }; }
          });
          if (nearest) setNearestNgo(nearest);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadNGOs();
  }, [lat, lng]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'quantity' ? Number(value) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const result = await createDonation({ ...form, lat, lng });
      onCreated?.(result.data);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.errors?.join(', ') || 'Failed to save donation');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative glass rounded-2xl w-full max-w-md animate-slide-up shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div>
            <h2 className="text-lg font-bold text-white">Add Donation</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              📍 {lat.toFixed(5)}, {lng.toFixed(5)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label htmlFor="donation-title" className="block text-sm font-medium text-slate-300 mb-1.5">
              Title
            </label>
            <input
              id="donation-title"
              name="title"
              type="text"
              required
              maxLength={120}
              placeholder="e.g., 20 kg rice, winter jackets…"
              value={form.title}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="donation-category" className="block text-sm font-medium text-slate-300 mb-1.5">
              Category
            </label>
            <select
              id="donation-category"
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition appearance-none cursor-pointer"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value} className="bg-gray-900">
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label htmlFor="donation-quantity" className="block text-sm font-medium text-slate-300 mb-1.5">
              Quantity
            </label>
            <input
              id="donation-quantity"
              name="quantity"
              type="number"
              min={1}
              required
              value={form.quantity}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition"
            />
          </div>

          {/* Urgency */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer group w-fit p-1">
              <div className="relative flex items-center justify-center w-12 h-6 bg-white/10 rounded-full transition-colors group-hover:bg-white/20">
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  checked={form.urgency === 'high'} 
                  onChange={(e) => setForm(prev => ({ ...prev, urgency: e.target.checked ? 'high' : 'low' }))} 
                />
                <div className={`absolute left-1 w-4 h-4 rounded-full transition-all ${form.urgency === 'high' ? 'translate-x-6 bg-red-400 shadow-[0_0_12px_rgba(248,113,113,0.9)]' : 'bg-slate-400'}`}></div>
              </div>
              <span className={`text-sm font-bold transition-all ${form.urgency === 'high' ? 'text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.5)]' : 'text-slate-300'}`}>
                Mark as Urgent
              </span>
            </label>
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Smart NGO Suggestion */}
          {nearestNgo && !linkedNgo && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-transparent border border-blue-500/20 flex flex-col gap-3 animate-fade-in">
              <div className="text-sm text-slate-300 leading-relaxed">
                <span className="font-semibold text-white">Nearest NGO:</span> {nearestNgo.tags?.name || 'Local NGO'} is ~{formatDistance(nearestNgo.distance)} away. Donate directly?
              </div>
              <button 
                type="button" 
                onClick={() => {
                  setLinkedNgo(nearestNgo);
                  setForm(prev => ({ ...prev, title: prev.title ? prev.title : `Donation for ${nearestNgo.tags?.name || 'NGO'}` }));
                }} 
                className="w-fit text-xs px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 font-bold border border-blue-500/30 hover:bg-blue-500/30 transition-colors shadow-lg shadow-blue-500/10"
              >
                Donate to NGO
              </button>
            </div>
          )}
          {linkedNgo && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-medium flex items-center gap-2 animate-slide-up">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">✓</div>
              Linked to {linkedNgo.tags?.name || 'NGO'}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 text-white font-semibold hover:from-brand-500 hover:to-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-500/25"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Saving…
              </span>
            ) : (
              'Add Donation'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
