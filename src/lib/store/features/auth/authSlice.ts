import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  currentUser: Record<string, any> | null;
  authenticated: boolean;
  justLoggedIn: boolean;
  justLoggedOut: boolean;
}

const initialState: AuthState = {
  currentUser: null,
  authenticated: false,
  justLoggedIn: false,
  justLoggedOut: false,
};

// Tạo slice
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<Record<string, any> | null>) => {
      state.currentUser = action.payload;
      state.authenticated = action.payload !== null;
    },
    setJustLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.justLoggedIn = action.payload;
    },
    setJustLoggedOut: (state, action: PayloadAction<boolean>) => {
      state.justLoggedOut = action.payload;
    },
  },
});

// Export actions
export const { setCurrentUser, setJustLoggedIn, setJustLoggedOut } = authSlice.actions;

// Selectors
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.currentUser;
export const selectAuthenticated = (state: { auth: AuthState }) => state.auth.authenticated;
export const selectJustLoggedIn = (state: { auth: AuthState }) => state.auth.justLoggedIn;
export const selectJustLoggedOut = (state: { auth: AuthState }) => state.auth.justLoggedOut;


// Export reducer
export default authSlice.reducer;
