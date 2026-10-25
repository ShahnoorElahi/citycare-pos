import { useState, useEffect } from 'react';
import { CheckCircle, Info } from 'lucide-react';

export const toast = (message, type = 'success') => {
  window.dispatchEvent(new CustomEvent('showToast', { detail: { message, type } }));
};

export default function Toast() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleToast = (e) => {
      const id = Date.now();
      setToasts(prev => [...prev, { id, ...e.detail }]);
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
    };
    window.addEventListener('showToast', handleToast);
    return () => window.removeEventListener('showToast', handleToast);
  }, []);

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className={`flex items-center gap-2.5 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl border-l-4 ${t.type === 'success' ? 'bg-slate-900 border-teal-500' : 'bg-slate-900 border-sky-500'} pointer-events-auto`}>
          {t.type === 'success' ? <CheckCircle className="w-4 h-4 text-teal-400" /> : <Info className="w-4 h-4 text-sky-400" />}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}