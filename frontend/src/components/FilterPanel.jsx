import { useState } from 'react';
import { Filter, X, Building2, BookOpen } from 'lucide-react';

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

const RADIUS_OPTIONS = [
  { label: '1 km', value: 1000 },
  { label: '5 km', value: 5000 },
  { label: '10 km', value: 10000 },
  { label: '20 km', value: 20000 },
];

export default function FilterPanel({
  selectedCategories,
  onToggleCategory,
  searchRadius,
  onSelectRadius,
  donationCount,
  showNGOs,
  onToggleNGOs,
  showSchools,
  onToggleSchools,
  isMobile = false
}) {
  const [isOpen, setIsOpen] = useState(false);
  const allSelected = selectedCategories.size === 0;

  // Render toggle button if mobile and closed
  if (isMobile && !isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="glass rounded-full p-4 text-white shadow-xl flex items-center justify-center relative hover:bg-white/10"
      >
        <Filter className="w-6 h-6" />
        {selectedCategories.size > 0 && (
          <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-brand-500 animate-pulse border border-gray-900" />
        )}
      </button>
    );
  }

  const panelClass = isMobile 
    ? "fixed inset-x-0 bottom-0 z-[1000] p-6 bg-gray-950/95 backdrop-blur-2xl border-t border-white/10 rounded-t-3xl shadow-2xl animate-slide-up max-h-[85vh] overflow-y-auto"
    : "glass rounded-2xl p-5 space-y-5 animate-fade-in shadow-2xl w-72 border border-white/10";

  return (
    <>
      {isMobile && isOpen && (
        <div className="fixed inset-0 bg-black/40 z-[999] backdrop-blur-sm transition-opacity" onClick={() => setIsOpen(false)} />
      )}
      <div className={panelClass}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-brand-400" />
            <h3 className="text-sm font-bold text-white tracking-widest uppercase">Filters</h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-brand-200 bg-brand-500/20 px-2.5 py-1 rounded-full border border-brand-500/30">
              {donationCount} result{donationCount !== 1 ? 's' : ''}
            </span>
            {isMobile && (
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-2">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">Category Filter</p>
          <div className={`grid gap-1.5 ${isMobile ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {CATEGORIES.map((cat) => {
              const isActive = allSelected || selectedCategories.has(cat.value);
              return (
                <button
                  key={cat.value}
                  onClick={() => onToggleCategory(cat.value)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all font-medium border ${
                    isActive
                      ? 'bg-brand-500/20 text-brand-300 border-brand-500/30 shadow-inner'
                      : 'text-slate-400 hover:text-white hover:bg-white/5 border-transparent'
                  }`}
                >
                  <span className="text-lg leading-none">{cat.label.split(' ')[0]}</span>
                  <span>{cat.label.split(' ').slice(1).join(' ')}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-4" />

        {/* Search Radius Dropdown */}
        <div className="space-y-2">
          <label className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Search Radius</label>
          <select 
            value={searchRadius} 
            onChange={(e) => onSelectRadius(Number(e.target.value))}
            className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand-500 hover:bg-white/5 transition-colors cursor-pointer appearance-none"
          >
            {RADIUS_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value} className="bg-gray-900">{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-4" />

        {/* Map Toggles (NGOs / Schools) */}
        <div className="space-y-3">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">Community Connect</p>
          
          <button
            onClick={onToggleNGOs}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all border ${
              showNGOs
                ? 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30'
                : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Building2 className={`w-4 h-4 ${showNGOs ? 'text-fuchsia-300' : 'text-slate-500'}`} />
              <span>Nearby NGOs</span>
            </div>
            <span className={`w-8 h-4 rounded-full transition-colors relative shadow-inner ${showNGOs ? 'bg-fuchsia-500' : 'bg-slate-700'}`}>
              <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow-md transition-transform ${showNGOs ? 'translate-x-4' : 'translate-x-0.5'}`} />
            </span>
          </button>

          <button
            onClick={onToggleSchools}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all border ${
              showSchools
                ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <BookOpen className={`w-4 h-4 ${showSchools ? 'text-blue-300' : 'text-slate-500'}`} />
              <span>Nearby Schools</span>
            </div>
            <span className={`w-8 h-4 rounded-full transition-colors relative shadow-inner ${showSchools ? 'bg-blue-500' : 'bg-slate-700'}`}>
              <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow-md transition-transform ${showSchools ? 'translate-x-4' : 'translate-x-0.5'}`} />
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
