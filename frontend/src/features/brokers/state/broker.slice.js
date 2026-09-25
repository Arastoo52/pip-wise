import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import brokerService from '../services/broker.service.js';
import { ALL_BROKERS_DATA } from '../data/brokersData.jsx';

// Async Thunks
export const fetchBrokers = createAsyncThunk(
  'brokers/fetchBrokers',
  async (params, { rejectWithValue }) => {
    try {
      const data = await brokerService.getAllBrokers(params);
      return data;
    } catch (error) {
      console.warn('Backend fetch failed, falling back to local static brokers:', error);
      return rejectWithValue(error.message || 'Failed to fetch brokers from API');
    }
  }
);

export const createBroker = createAsyncThunk(
  'brokers/createBroker',
  async (brokerData, { rejectWithValue }) => {
    try {
      const created = await brokerService.createBroker(brokerData);
      return created;
    } catch (error) {
      const message = error.message || error.response?.data?.message || 'Failed to create broker profile';
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  brokers: ALL_BROKERS_DATA,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  isCreating: false,
  createError: null,
  lastCreatedBroker: null,
};

export const brokerSlice = createSlice({
  name: 'brokers',
  initialState,
  reducers: {
    clearLastCreatedBroker: (state) => {
      state.lastCreatedBroker = null;
      state.createError = null;
    },
    resetBrokerStatus: (state) => {
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchBrokers
      .addCase(fetchBrokers.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchBrokers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload && action.payload.length > 0) {
          state.brokers = action.payload;
        }
      })
      .addCase(fetchBrokers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch brokers';
        // Keep fallback ALL_BROKERS_DATA already in state
      })

      // createBroker
      .addCase(createBroker.pending, (state) => {
        state.isCreating = true;
        state.createError = null;
      })
      .addCase(createBroker.fulfilled, (state, action) => {
        state.isCreating = false;
        state.lastCreatedBroker = action.payload;
        // Only push to public brokers state if broker is approved or active
        if (action.payload && (action.payload.status === 'approved' || action.payload.status === 'active')) {
          const exists = state.brokers.some((b) => b._id === action.payload._id || b.slug === action.payload.slug);
          if (!exists) {
            state.brokers = [...state.brokers, action.payload];
          }
        }
      })
      .addCase(createBroker.rejected, (state, action) => {
        state.isCreating = false;
        state.createError = action.payload || 'Failed to create broker';
      });
  },
});

export const { clearLastCreatedBroker, resetBrokerStatus } = brokerSlice.actions;
export default brokerSlice.reducer;
