import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

export default function SearchBar({ onLocationFound }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      // Use OpenStreetMap Nominatim for free geocoding
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
      const data = await res.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        if (onLocationFound) {
          onLocationFound(parseFloat(lat), parseFloat(lon));
        }
      } else {
        alert('Location not found. Try a different city or formatting.');
      }
    } catch (err) {
      console.error('Search failed', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative flex items-center w-full">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-slate-400" />
      </div>
      <input
        type="text"
        placeholder="Search city or area..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full bg-slate-900/50 border border-white/10 rounded-full py-2 pl-10 pr-12 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 focus:bg-slate-900 transition-all shadow-inner"
      />
      <button
        type="submit"
        disabled={loading || !query.trim()}
        className="absolute inset-y-1 right-1 px-3 bg-brand-600 hover:bg-brand-500 text-white rounded-full text-xs font-semibold transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Go'}
      </button>
    </form>
  );
}
