import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  FiShoppingBag, FiMapPin, FiHeart, FiSettings, 
  FiLogOut, FiPlus, FiTrash2 
} from 'react-icons/fi';
import { 
  selectUser, selectIsAuthenticated, logout, 
  updateProfile, addAddress, removeAddress 
} from '../redux/authSlice';
import { apiService } from '../services/apiService';
import { useToast } from '../components/Toast';
import ProductCard from '../components/ProductCard';

const DashboardPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const triggerToast = useToast();

  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { items: allProducts } = useSelector((state) => state.products);

  // Search parameters for tabs
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'orders';

  // State
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [showAddressModal, setShowAddressModal] = useState(false);

  // Profile Edit fields
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileEmail, setProfileEmail] = useState(user?.email || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');

  // Address fields
  const [newTag, setNewTag] = useState('Home');
  const [newVal, setNewVal] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      triggerToast('Please sign in to view dashboard!', 'warning');
      navigate('/login');
    }
  }, [isAuthenticated, navigate, triggerToast]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) return;
      setOrdersLoading(true);
      try {
        const orderData = await apiService.getOrders();
        // Concat any live checkouts created in Redux auth slice
        const userSpecificOrders = user?.orders ? [...user.orders, ...orderData] : orderData;
        setOrders(userSpecificOrders);
      } catch {
        triggerToast('Failed to load orders history', 'error');
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, user?.orders, triggerToast]);

  if (!isAuthenticated || !user) return null;

  const handleProfileSave = (e) => {
    e.preventDefault();
    dispatch(updateProfile({ name: profileName, email: profileEmail, phone: profilePhone }));
    triggerToast('Profile updated successfully!', 'success');
  };

  const handleLogout = () => {
    dispatch(logout());
    triggerToast('Logged out successfully', 'info');
    navigate('/');
  };

  const handleAddAddressSubmit = (e) => {
    e.preventDefault();
    if (!newVal) return;
    dispatch(addAddress({ tag: newTag, address: newVal }));
    triggerToast('Address saved successfully!', 'success');
    setShowAddressModal(false);
    setNewVal('');
  };

  const handleDeleteAddress = (id) => {
    dispatch(removeAddress(id));
    triggerToast('Address removed', 'info');
  };

  // Get wishlist items
  const wishlistProducts = allProducts.filter(p => user.wishlist.includes(p.id));

  return (
    <div className="pb-12 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-slate-950 dark:text-white">Customer Account</h1>
        <p className="text-xs text-slate-400 font-bold font-display">Manage profile settings, saved addresses, and track shipments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Left Sidebar Menu */}
        <aside className="md:col-span-1 bg-white dark:bg-slate-900 border border-slate-200/30 dark:border-slate-800/30 p-4 rounded-3xl h-fit space-y-1.5 shadow-sm">
          {[
            { id: 'orders', label: 'Order History', icon: FiShoppingBag },
            { id: 'addresses', label: 'Saved Addresses', icon: FiMapPin },
            { id: 'wishlist', label: 'My Wishlist', icon: FiHeart },
            { id: 'profile', label: 'Profile Settings', icon: FiSettings }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSearchParams({ tab: tab.id })}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-black transition-all ${
                  activeTab === tab.id
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/10'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
                }`}
              >
                <Icon className="w-4.5 h-4.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}

          <div className="h-px bg-slate-100 dark:bg-slate-800 my-4" />

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-2xl text-xs font-black transition-all"
          >
            <FiLogOut className="w-4.5 h-4.5" />
            <span>Sign Out</span>
          </button>
        </aside>

        {/* Right Content Panel */}
        <div className="md:col-span-3">
          
          {/* Tab 1: Orders History */}
          {activeTab === 'orders' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/30 dark:border-slate-800/30 rounded-3xl p-4 sm:p-6 shadow-sm space-y-6">
              <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-850 pb-3">My Orders History</h3>
              
              {ordersLoading ? (
                <div className="space-y-4 animate-pulse">
                  {Array.from({ length: 2 }).map((_, idx) => (
                    <div key={idx} className="h-28 bg-slate-100 dark:bg-slate-950 rounded-2xl" />
                  ))}
                </div>
              ) : orders.length === 0 ? (
                <p className="text-xs text-slate-400 font-bold text-center py-6">You have not placed any orders yet.</p>
              ) : (
                <div className="space-y-4">
                  {orders.map((ord) => (
                    <div key={ord.id} className="p-4 rounded-3xl border border-slate-200/50 dark:border-slate-800 hover:border-slate-200 transition-all space-y-4 bg-slate-50/30 dark:bg-slate-900/50">
                      
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-3 text-xs font-bold">
                        <div>
                          <p className="text-slate-900 dark:text-white font-black">{ord.id}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{new Date(ord.date).toLocaleDateString()} at {new Date(ord.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <span className={`px-2.5 py-1 rounded-full text-[9px] uppercase tracking-wider font-bold ${
                            ord.status === 'Delivered'
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900'
                              : 'bg-amber-50 text-amber-600 border border-amber-100 dark:bg-amber-950/20 dark:border-amber-900'
                          }`}>
                            {ord.status}
                          </span>
                          <span className="text-sm font-black text-emerald-600 dark:text-emerald-450">₹{ord.total}</span>
                        </div>
                      </div>

                      {/* Items row details */}
                      <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-slate-500">
                        {ord.items.map((item, idx) => (
                          <span key={idx} className="flex items-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-2" />
                            {item.name} ({item.quantity})
                          </span>
                        ))}
                      </div>

                      {/* Address summary */}
                      <div className="text-[11px] text-slate-400 font-semibold leading-relaxed flex items-start space-x-2">
                        <FiMapPin className="h-3.5 w-3.5 mt-0.5 text-emerald-600" />
                        <span>Address: {ord.address}</span>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Saved Addresses */}
          {activeTab === 'addresses' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/30 dark:border-slate-800/30 rounded-3xl p-4 sm:p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-3">
                <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">Saved Addresses</h3>
                <button 
                  onClick={() => setShowAddressModal(true)}
                  className="px-4 py-1.5 bg-emerald-50 dark:bg-slate-950 text-emerald-600 border border-emerald-500/20 rounded-xl text-xs font-black flex items-center space-x-1"
                >
                  <FiPlus className="stroke-[3]" />
                  <span>ADD ADDRESS</span>
                </button>
              </div>

              {user?.savedAddresses?.length === 0 ? (
                <p className="text-xs text-slate-400 font-bold text-center py-6">You have no saved addresses. Add address to unlock checkout.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {user.savedAddresses.map((addr) => (
                    <div key={addr.id} className="p-4 rounded-3xl border border-slate-200/40 dark:border-slate-800 shadow-sm bg-slate-50/20 dark:bg-slate-900/50 flex flex-col justify-between space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-lg bg-emerald-500 text-white font-bold text-[9px] uppercase tracking-wider">
                          {addr.tag}
                        </span>
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs font-semibold text-slate-650 dark:text-slate-405 leading-relaxed">{addr.address}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Wishlist */}
          {activeTab === 'wishlist' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/30 dark:border-slate-800/30 rounded-3xl p-4 sm:p-6 shadow-sm space-y-6">
              <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-850 pb-3">My Wishlisted Items</h3>
              
              {wishlistProducts.length === 0 ? (
                <p className="text-xs text-slate-400 font-bold text-center py-6">Your wishlist is currently empty.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {wishlistProducts.map((prod) => (
                    <ProductCard key={prod.id} product={prod} triggerToast={triggerToast} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 4: Profile Settings */}
          {activeTab === 'profile' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/30 dark:border-slate-800/30 rounded-3xl p-4 sm:p-6 shadow-sm space-y-6">
              <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-850 pb-3">Profile Details</h3>
              
              <form onSubmit={handleProfileSave} className="space-y-4 max-w-md">
                
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Full Name</label>
                  <input
                    required
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-950 border border-transparent focus:border-emerald-500/30 rounded-2xl text-xs font-semibold outline-none focus:ring-4 focus:ring-emerald-500/10 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Email Address</label>
                  <input
                    required
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-950 border border-transparent focus:border-emerald-500/30 rounded-2xl text-xs font-semibold outline-none focus:ring-4 focus:ring-emerald-500/10 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Phone Number</label>
                  <input
                    required
                    type="tel"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-950 border border-transparent focus:border-emerald-500/30 rounded-2xl text-xs font-semibold outline-none focus:ring-4 focus:ring-emerald-500/10 text-slate-900 dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black shadow-md shadow-emerald-500/10 active:scale-95 transition-all"
                >
                  Save Profile Settings
                </button>
              </form>
            </div>
          )}

        </div>

      </div>

      {/* Add Address Modal Popup */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-md border border-slate-100 dark:border-slate-800 shadow-2xl relative">
            <button 
              onClick={() => setShowAddressModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:opacity-80 transition-opacity"
            >
              <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
            
            <h3 className="text-lg font-bold font-display mb-4 text-slate-900 dark:text-white font-display">Add Delivery Address</h3>
            
            <form onSubmit={handleAddAddressSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase">Address Type / Tag</label>
                <div className="flex gap-2.5 mt-1">
                  {['Home', 'Office', 'Other'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setNewTag(t)}
                      className={`flex-1 py-2 text-xs font-bold rounded-xl border text-center transition-all ${
                        newTag === t
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
                  value={newVal}
                  onChange={(e) => setNewVal(e.target.value)}
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

export default DashboardPage;
