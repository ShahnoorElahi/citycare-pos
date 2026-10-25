import { configureStore } from '@reduxjs/toolkit';
import clinicReducer from './clinicSlice';

export const store = configureStore({
  reducer: {
    clinic: clinicReducer,
  },
});