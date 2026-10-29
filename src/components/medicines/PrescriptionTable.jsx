import React from 'react';
import { Calendar, Link as LinkIcon, ChevronDown, MoreVertical } from 'lucide-react';

// --- DATA STORAGE (Multiple Records) ---
const visitRecords = [
  {
    id: "record-1",
    date: "Oct 25, 2026",
    visitNumber: "Visit #6",
    visitId: "CC-9042",
    reason: "Mild fever and body pain since 2 days.",
    prescriptions: [
      {
        id: 1,
        name: "Paracetamol 500mg",
        type: "Tablet",
        badgeClass: "bg-[#D1FAE5] text-[#059669]",
        dosage: "1-0-1",
        duration: "5 Days",
        instructions: "After Meals",
        status: "Active"
      },
      {
        id: 2,
        name: "Ibuprofen 200mg",
        type: "Tablet",
        badgeClass: "bg-[#D1FAE5] text-[#059669]",
        dosage: "1-0-1",
        duration: "5 Days",
        instructions: "After Meals",
        status: "Active"
      },
      {
        id: 3,
        name: "Amoxicillin 250mg",
        type: "Capsule",
        badgeClass: "bg-[#FEF3C7] text-[#D97706]",
        dosage: "1-1-1",
        duration: "7 Days",
        instructions: "After Meals",
        status: "Active"
      },
      {
        id: 4,
        name: "Omeprazole 20mg",
        type: "Capsule",
        badgeClass: "bg-[#F3E8FF] text-[#9333EA]",
        dosage: "1-0-0",
        duration: "5 Days",
        instructions: "Before Meals",
        status: "Active"
      }
    ]
  },
  {
    id: "record-2",
    date: "Sep 12, 2026",
    visitNumber: "Visit #5",
    visitId: "CC-8811",
    reason: "Severe headache and dizziness.",
    prescriptions: [
      {
        id: 5,
        name: "Sumatriptan 50mg",
        type: "Tablet",
        badgeClass: "bg-[#D1FAE5] text-[#059669]",
        dosage: "1-0-0",
        duration: "3 Days",
        instructions: "As needed",
        status: "Completed"
      },
      {
        id: 6,
        name: "Domperidone 10mg",
        type: "Tablet",
        badgeClass: "bg-[#D1FAE5] text-[#059669]",
        dosage: "1-0-1",
        duration: "3 Days",
        instructions: "Before Meals",
        status: "Completed"
      }
    ]
  },
  {
    id: "record-3",
    date: "Aug 05, 2026",
    visitNumber: "Visit #4",
    visitId: "CC-8500",
    reason: "Routine checkup and seasonal allergy.",
    prescriptions: [
      {
        id: 7,
        name: "Cetirizine 10mg",
        type: "Tablet",
        badgeClass: "bg-[#D1FAE5] text-[#059669]",
        dosage: "0-0-1",
        duration: "10 Days",
        instructions: "After Meals",
        status: "Completed"
      }
    ]
  }
];

export default function PrescriptionView() {
  // Grid template for the right-side data columns
  const dataGridCols = "grid-cols-[2.5fr_1fr_1fr_1fr_1fr_40px]";

  return (
    <main className="flex-1 flex lg:flex-row flex-col p-4 gap-4 h-full overflow-hidden bg-slate-50" id="view-rx-pos">
      
      <div className="w-full min-h-screen bg-white p-8 font-sans flex justify-center items-start overflow-y-auto">
        <div className="w-full max-w-[1200px] border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          
          {/* --- MAIN HEADER (Sticky Top) --- */}
          <div className="grid grid-cols-[2fr_6fr] bg-[#F8FAFC] border-b border-gray-200 px-6 py-4 text-[#475569] font-semibold text-[13px] sticky top-0 z-10">
            {/* Left Header Section */}
            <div>Date & Visit Details</div>
            
            {/* Right Header Section */}
            <div className={`grid ${dataGridCols} pl-4`}>
              <div>Prescribed Medicines</div>
              <div className="text-center">Dosage & Frequency</div>
              <div className="text-center">Duration</div>
              <div className="text-center">Instructions</div>
              <div className="text-center">Status</div>
              <div></div>
            </div>
          </div>

          {/* --- RECORDS LIST --- */}
          <div className="flex flex-col">
            {visitRecords.map((record, recordIndex) => (
              <div 
                key={record.id} 
                // Adds a thicker border between distinct records, but not on the last one
                className={`grid grid-cols-[2fr_6fr] ${recordIndex !== visitRecords.length - 1 ? 'border-b-[6px] border-slate-100' : ''}`}
              >
                
                {/* --- LEFT COLUMN (Visit Details) --- */}
                <div className="p-6 border-r border-gray-200">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="bg-white border border-gray-200 p-2 rounded-lg text-slate-700">
                      <Calendar size={20} strokeWidth={2} />
                    </div>
                    
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1 cursor-pointer">
                        <span className="text-[#1E293B] font-semibold text-[15px]">{record.date}</span>
                        <ChevronDown size={16} className="text-slate-400 mt-0.5" />
                      </div>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[#64748B] text-[13px]">{record.visitNumber}</span>
                        <span className="bg-[#EEF2FF] text-[#4F46E5] text-[11px] font-medium px-2 py-0.5 rounded-md">
                          {record.visitId}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-[13px]">
                    <span className="text-[#64748B] block mb-1">Reason:</span>
                    <p className="text-[#334155] leading-relaxed">{record.reason}</p>
                  </div>
                </div>

                {/* --- RIGHT COLUMN (Prescriptions List) --- */}
                <div className="flex flex-col">
                  {record.prescriptions.map((med, medIndex) => (
                    <div 
                      key={med.id}
                      className={`grid ${dataGridCols} items-center px-4 py-5 
                        ${medIndex !== record.prescriptions.length - 1 ? 'border-b border-gray-100' : ''} 
                        hover:bg-slate-50 transition-colors`}
                    >
                      {/* Medicine */}
                      <div className="flex items-center gap-3 pl-2">
                        <LinkIcon size={16} strokeWidth={2.5} className="text-[#1E293B] font-bold" />
                        <span className="text-[#1E293B] font-semibold text-[14px]">{med.name}</span>
                        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${med.badgeClass}`}>
                          {med.type}
                        </span>
                      </div>

                      {/* Dosage */}
                      <div className="text-center text-[#475569] text-[14px]">{med.dosage}</div>
                      
                      {/* Duration */}
                      <div className="text-center text-[#475569] text-[14px]">{med.duration}</div>
                      
                      {/* Instructions */}
                      <div className="text-center text-[#475569] text-[14px]">{med.instructions}</div>
                      
                      {/* Status */}
                      <div className="flex justify-center">
                        <span className={`text-[12px] font-medium px-3 py-1 rounded-full w-max ${
                          med.status === 'Active' ? 'bg-[#D1FAE5] text-[#059669]' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {med.status}
                        </span>
                      </div>
                      
                      {/* Menu */}
                      <div className="flex justify-end pr-2">
                        <MoreVertical size={18} className="text-slate-400 cursor-pointer hover:text-slate-600" />
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}