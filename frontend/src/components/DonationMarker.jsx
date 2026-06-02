import { Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import DonationPopup from './DonationPopup';
import { haversineDistance, formatDistance } from '../utils/haversine';

const CATEGORY_ICONS = {
  food: '🍲',
  clothes: '👕',
  books: '📚',
  electronics: '💻',
  furniture: '🪑',
  medicine: '💊',
  toys: '🧸',
  other: '📦',
};

const CATEGORY_LABELS = {
  food: 'Food',
  clothes: 'Clothing',
  books: 'Books',
  electronics: 'Electronics',
  furniture: 'Furniture',
  medicine: 'Medicine',
  toys: 'Toys',
  other: 'Misc',
};

function createMarkerIcon(urgency, category) {
  const urgencyClass = `marker-${urgency || 'low'}`;
  const emoji = CATEGORY_ICONS[category] || '📦';

  return L.divIcon({
    className: '', 
    html: `
      <div class="donation-marker ${urgencyClass} shadow-xl border border-white/20 hover:scale-110 transition-transform">
        <span class="donation-marker-inner text-xl">${emoji}</span>
      </div>
    `,
    iconSize: [42, 42],
    iconAnchor: [21, 42],
    popupAnchor: [0, -42],
  });
}

export default function DonationMarker({ donation, userLat, userLng }) {
  const { location, urgency, category, distance: serverDistance } = donation;
  const lat = location.coordinates[1];
  const lng = location.coordinates[0];

  let distKm = null;
  if (serverDistance != null) {
    distKm = serverDistance / 1000;
  } else if (userLat != null && userLng != null) {
    distKm = haversineDistance(userLat, userLng, lat, lng);
  }

  return (
    <Marker position={[lat, lng]} icon={createMarkerIcon(urgency, category)}>
      <Tooltip direction="top" offset={[0, -42]} className="custom-tooltip" opacity={1}>
        <div className="flex flex-col gap-1 rounded bg-gray-900/40 p-1 text-center">
          <span className="font-bold text-white text-xs px-2 py-0.5 rounded-full bg-brand-500/20">{CATEGORY_LABELS[category] || category}</span>
          {distKm != null && <span className="text-brand-300 text-[10px] font-semibold">{formatDistance(distKm)}</span>}
        </div>
      </Tooltip>
      <DonationPopup donation={donation} userLat={userLat} userLng={userLng} />
    </Marker>
  );
}
