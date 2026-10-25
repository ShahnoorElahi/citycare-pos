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
  patientsQueue: [
  {
    "id": "CC-9042",
    "token": 101,
    "name": "Rahul Sharma",
    "age": 34,
    "gender": "Male",
    "bp": "120/80",
    "sugar": 110,
    "pulse": 72,
    "weight": 70,
    "height": 172,
    "temp": 98.6,
    "notes": "Mild fever and body pain since 2 days.",
    "prescription": [
      {
        "id": 1712000001,
        "medId": 1,
        "name": "Paracetamol 500mg",
        "freq": "1-0-1",
        "duration": "5 Days",
        "instructions": "After Meals"
      }
    ]
  },
  {
    "id": "CC-9043",
    "token": 102,
    "name": "Anita Desai",
    "age": 45,
    "gender": "Female",
    "bp": "140/90",
    "sugar": 160,
    "pulse": 78,
    "weight": 65,
    "height": 158,
    "temp": 98.4,
    "notes": "Routine checkup for hypertension. Reports occasional dizziness.",
    "prescription": [
      {
        "id": 1712000002,
        "medId": 2,
        "name": "Amlodipine 5mg",
        "freq": "1-0-0",
        "duration": "30 Days",
        "instructions": "Before Meals"
      }
    ]
  },
  {
    "id": "CC-9044",
    "token": 103,
    "name": "Vikram Singh",
    "age": 29,
    "gender": "Male",
    "bp": "118/76",
    "sugar": 95,
    "pulse": 85,
    "weight": 82,
    "height": 180,
    "temp": 98.9,
    "notes": "Dry cough and sore throat for a week. No difficulty breathing.",
    "prescription": [
      {
        "id": 1712000003,
        "medId": 3,
        "name": "Cough Syrup (Dextromethorphan)",
        "freq": "1-1-1",
        "duration": "5 Days",
        "instructions": "After Meals"
      }
    ]
  },
  {
    "id": "CC-9045",
    "token": 104,
    "name": "Priya Patel",
    "age": 62,
    "gender": "Female",
    "bp": "130/82",
    "sugar": 210,
    "pulse": 74,
    "weight": 58,
    "height": 152,
    "temp": 98.2,
    "notes": "Elevated fasting blood sugar. Needs adjustments to diabetes management.",
    "prescription": [
      {
        "id": 1712000004,
        "medId": 4,
        "name": "Metformin 500mg",
        "freq": "1-0-1",
        "duration": "30 Days",
        "instructions": "With Meals"
      }
    ]
  },
  {
    "id": "CC-9046",
    "token": 105,
    "name": "Arjun Mehta",
    "age": 12,
    "gender": "Male",
    "bp": "105/70",
    "sugar": 90,
    "pulse": 90,
    "weight": 38,
    "height": 145,
    "temp": 101.2,
    "notes": "Acute ear pain and high fever since last night.",
    "prescription": [
      {
        "id": 1712000005,
        "medId": 5,
        "name": "Amoxicillin 250mg",
        "freq": "1-1-1",
        "duration": "7 Days",
        "instructions": "After Meals"
      }
    ]
  }
],
  activePatientId: 'CC-9042',
};

const clinicSlice = createSlice({
  name: 'clinic',
  initialState,
  reducers: {
    // ... (Keep existing saveVitals, setActivePatient, addToSlip, etc.)
    saveVitals: (state, action) => {
      const { internalId, ...data } = action.payload;
      if (internalId) {
        const pt = state.patientsQueue.find(p => p.id === internalId);
        if (pt) Object.assign(pt, data);
      } else {
        state.patientsQueue.unshift({ ...data, prescription: [] });
        state.activePatientId = data.id;
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
    
    // --- UPDATED MEDICINE CRUD ---
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
    }
  },
});

export const {
  saveVitals, setActivePatient, addToSlip, removeFromSlip,
  updateSlipItem, clearPrescription, saveMedicine, deleteMedicine
} = clinicSlice.actions;

export default clinicSlice.reducer;