import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from '../../services/userService';

export const fetchUsers = createAsyncThunk('users/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const res = await userService.getUsers(params);
    return { users: res.data, pagination: res.pagination };
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to fetch users');
  }
});

export const updateUserRole = createAsyncThunk(
  'users/updateRole',
  async ({ id, role }, { rejectWithValue }) => {
    try {
      const res = await userService.updateRole(id, role);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update user role');
    }
  }
);

export const toggleUserStatus = createAsyncThunk('users/toggleStatus', async (id, { rejectWithValue }) => {
  try {
    const res = await userService.toggleStatus(id);
    return res.data;
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to toggle user status');
  }
});

const userSlice = createSlice({
  name: 'users',
  initialState: {
    items: [],
    pagination: { page: 1, limit: 20, total: 0, totalPages: 1 },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.users;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        const index = state.items.findIndex((u) => u._id === action.payload._id);
        if (index !== -1) {
          state.items[index].role = action.payload.role;
        }
      })
      .addCase(toggleUserStatus.fulfilled, (state, action) => {
        const index = state.items.findIndex((u) => u._id === action.payload._id);
        if (index !== -1) {
          state.items[index].isActive = action.payload.isActive;
        }
      });
  },
});

export default userSlice.reducer;
