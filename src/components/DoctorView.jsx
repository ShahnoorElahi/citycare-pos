import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, X, PackageOpen, Check, Plus, Users, Receipt, Trash2, FilePlus, Printer } from 'lucide-react';
import { addToSlip, removeFromSlip, updateSlipItem, clearPrescription, setActivePatient } from '../store/clinicSlice';

export default function DoctorView() {
  const dispatch = useDispatch();
  const { medicines, patientsQueue, activePatientId } = useSelector(state => state.clinic);
  const activePatient = patientsQueue.find(p => p.id === activePatientId);
  
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Antibiotic', 'Analgesic', 'Antacid', 'Antihistamine', 'Vitamins'];

  const filteredMeds = medicines.filter(m => {
    const matchesCat = activeCategory === 'All' || m.category === activeCategory;
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.generic.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const getCategoryBadge = (cat) => {
    switch(cat) {
      case 'Antibiotic': return 'bg-amber-100 text-amber-800';
      case 'Analgesic': return 'bg-rose-100 text-rose-800';
      case 'Antacid': return 'bg-sky-100 text-sky-800';
      case 'Antihistamine': return 'bg-purple-100 text-purple-800';
      default: return 'bg-emerald-100 text-emerald-800';
    }
  };

  return (
    <>
      <section className="flex-1 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-100 space-y-3 bg-slate-50/50">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search medicine by brand or generic formula..." className="w-full pl-11 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm" />
            {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"><X className="w-4 h-4" /></button>}
          </div>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all shadow-sm ${activeCategory === cat ? 'bg-teal-600 text-white' : 'bg-slate-200/70 text-slate-600 hover:bg-slate-200'}`}>
                {cat === 'All' ? 'All Medicines' : cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {filteredMeds.map(med => {
              const isAdded = activePatient?.prescription.some(i => i.medId === med.id);
              return (
                <div key={med.id} className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between space-y-3 ${isAdded ? 'bg-teal-50/60 border-teal-300 shadow-sm' : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'}`}>
                  <div>
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <span className="font-bold text-xs text-slate-800 leading-snug">{med.name}</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${getCategoryBadge(med.category)}`}>{med.category}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">{med.generic}</p>
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-100">
                    <span className="text-slate-500 font-medium">{med.form} • {med.freq}</span>
                    {isAdded ? (
                      <span className="text-teal-700 font-bold text-xs flex items-center gap-1 bg-teal-100 px-2 py-1 rounded-lg"><Check className="w-3.5 h-3.5" /> Added</span>
                    ) : (
                      <button onClick={() => { dispatch(addToSlip({ id: Date.now(), medId: med.id, name: med.name, freq: med.freq, duration: med.duration, instructions: med.instructions })); window.dispatchEvent(new CustomEvent('showToast', { detail: { message: `Added ${med.name}`, type: 'success' }})); }} className="bg-slate-100 hover:bg-teal-600 hover:text-white text-slate-700 font-semibold px-3 py-1 rounded-lg text-xs transition-all flex items-center gap-1"><Plus className="w-3.5 h-3.5" /> Add</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {filteredMeds.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <PackageOpen className="w-12 h-12 stroke-1 mb-2" />
              <p className="text-sm font-medium">No medicines match your search filter.</p>
            </div>
          )}
        </div>
      </section>

      <section className="w-full lg:w-[480px] xl:w-[520px] bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col overflow-hidden shrink-0">
        <div className="p-3 bg-slate-900 text-white border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2"><Users className="w-4 h-4 text-teal-400" /><span className="text-xs font-bold uppercase tracking-wider text-slate-300">Active Patient Queue</span></div>
          <select value={activePatientId} onChange={e => dispatch(setActivePatient(e.target.value))} className="bg-slate-800 text-teal-300 font-bold text-xs p-1.5 rounded-lg border border-slate-700 focus:outline-none">
            {patientsQueue.map(pt => <option key={pt.id} value={pt.id}>Token #{pt.token} - {pt.name} ({pt.id})</option>)}
          </select>
        </div>

        <div className="p-4 bg-slate-950 text-white space-y-3">
          {activePatient ? (
            <>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300 font-black text-sm shrink-0">#{activePatient.token}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-white leading-tight">{activePatient.name}</h3>
                      <span className="px-2 py-0.5 bg-teal-900/80 text-teal-300 text-[10px] font-bold rounded">{activePatient.gender}, {activePatient.age}y</span>
                    </div>
                    <p className="text-xs text-slate-400">PID: <span className="text-slate-300 font-mono">{activePatient.id}</span></p>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-md border border-emerald-500/30 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>Nurse Intake Ready</span>
              </div>
              <div className="grid grid-cols-5 gap-2 pt-2 border-t border-slate-800 text-xs">
                {[
                  { label: 'Blood Pressure', val: activePatient.bp, unit: 'mmHg', color: 'text-teal-300' },
                  { label: 'Blood Sugar', val: activePatient.sugar, unit: 'mg/dL', color: 'text-amber-300' },
                  { label: 'Heart Rate', val: activePatient.pulse, unit: 'bpm', color: 'text-rose-300' },
                  { label: 'Weight / Ht', val: `${activePatient.weight}kg`, unit: `/ ${activePatient.height}cm`, color: 'text-sky-300' },
                  { label: 'Body Temp', val: activePatient.temp, unit: '°F', color: 'text-purple-300' },
                ].map((v, i) => (
                  <div key={i} className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[9px] uppercase font-semibold">{v.label}</span>
                    <span className={`font-bold text-xs ${v.color}`}>{v.val} <span className="text-[9px] font-normal text-slate-400">{v.unit}</span></span>
                  </div>
                ))}
              </div>
              {activePatient.notes && <p className="text-[11px] text-slate-300 italic bg-slate-900/60 p-2 rounded-lg border border-slate-800/80 truncate"><strong className="text-teal-400 not-italic font-semibold">Symptom Note:</strong> {activePatient.notes}</p>}
            </>
          ) : <p className="text-xs text-slate-400 italic">No patient selected from nurse queue.</p>}
        </div>

        <div className="px-4 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-600">
          <span className="flex items-center gap-1.5"><Receipt className="w-4 h-4 text-teal-600" />PRESCRIBED MEDICATIONS</span>
          <span className="bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full text-[11px] font-bold">{activePatient?.prescription.length || 0} items</span>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {activePatient?.prescription.length === 0 ? (
            <div className="h-44 flex flex-col items-center justify-center text-slate-400 space-y-2 border-2 border-dashed border-slate-200 rounded-xl p-4 text-center">
              <FilePlus className="w-8 h-8 stroke-1" />
              <p className="text-xs font-semibold">No medicines prescribed for Token #{activePatient?.token}.</p>
              <p className="text-[11px] text-slate-400">Click medicines on left panel to add.</p>
            </div>
          ) : activePatient?.prescription.map((item, index) => (
            <div key={item.id} className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm space-y-2 group hover:border-teal-300 transition-all">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-[10px] shrink-0">{index + 1}</span>
                  <h4 className="font-bold text-xs text-slate-800">{item.name}</h4>
                </div>
                <button onClick={() => dispatch(removeFromSlip(item.id))} className="text-slate-400 hover:text-rose-600 p-1"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-1 text-[11px]">
                <div>
                  <span className="text-[9px] text-slate-400 block font-medium">Frequency</span>
                  <select value={item.freq} onChange={e => dispatch(updateSlipItem({ id: item.id, field: 'freq', value: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded p-1 font-semibold text-slate-700 focus:ring-1 focus:ring-teal-500">
                    {['1-0-1', '1-1-1', '1-0-0', '0-0-1', 'SOS'].map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block font-medium">Duration</span>
                  <input type="text" value={item.duration} onChange={e => dispatch(updateSlipItem({ id: item.id, field: 'duration', value: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded p-1 font-semibold text-slate-700 focus:ring-1 focus:ring-teal-500" />
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block font-medium">Instructions</span>
                  <input type="text" value={item.instructions} onChange={e => dispatch(updateSlipItem({ id: item.id, field: 'instructions', value: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded p-1 font-semibold text-slate-700 focus:ring-1 focus:ring-teal-500" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Doctor's Special Advice / Instructions</label>
            <input type="text" id="doctor-advice" placeholder="e.g. Avoid cold drinks, take 7 days rest..." className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500" />
          </div>
          <div className="flex gap-2">
            <button onClick={() => dispatch(clearPrescription())} className="w-1/3 py-2.5 border border-rose-200 text-rose-600 hover:bg-rose-50 font-semibold rounded-xl text-xs transition-all flex items-center justify-center gap-1"><Trash2 className="w-3.5 h-3.5" /> Clear Slip</button>
            <button onClick={() => window.dispatchEvent(new CustomEvent('openPrintModal'))} className="w-2/3 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2"><Printer className="w-4 h-4" /> Preview & Print Slip</button>
          </div>
        </div>
      </section>
    </>
  );
}