import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, X, PackageOpen, Check, Plus, Image as ImageIcon } from 'lucide-react';
import { addToSlip } from '../../store/clinicSlice';

export default function MedicineCatalog() {
  const dispatch = useDispatch();
  const { medicines, patientsQueue, activePatientId } = useSelector(state => state.clinic);
  const activePatient = patientsQueue.find(p => p.id === activePatientId);

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [hoverImage, setHoverImage] = useState(null);

  const categories = ['All', 'Antibiotic', 'Analgesic', 'Antacid', 'Antihistamine', 'Vitamins'];

  const filteredMeds = medicines.filter(m => {
    const matchesCat = activeCategory === 'All' || m.category === activeCategory;
    const query = search.toLowerCase();
    const safeName = (m.name || '').toLowerCase();
    const safeGeneric = (m.generic || m.formula || '').toLowerCase();
    return matchesCat && (safeName.includes(query) || safeGeneric.includes(query));
  });

  const getCategoryBadge = (cat) => {
    switch (cat) {
      case 'Antibiotic': return 'bg-amber-100 text-amber-800';
      case 'Analgesic': return 'bg-rose-100 text-rose-800';
      case 'Antacid': return 'bg-sky-100 text-sky-800';
      case 'Antihistamine': return 'bg-purple-100 text-purple-800';
      default: return 'bg-emerald-100 text-emerald-800';
    }
  };

  return (
    <>
      <div className="p-4 border-b border-slate-100 space-y-3 bg-slate-50/50 shrink-0">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search medicine by brand or generic formula..."
            className="w-full pl-11 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all shadow-sm ${activeCategory === cat ? 'bg-teal-600 text-white' : 'bg-slate-200/70 text-slate-600 hover:bg-slate-200'}`}
            >
              {cat === 'All' ? 'All Medicines' : cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid gap-3">
          {filteredMeds.map(med => {
            const isAdded = activePatient?.prescription?.some(i => i.medId === med.id);
            return (
              <div key={med.id} className={`p-3 rounded-xl border transition-all flex items-center gap-3 ${isAdded ? 'bg-teal-50/60 border-teal-300 shadow-sm' : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'}`}>
                <div
                  className="w-14 h-14 shrink-0 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-teal-500 transition-all group relative"
                  onMouseEnter={() => setHoverImage(med)}
                  onMouseLeave={() => setHoverImage(null)}
                >
                  {med.image ? (
                    <img src={med.image} alt={med.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
                  ) : (
                    <ImageIcon className="w-5 h-5 text-slate-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between h-full space-y-1.5">
                  <div>
                    <div className="flex items-start justify-between gap-1 mb-0.5">
                      <span className="font-bold text-xs text-slate-800 leading-tight truncate">{med.name}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase shrink-0 ${getCategoryBadge(med.category)}`}>{med.category}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 truncate">{med.generic || med.formula}</p>
                  </div>

                  <div className="flex items-center justify-between text-[10px] pt-1.5 border-t border-slate-100/80">
                    <span className="text-slate-500 font-medium">{med.form} • {med.freq}</span>
                    {isAdded ? (
                      <span className="text-teal-700 font-bold text-[10px] flex items-center gap-1 bg-teal-100 px-1.5 py-0.5 rounded"><Check className="w-3 h-3" /> Added</span>
                    ) : (
                      <button
                        onClick={() => {
                          dispatch(addToSlip({ id: Date.now(), medId: med.id, name: med.name, freq: med.freq, duration: med.duration, instructions: med.instructions }));
                          window.dispatchEvent(new CustomEvent('showToast', { detail: { message: `Added ${med.name}`, type: 'success' } }));
                        }}
                        className="bg-slate-100 hover:bg-teal-600 hover:text-white text-slate-700 font-semibold px-2 py-0.5 rounded transition-all flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Add
                      </button>
                    )}
                  </div>
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

      {/* Hover Modal */}
      {hoverImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none p-4 animate-in fade-in duration-200">
          <div className="relative bg-white p-4 rounded-3xl shadow-2xl max-w-lg w-full flex flex-col items-center transform scale-100 opacity-100 transition-all duration-200">
            <h4 className="text-sm font-bold text-slate-800 mb-3 text-center">{hoverImage.name} - High Resolution View</h4>
            <div className="w-full h-[300px] sm:h-[400px] md:h-[450px] bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden flex items-center justify-center">
              <img src={hoverImage.image} alt="Enlarged Medicine" className="w-full h-full object-contain" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}