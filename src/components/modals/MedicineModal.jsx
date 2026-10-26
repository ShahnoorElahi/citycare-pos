import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Pill, X, Upload } from 'lucide-react';
import { saveMedicine } from '../../store/clinicSlice';

export default function MedicineModal({ isOpen, onClose, initialData }) {
  const dispatch = useDispatch();
  const [form, setForm] = useState({ id: null, name: '', formula: '', image: '', form: 'Tablet', category: 'Antibiotic', freq: '1-0-1', duration: '', instructions: '' });

  useEffect(() => {
    if (isOpen) setForm(initialData || { id: null, name: '', formula: '', image: '', form: 'Tablet', category: 'Antibiotic', freq: '1-0-1', duration: '', instructions: '' });
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setForm({ ...form, image: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(saveMedicine({ ...form, formula: form.formula || form.name, dosage: `${form.freq} • ${form.duration || 'N/A'}` }));
    window.dispatchEvent(new CustomEvent('showToast', { detail: { message: form.id ? 'Medicine updated' : 'Medicine added', type: 'success' } }));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <h3 className="font-bold text-sm flex items-center gap-2"><Pill className="w-4 h-4 text-teal-400" /><span>{form.id ? 'Edit Medicine' : 'Add New Medicine'}</span></h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs overflow-y-auto">
          <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="w-16 h-16 bg-white border border-slate-300 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
              {form.image ? <img src={form.image} alt="Preview" className="w-full h-full object-cover" /> : <Upload className="w-5 h-5 text-slate-400" />}
            </div>
            <div className="flex-1">
              <label className="block font-semibold text-slate-700 mb-1">Medicine Image</label>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full text-[10px] file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100" />
            </div>
          </div>
          <div><label className="block font-semibold text-slate-700 mb-1">Brand Name *</label><input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none" /></div>
          <div><label className="block font-semibold text-slate-700 mb-1">Generic Formula</label><input type="text" value={form.formula} onChange={e => setForm({...form, formula: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none" /></div>
          
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block font-semibold text-slate-700 mb-1">Form Factor</label><select value={form.form} onChange={e => setForm({...form, form: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white">{['Tablet', 'Capsule', 'Syrup', 'Injection', 'Ointment', 'Drops'].map(f => <option key={f} value={f}>{f}</option>)}</select></div>
            <div><label className="block font-semibold text-slate-700 mb-1">Category</label><select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white">{['Antibiotic', 'Analgesic', 'Antacid', 'Antihistamine', 'Vitamins'].map(c => <option key={c} value={c}>{c}</option>)}</select></div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block font-semibold text-slate-700 mb-1">Default Frequency</label><select value={form.freq} onChange={e => setForm({...form, freq: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"><option value="1-0-1">1-0-1 (Twice daily)</option><option value="1-1-1">1-1-1 (Thrice daily)</option><option value="1-0-0">1-0-0 (Morning only)</option><option value="0-0-1">0-0-1 (Night only)</option><option value="SOS">SOS / As needed</option></select></div>
            <div><label className="block font-semibold text-slate-700 mb-1">Default Duration</label><input type="text" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} placeholder="e.g. 5 Days" className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none" /></div>
          </div>
          
          <div><label className="block font-semibold text-slate-700 mb-1">Special Instruction</label><input type="text" value={form.instructions} onChange={e => setForm({...form, instructions: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none" /></div>
          
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2 shrink-0">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-300 text-slate-600 font-semibold rounded-lg hover:bg-slate-100">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg shadow-sm">Save Drug</button>
          </div>
        </form>
      </div>
    </div>
  );
}