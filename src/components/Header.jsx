import { Calendar, PlusCircle, Printer, CheckCircle2, Menu } from 'lucide-react';
import { useSelector } from 'react-redux';

export default function Header({ activeTab, toggleSidebar }) {
  const activePatient = useSelector(state => state.clinic.patientsQueue.find(p => p.id === state.clinic.activePatientId));
  const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const handlePrint = () => {
    if (!activePatient || activePatient.prescription.length === 0) {
      window.dispatchEvent(new CustomEvent('showToast', { detail: { message: 'Add at least one drug to slip before printing', type: 'info' } }));
      return;
    }
    window.dispatchEvent(new CustomEvent('openPrintModal'));
  };

  const handleComplete = () => {
    if (!activePatient || activePatient.prescription.length === 0) {
      window.dispatchEvent(new CustomEvent('showToast', { detail: { message: 'Add medications before completing visit', type: 'info' } }));
      return;
    }
    window.dispatchEvent(new CustomEvent('showToast', { detail: { message: `Completed consultation for Token #${activePatient.token} (${activePatient.name})`, type: 'success' } }));
  };

  const titles = {
    'nurse-vitals': 'Nurse Triage & Patient Vitals Portal',
    'patient-archives': 'Patient Archives',
    'rx-pos': 'Prescription Builder (POS)',
    'inventory': 'Master Medicine Catalog',
    'lab-tests': 'Master Lab Tests Catalog' // <-- Add this
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between shrink-0 shadow-sm z-10">
      <div className="flex items-center gap-3 md:gap-4">

        {/* Hamburger Menu Button to open the Drawer */}
        <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors">
          <Menu className="w-5 h-5" />
        </button>

        <h2 className="text-base md:text-lg font-bold text-slate-800 tracking-tight">{titles[activeTab]}</h2>
      </div>

      {activeTab === 'rx-pos' && (
        <div className="flex items-center gap-2 md:gap-3">
          <button onClick={() => window.dispatchEvent(new CustomEvent('openCustomMedModal'))} className="hidden lg:flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-3 py-2 rounded-xl text-xs transition-all border border-slate-300">
            <PlusCircle className="w-4 h-4 text-teal-600" />
            <span>Add Drug to Catalog</span>
          </button>
          <button onClick={handlePrint} className="flex items-center gap-2 bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold px-3 py-2 rounded-xl text-xs transition-all border border-teal-200">
            <Printer className="w-4 h-4" />
            <span className="hidden md:inline">Print Prescription</span>
          </button>
          <button onClick={handleComplete} className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-3 md:px-4 py-2 rounded-xl text-xs shadow-sm transition-all">
            <CheckCircle2 className="w-4 h-4" />
            <span className="hidden md:inline">Complete Visit</span>
          </button>
        </div>
      )}
    </header>
  );
}