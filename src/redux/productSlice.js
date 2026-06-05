import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  categories: [],
  loading: false,
  error: null,
  filters: {
    category: 'all',
    search: '',
    minPrice: 0,
    maxPrice: 200,
    rating: 0,
    onlyInStock: false
  },
  sortBy: 'default' // 'default', 'price-asc', 'price-desc', 'rating-desc'
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProductsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    setProductsSuccess: (state, action) => {
      state.loading = false;
      state.items = action.payload;
    },
    setProductsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCategoriesSuccess: (state, action) => {
      state.categories = action.payload;
    },
    updateFilter: (state, action) => {
      const { key, value } = action.payload;
      state.filters[key] = value;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.sortBy = 'default';
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    addProductLocal: (state, action) => {
      state.items.unshift(action.payload);
    },
    updateProductLocal: (state, action) => {
      const index = state.items.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteProductLocal: (state, action) => {
      state.items = state.items.filter(p => p.id !== action.payload);
    }
  }
});

export const {
  setProductsStart,
  setProductsSuccess,
  setProductsFailure,
  setCategoriesSuccess,
  updateFilter,
  resetFilters,
  setSortBy,
  addProductLocal,
  updateProductLocal,
  deleteProductLocal
} = productSlice.actions;

export default productSlice.reducer;

// Selector to get filtered and sorted products
export const selectFilteredProducts = (state) => {
  const { items, filters, sortBy } = state.products;

  let filtered = [...items];

  // Apply search query
  if (filters.search) {
    const query = filters.search.toLowerCase();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.description.toLowerCase().includes(query)
    );
  }

  // Apply category filter
  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter(p => p.category === filters.category);
  }

  // Apply price range
  filtered = filtered.filter(p => p.price >= filters.minPrice && p.price <= filters.maxPrice);

  // Apply rating filter
  if (filters.rating > 0) {
    filtered = filtered.filter(p => p.rating >= filters.rating);
  }

  // Apply stock filter
  if (filters.onlyInStock) {
    filtered = filtered.filter(p => p.inStock);
  }

  // Apply sorting
  if (sortBy === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating-desc') {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  return filtered;
};
