import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { FlaskConical, X } from 'lucide-react';
import { saveLabTest } from '../../store/clinicSlice';

export default function LabTestModal({ isOpen, onClose, initialData }) {
  const dispatch = useDispatch();
  const [form, setForm] = useState({ id: null, name: '', category: 'Hematology', price: '', sample: 'Blood', desc: '' });

  useEffect(() => {
    if (isOpen) setForm(initialData || { id: null, name: '', category: 'Hematology', price: '', sample: 'Blood', desc: '' });
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(saveLabTest(form));
    window.dispatchEvent(new CustomEvent('showToast', { detail: { message: form.id ? 'Lab Test updated' : 'Lab Test added', type: 'success' } }));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <h3 className="font-bold text-sm flex items-center gap-2"><FlaskConical className="w-4 h-4 text-teal-400" /><span>{form.id ? 'Edit Lab Test' : 'Add New Lab Test'}</span></h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs overflow-y-auto">
          <div><label className="block font-semibold text-slate-700 mb-1">Test Name *</label><input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none" /></div>
          <div><label className="block font-semibold text-slate-700 mb-1">Description</label><input type="text" value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none" /></div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white">
                {['Hematology', 'Biochemistry', 'Endocrinology', 'Pathology', 'Radiology', 'Cardiology'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Sample Type</label>
              <select value={form.sample} onChange={e => setForm({...form, sample: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white">
                {['Blood', 'Urine', 'Stool', 'Swab', 'N/A'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          
          <div><label className="block font-semibold text-slate-700 mb-1">Price (e.g. $25)</label><input type="text" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none" /></div>
          
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2 shrink-0">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-300 text-slate-600 font-semibold rounded-lg hover:bg-slate-100">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg shadow-sm">Save Test</button>
          </div>
        </form>
      </div>
    </div>
  );
}