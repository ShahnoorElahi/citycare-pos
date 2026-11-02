import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  medicines: [
    { id: 1, image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80", name: "Paracetamol 500mg", formula: "Acetaminophen", form: "Tablet", category: "Analgesic", categoryBg: "bg-rose-100 text-rose-800", dosage: "1-0-1 • 5 Days", freq: "1-0-1", duration: "5 Days", instructions: "After Meals" },
    { id: 2, image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&auto=format&fit=crop&q=80", name: "Amoxicillin 250mg", formula: "Amoxicillin Trihydrate", form: "Capsule", category: "Antibiotic", categoryBg: "bg-amber-100 text-amber-800", dosage: "1-1-1 • 7 Days", freq: "1-1-1", duration: "7 Days", instructions: "After Meals" },
    { id: 3, image: "https://images.unsplash.com/photo-1550572017-edd951b55104?w=500&auto=format&fit=crop&q=80", name: "Omeprazole 20mg", formula: "Omeprazole", form: "Capsule", category: "Antacid", categoryBg: "bg-sky-100 text-sky-800", dosage: "1-0-0 • 14 Days", freq: "1-0-0", duration: "14 Days", instructions: "30 mins Before Breakfast" },
    { id: 4, image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500&auto=format&fit=crop&q=80", name: "Ibuprofen 400mg", formula: "Ibuprofen", form: "Tablet", category: "Analgesic", categoryBg: "bg-rose-100 text-rose-800", dosage: "1-0-1 • 3 Days", freq: "1-0-1", duration: "3 Days", instructions: "With Food" },
    { id: 5, image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=500&auto=format&fit=crop&q=80", name: "Cetirizine 10mg", formula: "Cetirizine Dihydrochloride", form: "Tablet", category: "Antihistamine", categoryBg: "bg-purple-100 text-purple-800", dosage: "0-0-1 • 5 Days", freq: "0-0-1", duration: "5 Days", instructions: "At Bedtime" },
    { id: 6, image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500&auto=format&fit=crop&q=80", name: "Azithromycin 500mg", formula: "Azithromycin", form: "Tablet", category: "Antibiotic", categoryBg: "bg-amber-100 text-amber-800", dosage: "1-0-0 • 3 Days", freq: "1-0-0", duration: "3 Days", instructions: "Before Meals" },
    { id: 7, image: "https://images.unsplash.com/photo-1577401239170-897942555fb3?w=500&auto=format&fit=crop&q=80", name: "Multivitamin Plus", formula: "Essential Vitamins & Minerals", form: "Tablet", category: "Vitamins", categoryBg: "bg-emerald-100 text-emerald-800", dosage: "0-1-0 • 30 Days", freq: "0-1-0", duration: "30 Days", instructions: "After Lunch" },
    { id: 8, image: "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=500&auto=format&fit=crop&q=80", name: "Pantoprazole 40mg", formula: "Pantoprazole Sodium", form: "Tablet", category: "Antacid", categoryBg: "bg-sky-100 text-sky-800", dosage: "1-0-0 • 10 Days", freq: "1-0-0", duration: "10 Days", instructions: "Empty Stomach" }
  ],

  // 🔥 ADDED LAB TESTS HERE
  labTests: [
    { id: 901, name: 'Complete Blood Count (CBC)', category: 'Hematology', price: '$25', sample: 'Blood', desc: 'Measures RBCs, WBCs, and platelets.' },
    { id: 902, name: 'Lipid Profile', category: 'Biochemistry', price: '$40', sample: 'Blood', desc: 'Cholesterol, Triglycerides, HDL, LDL.' },
    { id: 903, name: 'Liver Function Test (LFT)', category: 'Biochemistry', price: '$35', sample: 'Blood', desc: 'Evaluates liver enzymes and proteins.' },
    { id: 904, name: 'Kidney Function Test (KFT)', category: 'Biochemistry', price: '$30', sample: 'Blood', desc: 'Urea, Creatinine, and electrolytes.' },
    { id: 905, name: 'Thyroid Profile (T3, T4, TSH)', category: 'Endocrinology', price: '$50', sample: 'Blood', desc: 'Checks thyroid hormone levels.' },
    { id: 906, name: 'Urine Routine & Microscopy', category: 'Pathology', price: '$15', sample: 'Urine', desc: 'Screens for infections or kidney issues.' },
    { id: 907, name: 'Chest X-Ray (PA View)', category: 'Radiology', price: '$60', sample: 'N/A', desc: 'Evaluates lungs and heart size.' },
    { id: 908, name: 'ECG / EKG', category: 'Cardiology', price: '$45', sample: 'N/A', desc: 'Records the electrical activity of the heart.' },
    { id: 909, name: 'HbA1c (Glycated Hemoglobin)', category: 'Biochemistry', price: '$55', sample: 'Blood', desc: 'Average blood sugar over 3 months.' },
  ],

  patientsQueue: [
    {
      id: "CC-9042", token: 101, name: "Rahul Sharma", age: 34, gender: "Male", date: "2026-10-25",
      bp: "120/80", sugar: 110, pulse: 72, weight: 70, height: 172, temp: 98.6,
      notes: "Mild fever and body pain since 2 days.",
      prescription: [
        { id: 1712000001, medId: 1, name: "Paracetamol 500mg", freq: "1-0-1", duration: "5 Days", instructions: "After Meals", status: "Active" },
        { id: 1712000002, medId: 4, name: "Ibuprofen 400mg", freq: "1-0-1", duration: "3 Days", instructions: "With Food", status: "Pending" },
        { id: 1712000003, medId: 5, name: "Cetirizine 10mg", freq: "0-0-1", duration: "5 Days", instructions: "At Bedtime", status: "Dispensed" },
        { id: 1712000004, medId: 8, name: "Pantoprazole 40mg", freq: "1-0-0", duration: "10 Days", instructions: "Empty Stomach", status: "Completed" }
      ]
    },
    {
      id: "CC-9043", token: 102, name: "Anita Desai", age: 45, gender: "Female", date: "2026-10-24",
      bp: "140/90", sugar: 160, pulse: 78, weight: 65, height: 158, temp: 98.4,
      notes: "Routine checkup for hypertension. Reports occasional dizziness.",
      prescription: [
        { id: 1712000005, medId: 3, name: "Omeprazole 20mg", freq: "1-0-0", duration: "14 Days", instructions: "30 mins Before Breakfast", status: "Completed" },
        { id: 1712000006, medId: 6, name: "Azithromycin 500mg", freq: "1-0-0", duration: "3 Days", instructions: "Before Meals", status: "Cancelled" },
        { id: 1712000007, medId: 7, name: "Multivitamin Plus", freq: "0-1-0", duration: "30 Days", instructions: "After Lunch", status: "Active" }
      ]
    },
    {
      id: "CC-9044", token: 103, name: "Vikram Singh", age: 29, gender: "Male", date: "2026-10-25",
      bp: "118/76", sugar: 95, pulse: 85, weight: 82, height: 180, temp: 98.9,
      notes: "Dry cough and sore throat for a week. No difficulty breathing.",
      prescription: [
        { id: 1712000008, medId: 2, name: "Amoxicillin 250mg", freq: "1-1-1", duration: "7 Days", instructions: "After Meals", status: "Active" },
        { id: 1712000009, medId: 1, name: "Paracetamol 500mg", freq: "1-0-1", duration: "3 Days", instructions: "After Meals", status: "Dispensed" },
        { id: 1712000010, medId: 5, name: "Cetirizine 10mg", freq: "0-0-1", duration: "5 Days", instructions: "At Bedtime", status: "Completed" }
      ]
    },
    {
      id: "CC-9045", token: 104, name: "Priya Patel", age: 62, gender: "Female", date: "2026-10-23",
      bp: "130/82", sugar: 210, pulse: 74, weight: 58, height: 152, temp: 98.2,
      notes: "Elevated fasting blood sugar. Needs adjustments to diabetes management.",
      prescription: [
        { id: 1712000011, medId: 7, name: "Multivitamin Plus", freq: "0-1-0", duration: "30 Days", instructions: "After Lunch", status: "Active" },
        { id: 1712000012, medId: 8, name: "Pantoprazole 40mg", freq: "1-0-0", duration: "10 Days", instructions: "Empty Stomach", status: "Pending" },
        { id: 1712000013, medId: 4, name: "Ibuprofen 400mg", freq: "1-0-1", duration: "3 Days", instructions: "With Food", status: "Cancelled" }
      ]
    },
    {
      id: "CC-9046", token: 105, name: "Arjun Mehta", age: 12, gender: "Male", date: "2026-10-25",
      bp: "105/70", sugar: 90, pulse: 90, weight: 38, height: 145, temp: 101.2,
      notes: "Acute ear pain and high fever since last night.",
      prescription: [
        { id: 1712000014, medId: 2, name: "Amoxicillin 250mg", freq: "1-1-1", duration: "7 Days", instructions: "After Meals", status: "Active" },
        { id: 1712000015, medId: 1, name: "Paracetamol 500mg", freq: "1-0-1", duration: "5 Days", instructions: "After Meals", status: "Active" },
        { id: 1712000016, medId: 3, name: "Omeprazole 20mg", freq: "1-0-0", duration: "5 Days", instructions: "Before Breakfast", status: "Dispensed" },
        { id: 1712000017, medId: 6, name: "Azithromycin 500mg", freq: "1-0-0", duration: "3 Days", instructions: "Before Meals", status: "Completed" }
      ]
    },
    {
      id: "CC-9055", token: 106, name: "Ravi Kumar", age: 50, gender: "Male", date: "2026-10-26",
      bp: "135/85", sugar: 120, pulse: 76, weight: 75, height: 170, temp: 98.5,
      notes: "Persistent joint pain in knees.",
      prescription: [
        { id: 1712000018, medId: 4, name: "Ibuprofen 400mg", freq: "1-0-1", duration: "5 Days", instructions: "After Meals", status: "Pending" },
        { id: 1712000019, medId: 7, name: "Multivitamin Plus", freq: "0-1-0", duration: "30 Days", instructions: "After Lunch", status: "Active" },
        { id: 1712000020, medId: 8, name: "Pantoprazole 40mg", freq: "1-0-0", duration: "10 Days", instructions: "Empty Stomach", status: "Completed" }
      ]
    },
    {
      id: "CC-9056", token: 107, name: "Meera Nair", age: 28, gender: "Female", date: "2026-10-26",
      bp: "110/70", sugar: 85, pulse: 80, weight: 55, height: 160, temp: 98.1,
      notes: "Seasonal allergies and skin rash.",
      prescription: [
        { id: 1712000021, medId: 5, name: "Cetirizine 10mg", freq: "0-0-1", duration: "10 Days", instructions: "At Bedtime", status: "Active" },
        { id: 1712000022, medId: 1, name: "Paracetamol 500mg", freq: "1-0-1", duration: "3 Days", instructions: "After Meals", status: "Dispensed" },
        { id: 1712000023, medId: 2, name: "Amoxicillin 250mg", freq: "1-1-1", duration: "5 Days", instructions: "After Meals", status: "Active" }
      ]
    },
    {
      id: "CC-9057", token: 108, name: "Suresh Menon", age: 65, gender: "Male", date: "2026-10-27",
      bp: "150/95", sugar: 180, pulse: 70, weight: 80, height: 175, temp: 98.7,
      notes: "Follow-up for diabetes and hypertension.",
      prescription: [
        { id: 1712000024, medId: 3, name: "Omeprazole 20mg", freq: "1-0-0", duration: "14 Days", instructions: "Before Breakfast", status: "Active" },
        { id: 1712000025, medId: 7, name: "Multivitamin Plus", freq: "0-1-0", duration: "30 Days", instructions: "After Lunch", status: "Pending" },
        { id: 1712000026, medId: 8, name: "Pantoprazole 40mg", freq: "1-0-0", duration: "10 Days", instructions: "Empty Stomach", status: "Cancelled" },
        { id: 1712000027, medId: 4, name: "Ibuprofen 400mg", freq: "1-0-1", duration: "3 Days", instructions: "With Food", status: "Completed" }
      ]
    }
  ],
  activePatientId: null,
};

const clinicSlice = createSlice({
  name: 'clinic',
  initialState,
  reducers: {
    saveVitals: (state, action) => {
      const { internalId, ...data } = action.payload;
      if (internalId) {
        const pt = state.patientsQueue.find(p => p.id === internalId);
        if (pt) Object.assign(pt, data);
      } else {
        state.patientsQueue.unshift({ ...data, prescription: [] });
      }
    },
    setActivePatient: (state, action) => { state.activePatientId = action.payload; },
    addToSlip: (state, action) => {
      const pt = state.patientsQueue.find(p => p.id === state.activePatientId);
      if (pt && !pt.prescription.some(i => i.medId === action.payload.medId)) pt.prescription.push(action.payload);
    },
    removeFromSlip: (state, action) => {
      const pt = state.patientsQueue.find(p => p.id === state.activePatientId);
      if (pt) pt.prescription = pt.prescription.filter(i => i.id !== action.payload);
    },
    updateSlipItem: (state, action) => {
      const pt = state.patientsQueue.find(p => p.id === state.activePatientId);
      if (pt) {
        const item = pt.prescription.find(i => i.id === action.payload.id);
        if (item) item[action.payload.field] = action.payload.value;
      }
    },
    clearPrescription: (state) => {
      const pt = state.patientsQueue.find(p => p.id === state.activePatientId);
      if (pt) pt.prescription = [];
    },

    // --- MEDICINE CRUD ---
    saveMedicine: (state, action) => {
      const { id, ...data } = action.payload;

      // Auto-assign categoryBg based on category
      let categoryBg = "bg-slate-100 text-slate-800";
      if (data.category === 'Antibiotic') categoryBg = "bg-amber-100 text-amber-800";
      if (data.category === 'Analgesic') categoryBg = "bg-rose-100 text-rose-800";
      if (data.category === 'Antacid') categoryBg = "bg-sky-100 text-sky-800";
      if (data.category === 'Antihistamine') categoryBg = "bg-purple-100 text-purple-800";
      if (data.category === 'Vitamins') categoryBg = "bg-emerald-100 text-emerald-800";

      // Auto-format dosage string
      const dosage = `${data.freq || '1-0-1'} • ${data.duration || '5 Days'}`;

      if (id) {
        const med = state.medicines.find(m => m.id === id);
        if (med) Object.assign(med, { ...data, categoryBg, dosage });
      } else {
        state.medicines.unshift({ ...data, id: Date.now(), categoryBg, dosage });
      }
    },
    deleteMedicine: (state, action) => {
      state.medicines = state.medicines.filter(m => m.id !== action.payload);
    },

    // 🔥 LAB TEST CRUD
    saveLabTest: (state, action) => {
      const { id, ...data } = action.payload;
      if (id) {
        const test = state.labTests.find(t => t.id === id);
        if (test) Object.assign(test, data);
      } else {
        state.labTests.unshift({ ...data, id: Date.now() });
      }
    },
    deleteLabTest: (state, action) => {
      state.labTests = state.labTests.filter(t => t.id !== action.payload);
    },
    addNewVisit: (state, action) => {
      console.log("🔍 addNewVisit called with ID:", action.payload);

      const oldPatient = state.patientsQueue.find(p => p.id === action.payload);
      console.log("🔍 Found old patient:", oldPatient?.name, "Date:", oldPatient?.date);

      if (oldPatient) {
        const todayStr = new Date().toISOString().split('T')[0];
        console.log("🔍 Today is:", todayStr);

        const alreadyExistsToday = state.patientsQueue.some(
          p => p.id === oldPatient.id && p.date === todayStr
        );
        console.log("🔍 Already exists today?", alreadyExistsToday);

        if (alreadyExistsToday) {
          const existing = state.patientsQueue.find(p => p.id === oldPatient.id && p.date === todayStr);
          return;
        }

        const newToken = Math.max(...state.patientsQueue.map(p => p.token || 0)) + 1;
        const newVisit = {
          id: oldPatient.id,
          token: newToken,
          name: oldPatient.name,
          age: oldPatient.age,
          gender: oldPatient.gender,
          date: todayStr,
          bp: '', sugar: '', pulse: '', weight: '', height: '', temp: '', notes: '',
          prescription: []
        };

        console.log("✅ Creating new visit:", newVisit);
        state.patientsQueue.unshift(newVisit);
      } else {
        console.log("❌ No old patient found with ID:", action.payload);
      }
    },
    markAsSentToDoctor: (state, action) => {
      const todayStr = new Date().toISOString().split('T')[0];
      const record = state.patientsQueue.find(
        (pt) => pt.id === action.payload && pt.date === todayStr
      );

      if (record) {
        record.status = 'with-doctor';
      }
    },
    completeVisit: (state) => {
      const todayStr = new Date().toISOString().split('T')[0];
      const pt = state.patientsQueue.find(
        p => p.id === state.activePatientId && p.date === todayStr
      );
      if (pt) pt.status = 'with-doctor';
      // move to next active queued patient so activePatient isn't stale
      const next = state.patientsQueue.find(
        p => p.date === todayStr && p.status !== 'with-doctor'
      );
      state.activePatientId = next ? next.id : null;
    },
  },
});

export const {
  saveVitals, setActivePatient, addToSlip, removeFromSlip,
  updateSlipItem, clearPrescription, saveMedicine, deleteMedicine,
  saveLabTest, deleteLabTest, addNewVisit, markAsSentToDoctor,
  completeVisit
} = clinicSlice.actions;

export default clinicSlice.reducer;