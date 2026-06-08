import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  FiSearch, FiShoppingCart, FiUser, FiHeart, 
  FiMoon, FiSun, FiMapPin, FiChevronDown, FiPlus, FiX 
} from 'react-icons/fi';
import { selectCartItemsCount, cartSelector } from '../redux/cartSlice';
import { selectUser, selectIsAuthenticated, toggleDarkMode, selectDarkMode } from '../redux/authSlice';
import { updateFilter } from '../redux/productSlice';
import { useToast } from '../components/Toast';

const MainLayout = ({ children, customToast }) => {
  const count = useSelector(selectCartItemsCount);
  const cart = useSelector(cartSelector);
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const darkMode = useSelector(selectDarkMode);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const triggerToast = useToast();

  const [searchVal, setSearchVal] = useState('');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [activeAddress, setActiveAddress] = useState('Gurgaon, DLF Phase 3');
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [loadingLiveLocation, setLoadingLiveLocation] = useState(false);

  const locations = [
    'Gurgaon, DLF Phase 3',
    'Sushant Lok Phase I, Sector 27, Gurgaon',
    'Cyber City Phase II, Gurgaon',
    'Sector 45, Gurgaon, Haryana',
    'Nirvana Country, Sector 50, Gurgaon'
  ];

  // Apply dark mode class to HTML body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(updateFilter({ key: 'search', value: searchVal }));
    if (location.pathname !== '/products') {
      navigate('/products');
    }
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchVal(val);
    dispatch(updateFilter({ key: 'search', value: val }));
  };

  const changeAddress = (addr) => {
    setActiveAddress(addr);
    setShowLocationModal(false);
  };

  const handleUseLiveLocation = () => {
    if (!navigator.geolocation) {
      triggerToast('Geolocation is not supported by your browser', 'error');
      return;
    }

    setLoadingLiveLocation(true);
    triggerToast('Detecting your live location...', 'info');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Fetch from OpenStreetMap Nominatim reverse geocoding API
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            {
              headers: {
                'User-Agent': 'FreshBasketGroceryApp/1.0'
              }
            }
          );
          if (!response.ok) throw new Error('Failed to reverse geocode');
          const data = await response.json();
          
          // Construct a friendly address string
          const addressParts = [];
          if (data.address) {
            const addr = data.address;
            if (addr.road) addressParts.push(addr.road);
            if (addr.suburb) addressParts.push(addr.suburb);
            if (addr.neighbourhood) addressParts.push(addr.neighbourhood);
            if (addr.city_district) addressParts.push(addr.city_district);
            if (addr.village) addressParts.push(addr.village);
            if (addr.town) addressParts.push(addr.town);
            if (addr.city) addressParts.push(addr.city);
            if (addr.state) addressParts.push(addr.state);
          }
          
          let friendlyAddress = addressParts.slice(0, 3).join(', ');
          if (!friendlyAddress) {
            friendlyAddress = data.display_name || `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`;
          }
          
          // Truncate address if it's too long
          if (friendlyAddress.length > 50) {
            friendlyAddress = friendlyAddress.substring(0, 47) + '...';
          }

          setActiveAddress(friendlyAddress);
          setShowLocationModal(false);
          triggerToast('Location updated successfully!', 'success');
        } catch (error) {
          console.error('Reverse geocoding error:', error);
          // Fallback to coordinates
          const fallbackAddr = `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`;
          setActiveAddress(fallbackAddr);
          setShowLocationModal(false);
          triggerToast('Updated using fallback coordinates', 'warning');
        } finally {
          setLoadingLiveLocation(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        let errorMsg = 'Failed to retrieve your location';
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = 'Location permission denied by user';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMsg = 'Location information is unavailable';
        } else if (error.code === error.TIMEOUT) {
          errorMsg = 'Location request timed out';
        }
        triggerToast(errorMsg, 'error');
        setLoadingLiveLocation(false);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  };

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'dark text-slate-100 bg-slate-950' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* Toast Notification Container */}
      {customToast}

      {/* Top Navbar */}
      <nav className="sticky top-0 z-40 bg-white/70 dark:bg-slate-950/70 backdrop-blur-lg border-b border-slate-100 dark:border-slate-900/60 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
            
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 flex-shrink-0 group" onClick={() => dispatch(updateFilter({ key: 'search', value: '' }))}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
                <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 24 24">
                  <path d="M17 8C8 10 5.9 16.12 5 19c3.11-.9 9.12-3 11-12 .75 1.5.88 3.5.5 5h2c.88-3.12-.13-6.62-1.5-9z"/>
                </svg>
              </div>
              <span className="text-xl sm:text-2xl font-black font-display tracking-tight text-slate-900 dark:text-white group-hover:opacity-90 transition-opacity">
                fresh<span className="text-emerald-500 dark:text-emerald-400">basket</span>
              </span>
            </Link>

            {/* Delivery Location Selector */}
            <button 
              onClick={() => setShowLocationModal(true)}
              className="hidden md:flex items-center space-x-2 text-left hover:bg-slate-100/50 dark:hover:bg-slate-900/50 p-1.5 px-3 rounded-2xl border border-transparent hover:border-slate-200/50 dark:hover:border-slate-800 transition-all duration-300"
            >
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400">
                <FiMapPin className="h-4.5 w-4.5" />
              </div>
              <div className="max-w-[150px] lg:max-w-[200px]">
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Delivering to</p>
                <div className="flex items-center text-xs font-black truncate text-slate-700 dark:text-slate-200">
                  <span className="truncate">{activeAddress}</span>
                  <FiChevronDown className="h-4 w-4 ml-1 flex-shrink-0 text-emerald-500" />
                </div>
              </div>
            </button>

            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="flex-1 max-w-lg md:max-w-xl mx-2 relative">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Search for fruits, vegetables, snacks..."
                  value={searchVal}
                  onChange={handleSearchChange}
                  className="w-full pl-11 pr-4 py-2.5 sm:py-3 rounded-2xl bg-slate-100 dark:bg-slate-900/80 border border-transparent focus:border-emerald-500/20 focus:bg-white dark:focus:bg-slate-950 focus:ring-4 focus:ring-emerald-500/5 focus:shadow-[0_0_30px_rgba(16,185,129,0.08)] outline-none transition-all duration-300 text-sm font-semibold text-slate-900 dark:text-white"
                />
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-emerald-505 transition-colors" />
              </div>
            </form>

            {/* User Actions */}
            <div className="flex items-center space-x-1 sm:space-x-3">
              {/* Dark Mode */}
              <button 
                onClick={() => dispatch(toggleDarkMode())}
                className="p-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-455 transition-colors border border-transparent hover:border-slate-200/20"
                aria-label="Toggle Dark Mode"
              >
                {darkMode ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
              </button>

              {/* Wishlist */}
              <Link 
                to={isAuthenticated ? "/dashboard?tab=wishlist" : "/login"} 
                className="p-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-455 transition-colors relative border border-transparent hover:border-slate-200/20"
              >
                <FiHeart className="h-5 w-5" />
                {user?.wishlist?.length > 0 && (
                  <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-rose-500 border-2 border-white dark:border-slate-950" />
                )}
              </Link>

              {/* Cart Summary */}
              <div className="relative">
                <Link
                  to="/cart"
                  onMouseEnter={() => setShowCartDropdown(true)}
                  onMouseLeave={() => setShowCartDropdown(false)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-4 py-2 sm:py-2.5 rounded-2xl shadow-lg shadow-emerald-500/10 transition-all font-extrabold text-sm hover:shadow-xl hover:shadow-emerald-500/25 active:scale-95"
                >
                  <FiShoppingCart className="h-4.5 w-4.5" />
                  <span className="hidden sm:inline">₹{cart.total}</span>
                  {count > 0 && (
                    <span className="bg-white text-emerald-600 rounded-lg h-5 px-1.5 flex items-center justify-center text-xs font-black ml-1">
                      {count}
                    </span>
                  )}
                </Link>

                {/* Micro cart dropdown preview */}
                {showCartDropdown && count > 0 && (
                  <div 
                    onMouseEnter={() => setShowCartDropdown(true)}
                    onMouseLeave={() => setShowCartDropdown(false)}
                    className="absolute right-0 mt-2 w-72 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-250/40 dark:border-slate-800 shadow-2xl p-4 z-50 text-slate-800 dark:text-slate-200 hidden md:block"
                  >
                    <div className="max-h-60 overflow-y-auto mb-3 pr-1">
                      {cart.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800/40">
                          <div className="flex items-center space-x-3 truncate">
                            <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-xl border border-slate-100 dark:border-slate-800" />
                            <div className="truncate text-left">
                              <p className="text-xs font-extrabold truncate">{item.name}</p>
                              <p className="text-[10px] text-slate-400 font-bold">{item.weight} x {item.quantity}</p>
                            </div>
                          </div>
                          <span className="text-xs font-black text-slate-900 dark:text-white">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3 mb-3">
                      <span className="text-xs text-slate-400 font-black">Subtotal</span>
                      <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">₹{cart.subtotal}</span>
                    </div>
                    <Link 
                      to="/cart"
                      className="w-full py-2.5 block text-center bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition-all shadow-md shadow-emerald-500/10"
                    >
                      Checkout Now
                    </Link>
                  </div>
                )}
              </div>

              {/* Login / Profile */}
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="flex items-center justify-center p-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400 transition-colors border border-transparent hover:border-slate-205 dark:hover:border-slate-800"
                >
                  <FiUser className="h-5 w-5 text-emerald-650 dark:text-emerald-400" />
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="hidden md:inline-flex items-center justify-center px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 hover:text-emerald-650 dark:hover:text-emerald-400 transition-colors text-xs font-black border border-transparent hover:border-emerald-500/20"
                >
                  Sign In
                </Link>
              )}
            </div>

          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 mb-16 md:mb-0">
        {children}
      </main>

      {/* Sticky Bottom Navigation (Mobile & Tablet) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 border-t border-slate-200/50 dark:border-slate-800/50 backdrop-blur-lg px-6 py-2.5 flex items-center justify-between shadow-[0_-5px_15px_-3px_rgba(0,0,0,0.05)]">
        <Link 
          to="/" 
          onClick={() => dispatch(updateFilter({ key: 'category', value: 'all' }))}
          className={`flex flex-col items-center space-y-1 ${location.pathname === '/' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`}
        >
          <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
          <span className="text-[10px] font-bold">Home</span>
        </Link>

        <Link 
          to="/products" 
          className={`flex flex-col items-center space-y-1 ${location.pathname === '/products' && !searchVal ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`}
        >
          <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16"/></svg>
          <span className="text-[10px] font-bold">Shop</span>
        </Link>

        <Link 
          to="/cart" 
          className={`flex flex-col items-center space-y-1 relative ${location.pathname === '/cart' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`}
        >
          <FiShoppingCart className="h-5.5 w-5.5" />
          {count > 0 && (
            <span className="absolute -top-1 -right-2 bg-emerald-600 text-white rounded-full h-4.5 w-4.5 flex items-center justify-center text-[9px] font-bold">
              {count}
            </span>
          )}
          <span className="text-[10px] font-bold">Cart</span>
        </Link>

        <Link 
          to={isAuthenticated ? "/dashboard" : "/login"} 
          className={`flex flex-col items-center space-y-1 ${location.pathname.startsWith('/dashboard') || location.pathname === '/login' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`}
        >
          <FiUser className="h-5.5 w-5.5" />
          <span className="text-[10px] font-bold">Profile</span>
        </Link>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200/50 dark:border-slate-800/50 py-12 md:py-16 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            
            {/* Logo and About */}
            <div className="col-span-2 lg:col-span-2 space-y-4 text-left">
              <Link to="/" className="flex items-center space-x-2 group">
                <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                  🍃
                </div>
                <span className="text-lg font-black font-display tracking-tight text-slate-900 dark:text-white">
                  fresh<span className="text-emerald-500">basket</span>
                </span>
              </Link>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm font-semibold">
                Get fresh fruits, vegetables, bread, dairy, snacks, and cooking essentials delivered straight to your doorstep in 10 minutes.
              </p>
              <div className="pt-2">
                <span className="inline-block px-3.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 text-[10px] font-black text-emerald-600 dark:text-emerald-400 animate-pulse-subtle">
                  ⚡ Delivery in 10 minutes
                </span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4 text-left">
              <h4 className="text-[10px] font-black tracking-wider text-slate-400 uppercase">Categories</h4>
              <ul className="space-y-2 text-xs font-black">
                <li><Link to="/products" onClick={() => dispatch(updateFilter({ key: 'category', value: 'fruits-veg' }))} className="text-slate-500 dark:text-slate-450 hover:text-emerald-600 dark:hover:text-emerald-450 transition-colors">Fruits & Vegetables</Link></li>
                <li><Link to="/products" onClick={() => dispatch(updateFilter({ key: 'category', value: 'dairy-bread' }))} className="text-slate-500 dark:text-slate-455 hover:text-emerald-600 dark:hover:text-emerald-455 transition-colors">Dairy & Bread</Link></li>
                <li><Link to="/products" onClick={() => dispatch(updateFilter({ key: 'category', value: 'snacks-munchies' }))} className="text-slate-500 dark:text-slate-455 hover:text-emerald-600 dark:hover:text-emerald-455 transition-colors">Snacks & Munchies</Link></li>
                <li><Link to="/products" onClick={() => dispatch(updateFilter({ key: 'category', value: 'beverages' }))} className="text-slate-500 dark:text-slate-455 hover:text-emerald-600 dark:hover:text-emerald-455 transition-colors">Beverages</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-4 text-left">
              <h4 className="text-[10px] font-black tracking-wider text-slate-400 uppercase">Support</h4>
              <ul className="space-y-2 text-xs font-black">
                <li><Link to="/admin" className="text-slate-500 dark:text-slate-455 hover:text-emerald-600 dark:hover:text-emerald-455 transition-colors">Admin Dashboard</Link></li>
                <li><Link to="/login" className="text-slate-500 dark:text-slate-455 hover:text-emerald-600 dark:hover:text-emerald-455 transition-colors">Customer Login</Link></li>
                <li><Link to="/dashboard" className="text-slate-500 dark:text-slate-455 hover:text-emerald-600 dark:hover:text-emerald-455 transition-colors">My Profile</Link></li>
                <li><span className="text-slate-400 dark:text-slate-500 cursor-not-allowed">Help Center</span></li>
              </ul>
            </div>

            {/* App downloads */}
            <div className="col-span-2 md:col-span-4 lg:col-span-1 space-y-4 text-left">
              <h4 className="text-[10px] font-black tracking-wider text-slate-400 uppercase">Download App</h4>
              <div className="flex flex-row lg:flex-col gap-2.5">
                <button className="bg-slate-900 text-white rounded-xl px-4 py-2 border border-slate-800 hover:bg-black transition-colors flex items-center space-x-2 text-left flex-1 lg:flex-initial cursor-pointer">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C3.82 16.34 3.75 9.77 7.55 9.4c1.13.1 1.95.74 2.65.74.7 0 1.63-.78 3-.66 1.45.13 2.5.76 3.1 1.62-2.77 1.67-2.08 5.25.68 6.38-.68 1.71-1.45 3.4-2.23 3.8M14.97 7.03c.55-.66.86-1.57.75-2.48-.84.05-1.85.58-2.43 1.25-.49.56-.93 1.5.88 2.37.66.08 1.3-.48 1.68-1.14"/></svg>
                  <div>
                    <p className="text-[8px] text-slate-400 uppercase font-bold">Download on the</p>
                    <p className="text-xs font-black leading-tight">App Store</p>
                  </div>
                </button>
                <button className="bg-slate-900 text-white rounded-xl px-4 py-2 border border-slate-800 hover:bg-black transition-colors flex items-center space-x-2 text-left flex-1 lg:flex-initial cursor-pointer">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M3 5.27V18.73c0 .89.97 1.45 1.75.98l11.23-6.73c.75-.45.75-1.55 0-2l-11.23-6.7c-.78-.47-1.75.09-1.75.99M16.5 12L7.15 6.4c-.47-.28-1.07.06-1.07.6v10c0 .54.6.88 1.07.6L16.5 12z"/></svg>
                  <div>
                    <p className="text-[8px] text-slate-400 uppercase font-bold">Get it on</p>
                    <p className="text-xs font-black leading-tight">Google Play</p>
                  </div>
                </button>
              </div>
            </div>

          </div>

          <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800/80 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400 font-bold gap-4">
            <p>© 2026 FreshBasket. All rights reserved.</p>
            <div className="flex space-x-4">
              <span className="hover:text-emerald-500 cursor-pointer">Privacy Policy</span>
              <span className="hover:text-emerald-500 cursor-pointer">Terms of Service</span>
              <span className="hover:text-emerald-500 cursor-pointer">Cookie Settings</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Address Selector Popup Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-md border border-slate-100 dark:border-slate-805 shadow-2xl relative">
            <button 
              onClick={() => setShowLocationModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:opacity-80 transition-opacity"
            >
              <FiX className="h-5 w-5" />
            </button>
            
            <h3 className="text-lg font-bold font-display mb-2 text-slate-900 dark:text-white">Choose your location</h3>
            <p className="text-xs text-slate-450 mb-4">Select a delivery address to view exact delivery times and custom banners.</p>
            
            <div className="space-y-2 mb-4">
              
              {/* Detect Live Location Button */}
              <button
                onClick={handleUseLiveLocation}
                disabled={loadingLiveLocation}
                className="w-full mb-3 p-3.5 bg-emerald-650 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-2xl flex items-center justify-center space-x-2 text-xs font-black transition-all shadow-md shadow-emerald-500/10 active:scale-95 cursor-pointer"
              >
                {loadingLiveLocation ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                )}
                <span>{loadingLiveLocation ? 'Detecting Location...' : 'Use Live Location'}</span>
              </button>

              <div className="border-b border-slate-100 dark:border-slate-800/60 my-2" />

              {locations.map((loc, idx) => (
                <button
                  key={idx}
                  onClick={() => changeAddress(loc)}
                  className={`w-full p-3.5 text-left rounded-2xl flex items-center space-x-3 border text-xs font-bold transition-all ${
                    activeAddress === loc 
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-600 dark:text-emerald-400 shadow-sm'
                      : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <FiMapPin className={`h-4.5 w-4.5 ${activeAddress === loc ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
                  <span className="truncate">{loc}</span>
                </button>
              ))}
            </div>

            <button 
              onClick={() => {
                setShowLocationModal(false);
                if (isAuthenticated) {
                  navigate('/dashboard?tab=addresses');
                } else {
                  navigate('/login');
                }
              }}
              className="w-full py-3 bg-slate-105 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/50 text-slate-800 dark:text-slate-200 rounded-2xl text-xs font-black flex items-center justify-center space-x-2 transition-all"
            >
              <FiPlus className="h-4 w-4" />
              <span>Add New Address</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default MainLayout;
