import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as db from '../../db';
import type { Project } from '../../types';

interface ProjectsState {
  items: Project[];
  loading: boolean;
  error: string | null;
}

const initialState: ProjectsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchProjects = createAsyncThunk<Project[]>('projects/fetch', async () => {
  return db.listProjects();
});

export const createProject = createAsyncThunk<Project, Omit<Project, 'id' | 'createdAt'>>(
  'projects/create',
  async (input) => {
    const project: Project = {
      ...input,
      id: `p_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      createdAt: Date.now(),
    };
    await db.insertProject(project);
    return project;
  }
);

export const updateProject = createAsyncThunk<Project, Project>('projects/update', async (project) => {
  await db.updateProject(project);
  return project;
});

export const removeProject = createAsyncThunk<string, string>('projects/remove', async (id) => {
  await db.deleteProject(id);
  return id;
});

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchProjects.fulfilled, (s, a) => {
        s.loading = false;
        s.items = a.payload;
      })
      .addCase(fetchProjects.rejected, (s, a) => {
        s.loading = false;
        s.error = a.error.message ?? 'Failed to load projects';
      })
      .addCase(createProject.fulfilled, (s, a) => {
        s.items.unshift(a.payload);
      })
      .addCase(updateProject.fulfilled, (s, a) => {
        const i = s.items.findIndex((x) => x.id === a.payload.id);
        if (i >= 0) s.items[i] = a.payload;
      })
      .addCase(removeProject.fulfilled, (s, a) => {
        s.items = s.items.filter((p) => p.id !== a.payload);
      });
  },
});

export default projectsSlice.reducer;
