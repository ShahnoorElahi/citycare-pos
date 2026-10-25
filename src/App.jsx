import { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import NurseView from './components/NurseView';
import DoctorView from './components/DoctorView';
import InventoryView from './components/InventoryView';
import Modals from './components/Modals';

function MainApp() {
  const [activeTab, setActiveTab] = useState('rx-pos');

  useEffect(() => {
    const handleSwitchTab = (e) => setActiveTab(e.detail);
    window.addEventListener('switchTab', handleSwitchTab);
    return () => window.removeEventListener('switchTab', handleSwitchTab);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden text-slate-800 flex-col">
      <div className="flex h-screen overflow-hidden">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-100">
          <Header activeTab={activeTab} />
          <main id="view-nurse-vitals" className={`${activeTab !== 'nurse-vitals' ? 'hidden' : ''} flex-1 overflow-y-auto p-4 lg:p-6 space-y-6`}>
            <NurseView />
          </main>
          <main id="view-rx-pos" className={`${activeTab !== 'rx-pos' ? 'hidden' : ''} flex-1 flex flex-col lg:flex-row overflow-hidden p-4 gap-4`}>
            <DoctorView />
          </main>
          <main id="view-inventory" className={`${activeTab !== 'inventory' ? 'hidden' : ''} flex-1 overflow-y-auto p-6 space-y-6`}>
            <InventoryView />
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