import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Edit3, Trash2, Image as ImageIcon, Search } from 'lucide-react';
import { deleteMedicine } from '../store/clinicSlice';

export default function InventoryView() {
  const dispatch = useDispatch();
  const medicines = useSelector(state => state.clinic.medicines);
  
  // States for search and filter
  const [search, setSearch] = useState('');
  const [filterColumn, setFilterColumn] = useState('all'); // 'all', 'name', 'formula', 'form', 'category', 'dosage'
  
  // State for hover image modal
  const [hoverImage, setHoverImage] = useState(null);

  // Columns available for filtering
  const filterOptions = [
    { value: 'all', label: 'All Columns' },
    { value: 'name', label: 'Medicine Name' },
    { value: 'formula', label: 'Generic Formula' },
    { value: 'form', label: 'Form Factor' },
    { value: 'category', label: 'Category' },
    { value: 'dosage', label: 'Default Dosages' },
  ];

  // 🔥 DYNAMIC SEARCH LOGIC
  const filteredMeds = medicines.filter(med => {
    const query = search.toLowerCase();
    
    // If query is empty, show all
    if (query === '') return true;

    // Safe string extraction helper
    const safeStr = (val) => (val || '').toString().toLowerCase();

    // Search within ALL columns
    if (filterColumn === 'all') {
      return (
        safeStr(med.name).includes(query) ||
        safeStr(med.formula).includes(query) ||
        safeStr(med.form).includes(query) ||
        safeStr(med.category).includes(query) ||
        safeStr(med.dosage).includes(query)
      );
    }

    // Search within a SPECIFIC column
    return safeStr(med[filterColumn]).includes(query);
  });

  const handleOpenModal = (med) => {
    window.dispatchEvent(new CustomEvent('openCustomMedModal', { detail: med }));
  };

  return (
    <div id="view-inventory" className="max-w-7xl mx-auto space-y-6 w-full p-4 sm:p-6 overflow-y-auto">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Master Medicine Catalog</h3>
          <p className="text-xs text-slate-500">Perform CRUD operations (Create, Read, Update, Delete) on clinic drug directory.</p>
        </div>
        <button onClick={() => handleOpenModal(null)} className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm">
          <Plus className="w-4 h-4" /> Add New Drug Entry
        </button>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Toolbar: Search & Filter */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            
            {/* Column Filter Dropdown */}
            <select 
              value={filterColumn} 
              onChange={(e) => setFilterColumn(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-xl text-xs bg-slate-50 text-slate-700 focus:ring-2 focus:ring-teal-500 focus:outline-none font-semibold cursor-pointer"
            >
              {filterOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                placeholder={`Search in ${filterColumn === 'all' ? 'all columns' : filterOptions.find(o => o.value === filterColumn)?.label}...`}
                className="w-full pl-9 pr-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none" 
              />
            </div>
          </div>
          
          <span className="text-xs text-slate-500 font-medium shrink-0">
            Total Drugs: {filteredMeds.length}
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-28 text-center">Medicine Image</th>
                <th className="py-3 px-4">Medicine Name</th>
                <th className="py-3 px-4">Generic Formula</th>
                <th className="py-3 px-4">Form Factor</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Default Dosages</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredMeds.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-medium text-slate-600">No medicines found</p>
                    <p className="text-xs mt-1">Try adjusting your search term or column filter.</p>
                  </td>
                </tr>
              ) : (
                filteredMeds.map(med => (
                  <tr key={med.id} className="hover:bg-slate-50 transition-colors">
                    
                    {/* Image Column with Hover Modal */}
                    <td className="py-3 px-4 text-center">
                      <div 
                        className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden cursor-pointer shadow-sm hover:ring-2 hover:ring-teal-500 transition-all group relative"
                        onMouseEnter={() => setHoverImage(med)}
                        onMouseLeave={() => setHoverImage(null)}
                      >
                        {med.image ? (
                          <img src={med.image} alt={med.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
                        ) : (
                          <ImageIcon className="w-6 h-6 text-slate-400" />
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 font-bold text-slate-800">{med.name}</td>
                    <td className="py-3 px-4 text-slate-600">{med.formula}</td>
                    <td className="py-3 px-4"><span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 font-medium">{med.form}</span></td>
                    <td className="py-3 px-4"><span className={`px-2 py-0.5 rounded ${med.categoryBg || 'bg-slate-100'}`}>{med.category}</span></td>
                    <td className="py-3 px-4 text-slate-600">{med.dosage}</td>
                    
                    {/* Actions Column */}
                    <td className="py-3 px-4 text-right space-x-1">
                      <button onClick={() => handleOpenModal(med)} className="p-1.5 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all" title="Edit Medicine">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => { dispatch(deleteMedicine(med.id)); window.dispatchEvent(new CustomEvent('showToast', { detail: { message: 'Medicine removed', type: 'info' }})); }} className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all" title="Delete Medicine">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hover Image Preview Modal */}
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
    </div>
  );
}