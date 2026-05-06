import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as db from '../../db';
import type { Task, TaskStatus } from '../../types';

interface TasksState {
  items: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchTasks = createAsyncThunk<Task[]>('tasks/fetch', async () => {
  return db.listTasks();
});

export const createTask = createAsyncThunk<Task, Omit<Task, 'id' | 'createdAt'>>(
  'tasks/create',
  async (input) => {
    const task: Task = {
      ...input,
      id: `t_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      createdAt: Date.now(),
    };
    await db.insertTask(task);
    return task;
  }
);

export const setTaskStatus = createAsyncThunk<{ id: string; status: TaskStatus }, { id: string; status: TaskStatus }>(
  'tasks/setStatus',
  async ({ id, status }) => {
    await db.updateTaskStatus(id, status);
    return { id, status };
  }
);

export const updateTask = createAsyncThunk<Task, Task>('tasks/update', async (task) => {
  await db.updateTask(task);
  return task;
});

export const removeTask = createAsyncThunk<string, string>('tasks/remove', async (id) => {
  await db.deleteTask(id);
  return id;
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchTasks.fulfilled, (s, a) => {
        s.loading = false;
        s.items = a.payload;
      })
      .addCase(fetchTasks.rejected, (s, a) => {
        s.loading = false;
        s.error = a.error.message ?? 'Failed to load tasks';
      })
      .addCase(createTask.fulfilled, (s, a) => {
        s.items.push(a.payload);
        s.items.sort((x, y) => x.startsAt - y.startsAt);
      })
      .addCase(setTaskStatus.fulfilled, (s, a) => {
        const t = s.items.find((x) => x.id === a.payload.id);
        if (t) t.status = a.payload.status;
      })
      .addCase(updateTask.fulfilled, (s, a) => {
        const i = s.items.findIndex((x) => x.id === a.payload.id);
        if (i >= 0) s.items[i] = a.payload;
        s.items.sort((x, y) => x.startsAt - y.startsAt);
      })
      .addCase(removeTask.fulfilled, (s, a) => {
        s.items = s.items.filter((t) => t.id !== a.payload);
      });
  },
});

export default tasksSlice.reducer;
