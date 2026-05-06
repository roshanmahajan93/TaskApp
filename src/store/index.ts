import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import theme from './slices/themeSlice';
import tasks from './slices/tasksSlice';
import projects from './slices/projectsSlice';

export const store = configureStore({
  reducer: { theme, tasks, projects },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
