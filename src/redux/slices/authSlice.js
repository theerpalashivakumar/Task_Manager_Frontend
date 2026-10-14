import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';

// Helper to guarantee both _id and id exist on user objects
const normalizeUser = (user) => {
  if (!user) return null;
  const id = user._id || user.id;
  return {
    ...user,
    _id: id,
    id: id,
  };
};

// Initialize from localStorage
const storedToken = localStorage.getItem('token');
let storedUser = null;
try {
  const userJson = localStorage.getItem('user');
  if (userJson) storedUser = normalizeUser(JSON.parse(userJson));
} catch (e) {
  localStorage.removeItem('user');
}

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const res = await authService.login(credentials);
    const user = normalizeUser(res.data.user);
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(user));
    return { ...res.data, user };
  } catch (error) {
    return rejectWithValue(error.message || 'Login failed');
  }
});

export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const res = await authService.register(userData);
    const user = normalizeUser(res.data.user);
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(user));
    return { ...res.data, user };
  } catch (error) {
    return rejectWithValue(error.message || 'Registration failed');
  }
});

export const fetchCurrentUser = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
  try {
    const res = await authService.getMe();
    const user = normalizeUser(res.data);
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to fetch user session');
  }
});

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  try {
    await authService.logout();
  } catch (e) {
    // Ignore backend logout error if already disconnected
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('explanation_token');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: storedUser,
    token: storedToken,
    isAuthenticated: Boolean(storedToken),
    loading: false,
    error: null,
  },
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Current User
    builder.addCase(fetchCurrentUser.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    });

    // Logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
