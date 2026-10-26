import { Printer, X } from 'lucide-react';

export default function PrintModal({ isOpen, onClose, activePatient }) {
    if (!isOpen || !activePatient) return null;

    return (
        <>
            {/* 🔥 INLINE PRINT STYLES (Forces single page & hides app shell) */}
<style>{`
  @media print {
    /* 1. Hide the entire app body */
    body, html {
      height: auto !important;
      overflow: visible !important;
      background: white !important;
    }

    /* 2. Hide all content in the root */
    body #root * {
      visibility: hidden;
    }

    /* 3. Force the outer containers to allow full height printing */
    body #root > div,
    body #root > div > div,
    body #root > div > div > div {
      height: auto !important;
      max-height: none !important;
      overflow: visible !important;
      display: block !important;
      background: transparent !important;
      box-shadow: none !important;
      padding: 0 !important;
      margin: 0 !important;
    }

    /* 4. Show ONLY the print modal and its children */
    body #print-modal,
    body #print-modal * {
      visibility: visible !important;
    }

    /* 5. Position the print modal correctly at the top */
    body #print-modal {
      position: absolute !important;
      left: 0 !important;
      top: 0 !important;
      width: 100% !important;
      height: auto !important;
      background: white !important;
      padding: 0 !important;
      margin: 0 !important;
      box-shadow: none !important;
      border: none !important;
      z-index: 9999 !important;
    }

    /* 6. Hide the dark action bar */
    body #print-modal .no-print {
      display: none !important;
    }

    /* 7. Ensure the white area prints fully without cropping */
    body #printable-area {
      display: block !important;
      padding: 0 !important;
      margin: 0 !important;
      width: 100% !important;
      height: auto !important;
      overflow: visible !important;
      page-break-inside: avoid !important;
    }

    @page {
      size: A4 portrait;
      margin: 12mm;
    }
  }
`}</style>

            <div id="print-modal" className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden my-auto border border-slate-300">

                    {/* Modal Action Bar */}
                    <div className="no-print p-4 bg-slate-900 text-white flex items-center justify-between">
                        <span className="font-bold text-sm flex items-center gap-2">
                            <Printer className="w-4 h-4 text-teal-400" /> Print Prescription Preview
                        </span>
                        <div className="flex items-center gap-2">
                            <button onClick={() => window.print()} className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 shadow-sm">
                                <Printer className="w-3.5 h-3.5" /> Send to Printer
                            </button>
                            <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Printable Area */}
                    <div className="p-8 bg-white text-slate-800 space-y-5" id="printable-area">

                        {/* Header */}
                        <div className="flex items-start justify-between border-b-2 border-teal-600 pb-4">
                            <div>
                                <h1 className="text-2xl font-black text-slate-900 tracking-tight">CITYCARE CLINIC</h1>
                                <p className="text-xs font-semibold text-teal-700">Multi-Specialty Healthcare & Diagnostics</p>
                                <p className="text-[11px] text-slate-500">123 Health Avenue, Medical District • Ph: +1 (555) 019-2834</p>
                            </div>
                            <div className="text-right text-xs">
                                <p className="font-bold text-slate-900 text-sm">Dr. Sarah Jenkins</p>
                                <p className="text-slate-600">MBBS, MD (Internal Medicine)</p>
                                <p className="text-slate-500 text-[11px]">Reg No: PMC-894021</p>
                            </div>
                        </div>

                        {/* Patient Info */}
                        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs">
                            <div className="grid grid-cols-4 gap-2 border-b border-slate-200 pb-2">
                                <div><span className="text-slate-400 block font-medium text-[9px] uppercase">Token No</span><span className="font-black text-teal-700 text-sm">#{activePatient.token}</span></div>
                                <div><span className="text-slate-400 block font-medium text-[9px] uppercase">Patient Name</span><span className="font-bold text-slate-900">{activePatient.name}</span></div>
                                <div><span className="text-slate-400 block font-medium text-[9px] uppercase">Age / Gender</span><span className="font-bold text-slate-900">{activePatient.age} Yrs / {activePatient.gender}</span></div>
                                <div><span className="text-slate-400 block font-medium text-[9px] uppercase">PID / Date</span><span className="font-mono font-semibold text-slate-800 text-[11px]">{activePatient.id} • {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span></div>
                            </div>
                            <div className="grid grid-cols-5 gap-2 pt-0.5 text-[11px]">
                                <div><span className="text-slate-400 block text-[9px]">Blood Pressure:</span><span className="font-bold text-slate-800">{activePatient.bp} mmHg</span></div>
                                <div><span className="text-slate-400 block text-[9px]">Blood Sugar:</span><span className="font-bold text-slate-800">{activePatient.sugar} mg/dL</span></div>
                                <div><span className="text-slate-400 block text-[9px]">Pulse / HR:</span><span className="font-bold text-slate-800">{activePatient.pulse} bpm</span></div>
                                <div><span className="text-slate-400 block text-[9px]">Weight / Height:</span><span className="font-bold text-slate-800">{activePatient.weight} kg / {activePatient.height} cm</span></div>
                                <div><span className="text-slate-400 block text-[9px]">Body Temp:</span><span className="font-bold text-slate-800">{activePatient.temp} °F</span></div>
                            </div>
                        </div>

                        {/* Prescription Table */}
                        <div className="space-y-3 min-h-[280px]">
                            <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
                                <span className="text-2xl font-serif font-black text-teal-700">Rx</span>
                                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">(Prescribed Medications & Tests)</span>
                            </div>
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[9px]">
                                        <th className="py-2 w-8">#</th><th className="py-2">Medicine / Test Name</th><th className="py-2">Frequency</th><th className="py-2">Duration</th><th className="py-2 text-right">Instructions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {activePatient.prescription?.map((item, i) => {
                                        const isLabTest = item.instructions === 'Lab Test';

                                        return (
                                            <tr key={item.id} className="border-b border-slate-100">
                                                <td className="py-2.5 font-bold text-slate-400">{i + 1}</td>
                                                <td className="py-2.5 font-bold text-slate-800">{item.name}</td>

                                                <td className="py-2.5 font-semibold text-slate-700">
                                                    {isLabTest ? '—' : item.freq}
                                                </td>

                                                <td className="py-2.5 text-slate-600">
                                                    {isLabTest ? '—' : item.duration}
                                                </td>

                                                <td className="py-2.5 text-right text-slate-600 italic">{item.instructions}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Advice */}
                        <div className="pt-3 border-t border-slate-200">
                            <p className="text-xs font-bold text-slate-700">Advice / Special Instructions:</p>
                            <p className="text-xs text-slate-600 italic mt-1">
                                {document.getElementById('doctor-advice')?.value || 'Take medication as prescribed. Drink warm water and follow up if needed.'}
                            </p>
                        </div>

                        {/* Footer */}
                        <div className="pt-6 flex items-end justify-between text-xs">
                            <div className="text-[10px] text-slate-400">
                                <p>Vitals logged by Nurse Triage Station.</p>
                                <p>Computer Generated Medical Slip • CityCare</p>
                            </div>
                            <div className="text-center">
                                <div className="h-10 border-b border-slate-400 mb-1 flex items-end justify-center">
                                    <span className="font-serif italic text-slate-700 text-base font-bold">Dr. S. Jenkins</span>
                                </div>
                                <p className="font-bold text-slate-800">Doctor's Signature</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}