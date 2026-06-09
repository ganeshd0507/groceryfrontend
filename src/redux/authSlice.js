import { createSlice } from '@reduxjs/toolkit';

const token = localStorage.getItem('token');
const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

const initialState = {
  user: user,
  token: token,
  isAuthenticated: !!token,
  isLoading: false,
  error: null,
  darkMode: localStorage.getItem('darkMode') === 'true',
  activeAddress: localStorage.getItem('activeAddress') || 'Gurgaon, DLF Phase 3',
  showLocationModal: false
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
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    updateProfile: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
    addAddress: (state, action) => {
      if (state.user) {
        const newAddress = {
          id: 'ADDR-' + Math.floor(100 + Math.random() * 900),
          ...action.payload
        };
        state.user.savedAddresses.push(newAddress);
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
    removeAddress: (state, action) => {
      if (state.user) {
        state.user.savedAddresses = state.user.savedAddresses.filter(addr => addr.id !== action.payload);
        localStorage.setItem('user', JSON.stringify(state.user));
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
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
    addOrderToHistory: (state, action) => {
      if (state.user) {
        if (!state.user.orders) {
          state.user.orders = [];
        }
        state.user.orders.unshift(action.payload);
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem('darkMode', state.darkMode);
    },
    setActiveAddress: (state, action) => {
      state.activeAddress = action.payload;
      localStorage.setItem('activeAddress', action.payload);
    },
    setShowLocationModal: (state, action) => {
      state.showLocationModal = action.payload;
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
  toggleDarkMode,
  setActiveAddress,
  setShowLocationModal
} = authSlice.actions;

export default authSlice.reducer;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectWishlist = (state) => state.auth.user ? state.auth.user.wishlist : [];
export const selectDarkMode = (state) => state.auth.darkMode;
export const selectActiveAddress = (state) => state.auth.activeAddress;
export const selectShowLocationModal = (state) => state.auth.showLocationModal;
