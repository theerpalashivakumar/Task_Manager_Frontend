import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import taskService from '../../services/taskService';

export const fetchTasks = createAsyncThunk('tasks/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const res = await taskService.getTasks(params);
    return { tasks: res.data, pagination: res.pagination };
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to fetch tasks');
  }
});

export const fetchTaskById = createAsyncThunk('tasks/fetchById', async (id, { rejectWithValue }) => {
  try {
    const res = await taskService.getTaskById(id);
    return res.data; // { task, comments }
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to fetch task');
  }
});

export const createTask = createAsyncThunk('tasks/create', async (data, { rejectWithValue }) => {
  try {
    const res = await taskService.createTask(data);
    return res.data;
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to create task');
  }
});

export const updateTask = createAsyncThunk('tasks/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await taskService.updateTask(id, data);
    return res.data;
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to update task');
  }
});

export const updateTaskStatus = createAsyncThunk(
  'tasks/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const res = await taskService.updateTaskStatus(id, status);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update task status');
    }
  }
);

export const deleteTask = createAsyncThunk('tasks/delete', async (id, { rejectWithValue }) => {
  try {
    await taskService.deleteTask(id);
    return id;
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to delete task');
  }
});

export const addTaskComment = createAsyncThunk(
  'tasks/addComment',
  async ({ id, comment }, { rejectWithValue }) => {
    try {
      const res = await taskService.addComment(id, comment);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to post comment');
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: [],
    currentTask: null,
    comments: [],
    pagination: { page: 1, limit: 10, total: 0, totalPages: 1 },
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentTask: (state) => {
      state.currentTask = null;
      state.comments = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch List
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.tasks;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch by ID
      .addCase(fetchTaskById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTask = action.payload.task;
        state.comments = action.payload.comments || [];
      })
      .addCase(fetchTaskById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(createTask.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })

      // Update
      .addCase(updateTask.fulfilled, (state, action) => {
        state.currentTask = action.payload;
        const index = state.items.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })

      // Update Status
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        if (state.currentTask && state.currentTask._id === action.payload._id) {
          state.currentTask.status = action.payload.status;
        }
        const index = state.items.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) {
          state.items[index].status = action.payload.status;
        }
      })

      // Delete
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t._id !== action.payload);
        if (state.currentTask?._id === action.payload) {
          state.currentTask = null;
        }
      })

      // Comment
      .addCase(addTaskComment.fulfilled, (state, action) => {
        state.comments.push(action.payload);
      });
  },
});

export const { clearCurrentTask } = taskSlice.actions;
export default taskSlice.reducer;
