import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import explanationService from '../../services/explanationService';
import { logoutUser } from './authSlice';

export const verifyExplanationPassword = createAsyncThunk(
  'ui/verifyExplanationPassword',
  async (password, { rejectWithValue }) => {
    try {
      const res = await explanationService.verifyPassword(password);
      sessionStorage.setItem('explanation_token', res.data.token);
      return res.data.token;
    } catch (error) {
      return rejectWithValue(error.message || 'Incorrect password. Access denied.');
    }
  }
);

export const fetchExplanationContent = createAsyncThunk(
  'ui/fetchExplanationContent',
  async (_, { rejectWithValue }) => {
    try {
      const res = await explanationService.getContent();
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch project explanation');
    }
  }
);

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    toasts: [],
    // Project Explanation Modal & Data - strictly locked by default
    isExplanationModalOpen: false,
    isExplanationUnlocked: false,
    explanationToken: null,
    explanationData: null,
    explanationLoading: false,
    explanationError: null,
  },
  reducers: {
    addToast: (state, action) => {
      const id = Date.now() + Math.random().toString();
      state.toasts.push({
        id,
        type: action.payload.type || 'info',
        message: action.payload.message,
      });
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    openExplanationModal: (state) => {
      state.isExplanationModalOpen = true;
      state.explanationError = null;
    },
    closeExplanationModal: (state) => {
      state.isExplanationModalOpen = false;
      state.explanationError = null;
    },
    lockExplanation: (state) => {
      sessionStorage.removeItem('explanation_token');
      state.isExplanationUnlocked = false;
      state.explanationToken = null;
      state.explanationData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Password verification
      .addCase(verifyExplanationPassword.pending, (state) => {
        state.explanationLoading = true;
        state.explanationError = null;
      })
      .addCase(verifyExplanationPassword.fulfilled, (state, action) => {
        state.explanationLoading = false;
        state.isExplanationUnlocked = true;
        state.explanationToken = action.payload;
        state.isExplanationModalOpen = false;
      })
      .addCase(verifyExplanationPassword.rejected, (state, action) => {
        state.explanationLoading = false;
        state.explanationError = action.payload;
      })

      // Fetch explanation content
      .addCase(fetchExplanationContent.pending, (state) => {
        state.explanationLoading = true;
      })
      .addCase(fetchExplanationContent.fulfilled, (state, action) => {
        state.explanationLoading = false;
        state.explanationData = action.payload;
      })
      .addCase(fetchExplanationContent.rejected, (state, action) => {
        state.explanationLoading = false;
        state.explanationError = action.payload;
      })

      // Lock on logout
      .addCase(logoutUser.fulfilled, (state) => {
        sessionStorage.removeItem('explanation_token');
        state.isExplanationUnlocked = false;
        state.explanationToken = null;
        state.explanationData = null;
        state.isExplanationModalOpen = false;
      });
  },
});

export const {
  addToast,
  removeToast,
  openExplanationModal,
  closeExplanationModal,
  lockExplanation,
} = uiSlice.actions;

export default uiSlice.reducer;
