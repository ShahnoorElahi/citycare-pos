import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CheckCircle, Info, Pill, X, Printer, Upload } from 'lucide-react';
import { saveMedicine } from '../store/clinicSlice';

export default function Modals() {
  const dispatch = useDispatch();
  const { activePatientId, patientsQueue } = useSelector(state => state.clinic);
  const activePatient = patientsQueue.find(p => p.id === activePatientId);
  
  const [toasts, setToasts] = useState([]);
  const [showMedModal, setShowMedModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  
  // Updated Med Form State with Image
  const [medForm, setMedForm] = useState({ 
    id: null, name: '', formula: '', image: '', 
    form: 'Tablet', category: 'Antibiotic', 
    freq: '1-0-1', duration: '', instructions: '' 
  });

  useEffect(() => {
    const handleToast = (e) => {
      const id = Date.now();
      setToasts(prev => [...prev, { id, ...e.detail }]);
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
    };
    const handleOpenMed = (e) => {
      setMedForm(e.detail || { id: null, name: '', formula: '', image: '', form: 'Tablet', category: 'Antibiotic', freq: '1-0-1', duration: '', instructions: '' });
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

  // Handle Image Upload (Convert to Base64)
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMedForm({ ...medForm, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveMed = (e) => {
    e.preventDefault();
    
    // Formatting to match our Table layout requirements
    const payload = {
      ...medForm,
      formula: medForm.formula || medForm.name, // Fallback if generic not provided
      dosage: `${medForm.freq} • ${medForm.duration || 'N/A'}`
    };

    dispatch(saveMedicine(payload));
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

      {/* Add/Edit Medicine Modal */}
      {showMedModal && (
        <div id="custom-med-modal" className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <h3 className="font-bold text-sm flex items-center gap-2"><Pill className="w-4 h-4 text-teal-400" /><span>{medForm.id ? 'Edit Medicine' : 'Add New Medicine'}</span></h3>
              <button onClick={() => setShowMedModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleSaveMed} className="p-5 space-y-4 text-xs overflow-y-auto">
              
              {/* Image Upload Section */}
              <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="w-16 h-16 bg-white border border-slate-300 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                  {medForm.image ? (
                    <img src={medForm.image} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Upload className="w-5 h-5 text-slate-400" />
                  )}
                </div>
                <div className="flex-1">
                  <label className="block font-semibold text-slate-700 mb-1">Medicine Image</label>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full text-[10px] file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100" />
                  <p className="text-[9px] text-slate-400 mt-1">Upload an image file. (Uses Base64 storage).</p>
                </div>
              </div>

              <div><label className="block font-semibold text-slate-700 mb-1">Brand Name *</label><input type="text" required value={medForm.name} onChange={e => setMedForm({...medForm, name: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none" /></div>
              <div><label className="block font-semibold text-slate-700 mb-1">Generic Formula</label><input type="text" value={medForm.formula} onChange={e => setMedForm({...medForm, formula: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none" /></div>
              
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block font-semibold text-slate-700 mb-1">Form Factor</label><select value={medForm.form} onChange={e => setMedForm({...medForm, form: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white">{['Tablet', 'Capsule', 'Syrup', 'Injection', 'Ointment', 'Drops'].map(f => <option key={f} value={f}>{f}</option>)}</select></div>
                <div><label className="block font-semibold text-slate-700 mb-1">Category</label><select value={medForm.category} onChange={e => setMedForm({...medForm, category: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white">{['Antibiotic', 'Analgesic', 'Antacid', 'Antihistamine', 'Vitamins'].map(c => <option key={c} value={c}>{c}</option>)}</select></div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block font-semibold text-slate-700 mb-1">Default Frequency</label><select value={medForm.freq} onChange={e => setMedForm({...medForm, freq: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"><option value="1-0-1">1-0-1 (Twice daily)</option><option value="1-1-1">1-1-1 (Thrice daily)</option><option value="1-0-0">1-0-0 (Morning only)</option><option value="0-0-1">0-0-1 (Night only)</option><option value="SOS">SOS / As needed</option></select></div>
                <div><label className="block font-semibold text-slate-700 mb-1">Default Duration</label><input type="text" value={medForm.duration} onChange={e => setMedForm({...medForm, duration: e.target.value})} placeholder="e.g. 5 Days" className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none" /></div>
              </div>
              
              <div><label className="block font-semibold text-slate-700 mb-1">Special Instruction Preset</label><input type="text" value={medForm.instructions} onChange={e => setMedForm({...medForm, instructions: e.target.value})} placeholder="e.g. After Meals with water" className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none" /></div>
              
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2 shrink-0">
                <button type="button" onClick={() => setShowMedModal(false)} className="px-4 py-2 border border-slate-300 text-slate-600 font-semibold rounded-lg hover:bg-slate-100">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg shadow-sm">Save Drug</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Print Modal (Keep your existing Print Modal code here) */}
      {showPrintModal && activePatient && (
        <div id="print-modal" className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* ... Keep your existing print modal content ... */}
          <div className="bg-white p-8 rounded-xl w-[600px] text-center">
             <h2 className="text-xl font-bold mb-4">Print Preview</h2>
             <p className="text-xs text-slate-500 mb-4">(Ensure your previous Print Modal is pasted here)</p>
             <button onClick={() => setShowPrintModal(false)} className="bg-slate-200 px-4 py-2 rounded text-xs">Close</button>
          </div>
        </div>
      )}
    </>
  );
}