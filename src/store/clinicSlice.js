import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  medicines: [
    { id: 1, name: 'Paracetamol 500mg', generic: 'Acetaminophen', form: 'Tablet', category: 'Analgesic', freq: '1-0-1', duration: '5 Days', instructions: 'After Meals' },
    { id: 2, name: 'Amoxicillin 250mg', generic: 'Amoxicillin Trihydrate', form: 'Capsule', category: 'Antibiotic', freq: '1-1-1', duration: '7 Days', instructions: 'After Meals' },
    { id: 3, name: 'Omeprazole 20mg', generic: 'Omeprazole', form: 'Capsule', category: 'Antacid', freq: '1-0-0', duration: '14 Days', instructions: '30 mins Before Breakfast' },
    { id: 4, name: 'Ibuprofen 400mg', generic: 'Ibuprofen', form: 'Tablet', category: 'Analgesic', freq: '1-0-1', duration: '3 Days', instructions: 'With Food' },
    { id: 5, name: 'Cetirizine 10mg', generic: 'Cetirizine Dihydrochloride', form: 'Tablet', category: 'Antihistamine', freq: '0-0-1', duration: '5 Days', instructions: 'At Bedtime' },
    { id: 6, name: 'Azithromycin 500mg', generic: 'Azithromycin', form: 'Tablet', category: 'Antibiotic', freq: '1-0-0', duration: '3 Days', instructions: 'Before Meals' },
    { id: 7, name: 'Multivitamin Plus', generic: 'Essential Vitamins & Minerals', form: 'Tablet', category: 'Vitamins', freq: '0-1-0', duration: '30 Days', instructions: 'After Lunch' },
    { id: 8, name: 'Pantoprazole 40mg', generic: 'Pantoprazole Sodium', form: 'Tablet', category: 'Antacid', freq: '1-0-0', duration: '10 Days', instructions: 'Empty Stomach' }
  ],
  patientsQueue: [
    {
      id: 'CC-9042', token: 101, name: 'Rahul Sharma', age: 34, gender: 'Male',
      bp: '120/80', sugar: 110, pulse: 72, weight: 70, height: 172, temp: 98.6, notes: 'Mild fever and body pain since 2 days.',
      prescription: [
        { id: 1712000001, medId: 1, name: 'Paracetamol 500mg', freq: '1-0-1', duration: '5 Days', instructions: 'After Meals' },
        { id: 1712000002, medId: 2, name: 'Amoxicillin 250mg', freq: '1-1-1', duration: '7 Days', instructions: 'After Meals' }
      ]
    },
    {
      id: 'CC-9043', token: 102, name: 'Amina Khan', age: 28, gender: 'Female',
      bp: '115/75', sugar: 95, pulse: 68, weight: 58, height: 160, temp: 99.1, notes: 'Acidity, gastric pain and nausea.',
      prescription: [
        { id: 1712000003, medId: 3, name: 'Omeprazole 20mg', freq: '1-0-0', duration: '14 Days', instructions: '30 mins Before Breakfast' }
      ]
    }
  ],
  activePatientId: 'CC-9042',
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
    saveMedicine: (state, action) => {
      const { id, ...data } = action.payload;
      if (id) {
        const med = state.medicines.find(m => m.id === id);
        if (med) Object.assign(med, data);
      } else {
        state.medicines.unshift({ ...data, id: Date.now() });
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