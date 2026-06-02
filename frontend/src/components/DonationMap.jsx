import { useState, useCallback, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Circle, Marker, useMapEvents, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import DonationMarker from './DonationMarker';
import NgoMarker from './NgoMarker';
import SchoolMarker from './SchoolMarker';
import AddDonationForm from './AddDonationForm';
import FilterPanel from './FilterPanel';
import { getDonations } from '../services/api';
import { getNearbyNGOs, getNearbySchools } from '../services/osm';
import { Plus, X, MapPin, RefreshCw, Crosshair } from 'lucide-react';

/**
 * Invisible component that captures map click events.
 */
function MapClickHandler({ onClick, mapMode }) {
  useMapEvents({
    click(e) {
      if (mapMode === 'add') onClick(e.latlng);
    },
  });
  return null;
}

/**
 * Invisible component to help pan the map when mapCenter prop changes.
 */
function MapUpdater({ mapCenter }) {
  const map = useMap();
  useEffect(() => {
    if (mapCenter && typeof mapCenter.lat !== 'undefined' && typeof mapCenter.lng !== 'undefined') {
      try {
        map.setView([mapCenter.lat, mapCenter.lng], 14);
      } catch(e) { console.warn(e); }
    }
  }, [mapCenter, map]);
  return null;
}

/**
 * Fixes Leaflet map resize layout bugs during mode switches.
 */
function FixMapSize() {
  const map = useMap();
  useEffect(() => {
    const timeout = setTimeout(() => {
      map.invalidateSize();
    }, 150);
    return () => clearTimeout(timeout);
  }, [map]);
  return null;
}

/**
 * Adjusts the map view automatically when searchRadius changes.
 */
function RadiusAwareness({ center, radius }) {
  const map = useMap();
  useEffect(() => {
    if (!center || typeof center.lat === 'undefined' || typeof center.lng === 'undefined') return;

    // Defer the flyToBounds calculation slightly to ensure CSS map container sizing resolves
    const timer = setTimeout(() => {
      try {
        const size = map.getSize();
        if (size && size.x > 0 && size.y > 0) {
          const circle = L.circle([center.lat, center.lng], { radius });
          map.flyToBounds(circle.getBounds(), { padding: [50, 50], duration: 1.2 });
        }
      } catch (e) {
        console.warn('Radius awareness adjustment safely skipped:', e);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [center, radius, map]);
  return null;
}

/**
 * Floating UI controls for map (My location, Center, Refresh)
 */
function MapQuickControls({ userPosition, onRefresh, defaultCenter }) {
  const map = useMap();
  const divRef = useRef(null);
  
  useEffect(() => {
    if (divRef.current) {
      L.DomEvent.disableClickPropagation(divRef.current);
      L.DomEvent.disableScrollPropagation(divRef.current);
    }
  }, []);

  return (
    <div ref={divRef} className="absolute right-4 top-1/2 -translate-y-1/2 z-[500] flex flex-col gap-3">
      <button onClick={() => {
        try {
          if (userPosition && typeof userPosition.lat === 'number') {
            map.flyTo([userPosition.lat, userPosition.lng], 15, { duration: 1.0 });
          }
        } catch(e) {}
      }} className="w-10 h-10 glass rounded-xl flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 border border-white/10 shadow-xl transition-all hover:scale-110 group" title="My Location">
        <MapPin className="w-5 h-5 group-hover:text-blue-400 transition-colors" />
      </button>
      <button onClick={() => {
        try {
          if (defaultCenter && typeof defaultCenter.lat === 'number') {
             map.flyTo([defaultCenter.lat, defaultCenter.lng], 13, { duration: 1.0 });
          } else if (userPosition && typeof userPosition.lat === 'number') {
             map.flyTo([userPosition.lat, userPosition.lng], 12, { duration: 1.0 }); // Zoom out slightly to show center action
          }
        } catch(e) {}
      }} className="w-10 h-10 glass rounded-xl flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 border border-white/10 shadow-xl transition-all hover:scale-110 group" title="Center Map">
        <Crosshair className="w-5 h-5 group-hover:text-fuchsia-400 transition-colors" />
      </button>
      <button onClick={() => {
        try { onRefresh(); } catch(e) {}
      }} className="w-10 h-10 glass rounded-xl flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 border border-white/10 shadow-xl transition-all hover:scale-110 group" title="Refresh Data">
        <RefreshCw className="w-4 h-4 group-hover:text-emerald-400 group-hover:rotate-180 transition-all duration-500" />
      </button>
    </div>
  );
}

/**
 * User location marker (blue pulsing dot)
 */
const userIcon = L.divIcon({
  className: '',
  html: '<div class="user-marker"></div>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

/**
 * DonationMap
 * The main map component that ties everything together.
 */
export default function DonationMap({ userPosition, initialAddMode = false, mapCenter = null }) {
  const [donations, setDonations] = useState([]);
  const [clickPos, setClickPos] = useState(null); // lat/lng from map click
  const [searchRadius, setSearchRadius] = useState(5000); // meters
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [loading, setLoading] = useState(true);
  
  const [mapMode, setMapMode] = useState(initialAddMode ? 'add' : 'find');

  useEffect(() => {
    setMapMode(initialAddMode ? 'add' : 'find');
  }, [initialAddMode]);

  // NGO & School states
  const [ngos, setNgos] = useState([]);
  const [showNGOs, setShowNGOs] = useState(false);
  const [loadingNGOs, setLoadingNGOs] = useState(false);

  const [schools, setSchools] = useState([]);
  const [showSchools, setShowSchools] = useState(false);
  const [loadingSchools, setLoadingSchools] = useState(false);

  // ── Fetch donations from API ──────────────────────────────────────────────
  const fetchDonations = useCallback(async () => {
    try {
      const result = await getDonations({
        lat: userPosition.lat,
        lng: userPosition.lng,
      });
      setDonations(result.data || []);
    } catch (err) {
      console.error('Failed to fetch donations:', err);
    } finally {
      setLoading(false);
    }
  }, [userPosition]);

  useEffect(() => {
    fetchDonations();
  }, [fetchDonations]);

  // ── Fetch NGOs from OpenStreetMap / Mock ──────────────────────────────────
  const fetchNGOs = useCallback(async () => {
    if (!showNGOs) return;
    setLoadingNGOs(true);
    try {
      const data = await getNearbyNGOs(userPosition.lat, userPosition.lng, searchRadius);
      setNgos(data);
    } catch (err) {
      console.error('Failed to fetch NGOs:', err);
    } finally {
      setLoadingNGOs(false);
    }
  }, [userPosition, showNGOs, searchRadius]);

  useEffect(() => {
    fetchNGOs();
  }, [fetchNGOs]);

  // ── Fetch Schools from OpenStreetMap / Mock ───────────────────────────────
  const fetchSchools = useCallback(async () => {
    if (!showSchools) return;
    setLoadingSchools(true);
    try {
      const data = await getNearbySchools(userPosition.lat, userPosition.lng, searchRadius);
      setSchools(data);
    } catch (err) {
      console.error('Failed to fetch Schools:', err);
    } finally {
      setLoadingSchools(false);
    }
  }, [userPosition, showSchools, searchRadius]);

  useEffect(() => {
    fetchSchools();
  }, [fetchSchools]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleMapClick = (latlng) => {
    if (latlng && latlng.lat && latlng.lng) {
      setClickPos({ lat: latlng.lat, lng: latlng.lng });
    }
  };

  const handleDonationCreated = (newDonation) => {
    setClickPos(null);
    setMapMode('find'); // disable add mode after creating
    fetchDonations(); // Refresh markers from API to include distance
  };

  const handleToggleCategory = (cat) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchDonations();
    fetchNGOs();
    fetchSchools();
  };

  // ── Filter donations by selected categories and radius ───────────────────
  const filteredDonations = donations.filter((d) => {
    if (selectedCategories.size > 0 && !selectedCategories.has(d.category)) return false;
    if (d.distance != null && d.distance > searchRadius) return false;
    return true;
  });

  return (
    <div className="relative w-full h-full">
      {/* ── Map ──────────────────────────────────────────────────────────── */}
      <MapContainer
        center={[userPosition.lat, userPosition.lng]}
        zoom={13}
        className="w-full h-full"
        zoomControl={false}
      >
        <FixMapSize />
        <ZoomControl position="bottomright" />
        <RadiusAwareness center={userPosition} radius={searchRadius} />
        <MapUpdater mapCenter={mapCenter} />
        <MapQuickControls 
          userPosition={userPosition} 
          onRefresh={handleRefresh} 
          defaultCenter={mapCenter} 
        />
        
        {/* OpenStreetMap tiles – dark style from CartoDB */}
        <TileLayer
          attribution='&copy; OpenStreetMap &copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* Click handler */}
        <MapClickHandler onClick={handleMapClick} mapMode={mapMode} />

        {/* User location marker */}
        <Marker position={[userPosition.lat, userPosition.lng]} icon={userIcon} />

        {/* Variable search radius circle */}
        <Circle
          center={[userPosition.lat, userPosition.lng]}
          radius={searchRadius}
          pathOptions={{
            color: '#3b82f6',
            fillColor: '#3b82f6',
            fillOpacity: 0.08,
            weight: 2,
            dashArray: '5 5',
          }}
        />

        {/* Donation markers */}
        {filteredDonations.map((donation) => (
          <DonationMarker
            key={donation._id}
            donation={donation}
            userLat={userPosition.lat}
            userLng={userPosition.lng}
          />
        ))}

        {/* NGO markers */}
        {showNGOs && ngos.map((ngo) => (
          <NgoMarker key={ngo.id} ngo={ngo} />
        ))}

        {/* School markers */}
        {showSchools && schools.map((school) => (
          <SchoolMarker key={school.id} school={school} />
        ))}
      </MapContainer>

      {/* ── Filter Panel (top-left) ──────────────────────────────────────── */}
      <div className="absolute top-4 left-4 z-[600] hidden md:block">
        <FilterPanel
          selectedCategories={selectedCategories}
          onToggleCategory={handleToggleCategory}
          searchRadius={searchRadius}
          onSelectRadius={setSearchRadius}
          donationCount={filteredDonations.length}
          showNGOs={showNGOs}
          onToggleNGOs={() => setShowNGOs((v) => !v)}
          showSchools={showSchools}
          onToggleSchools={() => setShowSchools((v) => !v)}
        />
      </div>

      {/* ── Mode Banner ─────────────────────────────────────── */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[500] pointer-events-none flex flex-col items-center gap-2">
        {mapMode === 'find' && (
          <div className="glass px-5 py-2 rounded-full text-xs font-bold text-slate-200 border border-white/10 shadow-lg tracking-wide uppercase">
            Discovery Mode
          </div>
        )}
        {mapMode === 'add' && (
          <div className="bg-brand-500/20 backdrop-blur-md px-5 py-2 rounded-full text-xs font-bold text-brand-300 border border-brand-500/40 shadow-[0_0_20px_rgba(59,130,246,0.3)] animate-pulse uppercase tracking-wider">
            📍 Placement Mode
          </div>
        )}
      </div>

      {/* ── Floating Action Buttons (Bottom Center) ──────────────────────── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[500] flex flex-col items-center gap-3 w-max max-w-[90vw] px-4 sm:px-0">
        
        {mapMode === 'add' && !clickPos && (
          <div className="glass rounded-full px-5 py-2.5 text-sm text-slate-200 shadow-xl flex items-center gap-2 animate-bounce border border-brand-500/30">
            <span className="text-xl">👇</span>
            <span className="font-medium drop-shadow-md">Click anywhere on the map to place a donation</span>
          </div>
        )}

        <button
          onClick={() => setMapMode(mapMode === 'add' ? 'find' : 'add')}
          className={`flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-bold transition-all transform hover:scale-105 active:scale-95 border ${
            mapMode === 'add'
              ? 'bg-gray-900/80 backdrop-blur-md text-slate-300 border-slate-600 hover:bg-gray-800 shadow-lg' 
              : 'bg-brand-600 hover:bg-brand-500 text-white border-transparent shadow-[0_4px_20px_rgba(37,99,235,0.4)]'
          }`}
        >
          {mapMode === 'add' ? <X className="w-5 h-5 flex-shrink-0" /> : <Plus className="w-5 h-5 flex-shrink-0" />}
          {mapMode === 'add' ? 'Cancel Placement' : 'Add Donation'}
        </button>
      </div>

      {/* ── Mobile Filter Toggle (Bottom Right) ────────────────────────── */}
      <div className="md:hidden absolute bottom-6 right-4 z-[600]">
        <FilterPanel
          selectedCategories={selectedCategories}
          onToggleCategory={handleToggleCategory}
          searchRadius={searchRadius}
          onSelectRadius={setSearchRadius}
          donationCount={filteredDonations.length}
          showNGOs={showNGOs}
          onToggleNGOs={() => setShowNGOs((v) => !v)}
          showSchools={showSchools}
          onToggleSchools={() => setShowSchools((v) => !v)}
          isMobile={true}
        />
      </div>

      {/* ── Loading overlays ───────────────── */}
      {loading && (
        <div className="absolute inset-0 z-[600] flex items-center justify-center bg-gray-950/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <svg className="animate-spin h-8 w-8 text-brand-500" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="text-sm font-medium text-brand-300 tracking-wide">Scanning area...</span>
          </div>
        </div>
      )}

      {(loadingNGOs || loadingSchools) && (
        <div className="absolute top-4 right-4 z-[500] flex items-center gap-2 glass rounded-full px-3 py-1.5 text-xs text-brand-300 shadow animate-fade-in border border-brand-500/20">
          <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Locating Facilities
        </div>
      )}

      {/* ── Add Donation Form Modal ──────────────────────────────────────── */}
      {clickPos && (
        <AddDonationForm
          lat={clickPos.lat}
          lng={clickPos.lng}
          onClose={() => setClickPos(null)}
          onCreated={handleDonationCreated}
        />
      )}
    </div>
  );
}
