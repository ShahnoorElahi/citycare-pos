import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CheckCircle, Info, Pill, X, Printer } from 'lucide-react';
import { saveMedicine } from '../store/clinicSlice';

export default function Modals() {
  const dispatch = useDispatch();
  const { activePatientId, patientsQueue } = useSelector(state => state.clinic);
  const activePatient = patientsQueue.find(p => p.id === activePatientId);
  
  const [toasts, setToasts] = useState([]);
  const [showMedModal, setShowMedModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [medForm, setMedForm] = useState({ id: null, name: '', generic: '', form: 'Tablet', category: 'Antibiotic', freq: '1-0-1', duration: '', instructions: '' });

  useEffect(() => {
    const handleToast = (e) => {
      const id = Date.now();
      setToasts(prev => [...prev, { id, ...e.detail }]);
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
    };
    const handleOpenMed = (e) => {
      setMedForm(e.detail || { id: null, name: '', generic: '', form: 'Tablet', category: 'Antibiotic', freq: '1-0-1', duration: '', instructions: '' });
      setShowMedModal(true);
    };
    const handleOpenPrint = () => setShowPrintModal(true);

    window.addEventListener('showToast', handleToast);
    window.addEventListener('openCustomMedModal', handleOpenMed);
    window.addEventListener('openPrintModal', handleOpenPrint);
    return () => {
      window.removeEventListener('showToast', handleToast);
      window.removeEventListener('openCustomMedModal', handleOpenMed);
      window.removeEventListener('openPrintModal', handleOpenPrint);
    };
  }, []);

  const handleSaveMed = (e) => {
    e.preventDefault();
    dispatch(saveMedicine(medForm));
    window.dispatchEvent(new CustomEvent('showToast', { detail: { message: medForm.id ? 'Medicine details updated' : 'New medicine added to directory', type: 'success' }}));
    setShowMedModal(false);
  };

  return (
    <>
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className={`flex items-center gap-2.5 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl border-l-4 ${t.type === 'success' ? 'bg-slate-900 border-teal-500' : 'bg-slate-900 border-sky-500'} pointer-events-auto`}>
            {t.type === 'success' ? <CheckCircle className="w-4 h-4 text-teal-400" /> : <Info className="w-4 h-4 text-sky-400" />}
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      {showMedModal && (
        <div id="custom-med-modal" className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-2"><Pill className="w-4 h-4 text-teal-400" /><span>{medForm.id ? 'Edit Medicine' : 'Add New Medicine'}</span></h3>
              <button onClick={() => setShowMedModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveMed} className="p-5 space-y-4 text-xs">
              <input type="hidden" value={medForm.id || ''} />
              <div><label className="block font-semibold text-slate-700 mb-1">Brand Name *</label><input type="text" required value={medForm.name} onChange={e => setMedForm({...medForm, name: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none" /></div>
              <div><label className="block font-semibold text-slate-700 mb-1">Generic Name / Composition</label><input type="text" value={medForm.generic} onChange={e => setMedForm({...medForm, generic: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block font-semibold text-slate-700 mb-1">Form Factor</label><select value={medForm.form} onChange={e => setMedForm({...medForm, form: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white">{['Tablet', 'Capsule', 'Syrup', 'Injection', 'Ointment', 'Drops'].map(f => <option key={f} value={f}>{f}</option>)}</select></div>
                <div><label className="block font-semibold text-slate-700 mb-1">Category</label><select value={medForm.category} onChange={e => setMedForm({...medForm, category: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white">{['Antibiotic', 'Analgesic', 'Antacid', 'Antihistamine', 'Vitamins'].map(c => <option key={c} value={c}>{c}</option>)}</select></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block font-semibold text-slate-700 mb-1">Default Frequency</label><select value={medForm.freq} onChange={e => setMedForm({...medForm, freq: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"><option value="1-0-1">1-0-1 (Twice daily)</option><option value="1-1-1">1-1-1 (Thrice daily)</option><option value="1-0-0">1-0-0 (Morning only)</option><option value="0-0-1">0-0-1 (Night only)</option><option value="SOS">SOS / As needed</option></select></div>
                <div><label className="block font-semibold text-slate-700 mb-1">Default Duration</label><input type="text" value={medForm.duration} onChange={e => setMedForm({...medForm, duration: e.target.value})} placeholder="e.g. 5 Days" className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none" /></div>
              </div>
              <div><label className="block font-semibold text-slate-700 mb-1">Special Instruction Preset</label><input type="text" value={medForm.instructions} onChange={e => setMedForm({...medForm, instructions: e.target.value})} placeholder="e.g. After Meals with water" className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none" /></div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button type="button" onClick={() => setShowMedModal(false)} className="px-4 py-2 border border-slate-300 text-slate-600 font-semibold rounded-lg hover:bg-slate-100">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg shadow-sm">Save Drug</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPrintModal && activePatient && (
        <div id="print-modal" className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden my-auto border border-slate-300">
            <div className="no-print p-4 bg-slate-900 text-white flex items-center justify-between">
              <span className="font-bold text-sm flex items-center gap-2"><Printer className="w-4 h-4 text-teal-400" /> Print Prescription Preview</span>
              <div className="flex items-center gap-2">
                <button onClick={() => window.print()} className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 shadow-sm"><Printer className="w-3.5 h-3.5" /> Send to Printer</button>
                <button onClick={() => setShowPrintModal(false)} className="text-slate-400 hover:text-white p-1"><X className="w-5 h-5" /></button>
              </div>
            </div>
            <div className="p-8 bg-white text-slate-800 space-y-5" id="printable-area">
              <div className="flex items-start justify-between border-b-2 border-teal-600 pb-4">
                <div><h1 className="text-2xl font-black text-slate-900 tracking-tight">CITYCARE CLINIC</h1><p className="text-xs font-semibold text-teal-700">Multi-Specialty Healthcare & Diagnostics</p><p className="text-[11px] text-slate-500">123 Health Avenue, Medical District • Ph: +1 (555) 019-2834</p></div>
                <div className="text-right text-xs"><p className="font-bold text-slate-900 text-sm">Dr. Sarah Jenkins</p><p className="text-slate-600">MBBS, MD (Internal Medicine)</p><p className="text-slate-500 text-[11px]">Reg No: PMC-894021</p></div>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="grid grid-cols-4 gap-2 border-b border-slate-200 pb-2">
                  <div><span className="text-slate-400 block font-medium text-[9px] uppercase">Token No</span><span className="font-black text-teal-700 text-sm">#{activePatient.token}</span></div>
                  <div><span className="text-slate-400 block font-medium text-[9px] uppercase">Patient Name</span><span className="font-bold text-slate-900">{activePatient.name}</span></div>
                  <div><span className="text-slate-400 block font-medium text-[9px] uppercase">Age / Gender</span><span className="font-bold text-slate-900">{activePatient.age} Yrs / {activePatient.gender}</span></div>
                  <div><span className="text-slate-400 block font-medium text-[9px] uppercase">PID / Date</span><span className="font-mono font-semibold text-slate-800 text-[11px]">{activePatient.id} • {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span></div>
                </div>
                <div className="grid grid-cols-5 gap-2 pt-0.5 text-[11px]">
                  <div><span className="text-slate-400 block text-[9px]">Blood Pressure:</span><span className="font-bold text-slate-800">{activePatient.bp} mmHg</span></div>
                  <div><span className="text-slate-400 block text-[9px]">Blood Sugar:</span><span className="font-bold text-slate-800">{activePatient.sugar} mg/dL</span></div>
                  <div><span className="text-slate-400 block text-[9px]">Pulse / HR:</span><span className="font-bold text-slate-800">{activePatient.pulse} bpm</span></div>
                  <div><span className="text-slate-400 block text-[9px]">Weight / Height:</span><span className="font-bold text-slate-800">{activePatient.weight} kg / {activePatient.height} cm</span></div>
                  <div><span className="text-slate-400 block text-[9px]">Body Temp:</span><span className="font-bold text-slate-800">{activePatient.temp} °F</span></div>
                </div>
              </div>
              <div className="space-y-3 min-h-[280px]">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-1"><span className="text-2xl font-serif font-black text-teal-700">Rx</span><span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">(Prescribed Medications)</span></div>
                <table className="w-full text-left text-xs">
                  <thead><tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[9px]"><th className="py-2 w-8">#</th><th className="py-2">Medicine & Formula</th><th className="py-2">Frequency</th><th className="py-2">Duration</th><th className="py-2 text-right">Instructions</th></tr></thead>
                  <tbody className="divide-y divide-slate-100">
                    {activePatient.prescription.map((item, i) => (
                      <tr key={item.id} className="border-b border-slate-100"><td className="py-2.5 font-bold text-slate-400">{i + 1}</td><td className="py-2.5 font-bold text-slate-800">{item.name}</td><td className="py-2.5 font-semibold text-slate-700">{item.freq}</td><td className="py-2.5 text-slate-600">{item.duration}</td><td className="py-2.5 text-right text-slate-600 italic">{item.instructions}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="pt-3 border-t border-slate-200">
                <p className="text-xs font-bold text-slate-700">Advice / Special Instructions:</p>
                <p className="text-xs text-slate-600 italic mt-1">{document.getElementById('doctor-advice')?.value || 'Take medication as prescribed. Drink warm water and follow up if needed.'}</p>
              </div>
              <div className="pt-6 flex items-end justify-between text-xs">
                <div className="text-[10px] text-slate-400"><p>Vitals logged by Nurse Triage Station.</p><p>Computer Generated Medical Slip • CityCare</p></div>
                <div className="text-center"><div className="h-10 border-b border-slate-400 mb-1 flex items-end justify-center"><span className="font-serif italic text-slate-700 text-base font-bold">Dr. S. Jenkins</span></div><p className="font-bold text-slate-800">Doctor's Signature</p></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}