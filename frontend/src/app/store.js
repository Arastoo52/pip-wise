import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/state/auth.slice.js';
import brokerReducer from '../features/brokers/state/broker.slice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    brokers: brokerReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
