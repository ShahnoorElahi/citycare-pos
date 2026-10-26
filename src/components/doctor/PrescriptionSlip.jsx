import { useDispatch, useSelector } from 'react-redux';
import { Users, Receipt, FilePlus, Trash2, FlaskConical, Printer } from 'lucide-react';
import { removeFromSlip, updateSlipItem, clearPrescription, setActivePatient } from '../../store/clinicSlice';
import ActivePatientCard from './ActivePatientCard';

export default function PrescriptionSlip() {
  const dispatch = useDispatch();
  const { patientsQueue, activePatientId } = useSelector(state => state.clinic);
  const activePatient = patientsQueue.find(p => p.id === activePatientId);

  return (
    <section className="w-full lg:w-[58%] bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col overflow-hidden shrink-0">
      <div className="p-3 bg-slate-900 text-white border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-teal-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Active Patient Queue</span>
        </div>
        <select
          value={activePatientId}
          onChange={e => dispatch(setActivePatient(e.target.value))}
          className="bg-slate-800 text-teal-300 font-bold text-xs p-1.5 rounded-lg border border-slate-700 focus:outline-none max-w-[200px]"
        >
          {patientsQueue.map(pt => <option key={pt.id} value={pt.id}>Token #{pt.token} - {pt.name}</option>)}
        </select>
      </div>

      <ActivePatientCard />

      <div className="px-4 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-600 shrink-0">
        <span className="flex items-center gap-1.5"><Receipt className="w-4 h-4 text-teal-600" /> PRESCRIBED MEDICATIONS & TESTS</span>
        <span className="bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full text-[11px] font-bold">{activePatient?.prescription?.length || 0} items</span>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {activePatient?.prescription?.length === 0 ? (
          <div className="h-44 flex flex-col items-center justify-center text-slate-400 space-y-2 border-2 border-dashed border-slate-200 rounded-xl p-4 text-center">
            <FilePlus className="w-8 h-8 stroke-1" />
            <p className="text-xs font-semibold">No medicines or tests ordered.</p>
          </div>
        ) : activePatient?.prescription?.map((item, index) => {
          const isLabTest = item.instructions === 'Lab Test';
          return (
            <div key={item.id} className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm space-y-2 group hover:border-teal-300 transition-all">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 ${isLabTest ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                    {index + 1}
                  </span>
                  <h4 className="font-bold text-xs text-slate-800">{item.name}</h4>
                </div>
                <button onClick={() => dispatch(removeFromSlip(item.id))} className="text-slate-400 hover:text-rose-600 p-1"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>

              {isLabTest ? (
                <div className="flex items-center justify-between bg-amber-50/50 border border-amber-100 rounded-lg p-2 mt-1">
                  <div className="flex items-center gap-2 text-amber-700">
                    <FlaskConical className="w-4 h-4" />
                    <span className="text-[11px] font-semibold">Diagnostic Test</span>
                  </div>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                    {item.status || 'Pending'}
                  </span>
                </div>
              ) : (
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
              )}
            </div>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3 shrink-0">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Doctor's Advice</label>
          <input type="text" id="doctor-advice" placeholder="e.g. Avoid cold drinks..." className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500" />
        </div>
        <div className="flex gap-2">
          <button onClick={() => dispatch(clearPrescription())} className="w-1/3 py-2.5 border border-rose-200 text-rose-600 hover:bg-rose-50 font-semibold rounded-xl text-xs transition-all flex items-center justify-center gap-1"><Trash2 className="w-3.5 h-3.5" /> Clear</button>
          <button onClick={() => window.dispatchEvent(new CustomEvent('openPrintModal'))} className="w-2/3 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2"><Printer className="w-4 h-4" /> Preview & Print</button>
        </div>
      </div>
    </section>
  );
}