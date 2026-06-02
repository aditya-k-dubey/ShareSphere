import { Popup } from 'react-leaflet';
import { haversineDistance, formatDistance } from '../utils/haversine';
import { MessageCircle, Truck, Clock, Navigation } from 'lucide-react';

const URGENCY_STYLES = {
  high: { bg: 'bg-red-500/20', text: 'text-red-300 drop-shadow-[0_0_5px_rgba(248,113,113,0.8)]', border: 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.6)]', label: 'URGENT' },
  medium: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', label: 'Medium Priority' },
  low: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', label: 'Low Priority' },
};

const CATEGORY_LABELS = {
  food: 'Food',
  clothes: 'Clothing',
  books: 'Books/Education',
  electronics: 'Electronics',
  furniture: 'Furniture',
  medicine: 'Medical',
  toys: 'Toys & Games',
  other: 'Misc',
};

const STATUS_STYLES = {
  active: { bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-500/30', label: 'Active' },
  claimed: { bg: 'bg-purple-500/20', text: 'text-purple-300', border: 'border-purple-500/30', label: 'Claimed' },
  completed: { bg: 'bg-slate-500/20', text: 'text-slate-300', border: 'border-slate-500/30', label: 'Completed' },
};

export default function DonationPopup({ donation, userLat, userLng }) {
  const { title, category, quantity, urgency, location, distance: serverDistance, createdAt, status = 'active' } = donation;
  const lat = location.coordinates[1];
  const lng = location.coordinates[0];

  let distKm = null;
  if (serverDistance != null) {
    distKm = serverDistance / 1000;
  } else if (userLat != null && userLng != null) {
    distKm = haversineDistance(userLat, userLng, lat, lng);
  }

  const urg = URGENCY_STYLES[urgency] || URGENCY_STYLES.low;
  const stat = STATUS_STYLES[status?.toLowerCase()] || STATUS_STYLES.active;
  
  // Format age nicely
  let relativeTime = 'Just now';
  if (createdAt) {
    const hours = Math.floor((new Date() - new Date(createdAt)) / (1000 * 60 * 60));
    if (hours > 24) relativeTime = `${Math.floor(hours / 24)}d ago`;
    else if (hours > 0) relativeTime = `${hours}h ago`;
  }

  const handleMockAction = (type) => {
    if (type === 'pickup') alert('📦 Pickup request sent successfully (Demo Mode)');
    if (type === 'contact') alert('💬 Redirecting to WhatsApp/Email... (Demo Mode)');
  };

  return (
    <Popup maxWidth={300} minWidth={260} className="custom-popup">
      <div className="p-1 space-y-4">
        {/* Header Section */}
        <div className="space-y-2">
          {/* Badges */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="inline-flex py-0.5 px-2 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-500/20 text-brand-300 border border-brand-500/30">
              {CATEGORY_LABELS[category] || category}
            </span>
            <span className={`inline-flex py-0.5 px-2 rounded-full text-[10px] font-bold uppercase tracking-wider border ${urg.bg} ${urg.text} ${urg.border}`}>
              {urgency === 'high' && '⚡ '}
              {urg.label}
            </span>
            <span className={`inline-flex py-0.5 px-2 rounded-full text-[10px] font-bold uppercase tracking-wider border ${stat.bg} ${stat.text} ${stat.border}`}>
              {stat.label}
            </span>
            {relativeTime && (
              <span className="ml-auto text-[10px] text-slate-500 flex items-center gap-1 font-medium">
                <Clock className="w-3 h-3" />
                {relativeTime}
              </span>
            )}
          </div>
          
          <h3 className="text-[17px] font-bold text-white leading-tight pr-4 tracking-tight drop-shadow-sm">{title}</h3>
        </div>

        {/* Details Grid */}
        <div className="bg-white/5 rounded-xl p-3 border border-white/5 space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400 font-medium text-xs uppercase tracking-wider">Quantity</span>
            <span className="font-semibold text-white bg-slate-800 px-2 py-0.5 rounded text-xs">{quantity} units</span>
          </div>
          
          {distKm != null && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400 font-medium text-xs uppercase tracking-wider">Distance</span>
              <span className="font-semibold text-brand-400 text-sm">~{formatDistance(distKm)}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2 pt-1 border-t border-white/10 mt-2">
          <button 
            onClick={() => handleMockAction('pickup')}
            className="flex flex-col items-center justify-center gap-1 w-full py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-semibold text-[11px] transition border border-emerald-500/20"
          >
            <Truck className="w-4 h-4 mb-0.5" />
            Pick up
          </button>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
            target="_blank"
            rel="noreferrer"
            className="flex flex-col items-center justify-center gap-1 w-full py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 font-semibold text-[11px] transition border border-blue-500/20"
          >
            <Navigation className="w-4 h-4 mb-0.5" />
            Directions
          </a>
          <button 
            onClick={() => handleMockAction('contact')}
            className="flex flex-col items-center justify-center gap-1 w-full py-2 rounded-lg bg-brand-500 hover:bg-brand-400 text-white font-semibold text-[11px] transition shadow-lg shadow-brand-500/20"
          >
            <MessageCircle className="w-4 h-4 mb-0.5" />
            Contact
          </button>
        </div>
      </div>
    </Popup>
  );
}
