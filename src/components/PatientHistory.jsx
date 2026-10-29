import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Eye, X, UserCheck, FileText, Activity, Stethoscope } from 'lucide-react';
import { setActivePatient } from '../store/clinicSlice';
import PrescriptionTable from './medicines/PrescriptionTable';

// 🔥 Change prop to accept patientId
export default function PatientHistory({ patientId, patientName, onClose }) {
  const dispatch = useDispatch();
  const allPatients = useSelector(state => state.clinic.patientsQueue);

  // 🔥 Filter by ID (This is the unique identifier that stays the same)
  const patientRecords = allPatients.filter(p => p.id === patientId);

  // Sort newest first
  const sortedRecords = [...patientRecords].sort((a, b) => new Date(b.date) - new Date(a.date));

  const [viewingRecord, setViewingRecord] = useState(sortedRecords[0] || null);

  const sendToDoctor = (id) => {
    dispatch(setActivePatient(id));
    window.dispatchEvent(new CustomEvent('switchTab', { detail: 'rx-pos' }));
  };

  return (
    <>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <FileText className="w-5 h-5 text-teal-600" /> Medical History - {patientName}
            </h3>
            <p className="text-xs text-slate-500">Showing all {sortedRecords.length} visit records.</p>
          </div>
          <button onClick={onClose} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-2 transition-all">
            <X className="w-4 h-4" /> Close History
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT: Read-Only Record View */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5 h-[600px] overflow-y-auto">
            {viewingRecord ? (
              <>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-teal-600" /> Record from {viewingRecord.date}
                  </h4>
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">#{viewingRecord.token}</span>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div><span className="block text-[10px] font-semibold text-slate-500 uppercase">Patient ID</span><span className="text-xs font-mono font-semibold text-slate-800">{viewingRecord.id}</span></div>
                    <div><span className="block text-[10px] font-semibold text-slate-500 uppercase">Visit Date</span><span className="text-xs font-semibold text-slate-800">{viewingRecord.date}</span></div>
                  </div>

                  <div className="pt-2">
                    <p className="text-xs font-bold text-slate-600 mb-3 uppercase tracking-wider flex items-center gap-1.5"><Activity className="w-4 h-4 text-teal-600" /> Vitals</p>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      {['bp', 'sugar', 'pulse', 'weight', 'height', 'temp'].map(key => (
                        <div key={key} className="bg-slate-50 border border-slate-200 rounded-xl p-2.5">
                          <span className="block text-[9px] font-semibold text-slate-500 uppercase mb-0.5">{key}</span>
                          <span className="font-bold text-slate-800">{viewingRecord[key] || '-'}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {viewingRecord.notes && (
                    <div>
                      <span className="block text-xs font-semibold text-slate-700 mb-1">Symptom Notes</span>
                      <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-xs text-slate-700 italic">"{viewingRecord.notes}"</div>
                    </div>
                  )}

                  <div>
                    <span className="block text-xs font-semibold text-slate-700 mb-2">Prescribed Medications</span>
                    {viewingRecord.prescription?.length > 0 ? (
                      <div className="border border-slate-200 rounded-xl overflow-hidden">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-50 text-slate-500">
                            <tr><th className="py-2 px-3">Medicine</th><th className="py-2 px-3">Freq</th><th className="py-2 px-3">Duration</th></tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {viewingRecord.prescription.map((item, i) => {
                              const isLabTest = item.instructions === 'Lab Test';
                              return (
                                <tr key={i}>
                                  <td className="py-2 px-3 font-bold text-slate-800">{item.name}</td>
                                  <td className="py-2 px-3 text-slate-600">{isLabTest ? '—' : item.freq}</td>
                                  <td className="py-2 px-3 text-slate-600">{isLabTest ? '—' : item.duration}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    ) : <p className="text-xs text-slate-400 italic">No medications prescribed.</p>}
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">Select a record to view</div>
            )}
          </div>

          {/* RIGHT: History List */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[600px] overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div>
                <h4 className="font-bold text-sm text-slate-800">Visit History</h4>
                <p className="text-[11px] text-slate-500">Click a card to view details</p>
              </div>
              <span className="bg-teal-100 text-teal-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">{sortedRecords.length} Records</span>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {sortedRecords.map(pt => (
                <div key={`${pt.id}-${pt.date}-${pt.token}`} className={`p-3.5 bg-slate-50 border rounded-xl transition-all space-y-2.5 ${viewingRecord?.date === pt.date ? 'border-teal-500 ring-1 ring-teal-500' : 'border-slate-200 hover:border-teal-400'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="bg-teal-600 text-white text-xs font-black px-2 py-0.5 rounded-lg">#{pt.token}</span>
                      <h5 className="font-bold text-xs text-slate-800">{pt.date}</h5>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{pt.id}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[11px] border-t border-slate-200/60">
                    <span className="text-slate-500 italic text-[10px] truncate max-w-[150px]">{pt.notes || 'No notes'}</span>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => setViewingRecord(pt)} className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-2 py-1 rounded-lg text-[10px] transition-all flex items-center gap-1">
                        <Eye className="w-3 h-3" /> View
                      </button>
                      <button onClick={() => sendToDoctor(pt.id)} className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-2.5 py-1 rounded-lg text-[10px] transition-all">
                        Doctor Rx
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>


      </div>
      <PrescriptionTable/>
    </>
  );
}