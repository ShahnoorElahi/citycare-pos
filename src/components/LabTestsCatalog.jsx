import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'; // <-- Add
import { deleteLabTest } from '../store/clinicSlice.js';
import { Plus, Edit3, Trash2, FlaskConical, Search } from 'lucide-react';



export default function LabTestsCatalog() {
    const dispatch = useDispatch();
    const labTests = useSelector(state => state.clinic.labTests);

    // States for search and filter
    const [search, setSearch] = useState('');
    const [filterColumn, setFilterColumn] = useState('all');

    // Columns available for filtering
    const filterOptions = [
        { value: 'all', label: 'All Columns' },
        { value: 'name', label: 'Test Name' },
        { value: 'category', label: 'Category' },
        { value: 'sample', label: 'Sample Type' },
        { value: 'price', label: 'Price' },
    ];

    // Dynamic Search Logic
    const filteredTests = labTests.filter(test => {
        const query = search.toLowerCase();
        if (query === '') return true;

        const safeStr = (val) => (val || '').toString().toLowerCase();

        if (filterColumn === 'all') {
            return (
                safeStr(test.name).includes(query) ||
                safeStr(test.category).includes(query) ||
                safeStr(test.sample).includes(query) ||
                safeStr(test.price).includes(query) ||
                safeStr(test.desc).includes(query)
            );
        }
        return safeStr(test[filterColumn]).includes(query);
    });

    const handleDelete = (id) => {
        dispatch(deleteLabTest(id)); // <-- Dispatch instead of local state
        window.dispatchEvent(new CustomEvent('showToast', { detail: { message: 'Lab Test removed', type: 'info' } }));
    };

    // Open modal for ADDING (pass null)
    const handleAdd = () => {
        window.dispatchEvent(new CustomEvent('openLabTestModal', { detail: null }));
    };

    // Open modal for EDITING (pass the test data)
    const handleEdit = (test) => {
        window.dispatchEvent(new CustomEvent('openLabTestModal', { detail: test }));
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 w-full p-4 sm:p-6 overflow-y-auto">

            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">Master Lab Tests Catalog</h3>
                    <p className="text-xs text-slate-500">Perform CRUD operations on diagnostic lab tests directory.</p>
                </div>
                <button onClick={handleAdd} className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm">
                    <Plus className="w-4 h-4" /> Add New Lab Test
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
                        Total Tests: {filteredTests.length}
                    </span>
                </div>

                {/* 🔥 FIXED HEIGHT SCROLLABLE TABLE */}
                <div className="overflow-x-auto overflow-y-auto" style={{ height: '500px' }}>
                    <table className="w-full text-left text-xs relative">

                        {/* 🔥 STICKY HEADER */}
                        <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 sticky top-0 z-10">
                            <tr>
                                <th className="py-3 px-4 w-20 text-center">Icon</th>
                                <th className="py-3 px-4">Test Name</th>
                                <th className="py-3 px-4">Category</th>
                                <th className="py-3 px-4">Sample Type</th>
                                <th className="py-3 px-4">Price</th>
                                <th className="py-3 px-4">Description</th>
                                <th className="py-3 px-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                            {filteredTests.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="py-12 text-center text-slate-400">
                                        <FlaskConical className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                        <p className="text-sm font-medium text-slate-600">No lab tests found</p>
                                        <p className="text-xs mt-1">Try adjusting your search term or column filter.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredTests.map(test => (
                                    <tr key={test.id} className="hover:bg-slate-50 transition-colors">

                                        {/* Icon Column */}
                                        <td className="py-3 px-4 text-center">
                                            <div className="w-12 h-12 mx-auto rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
                                                <FlaskConical className="w-5 h-5" />
                                            </div>
                                        </td>

                                        <td className="py-3 px-4 font-bold text-slate-800">{test.name}</td>
                                        <td className="py-3 px-4"><span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 font-medium">{test.category}</span></td>
                                        <td className="py-3 px-4 text-slate-600">{test.sample}</td>
                                        <td className="py-3 px-4 font-bold text-teal-700">{test.price}</td>
                                        <td className="py-3 px-4 text-slate-500 truncate max-w-[200px]" title={test.desc}>{test.desc}</td>

                                        {/* Actions Column */}
                                        <td className="py-3 px-4 text-right space-x-1">
                                            <button onClick={() => handleEdit(test)} className="p-1.5 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all" title="Edit Test">
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(test.id)} className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all" title="Delete Test">
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
        </div>
    );
}