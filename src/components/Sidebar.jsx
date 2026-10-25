import { Activity, ClipboardList, Stethoscope, Pill } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="w-20 lg:w-64 bg-slate-900 text-slate-300 flex flex-col justify-between shrink-0 transition-all duration-300">
      <div>
        <div className="h-16 flex items-center px-4 border-b border-slate-800 bg-slate-950/50 gap-3">
          <div className="bg-teal-600 text-white p-2 rounded-xl flex items-center justify-center shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div className="hidden lg:block overflow-hidden">
            <h1 className="font-bold text-white text-base leading-tight truncate">CityCare</h1>
            <p className="text-xs text-teal-400 font-medium tracking-wide">CLINIC SYSTEM</p>
          </div>
        </div>

        <nav className="p-3 space-y-1.5">
          <div className="px-2 pt-2 pb-1 text-[10px] uppercase font-bold text-slate-500 hidden lg:block tracking-wider">Select Portal View</div>
          
          <button onClick={() => setActiveTab('nurse-vitals')} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-all ${activeTab === 'nurse-vitals' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <div className="relative shrink-0">
              <ClipboardList className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400"></span>
            </div>
            <div className="hidden lg:block overflow-hidden text-left">
              <p className={`text-xs font-bold leading-none ${activeTab === 'nurse-vitals' ? 'text-white' : 'text-slate-200'}`}>Nurse Station</p>
              <p className={`text-[10px] ${activeTab === 'nurse-vitals' ? 'text-teal-200' : 'text-slate-400'}`}>Vitals & Patient Entry</p>
            </div>
          </button>

          <button onClick={() => setActiveTab('rx-pos')} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-all ${activeTab === 'rx-pos' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <Stethoscope className="w-5 h-5 shrink-0" />
            <div className="hidden lg:block overflow-hidden text-left">
              <p className={`text-xs font-bold leading-none ${activeTab === 'rx-pos' ? 'text-white' : 'text-slate-200'}`}>Doctor Consultation</p>
              <p className={`text-[10px] ${activeTab === 'rx-pos' ? 'text-teal-200' : 'text-slate-400'}`}>Prescription Builder (POS)</p>
            </div>
          </button>

          <button onClick={() => setActiveTab('inventory')} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-all ${activeTab === 'inventory' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <Pill className="w-5 h-5 shrink-0" />
            <span className={`hidden lg:block text-xs font-semibold ${activeTab === 'inventory' ? 'text-white' : ''}`}>Medicine Catalog</span>
          </button>
        </nav>
      </div>

      <div className="p-3 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-800/60">
          <img src={activeTab === 'rx-pos' ? "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&auto=format&fit=crop&q=80" : "https://images.unsplash.com/photo-1594824813566-88855779663d?w=100&auto=format&fit=crop&q=80"} alt="Profile" className="w-9 h-9 rounded-full object-cover border-2 border-teal-500 shrink-0" />
          <div className="hidden lg:block overflow-hidden">
            <p className="text-xs font-bold text-white truncate">{activeTab === 'rx-pos' ? 'Dr. Sarah Jenkins' : 'Nurse Mary Adams'}</p>
            <p className="text-[10px] text-teal-400 font-medium truncate">{activeTab === 'rx-pos' ? 'Doctor (General Medicine)' : 'Triage Nurse (Station A)'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}