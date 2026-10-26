import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { CheckCircle, Info } from 'lucide-react';
import MedicineModal from './modals/MedicineModal';
import LabTestModal from './modals/LabTestModal';
import PrintModal from './modals/PrintModal'; // Ensure you create this!

export default function Modals() {
  const { activePatientId, patientsQueue } = useSelector(state => state.clinic);
  const activePatient = patientsQueue.find(p => p.id === activePatientId);
  
  const [toasts, setToasts] = useState([]);
  
  // Modal visibility states
  const [showMedModal, setShowMedModal] = useState(false);
  const [medFormData, setMedFormData] = useState(null);
  
  const [showLabModal, setShowLabModal] = useState(false);
  const [labFormData, setLabFormData] = useState(null);
  
  const [showPrint, setShowPrint] = useState(false);

  useEffect(() => {
    const handleToast = (e) => {
      const id = Date.now();
      setToasts(prev => [...prev, { id, ...e.detail }]);
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
    };

    const handleOpenMed = (e) => { setMedFormData(e.detail); setShowMedModal(true); };
    const handleOpenLab = (e) => { setLabFormData(e.detail); setShowLabModal(true); };
    const handleOpenPrint = () => setShowPrint(true);

    window.addEventListener('showToast', handleToast);
    window.addEventListener('openCustomMedModal', handleOpenMed);
    window.addEventListener('openLabTestModal', handleOpenLab);
    window.addEventListener('openPrintModal', handleOpenPrint);
    
    return () => {
      window.removeEventListener('showToast', handleToast);
      window.removeEventListener('openCustomMedModal', handleOpenMed);
      window.removeEventListener('openLabTestModal', handleOpenLab);
      window.removeEventListener('openPrintModal', handleOpenPrint);
    };
  }, []);

  return (
    <>
      {/* Toast Container */}
      <div className="fixed top-5 right-5 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className={`flex items-center gap-2.5 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl border-l-4 ${t.type === 'success' ? 'bg-slate-900 border-teal-500' : 'bg-slate-900 border-sky-500'} pointer-events-auto`}>
            {t.type === 'success' ? <CheckCircle className="w-4 h-4 text-teal-400" /> : <Info className="w-4 h-4 text-sky-400" />}
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      {/* Modals */}
      <MedicineModal isOpen={showMedModal} onClose={() => setShowMedModal(false)} initialData={medFormData} />
      <LabTestModal isOpen={showLabModal} onClose={() => setShowLabModal(false)} initialData={labFormData} />
      <PrintModal isOpen={showPrint} onClose={() => setShowPrint(false)} activePatient={activePatient} />
    </>
  );
}