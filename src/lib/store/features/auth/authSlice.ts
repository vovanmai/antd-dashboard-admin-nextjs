import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  currentUser: Record<string, any> | null;
  authenticated: boolean;
}

const initialState: AuthState = {
  currentUser: null,
  authenticated: false,
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
  },
});

// Export actions
export const { setCurrentUser } = authSlice.actions;

// Selectors
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.currentUser;
export const selectAuthenticated = (state: { auth: AuthState }) => state.auth.authenticated;


// Export reducer
export default authSlice.reducer;
