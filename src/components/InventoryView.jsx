import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Edit3, Trash2 } from 'lucide-react';
import { deleteMedicine } from '../store/clinicSlice';

export default function InventoryView() {
  const dispatch = useDispatch();
  const medicines = useSelector(state => state.clinic.medicines);
  const [search, setSearch] = useState('');

  const filteredMeds = medicines.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) || 
    m.generic.toLowerCase().includes(search.toLowerCase())
  );

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
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Master Medicine Directory</h3>
          <p className="text-xs text-slate-500">Perform CRUD operations (Create, Edit, Delete) on clinic medications.</p>
        </div>
        <button onClick={() => window.dispatchEvent(new CustomEvent('openCustomMedModal'))} className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm">
          <Plus className="w-4 h-4" /> Add New Drug
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Filter inventory medicines..." className="w-72 px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none" />
          <span className="text-xs text-slate-500 font-medium">Total Drugs: {medicines.length}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Medicine Name</th><th className="py-3 px-4">Generic Formula</th><th className="py-3 px-4">Form</th>
                <th className="py-3 px-4">Category</th><th className="py-3 px-4">Default Frequency</th>
                <th className="py-3 px-4 text-center">Status</th><th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredMeds.map(med => (
                <tr key={med.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-800">{med.name}</td>
                  <td className="py-3 px-4 text-slate-600">{med.generic}</td>
                  <td className="py-3 px-4"><span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 font-medium">{med.form}</span></td>
                  <td className="py-3 px-4"><span className={`px-2 py-0.5 rounded ${getCategoryBadge(med.category)}`}>{med.category}</span></td>
                  <td className="py-3 px-4 text-slate-600">{med.freq} • {med.duration}</td>
                  <td className="py-3 px-4 text-center"><span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold">Available</span></td>
                  <td className="py-3 px-4 text-right space-x-1">
                    <button onClick={() => window.dispatchEvent(new CustomEvent('openCustomMedModal', { detail: med }))} className="p-1.5 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all"><Edit3 className="w-4 h-4" /></button>
                    <button onClick={() => { dispatch(deleteMedicine(med.id)); window.dispatchEvent(new CustomEvent('showToast', { detail: { message: 'Medicine removed', type: 'info' }})); }} className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}