import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Truck, Check, X, Building2, PackageCheck } from 'lucide-react';

export default function NgoDashboard() {
  const [requests, setRequests] = useState([
    { id: 1, title: 'Emergency Food Supplies', location: '1.2 km away', status: 'pending' },
    { id: 2, title: 'Children\'s Textbooks', location: '3.5 km away', status: 'pending' }
  ]);

  const handleAction = (id, type) => {
    if (type === 'accept') {
      alert('✅ Request Accepted! Driver dispatched.');
    }
    setRequests(requests.filter(r => r.id !== id));
  };

  return (
    <div className="min-h-screen w-full bg-gray-950 text-slate-300 flex flex-col">
      <header className="glass flex items-center justify-between px-6 py-4 border-b border-white/5 sticky top-0 z-50 bg-brand-950/50">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/10 transition">
            <span className="text-lg text-brand-300">←</span>
          </Link>
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-brand-500/20 flex items-center justify-center border border-brand-500/30 shadow-lg shadow-brand-500/20">
               <Building2 className="text-brand-300 w-4 h-4" />
             </div>
             <h1 className="text-lg font-bold text-white tracking-tight">NGO Dashboard</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto p-6 space-y-8 animate-fade-in text-brand-100">
        {/* Stats */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass p-6 rounded-3xl border border-brand-500/20 flex items-center gap-5 bg-gradient-to-br from-brand-500/10 to-transparent">
            <div className="w-14 h-14 rounded-2xl bg-brand-500/20 flex items-center justify-center shadow-inner">
              <PackageCheck className="w-7 h-7 text-brand-400"/>
            </div>
            <div>
              <div className="text-4xl font-black text-white">45</div>
              <div className="text-xs font-bold text-brand-400/70 uppercase tracking-widest">Successful Pickups</div>
            </div>
          </div>
          <div className="glass p-6 rounded-3xl border border-white/5 flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center">
              <Truck className="w-7 h-7 text-slate-400"/>
            </div>
            <div>
              <div className="text-4xl font-black text-white">2</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Fleets</div>
            </div>
          </div>
        </section>

        {/* Action Center */}
        <section className="glass rounded-3xl border border-brand-500/10 overflow-hidden shadow-2xl">
          <div className="p-5 border-b border-white/5 bg-brand-500/5">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider text-brand-200">Incoming Requests</h2>
          </div>
          <div className="divide-y divide-white/5">
            {requests.length === 0 ? (
              <div className="p-8 text-center text-slate-500 font-medium">No pending requests.</div>
            ) : requests.map((req) => (
              <div key={req.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/[0.02] transition">
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-white text-lg">{req.title}</span>
                  <span className="text-sm text-brand-400 font-medium flex items-center gap-1">
                    📍 {req.location}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleAction(req.id, 'reject')}
                    className="flex-1 md:flex-none px-4 py-2 rounded-xl text-sm font-bold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition border border-white/5"
                  >
                    <X className="w-4 h-4 mx-auto md:hidden" />
                    <span className="hidden md:inline">Decline</span>
                  </button>
                  <button 
                    onClick={() => handleAction(req.id, 'accept')}
                    className="flex-1 md:flex-none px-6 py-2 rounded-xl text-sm font-bold text-white bg-brand-600 hover:bg-brand-500 transition shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Accept Pickup
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
