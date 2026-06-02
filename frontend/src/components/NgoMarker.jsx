import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Building2, Navigation, HeartHandshake, MessageCircle } from 'lucide-react';

/**
 * Custom dark-mode themed popup for NGOs.
 */
function NgoPopup({ ngo }) {
  const name = ngo.tags?.name || 'Unnamed NGO / Social Facility';
  const typeMap = {
    social_facility: 'Social Facility',
    community_centre: 'Community Centre',
    shelter: 'Shelter',
    food_bank: 'Food Bank',
    ngo: 'NGO Office',
    charity: 'Charity',
    association: 'Association',
    foundation: 'Foundation',
  };
  const rawType = ngo.tags?.amenity || ngo.tags?.office || 'ngo';
  const type = typeMap[rawType] || 'Community Organisation';
  const contact = ngo.tags?.contact || ngo.tags?.phone || ngo.tags?.website;

  const handleMockAction = () => {
    alert('📍 Navigation request sent! Demo mode.');
  };

  return (
    <Popup maxWidth={260} minWidth={220} className="custom-popup">
      <div className="p-1 space-y-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-fuchsia-500/20 flex items-center justify-center border border-fuchsia-400/30">
              <Building2 className="w-3.5 h-3.5 text-fuchsia-300" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
              {type}
            </span>
          </div>
          <h3 className="font-extrabold text-white text-[16px] leading-tight tracking-tight shadow-sm mt-1">
            {name}
          </h3>
        </div>

        {contact && (
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
             <span className="text-fuchsia-300/80 font-medium text-[10px] uppercase tracking-widest block mb-1">Contact Details</span>
             <span className="break-words text-sm text-slate-200 font-medium">{contact}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 mt-2">
          <button 
            onClick={() => alert('📍 Mode switched: Donate directly to NGO (Demo Mode)')}
            className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-semibold text-[11px] transition shadow-lg shadow-fuchsia-500/25"
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            Donate
          </button>
          <button 
            onClick={() => alert('💬 Contacting NGO (Demo Mode)')}
            className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-semibold text-[11px] transition border border-emerald-500/20"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Contact
          </button>
        </div>
      </div>
    </Popup>
  );
}

const ngoIcon = L.divIcon({
  className: '', 
  html: `
    <div class="donation-marker marker-ngo" style="width: 42px; height: 42px;">
      <span class="donation-marker-inner" style="font-size: 20px;">🏢</span>
    </div>
  `,
  iconSize: [42, 42],
  iconAnchor: [21, 42],
  popupAnchor: [0, -42],
});


export default function NgoMarker({ ngo }) {
  return (
    <Marker position={[ngo.lat, ngo.lon]} icon={ngoIcon}>
      <NgoPopup ngo={ngo} />
    </Marker>
  );
}
