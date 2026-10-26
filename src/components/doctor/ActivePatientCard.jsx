import { useSelector } from 'react-redux';

export default function ActivePatientCard() {
  const { patientsQueue, activePatientId } = useSelector(state => state.clinic);
  const activePatient = patientsQueue.find(p => p.id === activePatientId);

  if (!activePatient) return null;

  return (
    <div className="p-4 bg-slate-950 text-white space-y-3">
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
        <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-md border border-emerald-500/30 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Ready
        </span>
      </div>

      <div className="grid grid-cols-5 gap-2 pt-2 border-t border-slate-800 text-xs">
        {[
          { label: 'BP', val: activePatient.bp, unit: 'mmHg', color: 'text-teal-300' },
          { label: 'Sugar', val: activePatient.sugar, unit: 'mg/dL', color: 'text-amber-300' },
          { label: 'Pulse', val: activePatient.pulse, unit: 'bpm', color: 'text-rose-300' },
          { label: 'W/H', val: `${activePatient.weight}kg`, unit: `/ ${activePatient.height}cm`, color: 'text-sky-300' },
          { label: 'Temp', val: activePatient.temp, unit: '°F', color: 'text-purple-300' },
        ].map((v, i) => (
          <div key={i} className="bg-slate-900 p-2 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[9px] uppercase font-semibold">{v.label}</span>
            <span className={`font-bold text-xs ${v.color}`}>{v.val} <span className="text-[9px] font-normal text-slate-400">{v.unit}</span></span>
          </div>
        ))}
      </div>
      {activePatient.notes && (
        <p className="text-[11px] text-slate-300 italic bg-slate-900/60 p-2 rounded-lg border border-slate-800/80 truncate">
          <strong className="text-teal-400 not-italic font-semibold">Note:</strong> {activePatient.notes}
        </p>
      )}
    </div>
  );
}