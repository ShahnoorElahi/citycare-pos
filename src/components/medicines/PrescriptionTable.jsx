import React from 'react';
import { useSelector } from 'react-redux';
import { Calendar, Link as LinkIcon, ChevronDown, MoreVertical } from 'lucide-react';

// Helper for pill form colors
const getFormBadgeColor = (form) => {
  switch (form?.toLowerCase()) {
    case 'tablet': return 'bg-[#D1FAE5] text-[#059669]'; 
    case 'capsule': return 'bg-[#FEF3C7] text-[#D97706]'; 
    case 'syrup': return 'bg-[#F3E8FF] text-[#9333EA]'; 
    default: return 'bg-slate-100 text-slate-600'; 
  }
};

// 🔥 Helper for distinct status colors
const getStatusBadge = (status) => {
  switch (status?.toLowerCase()) {
    case 'active':
      return 'bg-[#D1FAE5] text-[#059669] border border-[#A7F3D0]'; // Green
    case 'completed':
      return 'bg-gray-100 text-gray-600 border border-gray-200'; // Gray
    case 'pending':
      return 'bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]'; // Amber
    case 'dispensed':
      return 'bg-[#DBEAFE] text-[#2563EB] border border-[#BFDBFE]'; // Blue
    case 'cancelled':
      return 'bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA]'; // Red
    default:
      return 'bg-gray-100 text-gray-600 border border-gray-200';
  }
};

export default function PrescriptionView(prop) {
  // const rawPatientsQueue = useSelector((state) => state.clinic.patientsQueue);
  const rawPatientsQueue = prop.sortedRecords;
  const medicines = useSelector((state) => state.clinic.medicines);

  const patientsQueue = Array.from(
    new Map(rawPatientsQueue.map(item => [`${item.id}-${item.date}`, item])).values()
  );

  const dataGridCols = "grid-cols-[2.5fr_1fr_1fr_1fr_1fr_40px]";

  const getMedicineForm = (medId, medName) => {
    const med = medicines.find(m => m.id === medId) || medicines.find(m => m.name === medName);
    return med ? med.form : "Tablet"; 
  };

  return (
    <main className="flex-1 flex lg:flex-row flex-col p-4 gap-4 h-full overflow-hidden bg-slate-50" id="view-rx-pos">
      <div className="w-full min-h-screen bg-white p-8 font-sans flex justify-center items-start overflow-y-auto">
        <div className="w-full max-w-[1200px] border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          
          <div className="grid grid-cols-[2fr_6fr] bg-[#F8FAFC] border-b border-gray-200 px-6 py-4 text-[#475569] font-semibold text-[13px] sticky top-0 z-10">
            <div>Date & Visit Details</div>
            <div className={`grid ${dataGridCols} pl-4`}>
              <div>Prescribed Medicines</div>
              <div className="text-center">Dosage & Frequency</div>
              <div className="text-center">Duration</div>
              <div className="text-center">Instructions</div>
              <div className="text-center">Status</div>
              <div></div>
            </div>
          </div>

          <div className="flex flex-col">
            {patientsQueue.map((patient, patientIndex) => {
              const formattedDate = new Date(patient.date).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
              });

              if (!patient.prescription || patient.prescription.length === 0) return null;

              return (
                <div 
                  key={`${patient.id}-${patient.date}-${patientIndex}`} 
                  className={`grid grid-cols-[2fr_6fr] ${patientIndex !== patientsQueue.length - 1 ? 'border-b-[6px] border-slate-100' : ''}`}
                >
                  <div className="p-6 border-r border-gray-200">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="bg-white border border-gray-200 p-2 rounded-lg text-slate-700">
                        <Calendar size={20} strokeWidth={2} />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1 cursor-pointer">
                          <span className="text-[#1E293B] font-semibold text-[15px]">{formattedDate}</span>
                          <ChevronDown size={16} className="text-slate-400 mt-0.5" />
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[#64748B] text-[13px]">Visit #{patient.token}</span>
                          <span className="bg-[#EEF2FF] text-[#4F46E5] text-[11px] font-medium px-2 py-0.5 rounded-md">
                            {patient.id}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-[13px]">
                      <span className="text-[#64748B] block mb-1">Reason:</span>
                      <p className="text-[#334155] leading-relaxed">{patient.notes || "No notes provided."}</p>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center">
                    {patient.prescription.map((item, medIndex) => {
                      const form = getMedicineForm(item.medId, item.name);
                      const badgeColor = getFormBadgeColor(form);
                      const status = item.status || "Active";
                      const statusColor = getStatusBadge(status);

                      return (
                        <div 
                          key={item.id || medIndex}
                          className={`grid ${dataGridCols} items-center px-4 py-4
                            ${medIndex !== patient.prescription.length - 1 ? 'border-b border-gray-100' : ''} 
                            hover:bg-slate-50 transition-colors`}
                        >
                          <div className="flex items-center gap-3 pl-2">
                            <LinkIcon size={16} strokeWidth={2.5} className="text-[#1E293B] font-bold" />
                            <span className="text-[#1E293B] font-semibold text-[14px]">{item.name}</span>
                            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${badgeColor}`}>
                              {form}
                            </span>
                          </div>

                          <div className="text-center text-[#475569] text-[14px]">{item.freq}</div>
                          <div className="text-center text-[#475569] text-[14px]">{item.duration}</div>
                          <div className="text-center text-[#475569] text-[14px]">{item.instructions}</div>
                          
                          <div className="flex justify-center">
                            <span className={`text-[12px] font-medium px-3 py-1 rounded-full w-max ${statusColor}`}>
                              {status}
                            </span>
                          </div>
                          
                          <div className="flex justify-end pr-2">
                            <MoreVertical size={18} className="text-slate-400 cursor-pointer hover:text-slate-600" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}