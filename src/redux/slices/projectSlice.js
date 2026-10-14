import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import projectService from '../../services/projectService';

export const fetchProjects = createAsyncThunk('projects/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const res = await projectService.getProjects(params);
    return { projects: res.data, pagination: res.pagination };
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to fetch projects');
  }
});

export const fetchProjectById = createAsyncThunk('projects/fetchById', async (id, { rejectWithValue }) => {
  try {
    const res = await projectService.getProjectById(id);
    return res.data;
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to fetch project details');
  }
});

export const createProject = createAsyncThunk('projects/create', async (data, { rejectWithValue }) => {
  try {
    const res = await projectService.createProject(data);
    return res.data;
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to create project');
  }
});

export const updateProject = createAsyncThunk(
  'projects/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await projectService.updateProject(id, data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update project');
    }
  }
);

export const deleteProject = createAsyncThunk('projects/delete', async (id, { rejectWithValue }) => {
  try {
    await projectService.deleteProject(id);
    return id;
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to delete project');
  }
});

export const toggleArchiveProject = createAsyncThunk('projects/archive', async (id, { rejectWithValue }) => {
  try {
    const res = await projectService.toggleArchive(id);
    return res.data;
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to update project archive state');
  }
});

const projectSlice = createSlice({
  name: 'projects',
  initialState: {
    items: [],
    currentProject: null,
    pagination: { page: 1, limit: 10, total: 0, totalPages: 1 },
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentProject: (state) => {
      state.currentProject = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch list
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.projects;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch by ID
      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProject = action.payload;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(createProject.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })

      // Update
      .addCase(updateProject.fulfilled, (state, action) => {
        state.currentProject = action.payload;
        const index = state.items.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })

      // Delete
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p._id !== action.payload);
        if (state.currentProject?._id === action.payload) {
          state.currentProject = null;
        }
      });
  },
});

export const { clearCurrentProject } = projectSlice.actions;
export default projectSlice.reducer;
