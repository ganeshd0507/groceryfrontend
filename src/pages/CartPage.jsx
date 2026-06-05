import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiTag, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  cartSelector, updateQuantity, removeFromCart, 
  applyCoupon, removeCoupon, clearCart 
} from '../redux/cartSlice';
import { MOCK_COUPONS } from '../services/mockData';
import { useToast } from '../components/Toast';

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const triggerToast = useToast();

  const cart = useSelector(cartSelector);
  const [couponCode, setCouponCode] = useState('');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponCode) return;
    try {
      dispatch(applyCoupon(couponCode));
      triggerToast('Coupon applied successfully!', 'success');
      setCouponCode('');
    } catch (err) {
      triggerToast(err.message || 'Failed to apply coupon', 'error');
    }
  };

  const handleApplyClick = (code) => {
    try {
      dispatch(applyCoupon(code));
      triggerToast('Coupon applied successfully!', 'success');
    } catch (err) {
      triggerToast(err.message || 'Failed to apply coupon', 'error');
    }
  };

  const handleRemoveCouponClick = () => {
    dispatch(removeCoupon());
    triggerToast('Coupon removed', 'info');
  };

  const handleIncrement = (id, q) => {
    dispatch(updateQuantity({ id, quantity: q + 1 }));
  };

  const handleDecrement = (id, q) => {
    dispatch(updateQuantity({ id, quantity: q - 1 }));
  };

  const handleRemove = (id, name) => {
    dispatch(removeFromCart(id));
    triggerToast(`Removed ${name} from basket`, 'info');
  };

  if (cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 max-w-md mx-auto text-center space-y-6">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="w-24 h-24 bg-emerald-50 dark:bg-slate-900 rounded-full flex items-center justify-center text-emerald-600 shadow-sm"
        >
          <FiShoppingBag className="w-12 h-12 stroke-[1.5]" />
        </motion.div>
        <div>
          <h2 className="text-xl sm:text-2xl font-black font-display">Your basket is empty</h2>
          <p className="text-xs text-slate-400 font-bold mt-1">Add items to start shopping and get fast delivery in minutes.</p>
        </div>
        <Link
          to="/products"
          className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-sm font-black transition-all shadow-lg shadow-emerald-500/10 active:scale-95 block w-full text-center"
        >
          Shop Fresh Groceries
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-12 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-slate-950 dark:text-white">Shopping Basket</h1>
        <p className="text-xs text-slate-400 font-bold">Review items, apply coupons, and checkout securely</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/30 dark:border-slate-800/30 rounded-3xl p-4 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-4">
              <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">Items in Basket ({cart.items.length})</h3>
              <button 
                onClick={() => {
                  dispatch(clearCart());
                  triggerToast('Basket cleared', 'info');
                }}
                className="text-xs font-black text-rose-500 hover:opacity-80 transition-opacity"
              >
                Clear All
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-850">
              <AnimatePresence>
                {cart.items.map((item) => (
                  <motion.div
                    key={item.id}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 gap-4"
                  >
                    <div className="flex items-center space-x-4 w-full sm:w-auto truncate">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-2xl border bg-slate-50 dark:bg-slate-950 border-slate-200/40 dark:border-slate-800" />
                      <div className="truncate">
                        <Link to={`/product/${item.id}`} className="text-sm font-black text-slate-800 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 truncate block">
                          {item.name}
                        </Link>
                        <p className="text-[11px] text-slate-400 font-bold">{item.weight}</p>
                        <p className="text-xs font-black text-emerald-600 dark:text-emerald-400 mt-0.5">₹{item.price} each</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 mt-2 sm:mt-0 select-none">
                      {/* Quantity Selector */}
                      <div className="bg-slate-100 dark:bg-slate-950 rounded-xl py-1 px-1.5 flex items-center space-x-4 border border-slate-200/10 font-bold text-xs">
                        <button 
                          onClick={() => handleDecrement(item.id, item.quantity)} 
                          className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-900 transition-colors"
                        >
                          <FiMinus className="h-3.5 w-3.5 stroke-[3]" />
                        </button>
                        <span className="font-black text-sm text-slate-900 dark:text-white">{item.quantity}</span>
                        <button 
                          onClick={() => handleIncrement(item.id, item.quantity)} 
                          className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-900 transition-colors"
                        >
                          <FiPlus className="h-3.5 w-3.5 stroke-[3]" />
                        </button>
                      </div>

                      {/* Total and Trash */}
                      <div className="flex items-center space-x-4">
                        <span className="text-sm font-black text-slate-900 dark:text-white">₹{item.price * item.quantity}</span>
                        <button 
                          onClick={() => handleRemove(item.id, item.name)}
                          className="text-slate-400 hover:text-rose-500 p-2 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-all"
                        >
                          <FiTrash2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right Side: Coupons & Bill Breakdown */}
        <div className="space-y-6">
          
          {/* Coupon Code Section */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/30 dark:border-slate-800/30 rounded-3xl p-4 sm:p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">Coupons</h3>
            
            {cart.appliedCoupon ? (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/20 rounded-2xl flex items-center justify-between text-emerald-800 dark:text-emerald-300">
                <div className="flex items-center space-x-2.5">
                  <FiTag className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider">{cart.appliedCoupon.code} Applied</p>
                    <p className="text-[10px] text-slate-400">{cart.appliedCoupon.description}</p>
                  </div>
                </div>
                <button 
                  onClick={handleRemoveCouponClick}
                  className="p-1 rounded bg-white dark:bg-slate-900 shadow hover:opacity-85"
                >
                  <FiX className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter Promo Code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-950 border border-transparent focus:border-emerald-500/30 rounded-xl text-xs font-bold uppercase outline-none focus:ring-4 focus:ring-emerald-500/10 text-slate-900 dark:text-white"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-md shadow-emerald-500/10 active:scale-95"
                >
                  APPLY
                </button>
              </form>
            )}

            {/* Active Coupon suggestions list */}
            {!cart.appliedCoupon && (
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/50">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Available Coupons</p>
                {MOCK_COUPONS.map((coupon) => (
                  <button
                    key={coupon.code}
                    onClick={() => handleApplyClick(coupon.code)}
                    className="w-full p-2.5 text-left border border-dashed border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 rounded-2xl group flex items-start justify-between transition-all"
                  >
                    <div>
                      <p className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider group-hover:text-emerald-600 transition-colors">
                        {coupon.code}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{coupon.description}</p>
                    </div>
                    <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 group-hover:underline">APPLY</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Pricing Summary */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/30 dark:border-slate-800/30 rounded-3xl p-4 sm:p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-850 pb-3">Bill Details</h3>
            
            <div className="space-y-2.5 text-xs font-bold text-slate-500">
              <div className="flex items-center justify-between">
                <span>Items Subtotal</span>
                <span className="text-slate-900 dark:text-white">₹{cart.subtotal}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Delivery Charges</span>
                {cart.deliveryCharge === 0 ? (
                  <span className="text-emerald-600 dark:text-emerald-400 uppercase font-black">Free</span>
                ) : (
                  <span className="text-slate-900 dark:text-white">₹{cart.deliveryCharge}</span>
                )}
              </div>
              
              {cart.discountAmount > 0 && (
                <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Promo Discount</span>
                  <span>-₹{cart.discountAmount}</span>
                </div>
              )}

              <div className="border-t border-slate-100 dark:border-slate-850 pt-3 flex items-center justify-between text-slate-900 dark:text-white">
                <span className="text-sm font-black">Total Bill</span>
                <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">₹{cart.total}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-sm font-black shadow-lg shadow-emerald-500/10 active:scale-95 block text-center"
            >
              Proceed to Checkout
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};

export default CartPage;
