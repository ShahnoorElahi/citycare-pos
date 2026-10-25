import { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import NurseView from './components/NurseView';
import DoctorView from './components/DoctorView';
import InventoryView from './components/InventoryView';
import PatientArchives from './components/PatientArchives'; // <-- 1. Import here
import Modals from './components/Modals';

function MainApp() {
  const [activeTab, setActiveTab] = useState('rx-pos');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 

  useEffect(() => {
    const handleSwitchTab = (e) => {
      setActiveTab(e.detail);
      setIsSidebarOpen(false); 
    };
    window.addEventListener('switchTab', handleSwitchTab);
    return () => window.removeEventListener('switchTab', handleSwitchTab);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden text-slate-800 flex-col">
      <div className="flex h-screen overflow-hidden relative">
        
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />

        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-100 w-full">
          <Header 
            activeTab={activeTab} 
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
          />
          
          <main id="view-nurse-vitals" className={`${activeTab !== 'nurse-vitals' ? 'hidden' : ''} flex-1 overflow-y-auto p-4 lg:p-6 space-y-6`}>
            <NurseView />
          </main>
          
          <main id="view-rx-pos" className={`${activeTab !== 'rx-pos' ? 'hidden' : ''} flex-1 flex flex-col lg:flex-row overflow-hidden p-4 gap-4`}>
            <DoctorView />
          </main>
          
          <main id="view-inventory" className={`${activeTab !== 'inventory' ? 'hidden' : ''} flex-1 overflow-y-auto p-6 space-y-6`}>
            <InventoryView />
          </main>

          {/* 2. Add the new Patient Archives Tab */}
          <main id="view-patient-archives" className={`${activeTab !== 'patient-archives' ? 'hidden' : ''} flex-1 overflow-y-auto p-6 space-y-6`}>
            <PatientArchives />
          </main>

        </div>
      </div>
      <Modals />
    </div>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <MainApp />
    </Provider>
  );
}