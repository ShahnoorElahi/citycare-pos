import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Search, Eye, X, FileText, Activity, Calendar, RotateCcw } from 'lucide-react';

export default function PatientArchives() {
  const patients = useSelector(state => state.clinic.patientsQueue);
  
  // Get today's date in YYYY-MM-DD format for the input default
  const todayStr = new Date().toISOString().split('T')[0];

  const [search, setSearch] = useState('');
  const [filterColumn, setFilterColumn] = useState('all');
  const [dateFilter, setDateFilter] = useState(todayStr); // 🔥 Defaults to today
  const [selectedPatient, setSelectedPatient] = useState(null);

  const filterOptions = [
    { value: 'all', label: 'All Columns' },
    { value: 'name', label: 'Patient Name' },
    { value: 'id', label: 'Patient ID (PID)' },
    { value: 'token', label: 'Token No' },
    { value: 'gender', label: 'Gender' },
    { value: 'notes', label: 'Symptom Notes' },
  ];

  // Filter Logic
  const filteredPatients = patients.filter(pt => {
    // 1. Date Filter Check
    if (dateFilter && pt.date !== dateFilter) {
      return false;
    }

    // 2. Text Search Check
    const query = search.toLowerCase();
    if (query === '') return true;

    const safeStr = (val) => (val || '').toString().toLowerCase();

    if (filterColumn === 'all') {
      return (
        safeStr(pt.name).includes(query) ||
        safeStr(pt.id).includes(query) ||
        safeStr(pt.token).includes(query) ||
        safeStr(pt.gender).includes(query) ||
        safeStr(pt.notes).includes(query) ||
        safeStr(pt.date).includes(query)
      );
    }
    return safeStr(pt[filterColumn]).includes(query);
  });

  return (
    <div id="view-patients" className="max-w-7xl mx-auto space-y-6 w-full p-4 sm:p-6 overflow-y-auto">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Patient Archives</h3>
          <p className="text-xs text-slate-500">View and search all registered patients, their vitals, and prescription history.</p>
        </div>
        <span className="bg-teal-100 text-teal-800 text-xs font-bold px-3 py-1.5 rounded-lg border border-teal-200">
          Total Records: {patients.length}
        </span>
      </div>

      {/* Patient Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-2 w-full xl:w-auto">
            
            {/* Column Filter */}
            <select 
              value={filterColumn} 
              onChange={(e) => setFilterColumn(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-xl text-xs bg-slate-50 text-slate-700 focus:ring-2 focus:ring-teal-500 focus:outline-none font-semibold cursor-pointer w-full sm:w-auto"
            >
              {filterOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            {/* Date Filter (with Reset Button) */}
            <div className="relative flex items-center w-full sm:w-auto gap-1">
              <div className="relative w-full">
                <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input 
                  type="date" 
                  value={dateFilter} 
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full sm:w-auto pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none text-slate-700 font-medium cursor-pointer"
                  title="Filter by Date"
                />
              </div>
              
              {/* Clear Date Filter Button (Only shows if a date is selected) */}
              {dateFilter && (
                <button 
                  onClick={() => setDateFilter('')} 
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Show All Dates"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                placeholder={`Search...`}
                className="w-full pl-9 pr-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none" 
              />
            </div>
          </div>
          
          <span className="text-xs text-slate-500 font-medium shrink-0 mt-2 xl:mt-0">
            Showing {filteredPatients.length} of {patients.length}
          </span>
        </div>
        
        {/* 🔥 FIXED HEIGHT SCROLLABLE TABLE */}
        <div className="overflow-x-auto overflow-y-auto" style={{ height: '500px' }}>
          <table className="w-full text-left text-xs relative">
            
            {/* 🔥 STICKY HEADER */}
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 sticky top-0 z-10">
              <tr>
                <th className="py-3 px-4 text-center w-20">Token</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Patient ID (PID)</th>
                <th className="py-3 px-4">Age / Gender</th>
                <th className="py-3 px-4">Blood Pressure</th>
                <th className="py-3 px-4">Pulse</th>
                <th className="py-3 px-4">Prescription</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-slate-400">
                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-medium text-slate-600">No patient records found for this date.</p>
                    <p className="text-xs mt-1">Try clearing the date filter or adjusting your search.</p>
                  </td>
                </tr>
              ) : (
                filteredPatients.map(pt => (
                  <tr key={pt.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 text-center">
                      <span className="bg-teal-600 text-white text-[10px] font-black px-2 py-1 rounded-lg">#{pt.token}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-semibold">{pt.date || 'N/A'}</td>
                    <td className="py-3 px-4 font-bold text-slate-800">{pt.name}</td>
                    <td className="py-3 px-4 text-slate-500 font-mono">{pt.id}</td>
                    <td className="py-3 px-4 text-slate-600">{pt.age}y • {pt.gender}</td>
                    <td className="py-3 px-4 text-slate-600">{pt.bp} <span className="text-[9px] text-slate-400">mmHg</span></td>
                    <td className="py-3 px-4 text-slate-600">{pt.pulse} <span className="text-[9px] text-slate-400">bpm</span></td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${pt.prescription?.length > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}>
                        {pt.prescription?.length || 0} Drugs
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button 
                        onClick={() => setSelectedPatient(pt)} 
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200 rounded-lg text-[11px] font-bold transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW PATIENT MODAL */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-400" /> Patient File - {selectedPatient.name}
              </h3>
              <button onClick={() => setSelectedPatient(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              
              {/* Patient Info Card */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <div><span className="text-slate-400 block mb-1">Patient ID</span><span className="font-bold text-slate-800 font-mono">{selectedPatient.id}</span></div>
                <div><span className="text-slate-400 block mb-1">Visit Date</span><span className="font-bold text-slate-800">{selectedPatient.date || 'N/A'}</span></div>
                <div><span className="text-slate-400 block mb-1">Age / Gender</span><span className="font-bold text-slate-800">{selectedPatient.age} Yrs / {selectedPatient.gender}</span></div>
                <div><span className="text-slate-400 block mb-1">Contact/Token</span><span className="font-bold text-teal-600">Token #{selectedPatient.token}</span></div>
              </div>

              {/* Vitals Card */}
              <div>
                <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3 flex items-center gap-1.5"><Activity className="w-4 h-4 text-teal-600" /> Recorded Vitals</h4>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs">
                  <div className="bg-white p-2 rounded-lg border border-slate-200"><span className="text-slate-400 block text-[10px] mb-1">BP</span><span className="font-bold text-slate-800">{selectedPatient.bp}</span></div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200"><span className="text-slate-400 block text-[10px] mb-1">Sugar</span><span className="font-bold text-slate-800">{selectedPatient.sugar}</span></div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200"><span className="text-slate-400 block text-[10px] mb-1">Pulse</span><span className="font-bold text-slate-800">{selectedPatient.pulse}</span></div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200"><span className="text-slate-400 block text-[10px] mb-1">Weight</span><span className="font-bold text-slate-800">{selectedPatient.weight}kg</span></div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200"><span className="text-slate-400 block text-[10px] mb-1">Height</span><span className="font-bold text-slate-800">{selectedPatient.height}cm</span></div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200"><span className="text-slate-400 block text-[10px] mb-1">Temp</span><span className="font-bold text-slate-800">{selectedPatient.temp}°F</span></div>
                </div>
              </div>

              {/* Notes */}
              {selectedPatient.notes && (
                <div>
                  <h4 className="text-xs font-bold text-slate-600 mb-2">Symptom Notes</h4>
                  <p className="text-xs text-slate-700 bg-amber-50 border border-amber-100 p-3 rounded-lg italic">"{selectedPatient.notes}"</p>
                </div>
              )}

              {/* Prescription History */}
              <div>
                <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Prescribed Medications</h4>
                {selectedPatient.prescription?.length > 0 ? (
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                        <tr>
                          <th className="py-2 px-3">Medicine Name</th>
                          <th className="py-2 px-3">Frequency</th>
                          <th className="py-2 px-3">Duration</th>
                          <th className="py-2 px-3 text-right">Instructions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {selectedPatient.prescription.map((item, idx) => (
                          <tr key={idx}>
                            <td className="py-2 px-3 font-bold text-slate-800">{item.name}</td>
                            <td className="py-2 px-3 text-slate-600">{item.freq}</td>
                            <td className="py-2 px-3 text-slate-600">{item.duration}</td>
                            <td className="py-2 px-3 text-right text-slate-500 italic">{item.instructions}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-6 bg-slate-50 border border-slate-200 rounded-xl text-slate-400">
                    <p className="text-xs">No medications were prescribed for this visit.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end shrink-0">
              <button onClick={() => setSelectedPatient(null)} className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs transition-all">
                Close File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}