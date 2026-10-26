import { useState } from 'react';
import MedicineCatalog from './MedicineCatalog';
import LabTestCatalog from './LabTestCatalog';
import PrescriptionSlip from './PrescriptionSlip';
import { Activity, FlaskConical } from 'lucide-react';

export default function DoctorView() {
  const [activeTab, setActiveTab] = useState('medicines');

  return (
    <>
      <section className="flex-1 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col overflow-hidden">
        {/* Toggle Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 shrink-0">
          <button
            onClick={() => setActiveTab('medicines')}
            className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'medicines' ? 'bg-white text-teal-700 border-b-2 border-teal-600' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            <Activity className="w-4 h-4" /> Medicine Catalog
          </button>
          <button
            onClick={() => setActiveTab('tests')}
            className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'tests' ? 'bg-white text-teal-700 border-b-2 border-teal-600' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            <FlaskConical className="w-4 h-4" /> Lab Tests / Diagnostics
          </button>
        </div>

        {/* Content */}
        {activeTab === 'medicines' ? <MedicineCatalog /> : <LabTestCatalog />}
      </section>

      <PrescriptionSlip />
    </>
  );
}