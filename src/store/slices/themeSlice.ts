import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ThemeName } from '../../constants/Colors';

const STORAGE_KEY = '@taskapp:theme';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  mode: ThemeMode;
  resolved: ThemeName;
  systemScheme: ThemeName;
  hydrated: boolean;
}

const initialState: ThemeState = {
  mode: 'system',
  resolved: 'light',
  systemScheme: 'light',
  hydrated: false,
};

export const loadThemeMode = createAsyncThunk<ThemeMode>('theme/load', async () => {
  const v = await AsyncStorage.getItem(STORAGE_KEY);
  if (v === 'light' || v === 'dark' || v === 'system') return v;
  return 'system';
});

export const persistThemeMode = createAsyncThunk<ThemeMode, ThemeMode>(
  'theme/persist',
  async (mode) => {
    await AsyncStorage.setItem(STORAGE_KEY, mode);
    return mode;
  }
);

function resolve(mode: ThemeMode, system: ThemeName): ThemeName {
  return mode === 'system' ? system : mode;
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setSystemScheme(state, action: PayloadAction<ThemeName>) {
      state.systemScheme = action.payload;
      state.resolved = resolve(state.mode, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadThemeMode.fulfilled, (state, action) => {
        state.mode = action.payload;
        state.resolved = resolve(action.payload, state.systemScheme);
        state.hydrated = true;
      })
      .addCase(persistThemeMode.fulfilled, (state, action) => {
        state.mode = action.payload;
        state.resolved = resolve(action.payload, state.systemScheme);
      });
  },
});

export const { setSystemScheme } = themeSlice.actions;
export default themeSlice.reducer;
