import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HeartPulse, Users, UserPlus, Send, UserCheck, Search, Eye, Edit3, X, Stethoscope } from 'lucide-react';
import { saveVitals, setActivePatient, markAsSentToDoctor } from '../store/clinicSlice'; // 🔥 Updated import

export default function NurseView() {
  const dispatch = useDispatch();
  const patientsQueue = useSelector(state => state.clinic.patientsQueue);
  
  const [viewMode, setViewMode] = useState('form'); 
  const [viewingPatient, setViewingPatient] = useState(null);

  const [form, setForm] = useState({
    internalId: '', token: '', name: '', pid: '', age: '', gender: 'Male',
    bp: '', sugar: '', pulse: '', weight: '', height: '', temp: '', notes: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  const [search, setSearch] = useState('');
  const [filterColumn, setFilterColumn] = useState('all');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const clearForm = () => {
    setForm({ internalId: '', token: '', name: '', pid: '', age: '', gender: 'Male', bp: '', sugar: '', pulse: '', weight: '', height: '', temp: '', notes: '' });
    setIsEditing(false);
    setViewMode('form');
    setViewingPatient(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const token = parseInt(form.token) || (patientsQueue.length + 101);
    const pid = form.pid || form.internalId || `CC-${Math.floor(1000 + Math.random() * 9000)}`;
    const todayStr = new Date().toISOString().split('T')[0];

    if (!isEditing) {
      const existingTodayRecord = patientsQueue.find(
        (pt) => pt.id === pid && pt.date === todayStr
      );

      if (existingTodayRecord) {
        window.dispatchEvent(new CustomEvent('showToast', { 
          detail: { 
            message: `Patient ${form.name} is already in today's queue. Please click 'Edit' on their card to update.`, 
            type: 'info' 
          }
        }));
        return;
      }
    }

    dispatch(saveVitals({
      internalId: form.internalId, 
      token, 
      name: form.name, 
      id: pid,
      age: parseInt(form.age) || 30, 
      gender: form.gender,
      bp: form.bp || '120/80', 
      sugar: form.sugar || '100', 
      pulse: form.pulse || '72',
      weight: form.weight || '70', 
      height: form.height || '170', 
      temp: form.temp || '98.6', 
      notes: form.notes,
      date: todayStr 
    }));

    window.dispatchEvent(new CustomEvent('showToast', { 
      detail: { message: isEditing ? `Updated vitals for ${form.name}` : `Saved & Queued Token #${token} (${form.name}) for Doctor`, type: 'success' }
    }));
    
    clearForm();
  };

  const editPatient = (pt) => {
    setForm({
      internalId: pt.id, token: pt.token, name: pt.name, pid: pt.id, age: pt.age, gender: pt.gender,
      bp: pt.bp, sugar: pt.sugar, pulse: pt.pulse, weight: pt.weight, height: pt.height, temp: pt.temp, notes: pt.notes
    });
    setIsEditing(true);
    setViewMode('form');
    setViewingPatient(null);
  };

  const viewPatient = (pt) => {
    setViewingPatient(pt);
    setViewMode('view');
    setIsEditing(false);
  };

  // 🔥 MARK AS SENT TO DOCTOR (instead of remove)
  const sendToDoctor = (patient) => {
    dispatch(markAsSentToDoctor(patient.id));
    dispatch(setActivePatient(patient.id));
    
    window.dispatchEvent(new CustomEvent('switchTab', { detail: 'rx-pos' }));
    window.dispatchEvent(new CustomEvent('showToast', { 
      detail: { message: `Patient ${patient.name} sent to Doctor.`, type: 'success' }
    }));
  };

  const filterOptions = [
    { value: 'all', label: 'All Columns' },
    { value: 'name', label: 'Patient Name' },
    { value: 'id', label: 'Patient ID (PID)' },
    { value: 'token', label: 'Token No' },
    { value: 'gender', label: 'Gender' },
    { value: 'notes', label: 'Symptom Notes' },
  ];

  // 🔥 HIDE RECORDS SENT TO DOCTOR
  const filteredQueue = patientsQueue.filter(pt => {
    const todayStr = new Date().toISOString().split('T')[0];
    if (pt.date !== todayStr) return false;
    
    // Hide if sent to doctor
    if (pt.status === 'with-doctor') return false;

    const query = search.toLowerCase();
    if (query === '') return true;

    const safeStr = (val) => (val || '').toString().toLowerCase();

    if (filterColumn === 'all') {
      return (
        safeStr(pt.name).includes(query) ||
        safeStr(pt.id).includes(query) ||
        safeStr(pt.token).includes(query) ||
        safeStr(pt.gender).includes(query) ||
        safeStr(pt.notes).includes(query)
      );
    }
    return safeStr(pt[filterColumn]).includes(query);
  });

  const todayCount = patientsQueue.filter(pt => 
    pt.date === new Date().toISOString().split('T')[0] && pt.status !== 'with-doctor'
  ).length;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header Section */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 shrink-0">
          <div className="p-3 bg-teal-50 text-teal-700 rounded-xl border border-teal-200">
            <HeartPulse className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">Nurse Triage & Patient Vitals Entry</h3>
            <p className="text-xs text-slate-500">Record patient physical readings to route directly into the doctor's queue.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full xl:w-auto mt-2 xl:mt-0">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select 
              value={filterColumn} 
              onChange={(e) => setFilterColumn(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-xl text-xs bg-slate-50 text-slate-700 focus:ring-2 focus:ring-teal-500 focus:outline-none font-semibold cursor-pointer"
            >
              {filterOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            <div className="relative w-full sm:w-56">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                placeholder="Search queue..." 
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none" 
              />
            </div>
          </div>

          <span className="px-3 py-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 w-full sm:w-auto justify-center sm:justify-start">
            <Users className="w-3.5 h-3.5" />
            <span>{todayCount} in Queue Today</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          
          {viewMode === 'view' && viewingPatient && (
            <>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-teal-600" /> Patient Record Details
                </h4>
                <span className="text-[10px] font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded-md">Read Only</span>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div>
                    <span className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Token Number</span>
                    <span className="text-sm font-bold text-teal-700">#{viewingPatient.token}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Patient Full Name</span>
                    <span className="text-sm font-bold text-slate-800">{viewingPatient.name}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div>
                    <span className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Patient ID (PID)</span>
                    <span className="text-xs font-mono font-semibold text-slate-800">{viewingPatient.id}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Age</span>
                    <span className="text-xs font-semibold text-slate-800">{viewingPatient.age} Years</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Gender</span>
                    <span className="text-xs font-semibold text-slate-800">{viewingPatient.gender}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <p className="text-xs font-bold text-slate-600 mb-3 uppercase tracking-wider">Physical Vitals Measurements</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { label: 'Blood Pressure', val: viewingPatient.bp, unit: 'mmHg' },
                      { label: 'Blood Sugar', val: viewingPatient.sugar, unit: 'mg/dL' },
                      { label: 'Heart Beats / Pulse', val: viewingPatient.pulse, unit: 'bpm' },
                      { label: 'Weight', val: viewingPatient.weight, unit: 'kg' },
                      { label: 'Height', val: viewingPatient.height, unit: 'cm' },
                      { label: 'Body Temp', val: viewingPatient.temp, unit: '°F' },
                    ].map((f, i) => (
                      <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-2.5">
                        <span className="block text-[10px] font-semibold text-slate-500 mb-1">{f.label}</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-sm font-bold text-slate-800">{f.val}</span>
                          <span className="text-[10px] text-slate-400">{f.unit}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="block text-xs font-semibold text-slate-700 mb-1">Chief Complaints / Symptom Notes</span>
                  <div className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 min-h-[60px]">
                    {viewingPatient.notes || <span className="text-slate-400 italic">No notes recorded.</span>}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <button onClick={() => clearForm()} className="px-4 py-2.5 border border-slate-300 text-slate-600 font-semibold rounded-xl text-xs hover:bg-slate-100 transition-all flex items-center gap-1.5">
                    <X className="w-3.5 h-3.5" /> Close View
                  </button>
                  <div className="flex items-center gap-2">
                    <button onClick={() => editPatient(viewingPatient)} className="px-4 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-200 transition-all flex items-center gap-1.5">
                      <Edit3 className="w-3.5 h-3.5" /> Edit Record
                    </button>
                    <button onClick={() => sendToDoctor(viewingPatient)} className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all flex items-center gap-2">
                      <Stethoscope className="w-4 h-4" /> Send to Doctor
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {viewMode === 'form' && (
            <>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-teal-600" />
                  {isEditing ? 'Edit Patient Vitals' : 'Patient Vitals & Registration Form'}
                </h4>
                {isEditing && <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md">Editing Patient Record</span>}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Token Number *</label>
                    <input type="number" name="token" required value={form.token} onChange={handleChange} placeholder="e.g. 101" className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-teal-800 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Patient Full Name *</label>
                    <input type="text" name="name" required value={form.name} onChange={handleChange} placeholder="e.g. Rahul Sharma" className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Patient ID (PID)</label>
                    <input type="text" name="pid" value={form.pid} onChange={handleChange} placeholder="Auto-generated" className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Age (Years) *</label>
                    <input type="number" name="age" required value={form.age} onChange={handleChange} placeholder="e.g. 34" className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Gender *</label>
                    <select name="gender" value={form.gender} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none">
                      <option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-600 mb-3 uppercase tracking-wider">Physical Vitals Measurements</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { label: 'Blood Pressure (BP)', name: 'bp', placeholder: '120/80', unit: 'mmHg' },
                      { label: 'Blood Sugar', name: 'sugar', placeholder: '110', unit: 'mg/dL' },
                      { label: 'Heart Beats / Pulse', name: 'pulse', placeholder: '72', unit: 'bpm' },
                      { label: 'Weight', name: 'weight', placeholder: '70', unit: 'kg' },
                      { label: 'Height', name: 'height', placeholder: '172', unit: 'cm' },
                      { label: 'Body Temp', name: 'temp', placeholder: '98.6', unit: '°F' },
                    ].map(f => (
                      <div key={f.name}>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">{f.label}</label>
                        <div className="relative">
                          <input type="text" name={f.name} value={form[f.name]} onChange={handleChange} placeholder={f.placeholder} className="w-full p-2.5 pr-10 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none" />
                          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">{f.unit}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Chief Complaints / Symptom Notes</label>
                  <textarea name="notes" value={form.notes} onChange={handleChange} rows="2" placeholder="e.g. Fever since 2 days..." className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"></textarea>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                  {isEditing ? (
                    <button type="button" onClick={() => clearForm()} className="px-4 py-2.5 border border-slate-300 text-slate-600 font-semibold rounded-xl text-xs hover:bg-slate-100 transition-all">Cancel Edit</button>
                  ) : (
                    <button type="button" onClick={clearForm} className="px-4 py-2.5 border border-slate-300 text-slate-600 font-semibold rounded-xl text-xs hover:bg-slate-100 transition-all">Clear Form</button>
                  )}
                  <button type="submit" className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all flex items-center gap-2">
                    <Send className="w-4 h-4" /><span>{isEditing ? 'Update Vitals' : 'Save & Send to Doctor Queue'}</span>
                  </button>
                </div>
              </form>
            </>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[600px] overflow-hidden">
          
          <div className="p-4 border-b border-slate-100 flex items-center justify-between shrink-0">
            <div>
              <h4 className="font-bold text-sm text-slate-800">Today's Patient Intake List</h4>
              <p className="text-[11px] text-slate-500">Patients registered by triage nurse</p>
            </div>
            <span className="bg-teal-100 text-teal-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">{filteredQueue.length} Listed</span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {filteredQueue.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2 border-2 border-dashed border-slate-200 rounded-xl p-4 text-center">
                 <UserCheck className="w-10 h-10 stroke-1" />
                 <p className="text-xs font-semibold">No patients found.</p>
                 <p className="text-[11px]">Try adjusting your search or filter.</p>
               </div>
            ) : filteredQueue.map(pt => (
              <div key={`${pt.id}-${pt.date}`} className={`p-3.5 bg-slate-50 border rounded-xl transition-all space-y-2.5 ${viewingPatient?.id === pt.id ? 'border-teal-500 ring-1 ring-teal-500' : 'border-slate-200 hover:border-teal-400'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="bg-teal-600 text-white text-xs font-black px-2 py-0.5 rounded-lg">#{pt.token}</span>
                    <h5 className="font-bold text-xs text-slate-800">{pt.name}</h5>
                    <span className="text-[10px] text-slate-500">({pt.age}y • {pt.gender})</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{pt.id}</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 text-[10px] text-slate-600 font-medium">
                  <div className="bg-white p-1.5 rounded border border-slate-200 text-center"><span className="text-slate-400 block text-[9px]">BP</span><span className="font-bold text-slate-800">{pt.bp}</span></div>
                  <div className="bg-white p-1.5 rounded border border-slate-200 text-center"><span className="text-slate-400 block text-[9px]">Sugar</span><span className="font-bold text-slate-800">{pt.sugar}</span></div>
                  <div className="bg-white p-1.5 rounded border border-slate-200 text-center"><span className="text-slate-400 block text-[9px]">Pulse</span><span className="font-bold text-slate-800">{pt.pulse} bpm</span></div>
                  <div className="bg-white p-1.5 rounded border border-slate-200 text-center"><span className="text-slate-400 block text-[9px]">Weight</span><span className="font-bold text-slate-800">{pt.weight} kg</span></div>
                </div>
                <div className="flex items-center justify-between pt-1 text-[11px] border-t border-slate-200/60">
                  <span className="text-slate-500 italic text-[10px] truncate max-w-[150px]">{pt.notes || 'No notes'}</span>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => viewPatient(pt)} className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-2 py-1 rounded-lg text-[10px] transition-all flex items-center gap-1">
                      <Eye className="w-3 h-3" /> View
                    </button>
                    <button onClick={() => editPatient(pt)} className="text-slate-600 hover:text-teal-600 font-semibold text-[11px] underline px-1">Edit</button>
                    <button onClick={() => sendToDoctor(pt)} className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-2.5 py-1 rounded-lg text-[10px] transition-all">Doctor Rx</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}