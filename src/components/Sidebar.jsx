import { Activity, ClipboardList, Stethoscope, Pill, X } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, isOpen, onClose }) {
  const navItems = [
    { id: 'nurse-vitals', label: 'Nurse Station', sub: 'Vitals & Patient Entry', icon: ClipboardList, badge: true },
    { id: 'rx-pos', label: 'Doctor Consultation', sub: 'Prescription Builder (POS)', icon: Stethoscope, badge: false },
    { id: 'inventory', label: 'Medicine Catalog', sub: 'Master Directory', icon: Pill, badge: false },
  ];

  const isDoctor = activeTab === 'rx-pos';

  return (
    <aside 
      className={`fixed top-0 left-0 h-full w-72 bg-slate-900 text-slate-300 flex flex-col justify-between shrink-0 z-50 transition-transform duration-300 ease-in-out shadow-2xl ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div>
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 bg-slate-950/50 gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-teal-600 text-white p-2 rounded-xl flex items-center justify-center shrink-0">
              <Activity className="w-6 h-6" />
            </div>
            <div className="overflow-hidden">
              <h1 className="font-bold text-white text-base leading-tight truncate">CityCare</h1>
              <p className="text-xs text-teal-400 font-medium tracking-wide">CLINIC SYSTEM</p>
            </div>
          </div>
          {/* Close button inside the drawer for mobile */}
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-3 space-y-1.5">
          <div className="px-2 pt-2 pb-1 text-[10px] uppercase font-bold text-slate-500 tracking-wider">Select Portal View</div>
          
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id)} 
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-all ${
                  isActive ? 'bg-teal-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="relative shrink-0">
                  <Icon className="w-5 h-5" />
                  {item.badge && <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400"></span>}
                </div>
                <div className="overflow-hidden text-left">
                  <p className={`text-xs font-bold leading-none ${isActive ? 'text-white' : 'text-slate-200'}`}>{item.label}</p>
                  <p className={`text-[10px] ${isActive ? 'text-teal-200' : 'text-slate-400'}`}>{item.sub}</p>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-3 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-800/60">
          <img 
            src={isDoctor ? "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&auto=format&fit=crop&q=80" : "https://images.unsplash.com/photo-1594824813566-88855779663d?w=100&auto=format&fit=crop&q=80"} 
            alt="Profile" 
            className="w-9 h-9 rounded-full object-cover border-2 border-teal-500 shrink-0" 
          />
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-white truncate">{isDoctor ? 'Dr. Sarah Jenkins' : 'Nurse Mary Adams'}</p>
            <p className="text-[10px] text-teal-400 font-medium truncate">{isDoctor ? 'Doctor (General Medicine)' : 'Triage Nurse (Station A)'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}