import { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useGeolocation } from '../hooks/useGeolocation';
import DonationMap from '../components/DonationMap';
import SearchBar from '../components/SearchBar';
import { HeartHandshake, MapPin } from 'lucide-react';

export default function MapPage() {
  const { position, loading, error } = useGeolocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [mapCenter, setMapCenter] = useState(null); // Used to pan the map based on search

  // Check if we came from 'Donate Items'
  const initialAddMode = searchParams.get('add') === 'true';

  const defaultCenter = { lat: 26.85, lng: 75.56 }; // fallback
  const safePosition = (position && position.lat && position.lng) ? position : defaultCenter;

  return (
    <div className="h-[100dvh] w-screen flex flex-col bg-gray-950 overflow-hidden">
      {/* Loading Overlay */}
      {(loading || (!position && !error)) && (
        <div className="absolute inset-0 z-[1000] flex flex-col items-center justify-center bg-gray-950/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-500/25">
              <HeartHandshake className="text-white w-8 h-8 " />
            </div>
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-brand-400 to-brand-200 bg-clip-text text-transparent">
              ShareSphere
            </h1>
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Finding your location...
            </div>
          </div>
        </div>
      )}

      {/* ── Top bar ──────────────────────────────────────────────────────── */}
      <header className="glass z-[500] flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-b border-white/5 gap-3 shrink-0 relative">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors"
          >
            <span className="text-lg">←</span>
          </button>
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <HeartHandshake className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold bg-gradient-to-r from-brand-400 to-brand-200 bg-clip-text text-transparent leading-tight">
                ShareSphere
              </h1>
              <p className="text-[11px] text-slate-500 -mt-0.5">Community map</p>
            </div>
          </Link>
        </div>

        {/* Integrated Search Bar */}
        <div className="w-full sm:w-auto sm:min-w-[320px]">
          <SearchBar onLocationFound={(lat, lon) => setMapCenter({ lat, lng: lon })} />
        </div>

        {/* Location indicator (Hidden on very small screens) */}
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 bg-white/5 px-3 py-2 rounded-full border border-white/5">
          <span className={`w-2 h-2 rounded-full ${error ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse-soft'}`} />
          {error ? 'Default location' : 'Your location'}
          {position && !error && (
            <span className="text-slate-500 font-mono">
              {position.lat.toFixed(2)}, {position.lng.toFixed(2)}
            </span>
          )}
        </div>
      </header>

      {/* ── Map ──────────────────────────────────────────────────────────── */}
      <main className="flex-1 relative isolate">
        <DonationMap
          userPosition={safePosition}
          initialAddMode={initialAddMode}
          mapCenter={mapCenter}
        />
      </main>
    </div>
  );
}
