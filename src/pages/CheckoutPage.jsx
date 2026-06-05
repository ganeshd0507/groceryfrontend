import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiMapPin, FiClock, FiCreditCard, FiCheckCircle, FiLock, FiPlus, FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { cartSelector, clearCart } from '../redux/cartSlice';
import { selectUser, selectIsAuthenticated, addAddress, addOrderToHistory } from '../redux/authSlice';
import { apiService } from '../services/apiService';
import { useToast } from '../components/Toast';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const triggerToast = useToast();

  const cart = useSelector(cartSelector);
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // States
  const [selectedAddress, setSelectedAddress] = useState(user?.savedAddresses?.[0]?.id || '1');
  const [selectedSlot, setSelectedSlot] = useState('instant');
  const [selectedPayment, setSelectedPayment] = useState('upi');
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('');

  // New Address form
  const [newAddrTag, setNewAddrTag] = useState('Home');
  const [newAddrVal, setNewAddrVal] = useState('');

  const slots = [
    { id: 'instant', name: 'Instant Delivery', time: '10-15 mins', description: 'Fastest delivery mode' },
    { id: 'morning', name: 'Morning Slot', time: '7:00 AM - 9:00 AM', description: 'Deliver tomorrow morning' },
    { id: 'evening', name: 'Evening Slot', time: '6:00 PM - 8:00 PM', description: 'Deliver today evening' }
  ];

  const payments = [
    { id: 'upi', name: 'UPI (Paytm, Google Pay, PhonePe)', icon: FiCheckCircle },
    { id: 'card', name: 'Credit / Debit / ATM Card', icon: FiCreditCard },
    { id: 'cod', name: 'Cash on Delivery (COD)', icon: FiMapPin }
  ];

  const handleAddAddressSubmit = (e) => {
    e.preventDefault();
    if (!newAddrVal) return;
    dispatch(addAddress({ tag: newAddrTag, address: newAddrVal }));
    triggerToast('Address saved successfully!', 'success');
    setShowAddAddressModal(false);
    setNewAddrVal('');
  };

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      triggerToast('Please login to place an order!', 'warning');
      navigate('/login');
      return;
    }

    if (!selectedAddress && user?.savedAddresses?.length === 0) {
      triggerToast('Please select or add a delivery address!', 'warning');
      return;
    }

    setIsPlacingOrder(true);
    
    // Construct order details
    const activeAddrObj = user.savedAddresses.find(a => a.id === selectedAddress) || { address: 'DLF Phase 3, Gurgaon' };
    const activeSlotObj = slots.find(s => s.id === selectedSlot);
    const activePaymentObj = payments.find(p => p.id === selectedPayment);

    const orderPayload = {
      items: cart.items.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
      subtotal: cart.subtotal,
      delivery: cart.deliveryCharge,
      discount: cart.discountAmount,
      total: cart.total,
      address: activeAddrObj.address,
      paymentMethod: activePaymentObj.name,
      slot: activeSlotObj.name + ' (' + activeSlotObj.time + ')'
    };

    try {
      const response = await apiService.placeOrder(orderPayload);
      // Save order to history slice
      dispatch(addOrderToHistory(response));
      setPlacedOrderId(response.id);
      setIsPlacingOrder(false);
      setOrderSuccess(true);
      dispatch(clearCart());
    } catch {
      triggerToast('Failed to place order. Try again!', 'error');
      setIsPlacingOrder(false);
    }
  };

  if (cart.items.length === 0 && !orderSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center space-y-4 max-w-sm mx-auto">
        <FiLock className="w-12 h-12 text-slate-350" />
        <h2 className="text-xl font-black font-display">Checkout Locked</h2>
        <p className="text-xs text-slate-400">Add items to your basket and complete your address listings to open checkout.</p>
        <Link to="/products" className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-md">
          Go To Products
        </Link>
      </div>
    );
  }

  // If order is placed successfully
  if (orderSuccess) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 text-center flex flex-col items-center justify-center space-y-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-20 h-20 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 rounded-full flex items-center justify-center border border-emerald-500/20 shadow-md shadow-emerald-500/10"
        >
          <FiCheckCircle className="w-10 h-10 stroke-[2.5]" />
        </motion.div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black font-display">Order Accepted!</h2>
          <p className="text-xs text-slate-400 font-bold">Your order <span className="text-slate-900 dark:text-white font-black">{placedOrderId}</span> is being processed and will be delivered in 10 minutes.</p>
        </div>

        <div className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200/20 dark:border-slate-800/20 p-4 rounded-3xl text-left space-y-2 text-xs font-semibold">
          <p className="text-[10px] text-slate-400 font-bold uppercase">Estimated Delivery time</p>
          <p className="text-sm font-black text-emerald-600 dark:text-emerald-400 flex items-center">⚡ 9-12 minutes</p>
          <div className="h-px bg-slate-100 dark:bg-slate-800 my-2" />
          <p className="text-slate-500 dark:text-slate-400">Payment: {payments.find(p => p.id === selectedPayment)?.name}</p>
        </div>

        <div className="flex gap-4 w-full">
          <Link
            to="/dashboard"
            className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black shadow-md shadow-emerald-500/10 text-center"
          >
            Track Order
          </Link>
          <Link
            to="/"
            className="flex-1 py-3 bg-slate-150 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-2xl text-xs font-black text-center"
          >
            Keep Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-12 space-y-8 relative">
      
      {/* Loading Overlay */}
      {isPlacingOrder && (
        <div className="fixed inset-0 bg-slate-950/70 z-50 flex flex-col items-center justify-center space-y-4 text-white">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-black uppercase tracking-widest text-emerald-400">Processing Payment...</p>
        </div>
      )}

      <div>
        <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-slate-950 dark:text-white">Checkout Details</h1>
        <p className="text-xs text-slate-400 font-bold font-display">Confirm details and pay securely</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Columns: Address, slots, payment */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Address Section */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/30 dark:border-slate-800/30 rounded-3xl p-4 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-3">
              <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center">
                <FiMapPin className="mr-2 text-emerald-600" /> Deliver Address
              </h3>
              <button 
                onClick={() => {
                  if (isAuthenticated) {
                    setShowAddAddressModal(true);
                  } else {
                    triggerToast('Login first to manage addresses!', 'warning');
                    navigate('/login');
                  }
                }}
                className="text-xs font-black text-emerald-600 dark:text-emerald-400 hover:underline flex items-center"
              >
                <FiPlus className="mr-1" /> Add Address
              </button>
            </div>

            {!isAuthenticated ? (
              <p className="text-xs text-slate-400 font-bold">Please <Link to="/login" className="text-emerald-600 underline">login</Link> to view and manage delivery locations.</p>
            ) : user?.savedAddresses?.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-xs text-slate-400 font-semibold">No saved addresses found. Please add a new delivery address.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user?.savedAddresses?.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddress(addr.id)}
                    className={`p-4 rounded-2xl border text-xs font-semibold cursor-pointer transition-all flex flex-col justify-between space-y-2 select-none ${
                      selectedAddress === addr.id
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 text-emerald-800 dark:text-emerald-300'
                        : 'border-slate-200/50 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded-lg text-[9px] uppercase tracking-wider font-bold ${
                        selectedAddress === addr.id 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}>
                        {addr.tag}
                      </span>
                    </div>
                    <p className="leading-relaxed font-medium">{addr.address}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Delivery Slot Selector */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/30 dark:border-slate-800/30 rounded-3xl p-4 sm:p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-850 pb-3 flex items-center">
              <FiClock className="mr-2 text-emerald-600" /> Delivery Time Slot
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {slots.map((s) => (
                <div
                  key={s.id}
                  onClick={() => setSelectedSlot(s.id)}
                  className={`p-4 rounded-2xl border text-xs font-semibold cursor-pointer transition-all flex flex-col space-y-1 justify-between select-none ${
                    selectedSlot === s.id
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 text-emerald-800 dark:text-emerald-300'
                      : 'border-slate-200/50 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
                  }`}
                >
                  <div>
                    <h4 className="font-extrabold text-slate-800 dark:text-white">{s.name}</h4>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">{s.description}</p>
                  </div>
                  <p className="text-emerald-600 dark:text-emerald-400 font-black mt-2 text-sm">{s.time}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/30 dark:border-slate-800/30 rounded-3xl p-4 sm:p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-850 pb-3 flex items-center">
              <FiCreditCard className="mr-2 text-emerald-600" /> Secure Payment
            </h3>

            <div className="space-y-3">
              {payments.map((p) => {
                const Icon = p.icon;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPayment(p.id)}
                    className={`p-4 rounded-2xl border text-xs font-bold cursor-pointer flex items-center justify-between select-none transition-all ${
                      selectedPayment === p.id
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 text-emerald-850 dark:text-emerald-300'
                        : 'border-slate-200/50 dark:border-slate-800 text-slate-700 dark:text-slate-450 hover:bg-slate-50 dark:hover:bg-slate-850'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5 text-emerald-600" />
                      <span>{p.name}</span>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      selectedPayment === p.id ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'
                    }`}>
                      {selectedPayment === p.id && <span className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Side: Order Summary Card */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/30 dark:border-slate-800/30 rounded-3xl p-4 sm:p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-850 pb-3">Order Summary</h3>

            {/* Micro items list */}
            <div className="max-h-48 overflow-y-auto mb-3 space-y-3 pr-2">
              {cart.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                  <span className="truncate max-w-[150px]">{item.name} <span className="text-[10px] text-slate-400">x{item.quantity}</span></span>
                  <span className="text-slate-900 dark:text-white">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-2.5 text-xs font-semibold text-slate-400">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className="text-slate-700 dark:text-slate-350">₹{cart.subtotal}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Delivery charge</span>
                <span className="text-slate-700 dark:text-slate-350">{cart.deliveryCharge === 0 ? 'Free' : `₹${cart.deliveryCharge}`}</span>
              </div>
              
              {cart.discountAmount > 0 && (
                <div className="flex items-center justify-between text-emerald-600">
                  <span>Discount</span>
                  <span>-₹{cart.discountAmount}</span>
                </div>
              )}

              <div className="border-t border-slate-100 dark:border-slate-850 pt-3 flex items-center justify-between text-slate-900 dark:text-white font-bold">
                <span className="text-sm font-black">Total to pay</span>
                <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">₹{cart.total}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-sm font-black shadow-lg shadow-emerald-500/10 active:scale-95 block text-center uppercase tracking-wider"
            >
              Place Order - ₹{cart.total}
            </button>
            
            <p className="text-[10px] text-slate-400 text-center font-semibold">
              🔒 Safe & secure SSL checkout. 100% money back guarantee.
            </p>
          </div>
        </div>

      </div>

      {/* Add Address Modal */}
      {showAddAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-md border border-slate-100 dark:border-slate-800 shadow-2xl relative">
            <button 
              onClick={() => setShowAddAddressModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:opacity-80 transition-opacity"
            >
              <FiX className="h-5 w-5" />
            </button>
            
            <h3 className="text-lg font-bold font-display mb-4 text-slate-900 dark:text-white">Add Delivery Address</h3>
            
            <form onSubmit={handleAddAddressSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase">Address Type / Tag</label>
                <div className="flex gap-2.5 mt-1">
                  {['Home', 'Office', 'Other'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setNewAddrTag(t)}
                      className={`flex-1 py-2 text-xs font-bold rounded-xl border text-center transition-all ${
                        newAddrTag === t
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-850'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase">Full Address</label>
                <textarea
                  required
                  placeholder="Enter details like Flat/Door No., Block name, Area name, Landmark etc."
                  value={newAddrVal}
                  onChange={(e) => setNewAddrVal(e.target.value)}
                  className="w-full p-3.5 mt-1 bg-slate-100 dark:bg-slate-950 border border-transparent focus:border-emerald-500/30 rounded-2xl text-xs font-semibold outline-none focus:ring-4 focus:ring-emerald-500/10 min-h-[90px] text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-sm font-black shadow-md"
              >
                Save Delivery Location
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default CheckoutPage;
