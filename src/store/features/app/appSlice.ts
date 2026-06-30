import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/store/store';

interface AppMessage {
  type: 'success' | 'error' | 'warning' | 'info';
  content: string;
}

interface AppTheme {
  token: {
    colorPrimary: string;
  };
}

interface AppState {
  message: AppMessage | null;
  loading: boolean;
  theme: AppTheme;
}

const initialState: AppState = {
  message: null,
  loading: false,
  theme: {
    token: { colorPrimary: '#6366f1' },
  },
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setMessage: (state, action: PayloadAction<AppMessage | null>) => {
      state.message = action.payload;
    },
    clearMessage: (state) => {
      state.message = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setTheme: (state, action: PayloadAction<AppTheme>) => {
      state.theme = action.payload;
    },
    setColorPrimary: (state, action: PayloadAction<string>) => {
      state.theme.token.colorPrimary = action.payload;
    },
  },
});

export const { setMessage, clearMessage, setLoading, setTheme, setColorPrimary } = appSlice.actions;

export const selectMessage = (state: RootState) => state.app.message;
export const selectAppLoading = (state: RootState) => state.app.loading;
export const selectTheme = (state: RootState) => state.app.theme;

export default appSlice.reducer;
