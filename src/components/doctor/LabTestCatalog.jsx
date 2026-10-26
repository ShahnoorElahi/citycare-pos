import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, X, Check, Plus, FlaskConical } from 'lucide-react';
import { addToSlip } from '../../store/clinicSlice';

export default function LabTestCatalog() {
  const dispatch = useDispatch();
  const { labTests, patientsQueue, activePatientId } = useSelector(state => state.clinic);
  const activePatient = patientsQueue.find(p => p.id === activePatientId);

  const [search, setSearch] = useState('');

  const filteredTests = labTests.filter(t => {
    const query = search.toLowerCase();
    return (t.name || '').toLowerCase().includes(query) || (t.category || '').toLowerCase().includes(query);
  });

  return (
    <>
      <div className="p-4 border-b border-slate-100 space-y-3 bg-slate-50/50 shrink-0">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tests by name or category..."
            className="w-full pl-11 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid gap-3">
          {filteredTests.map(test => {
            const isAdded = activePatient?.prescription?.some(i => i.medId === test.id);
            return (
              <div key={test.id} className={`p-3 rounded-xl border transition-all flex items-center gap-3 ${isAdded ? 'bg-teal-50/60 border-teal-300 shadow-sm' : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'}`}>
                <div className="w-14 h-14 shrink-0 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
                  <FlaskConical className="w-6 h-6" />
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between h-full space-y-1.5">
                  <div>
                    <div className="flex items-start justify-between gap-1 mb-0.5">
                      <span className="font-bold text-xs text-slate-800 leading-tight truncate">{test.name}</span>
                      <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase shrink-0 bg-slate-100 text-slate-600">{test.category}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 truncate">{test.desc}</p>
                  </div>

                  <div className="flex items-center justify-between text-[10px] pt-1.5 border-t border-slate-100/80">
                    <span className="text-slate-500 font-medium">Diagnostic Test</span>
                    {isAdded ? (
                      <span className="text-teal-700 font-bold text-[10px] flex items-center gap-1 bg-teal-100 px-1.5 py-0.5 rounded"><Check className="w-3 h-3" /> Ordered</span>
                    ) : (
                      <button
                        onClick={() => {
                          dispatch(addToSlip({ id: Date.now(), medId: test.id, name: test.name, freq: 'Once', duration: '1 Day', instructions: 'Lab Test' }));
                          window.dispatchEvent(new CustomEvent('showToast', { detail: { message: `Ordered ${test.name}`, type: 'success' } }));
                        }}
                        className="bg-slate-100 hover:bg-teal-600 hover:text-white text-slate-700 font-semibold px-2 py-0.5 rounded transition-all flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {filteredTests.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <FlaskConical className="w-12 h-12 stroke-1 mb-2" />
            <p className="text-sm font-medium">No lab tests match your search.</p>
          </div>
        )}
      </div>
    </>
  );
}