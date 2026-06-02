import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { BookOpen, Navigation } from 'lucide-react';

function SchoolPopup({ school }) {
  const name = school.tags?.name || 'Unnamed School / Education Center';
  const typeMap = {
    school: 'School',
    college: 'College / University',
  };
  const rawType = school.tags?.amenity || 'school';
  const type = typeMap[rawType] || 'Educational Institution';
  const contact = school.tags?.contact || school.tags?.phone || school.tags?.website;

  const handleMockAction = () => {
    alert('📍 Navigation request sent to school! Demo mode.');
  };

  return (
    <Popup maxWidth={260} minWidth={220} className="custom-popup">
      <div className="p-1 space-y-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-blue-500/20 flex items-center justify-center border border-blue-400/30">
              <BookOpen className="w-3.5 h-3.5 text-blue-300" />
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
             <span className="text-blue-300/80 font-medium text-[10px] uppercase tracking-widest block mb-1">Contact Details</span>
             <span className="break-words text-sm text-slate-200 font-medium">{contact}</span>
          </div>
        )}

        <div className="pt-2 border-t border-white/10">
          <button 
            onClick={handleMockAction}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition shadow-lg shadow-blue-500/25"
          >
            <Navigation className="w-4 h-4" />
            Navigate to School
          </button>
        </div>
      </div>
    </Popup>
  );
}

const schoolIcon = L.divIcon({
  className: '', 
  html: `
    <div class="donation-marker marker-low" style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); border-color: #93c5fd; width: 42px; height: 42px;">
      <span class="donation-marker-inner" style="font-size: 20px;">🎓</span>
    </div>
  `,
  iconSize: [42, 42],
  iconAnchor: [21, 42],
  popupAnchor: [0, -42],
});

export default function SchoolMarker({ school }) {
  return (
    <Marker position={[school.lat, school.lon]} icon={schoolIcon}>
      <SchoolPopup school={school} />
    </Marker>
  );
}
