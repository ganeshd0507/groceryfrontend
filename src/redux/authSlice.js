import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null, // { name, email, phone, savedAddresses: [], wishlist: [], orders: [] }
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  darkMode: false // Add UI preference here for simple global state access
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    updateProfile: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    addAddress: (state, action) => {
      if (state.user) {
        const newAddress = {
          id: 'ADDR-' + Math.floor(100 + Math.random() * 900),
          ...action.payload
        };
        state.user.savedAddresses.push(newAddress);
      }
    },
    removeAddress: (state, action) => {
      if (state.user) {
        state.user.savedAddresses = state.user.savedAddresses.filter(addr => addr.id !== action.payload);
      }
    },
    toggleWishlist: (state, action) => {
      if (state.user) {
        const id = action.payload;
        const exists = state.user.wishlist.includes(id);
        if (exists) {
          state.user.wishlist = state.user.wishlist.filter(wId => wId !== id);
        } else {
          state.user.wishlist.push(id);
        }
      }
    },
    addOrderToHistory: (state, action) => {
      if (state.user) {
        if (!state.user.orders) {
          state.user.orders = [];
        }
        state.user.orders.unshift(action.payload);
      }
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    }
  }
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateProfile,
  addAddress,
  removeAddress,
  toggleWishlist,
  addOrderToHistory,
  toggleDarkMode
} = authSlice.actions;

export default authSlice.reducer;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectWishlist = (state) => state.auth.user ? state.auth.user.wishlist : [];
export const selectDarkMode = (state) => state.auth.darkMode;
