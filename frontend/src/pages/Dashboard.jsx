import { Link } from 'react-router-dom';
import { Package, Users, CheckCircle, Activity, HeartHandshake } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="min-h-screen w-full bg-gray-950 text-slate-300 flex flex-col">
      <header className="glass flex items-center justify-between px-6 py-4 border-b border-white/5 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/10 transition">
            <span className="text-lg">←</span>
          </Link>
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-brand-500/20 flex items-center justify-center border border-brand-500/30">
               <HeartHandshake className="text-brand-400 w-4 h-4" />
             </div>
             <h1 className="text-lg font-bold text-white">Donor Dashboard</h1>
          </div>
        </div>
        <Link to="/map?add=true" className="px-4 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold shadow-lg shadow-brand-500/20 transition">
          + New Delivery
        </Link>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto p-6 space-y-8 animate-fade-in">
        {/* Stats */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Total Donations', value: '14', icon: <Package className="w-6 h-6 text-brand-400"/> },
            { label: 'People Helped', value: '28', icon: <Users className="w-6 h-6 text-emerald-400"/> },
            { label: 'Pending Pickups', value: '1', icon: <Activity className="w-6 h-6 text-fuchsia-400"/> }
          ].map((s, i) => (
             <div key={i} className="glass p-5 rounded-2xl border border-white/5 flex items-center gap-4">
               <div className="p-3 rounded-xl bg-white/5">{s.icon}</div>
               <div>
                 <div className="text-2xl font-black text-white">{s.value}</div>
                 <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{s.label}</div>
               </div>
             </div>
          ))}
        </section>

        {/* History */}
        <section className="glass rounded-2xl border border-white/5 overflow-hidden">
          <div className="p-5 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider text-slate-300">Your Deliveries</h2>
          </div>
          <div className="divide-y divide-white/5">
            {[
              { title: '20 kg Rice & Grains', date: 'Today', status: 'Active', color: 'text-amber-400', bg: 'bg-amber-400/10' },
              { title: 'Winter Coats', date: '2 days ago', status: 'Completed', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
              { title: 'Electronics (Phones)', date: 'Last week', status: 'Completed', color: 'text-emerald-400', bg: 'bg-emerald-400/10' }
            ].map((d, i) => (
              <div key={i} className="p-5 flex items-center justify-between hover:bg-white/[0.02] transition">
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-white">{d.title}</span>
                  <span className="text-xs text-slate-500 font-medium">{d.date}</span>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold border border-white/5 flex items-center gap-1.5 ${d.bg} ${d.color}`}>
                  {d.status === 'Completed' && <CheckCircle className="w-3 h-3" />}
                  {d.status}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
