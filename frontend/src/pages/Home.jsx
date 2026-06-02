import { Link } from 'react-router-dom';
import { HeartHandshake, MapPin, Package, Globe, ShieldCheck, Users, Activity, Heart, Sprout } from 'lucide-react';
import { useRole } from '../context/RoleContext';

export default function Home() {
  const { role, setRole } = useRole();

  return (
    <div className="min-h-screen w-full bg-gray-950 text-slate-300 flex flex-col relative overflow-x-hidden">
      {/* Background glowing blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-600/20 blur-[120px] pointer-events-none transition-colors duration-500" />
      <div className="absolute top-[40%] right-[-10%] w-[30%] h-[50%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[10%] w-[40%] h-[40%] rounded-full bg-fuchsia-600/15 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6 z-10 w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-500/25 transition-colors duration-500">
            <HeartHandshake className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold bg-gradient-to-r from-brand-300 to-brand-100 bg-clip-text text-transparent leading-tight tracking-tight transition-colors duration-500">
              ShareSphere
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Role Toggle Switch */}
          <div className="hidden md:flex glass rounded-full p-1 border border-white/10 items-center">
            <button 
              onClick={() => setRole('donor')}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${role === 'donor' ? 'bg-blue-500 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              Donor
            </button>
            <button 
              onClick={() => setRole('ngo')}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${role === 'ngo' ? 'bg-fuchsia-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              NGO
            </button>
          </div>
          
          <Link 
            to={role === 'ngo' ? '/ngo-dashboard' : '/dashboard'} 
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white text-sm font-semibold transition-colors flex items-center gap-2"
          >
            Dashboard
            <span className="text-brand-400 font-extrabold">→</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center z-10 w-full mb-20">
        
        {/* ── Hero Content ── */}
        <section className="flex flex-col items-center text-center px-4 pt-12 pb-24 max-w-4xl mx-auto w-full animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-brand-300 text-sm font-medium mx-auto mb-6 hover:bg-white/10 transition-colors cursor-default">
             <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
            </span>
            Live impact in your local community
          </div>

          <h2 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-8">
            Share surplus. <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-brand-400 via-fuchsia-400 to-brand-300 bg-clip-text text-transparent leading-[1.2]">
              Help communities.
            </span>
          </h2>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
            Connect excess goods with people in need nearby. Reduce waste, foster community support, and make a real difference today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto px-4">
            <Link 
              to="/map?add=true" 
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white rounded-2xl font-bold shadow-xl shadow-brand-500/25 transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 text-lg"
            >
              <Package className="w-5 h-5" />
              Donate Items
            </Link>
            
            <Link 
              to="/map" 
              className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl font-bold backdrop-blur-md transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 text-lg group"
            >
              <MapPin className="w-5 h-5 text-brand-400 group-hover:text-brand-300 transition-colors" />
              Find Donations
            </Link>
          </div>
        </section>

        {/* ── Impact Dashboard ── */}
        <section className="w-full bg-gradient-to-b from-gray-950 to-gray-900 border-y border-white/5 py-16 relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNjAgMEgwdjYwaDYwVjB6bS0xIDFIMXY1OGg1OFYxeiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+')] opacity-50" />
          <div className="max-w-5xl mx-auto px-6 relative z-10">
            <h3 className="text-2xl md:text-3xl font-extrabold text-center text-white mb-10 tracking-tight">Community Impact <span className="text-brand-400">At A Glance</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Total Donations', value: '12,450+', icon: <Package className="w-8 h-8 text-brand-400 mb-4"/>, color: 'from-brand-500/20 to-transparent', border: 'border-brand-500/20' },
                { label: 'People Helped', value: '8,230', icon: <Users className="w-8 h-8 text-emerald-400 mb-4"/>, color: 'from-emerald-500/20 to-transparent', border: 'border-emerald-500/20' },
                { label: 'NGOs Connected', value: '142', icon: <ShieldCheck className="w-8 h-8 text-fuchsia-400 mb-4"/>, color: 'from-fuchsia-500/20 to-transparent', border: 'border-fuchsia-500/20' },
              ].map((stat, i) => (
                <div key={i} className={`glass p-8 rounded-3xl flex flex-col items-center text-center border-t border-l ${stat.border} bg-gradient-to-br ${stat.color} shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform`}>
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/[0.05] to-white/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {stat.icon}
                  <div className="text-4xl font-black text-white tracking-tight mb-2">{stat.value}</div>
                  <div className="text-sm font-semibold text-slate-400 uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How It Works ── */}
        <section className="w-full max-w-6xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-white mb-4">How it Works</h3>
            <p className="text-slate-400 max-w-xl mx-auto">Three simple steps to build a more sustainable and supportive community.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass p-8 rounded-3xl relative overflow-hidden group hover:bg-white/[0.04] transition-colors border-white/5">
              <div className="w-14 h-14 rounded-2xl bg-brand-500/20 flex items-center justify-center mb-6">
                <Package className="w-7 h-7 text-brand-400" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">1. Donate</h4>
              <p className="text-slate-400 leading-relaxed">
                Have surplus food, clothing, or electronics? Drop a pin on our live map in seconds to notify people nearby.
              </p>
            </div>

            <div className="glass p-8 rounded-3xl relative overflow-hidden group hover:bg-white/[0.04] transition-colors border-white/5">
              <div className="w-14 h-14 rounded-2xl bg-fuchsia-500/20 flex items-center justify-center mb-6">
                <Globe className="w-7 h-7 text-fuchsia-400" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">2. Discover</h4>
              <p className="text-slate-400 leading-relaxed">
                Use intelligent dynamic filters to find exact resources in your community, including verified NGOs and local schools.
              </p>
            </div>

            <div className="glass p-8 rounded-3xl relative overflow-hidden group hover:bg-white/[0.04] transition-colors border-white/5">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-6">
                <HeartHandshake className="w-7 h-7 text-emerald-400" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">3. Connect</h4>
              <p className="text-slate-400 leading-relaxed">
                Get direct navigation routes or contact donors securely through the app to request pickups seamlessly.
              </p>
            </div>
          </div>
        </section>

        {/* ── Impact / Why ShareSphere ── */}
        <section className="w-full max-w-5xl mx-auto px-6 py-12">
          <div className="glass rounded-[2.5rem] p-8 md:p-14 border border-brand-500/20 bg-gradient-to-b from-brand-900/10 to-transparent flex flex-col md:flex-row gap-12 items-center justify-between">
            <div className="flex-1 space-y-6">
              <h3 className="text-3xl font-bold text-white leading-tight">
                Why ShareSphere?
              </h3>
              <ul className="space-y-4">
                {[
                  { icon: <Sprout className="w-5 h-5 text-emerald-400"/>, text: "Zero Waste Initiative: Keep perfectly good items out of landfills." },
                  { icon: <Heart className="w-5 h-5 text-rose-400"/>, text: "Community Support: Help neighbors dealing with immediate resource gaps." },
                  { icon: <ShieldCheck className="w-5 h-5 text-blue-400"/>, text: "Verified Networks: Direct integration with validated NGOs and Schools." }
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-300">
                    <div className="mt-1 bg-white/5 p-1.5 rounded-lg border border-white/10 shrink-0">{item.icon}</div>
                    <span className="leading-relaxed font-medium">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="w-full md:w-1/3 flex flex-col items-center gap-4">
               <div className="w-32 h-32 rounded-full border-[8px] border-brand-500/20 flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.3)]">
                 <Globe className="w-12 h-12 text-brand-400" />
               </div>
               <Link to="/map" className="mt-4 px-6 py-2 rounded-full border border-brand-500/40 text-brand-300 font-semibold text-sm hover:bg-brand-500/10 transition-colors">
                 Open Map View
               </Link>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-slate-500 text-sm z-10 w-full mt-auto border-t border-white/5">
        <div className="flex items-center justify-center gap-2 text-slate-400 mb-2">
          <HeartHandshake className="w-4 h-4" /> ShareSphere
        </div>
        &copy; {new Date().getFullYear()} Demo Environment. Built for impact.
      </footer>
    </div>
  );
}
