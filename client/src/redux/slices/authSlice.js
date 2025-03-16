import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Helper function to get the auth token from localStorage
const getAuthToken = () => localStorage.getItem('token');

// Async Thunks
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/register', userData);
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/login', userData);
      localStorage.setItem('token', response.data.token);
      return { user: response.data.user, token: response.data.token };
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchProfile = createAsyncThunk(
  'auth/profile',
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get('/api/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err) {
      console.error('Fetch profile error:', err.response?.data || err.message);
      return rejectWithValue(err.response?.data || 'Failed to fetch profile');
    }
  }
);

export const fetchUserOnLoad = createAsyncThunk(
  'auth/fetchUserOnLoad',
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get('/api/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err) {
      console.error('Fetch profile error:', err.response?.data || err.message);
      return rejectWithValue(err.response?.data || 'Failed to fetch profile');
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/forgot-password', { email });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, newPassword }, { rejectWithValue }) => {
    try {
      const authToken = getAuthToken();
      const response = await axios.post(
        '/api/reset-password',
        { token, newPassword },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const setup2FA = createAsyncThunk(
  'auth/setup2FA',
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.get('/api/setup-2fa', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const verify2FA = createAsyncThunk(
  'auth/verify2FA',
  async ({ token }, { rejectWithValue }) => {
    try {
      const authToken = getAuthToken();
      const response = await axios.post(
        '/api/verify-2fa',
        { token },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,
    requires2FA: false, // Added to handle 2FA flow
    message: null,
    secret: null,
    qrCode: null,
    is2FAVerified: false,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      state.user = null;
      state.isAuthenticated = false;
      state.is2FAVerified = false;
      state.requires2FA = false; // Reset requires2FA on logout
    },
    resetError: (state) => {
      state.error = null; // Reset error state
    },
  },
  extraReducers: (builder) => {
    builder
      // Register User
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Registration failed';
      })

      // Login User
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.requires2FA = false; // Reset requires2FA on new login attempt
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.requires2FA = false; // Reset requires2FA on successful login
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Login failed';
        state.isAuthenticated = false;
        // Set requires2FA to true if the error is '2FA code is required'
        if (action.payload?.error === '2FA code is required') {
          state.requires2FA = true;
        } else {
          state.requires2FA = false;
        }
      })

      // Verify 2FA
      .addCase(verify2FA.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(verify2FA.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.is2FAVerified = true; // Mark 2FA as verified
        state.requires2FA = false; // Reset requires2FA after successful verification
      })
      .addCase(verify2FA.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to verify 2FA';
        state.is2FAVerified = false;
      })

      // Fetch Profile
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch profile';
        state.isAuthenticated = false;
      })

      // Fetch User on App Load
      .addCase(fetchUserOnLoad.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOnLoad.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchUserOnLoad.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch profile';
        state.isAuthenticated = false;
      })

      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to send reset link';
      })

      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to reset password';
      })

      // Setup 2FA
      .addCase(setup2FA.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setup2FA.fulfilled, (state, action) => {
        state.loading = false;
        state.secret = action.payload.secret;
        state.qrCode = action.payload.qrCode;
      })
      .addCase(setup2FA.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to setup 2FA';
      });
  },
});

export const { logout, resetError } = authSlice.actions;
export default authSlice.reducer;
