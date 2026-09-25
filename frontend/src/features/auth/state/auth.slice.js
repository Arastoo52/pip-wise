import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../services/auth.service.js";

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem("pipwise_user");
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getMe();
      const user = response.data?.user;
      if (user) {
        try {
          localStorage.setItem("pipwise_user", JSON.stringify(user));
        } catch (e) {}
      }
      return user;
    } catch (error) {
      if (error?.statusCode === 401 || error?.statusCode === 403) {
        try {
          localStorage.removeItem("pipwise_token");
          localStorage.removeItem("pipwise_user");
        } catch (e) {}
      }
      return rejectWithValue(error);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      if (response.data?.requiresOtp) {
        return {
          requiresOtp: true,
          email: response.data.email || credentials.email,
          cooldownSeconds: response.data.cooldownSeconds || 3,
          previewOtp: response.data.previewOtp,
        };
      }
      const user = response.data?.user;
      const token = response.data?.token;
      if (token) {
        try { localStorage.setItem("pipwise_token", token); } catch (e) {}
      }
      if (user) {
        try { localStorage.setItem("pipwise_user", JSON.stringify(user)); } catch (e) {}
      }
      return { user };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.register(credentials);
      if (response.data?.requiresOtp) {
        return {
          requiresOtp: true,
          email: response.data.email || credentials.email,
          cooldownSeconds: response.data.cooldownSeconds || 3,
          previewOtp: response.data.previewOtp,
        };
      }
      const user = response.data?.user;
      const token = response.data?.token;
      if (token) {
        try { localStorage.setItem("pipwise_token", token); } catch (e) {}
      }
      if (user) {
        try { localStorage.setItem("pipwise_user", JSON.stringify(user)); } catch (e) {}
      }
      return { user };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const verifyOtpCode = createAsyncThunk(
  "auth/verifyOtpCode",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await authService.verifyOtp({ email, otp });
      const user = response.data?.user;
      const token = response.data?.token;
      if (token) {
        try { localStorage.setItem("pipwise_token", token); } catch (e) {}
      }
      if (user) {
        try { localStorage.setItem("pipwise_user", JSON.stringify(user)); } catch (e) {}
      }
      return user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const resendOtpCode = createAsyncThunk(
  "auth/resendOtpCode",
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await authService.resendOtp({ email });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      try {
        localStorage.removeItem("pipwise_token");
        localStorage.removeItem("pipwise_user");
      } catch (e) {}
      return null;
    } catch (error) {
      try {
        localStorage.removeItem("pipwise_token");
        localStorage.removeItem("pipwise_user");
      } catch (e) {}
      return rejectWithValue(error.message);
    }
  }
);

const storedUser = getStoredUser();

const initialState = {
  user: storedUser,
  isAuthenticated: !!storedUser,
  loading: false,
  isInitialChecking: true,
  error: null,
  isAuthModalOpen: false,
  authModalMode: "login",
  pendingOtpEmail: null,
  pendingVerifiedUser: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    openAuthModal: (state, action) => {
      state.isAuthModalOpen = true;
      state.authModalMode = action.payload || "login";
      state.error = null;
    },
    closeAuthModal: (state) => {
      state.isAuthModalOpen = false;
      state.error = null;
    },
    switchAuthMode: (state, action) => {
      state.authModalMode = action.payload;
      state.error = null;
    },
    setPendingOtpEmail: (state, action) => {
      state.pendingOtpEmail = action.payload;
    },
    completeOtpLogin: (state, action) => {
      state.user = action.payload || state.pendingVerifiedUser;
      state.isAuthenticated = true;
      state.pendingVerifiedUser = null;
      state.pendingOtpEmail = null;
      state.isAuthModalOpen = false;
      state.authModalMode = "login";
      state.error = null;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.isInitialChecking = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isInitialChecking = false;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isInitialChecking = false;
        if (
          action.payload?.statusCode === 401 ||
          action.payload?.statusCode === 403 ||
          !localStorage.getItem("pipwise_token")
        ) {
          state.user = null;
          state.isAuthenticated = false;
        }
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.requiresOtp) {
          state.pendingOtpEmail = action.payload.email;
          state.authModalMode = "otp";
          state.error = null;
          return;
        }
        state.user = action.payload?.user || action.payload;
        state.isAuthenticated = true;
        state.isAuthModalOpen = false;
        state.pendingOtpEmail = null;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to login";
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.requiresOtp) {
          state.pendingOtpEmail = action.payload.email;
          state.authModalMode = "otp";
          state.error = null;
          return;
        }
        state.user = action.payload?.user || action.payload;
        state.isAuthenticated = true;
        state.isAuthModalOpen = false;
        state.pendingOtpEmail = null;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create account";
      })
      // Keep modal open during verifyOtpCode.fulfilled so the full 2s animation + 1s pause plays!
      .addCase(verifyOtpCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtpCode.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingVerifiedUser = action.payload;
        state.error = null;
      })
      .addCase(verifyOtpCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Invalid 4-digit OTP code";
      })
      .addCase(resendOtpCode.rejected, (state, action) => {
        state.error = action.payload || "Failed to resend OTP";
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
      });
  },
});

export const {
  openAuthModal,
  closeAuthModal,
  switchAuthMode,
  setPendingOtpEmail,
  completeOtpLogin,
  clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;
