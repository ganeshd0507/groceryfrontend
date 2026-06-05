import { createSlice } from '@reduxjs/toolkit';
import { MOCK_COUPONS } from '../services/mockData';

const initialState = {
  items: [], // { id, name, price, oldPrice, weight, image, quantity, category }
  appliedCoupon: null, // coupon object
  deliveryCharge: 25,
  subtotal: 0,
  discountAmount: 0,
  total: 0
};

const calculateTotals = (state) => {
  // Calculate subtotal
  state.subtotal = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Calculate discount based on coupon
  state.discountAmount = 0;
  state.deliveryCharge = state.items.length > 0 ? 25 : 0;

  if (state.appliedCoupon) {
    const coupon = state.appliedCoupon;
    
    if (state.subtotal >= (coupon.minCart || 0)) {
      if (coupon.discountType === 'fixed') {
        state.discountAmount = coupon.value;
      } else if (coupon.discountType === 'percentage') {
        const pctDiscount = Math.round((state.subtotal * coupon.value) / 100);
        state.discountAmount = coupon.maxDiscount ? Math.min(pctDiscount, coupon.maxDiscount) : pctDiscount;
      } else if (coupon.discountType === 'delivery') {
        state.deliveryCharge = 0;
      }
    } else {
      // Cart value dropped below min requirement, remove coupon
      state.appliedCoupon = null;
    }
  }

  // Calculate final total
  state.total = Math.max(0, state.subtotal + state.deliveryCharge - state.discountAmount);
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.items.find(item => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          oldPrice: product.oldPrice,
          weight: product.weight,
          image: product.image,
          category: product.category,
          quantity: quantity
        });
      }
      calculateTotals(state);
    },
    removeFromCart: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter(item => item.id !== id);
      calculateTotals(state);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item) {
        item.quantity = quantity;
        if (item.quantity <= 0) {
          state.items = state.items.filter(i => i.id !== id);
        }
      }
      calculateTotals(state);
    },
    applyCoupon: (state, action) => {
      const code = action.payload.toUpperCase();
      const coupon = MOCK_COUPONS.find(c => c.code === code);
      
      if (coupon) {
        if (state.subtotal >= (coupon.minCart || 0)) {
          state.appliedCoupon = coupon;
          calculateTotals(state);
        } else {
          throw new Error(`Minimum cart value of ₹${coupon.minCart} required to apply this coupon!`);
        }
      } else {
        throw new Error('Invalid coupon code!');
      }
    },
    removeCoupon: (state) => {
      state.appliedCoupon = null;
      calculateTotals(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.appliedCoupon = null;
      state.deliveryCharge = 0;
      state.subtotal = 0;
      state.discountAmount = 0;
      state.total = 0;
    }
  }
});

export const { addToCart, removeFromCart, updateQuantity, applyCoupon, removeCoupon, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
export const cartSelector = (state) => state.cart;
export const selectCartItemsCount = (state) => state.cart.items.reduce((acc, item) => acc + item.quantity, 0);
