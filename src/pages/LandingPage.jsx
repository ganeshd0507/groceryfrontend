import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiArrowRight, FiClock, FiShoppingBag, FiTruck, FiShield, FiMapPin, FiSearch, FiChevronDown } from 'react-icons/fi';
import { motion, useScroll, useTransform } from 'framer-motion';
import { apiService } from '../services/apiService';
import { 
  setProductsStart, setProductsSuccess, setProductsFailure, 
  setCategoriesSuccess, updateFilter 
} from '../redux/productSlice';
import { selectActiveAddress, setShowLocationModal } from '../redux/authSlice';
import ProductCard from '../components/ProductCard';
import { useToast } from '../components/Toast';
import { TESTIMONIALS } from '../services/mockData';

const LandingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const triggerToast = useToast();
  
  const { items: products, categories, loading } = useSelector((state) => state.products);
  const activeAddress = useSelector(selectActiveAddress);
  
  const [searchVal, setSearchVal] = useState('');
  // Timer for Flash Sale
  const [timeLeft, setTimeLeft] = useState(14400); // 4 hours in seconds

  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const videos = [
    "/videos/cooking_loop.mp4",
    "/videos/grill_loop.mp4",
    "/videos/cafe_loop.mp4"
  ];

  useEffect(() => {
    const videoInterval = setInterval(() => {
      setActiveVideoIndex((prev) => (prev + 1) % videos.length);
    }, 9000); // cycle every 9 seconds
    return () => clearInterval(videoInterval);
  }, []);

  const { scrollY } = useScroll();
  // Parallax: background moves slower than scrolling speed (moves down by 12% over 600px of scroll)
  const bgY = useTransform(scrollY, [0, 600], ["0%", "12%"]);
  // Fade out background slightly as user scrolls down
  const bgOpacity = useTransform(scrollY, [0, 600], [1, 0.25]);
  // Dynamic brightness adjustments (cinematic Zomato highlight)
  const bgFilter = useTransform(scrollY, [0, 400], ["brightness(0.55)", "brightness(0.25)"]);

  // Staggered entry animation variants for the hero contents
  const heroContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.15,
      }
    }
  };

  const heroItemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] // OutExpo
      }
    }
  };
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 14400));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      dispatch(setProductsStart());
      try {
        const prodData = await apiService.getProducts();
        dispatch(setProductsSuccess(prodData));
        const catData = await apiService.getCategories();
        dispatch(setCategoriesSuccess(catData));
      } catch (err) {
        dispatch(setProductsFailure(err.message || 'Failed to load landing data'));
      }
    };
    
    fetchData();
  }, [dispatch]);

  const handleCategoryClick = (catId) => {
    dispatch(updateFilter({ key: 'category', value: catId }));
    navigate('/products');
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    dispatch(updateFilter({ key: 'search', value: searchVal }));
    navigate('/products');
  };

  const handleScrollDown = () => {
    const nextSection = document.getElementById('shop-content');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const featuredProducts = products.filter(p => p.rating >= 4.6).slice(0, 4);
  const flashSaleProducts = products.filter(p => p.discount >= 12 && p.inStock).slice(0, 4);

  return (
    <div className="pb-12">
      
      {/* Immersive Zomato-style Hero Section with Background entry animations */}
      <section className="relative w-full h-[95vh] min-h-[580px] flex flex-col items-center justify-center overflow-hidden mb-12">
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          {videos.map((src, index) => (
            <motion.video
              key={src}
              src={src}
              autoPlay
              muted
              loop
              playsInline
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: index === activeVideoIndex ? 1 : 0,
                scale: index === activeVideoIndex ? 1.05 : 1.15
              }}
              transition={{ 
                opacity: { duration: 1.5, ease: "easeInOut" },
                scale: { duration: 9, ease: "linear" }
              }}
              style={{ y: bgY, filter: bgFilter }}
              className="w-full h-[115%] absolute -top-[5%] left-0 right-0 object-cover"
            />
          ))}
          {/* Zomato-style Cinematic Highlights (linear gradient + radial vignette) */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/95 z-10 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_15%,rgba(0,0,0,0.85)_100%)] z-10 pointer-events-none" />
        </div>

        <motion.div 
          variants={heroContainerVariants}
          initial="hidden"
          animate="visible"
          className="z-10 flex flex-col items-center max-w-4xl px-4 text-center text-white space-y-6"
        >
          {/* Animated Logo */}
          <motion.div
            variants={heroItemVariants}
            className="flex items-center space-x-3 mb-2 justify-center"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-green-600 flex items-center justify-center shadow-2xl shadow-emerald-500/30">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white fill-current" viewBox="0 0 24 24">
                <path d="M17 8C8 10 5.9 16.12 5 19c3.11-.9 9.12-3 11-12 .75 1.5.88 3.5.5 5h2c.88-3.12-.13-6.62-1.5-9z"/>
              </svg>
            </div>
            <span className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white">
              fresh<span className="text-emerald-400">basket</span>
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={heroItemVariants}
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-3xl"
          >
            India's #1 food & grocery delivery app
          </motion.h1>

          <motion.p
            variants={heroItemVariants}
            className="text-sm sm:text-base md:text-lg text-slate-200 max-w-xl font-medium"
          >
            Experience fast & easy online ordering on the freshbasket app
          </motion.p>

          {/* Download Badges */}
          <motion.div
            variants={heroItemVariants}
            className="flex flex-row gap-3 sm:gap-4 pt-2 justify-center"
          >
            <a href="#" className="bg-black/50 border border-white/10 hover:border-white/30 hover:bg-black/75 rounded-xl px-4 py-2.5 flex items-center space-x-2 text-left cursor-pointer transition-all hover:scale-[1.03] active:scale-95 shadow-md">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M3 5.27V18.73c0 .89.97 1.45 1.75.98l11.23-6.73c.75-.45.75-1.55 0-2l-11.23-6.7c-.78-.47-1.75.09-1.75.99M16.5 12L7.15 6.4c-.47-.28-1.07.06-1.07.6v10c0 .54.6.88 1.07.6L16.5 12z"/></svg>
              <div>
                <p className="text-[7px] text-slate-400 uppercase font-extrabold tracking-wider">GET IT ON</p>
                <p className="text-xs font-black leading-tight text-white">Google Play</p>
              </div>
            </a>
            <a href="#" className="bg-black/50 border border-white/10 hover:border-white/30 hover:bg-black/75 rounded-xl px-4 py-2.5 flex items-center space-x-2 text-left cursor-pointer transition-all hover:scale-[1.03] active:scale-95 shadow-md">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C3.82 16.34 3.75 9.77 7.55 9.4c1.13.1 1.95.74 2.65.74.7 0 1.63-.78 3-.66 1.45.13 2.5.76 3.1 1.62-2.77 1.67-2.08 5.25.68 6.38-.68 1.71-1.45 3.4-2.23 3.8M14.97 7.03c.55-.66.86-1.57.75-2.48-.84.05-1.85.58-2.43 1.25-.49.56-.93 1.5.88 2.37.66.08 1.3-.48 1.68-1.14"/></svg>
              <div>
                <p className="text-[7px] text-slate-400 uppercase font-extrabold tracking-wider">Download on the</p>
                <p className="text-xs font-black leading-tight text-white">App Store</p>
              </div>
            </a>
          </motion.div>

          {/* Location & Search widget */}
          <motion.div
            variants={heroItemVariants}
            className="w-full max-w-2xl pt-4 px-2 sm:px-0"
          >
            <div className="flex flex-col md:flex-row bg-white dark:bg-slate-900 rounded-2xl md:rounded-full shadow-2xl p-2 w-full gap-3 md:gap-0 md:items-center text-slate-800 dark:text-slate-200">
              
              {/* Location Picker */}
              <button
                type="button"
                onClick={() => dispatch(setShowLocationModal(true))}
                className="flex items-center space-x-2 px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl md:rounded-l-full md:w-[35%] transition-colors duration-300 cursor-pointer text-left"
              >
                <FiMapPin className="text-emerald-500 w-5 h-5 flex-shrink-0" />
                <span className="text-xs font-bold truncate flex-1 text-slate-700 dark:text-slate-255">
                  {activeAddress}
                </span>
                <FiChevronDown className="text-slate-400 w-4 h-4 flex-shrink-0" />
              </button>

              {/* Separator */}
              <div className="hidden md:block w-[1px] h-8 bg-slate-200 dark:bg-slate-800 mx-2" />

              {/* Search Field */}
              <div className="flex-grow flex items-center pl-4 pr-1 py-1">
                <FiSearch className="text-slate-450 w-5 h-5 mr-3 flex-shrink-0" />
                <form onSubmit={handleSearchSubmit} className="flex-grow flex items-center">
                  <input
                    type="text"
                    placeholder="Search for fresh fruits, vegetables, bread, dairy..."
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    className="w-full bg-transparent border-none outline-none focus:ring-0 text-xs font-bold text-slate-950 dark:text-white placeholder-slate-400"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl md:rounded-full text-xs font-black shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35 transition-all duration-300 active:scale-95 cursor-pointer ml-2 whitespace-nowrap"
                  >
                    Search
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center cursor-pointer text-white/70 hover:text-white transition-colors z-10" 
          onClick={handleScrollDown}
        >
          <span className="text-[10px] font-black uppercase tracking-widest mb-1.5">Scroll Down</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <FiChevronDown className="w-5 h-5 stroke-[3]" />
          </motion.div>
        </div>
      </section>

      {/* Constraints wrapper for the main landing page content */}
      <div id="shop-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 sm:space-y-16">

      {/* Categories Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="text-left">
            <h2 className="text-2xl font-black font-display tracking-tight">Shop by Categories</h2>
            <p className="text-xs text-slate-450 dark:text-slate-500 font-bold">Pick your daily needs from our fresh stocks</p>
          </div>
          <Link to="/products" className="text-emerald-600 dark:text-emerald-400 font-black text-sm flex items-center space-x-1 group">
            <span>View All</span>
            <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Horizontal Category Cards with premium hover glow styles */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <motion.button
              key={cat.id}
              whileHover={{ y: -4 }}
              onClick={() => handleCategoryClick(cat.id)}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-205/30 dark:border-slate-800/40 flex flex-col items-center justify-between text-center group cursor-pointer hover:shadow-xl hover:shadow-slate-100/50 dark:hover:shadow-black/20 hover:border-emerald-500/20 dark:hover:border-emerald-500/20 transition-all select-none duration-300"
            >
              <div className="w-18 h-18 rounded-2xl bg-emerald-50/50 dark:bg-slate-850 overflow-hidden mb-3.5 group-hover:scale-105 transition-transform flex items-center justify-center border border-slate-100/10">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-xs font-black text-slate-800 dark:text-white leading-snug mb-1 group-hover:text-emerald-600 transition-colors">
                  {cat.name}
                </p>
                <p className="text-[10px] text-slate-400 font-bold">{cat.count} Items</p>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Offer Banner Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-[32px] p-8 bg-gradient-to-r from-amber-500 to-orange-600 text-white flex flex-col justify-between items-start space-y-4 shadow-xl shadow-orange-950/10 relative overflow-hidden group text-left">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-white/10 group-hover:scale-110 transition-transform duration-500" />
          <div className="z-10">
            <span className="bg-white/20 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider">Mega Offer</span>
            <h3 className="text-xl sm:text-2xl font-black font-display mt-2">Get flat ₹75 Off on your first order!</h3>
            <p className="text-xs text-orange-100 font-semibold mt-1.5 leading-relaxed">Applicable on orders above ₹300. Use code: <span className="bg-white/20 px-1.5 py-0.5 rounded font-black text-white">BLINK75</span></p>
          </div>
          <button onClick={() => navigate('/products')} className="px-5 py-2.5 bg-slate-900 text-white hover:bg-black text-xs font-black rounded-xl transition-all shadow-md z-10 active:scale-95 cursor-pointer">
            Claim Offer
          </button>
        </div>

        <div className="rounded-[32px] p-8 bg-gradient-to-r from-teal-500 to-emerald-600 text-white flex flex-col justify-between items-start space-y-4 shadow-xl shadow-teal-950/10 relative overflow-hidden group text-left">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-white/10 group-hover:scale-110 transition-transform duration-500" />
          <div className="z-10">
            <span className="bg-white/20 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider">Premium organic</span>
            <h3 className="text-xl sm:text-2xl font-black font-display mt-2">Healthy Organic Fruits & Greens</h3>
            <p className="text-xs text-teal-100 font-semibold mt-1.5 leading-relaxed">Directly from certified local organic farms. 100% chemical-free.</p>
          </div>
          <button 
            onClick={() => {
              dispatch(updateFilter({ key: 'category', value: 'fruits-veg' }));
              navigate('/products');
            }} 
            className="px-5 py-2.5 bg-white text-emerald-600 hover:bg-emerald-50 text-xs font-black rounded-xl transition-all shadow-md z-10 active:scale-95 cursor-pointer"
          >
            Explore Fresh
          </button>
        </div>
      </section>

      {/* Flash Sale Section */}
      <section className="space-y-6 bg-gradient-to-br from-amber-500/5 to-orange-500/5 dark:from-amber-950/10 dark:to-orange-950/10 rounded-[32px] p-6 border border-amber-500/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-amber-400 to-amber-550 text-white rounded-2xl shadow-md animate-pulse">
              <FiClock className="w-5.5 h-5.5 stroke-[2.5]" />
            </div>
            <div className="text-left">
              <h2 className="text-xl sm:text-2xl font-black font-display text-amber-700 dark:text-amber-400 tracking-tight">Flash Sale Daily</h2>
              <p className="text-xs text-slate-450 dark:text-slate-500 font-bold">Limited stocks. Lowest price guaranteed!</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 self-start sm:self-auto">
            <span className="text-xs text-slate-400 font-bold">Ends in:</span>
            <span className="bg-slate-900 text-yellow-400 px-3 py-1.5 rounded-xl font-mono text-xs font-black tracking-widest shadow-md">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {flashSaleProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} triggerToast={triggerToast} />
            ))}
          </div>
        )}
      </section>

      {/* Featured Products */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="text-left">
            <h2 className="text-2xl font-black font-display tracking-tight">Featured Best Sellers</h2>
            <p className="text-xs text-slate-450 dark:text-slate-550 font-bold font-display">Highest-rated items by customers</p>
          </div>
          <Link to="/products" className="text-emerald-600 dark:text-emerald-400 font-black text-sm flex items-center space-x-1 group">
            <span>Shop All</span>
            <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} triggerToast={triggerToast} />
            ))}
          </div>
        )}
      </section>

      {/* Trust Badges */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-6 border-y border-slate-200/50 dark:border-slate-800/50">
        <div className="flex items-center space-x-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/10 dark:border-slate-800/10 text-left">
          <div className="p-3 bg-emerald-50 dark:bg-slate-850 rounded-2xl text-emerald-600 dark:text-emerald-450 border border-emerald-100/10">
            <FiTruck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-black">10 Min Delivery</h4>
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-bold">Fastest grocery delivery in town.</p>
          </div>
        </div>

        <div className="flex items-center space-x-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/10 dark:border-slate-800/10 text-left">
          <div className="p-3 bg-emerald-50 dark:bg-slate-850 rounded-2xl text-emerald-600 dark:text-emerald-450 border border-emerald-100/10">
            <FiShield className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-black">Quality Guaranteed</h4>
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-bold">100% replacement if not satisfied.</p>
          </div>
        </div>

        <div className="flex items-center space-x-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/10 dark:border-slate-800/10 text-left">
          <div className="p-3 bg-emerald-50 dark:bg-slate-850 rounded-2xl text-emerald-600 dark:text-emerald-450 border border-emerald-100/10">
            <FiShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-black">Best Prices & Offers</h4>
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-bold">Get direct farm rates and coupons.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="space-y-6">
        <div className="text-center max-w-md mx-auto space-y-2">
          <h2 className="text-2xl font-black font-display tracking-tight">Loved by Customers</h2>
          <p className="text-xs text-slate-450 dark:text-slate-550 font-bold">Hear what our regular clients say about freshbasket</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((test) => (
            <div key={test.id} className="p-6 rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200/20 dark:border-slate-800/30 shadow-sm flex flex-col justify-between space-y-4 text-left">
              <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed italic">
                "{test.comment}"
              </p>
              <div className="flex items-center space-x-3">
                <img src={test.avatar} alt={test.name} className="w-10 h-10 rounded-full object-cover border border-slate-100 dark:border-slate-800" />
                <div>
                  <h4 className="text-xs font-black">{test.name}</h4>
                  <p className="text-[10px] text-slate-400 font-bold">{test.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      </div>
    </div>
  );
};

export default LandingPage;
