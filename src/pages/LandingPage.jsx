import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiArrowRight, FiClock, FiShoppingBag, FiTruck, FiShield } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { apiService } from '../services/apiService';
import { 
  setProductsStart, setProductsSuccess, setProductsFailure, 
  setCategoriesSuccess, updateFilter 
} from '../redux/productSlice';
import ProductCard from '../components/ProductCard';
import { useToast } from '../components/Toast';
import heroImg from '../assets/hero.png';
import { TESTIMONIALS } from '../services/mockData';

const LandingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const triggerToast = useToast();
  
  const { items: products, categories, loading } = useSelector((state) => state.products);
  
  // Timer for Flash Sale
  const [timeLeft, setTimeLeft] = useState(14400); // 4 hours in seconds
  
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
    
    if (products.length === 0) {
      fetchData();
    }
  }, [dispatch, products.length]);

  const handleCategoryClick = (catId) => {
    dispatch(updateFilter({ key: 'category', value: catId }));
    navigate('/products');
  };

  const featuredProducts = products.filter(p => p.rating >= 4.6).slice(0, 4);
  const flashSaleProducts = products.filter(p => p.discount >= 12 && p.inStock).slice(0, 4);

  return (
    <div className="space-y-12 sm:space-y-16 pb-12">
      
      {/* Hero Banner Section with modern Dribbble floating blobs and rich gradients */}
      <section className="relative rounded-[40px] overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-900 text-white p-8 sm:p-14 lg:p-16 flex flex-col md:flex-row items-center justify-between shadow-2xl shadow-emerald-950/20">
        
        {/* Floating gradient blur blobs for premium aesthetic */}
        <div className="absolute top-[-20%] left-[-10%] w-80 h-80 rounded-full bg-emerald-400/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-15%] right-[-5%] w-96 h-96 rounded-full bg-yellow-400/10 blur-3xl pointer-events-none" />
        
        <div className="max-w-xl space-y-6 text-center md:text-left z-10">
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center px-4 py-1.5 rounded-full bg-emerald-500/20 dark:bg-emerald-400/10 backdrop-blur-md text-[10px] font-black uppercase tracking-widest border border-emerald-400/30 text-emerald-200"
          >
            ⚡ Delivery in 10 minutes
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black font-display tracking-tight leading-[1.05]"
          >
            Your Daily Groceries, <br />
            Delivered <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-400">Fresh & Fast</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-base text-emerald-100/90 font-medium max-w-sm"
          >
            Order farm-fresh fruits, vegetables, bread, dairy, and snacks at low warehouse rates.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="pt-2 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4"
          >
            <Link
              to="/products"
              className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-900 rounded-2xl shadow-xl shadow-yellow-500/10 hover:shadow-yellow-500/25 text-sm font-black transition-all active:scale-95 flex items-center space-x-2 w-full sm:w-auto justify-center"
            >
              <span>Order Now</span>
              <FiArrowRight className="w-4.5 h-4.5 stroke-[3]" />
            </Link>
            <Link
              to="/products"
              onClick={() => dispatch(updateFilter({ key: 'category', value: 'fruits-veg' }))}
              className="px-6 py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-sm font-bold transition-all w-full sm:w-auto text-center backdrop-blur-sm"
            >
              Fresh Vegetables
            </Link>
          </motion.div>
        </div>

        {/* Hero Image Illustration with floating animations */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-56 sm:w-72 lg:w-96 flex-shrink-0 mt-8 md:mt-0 z-10 relative flex justify-center"
        >
          {/* Soft reflection/shadow underneath image */}
          <div className="absolute bottom-[-15px] left-1/2 transform -translate-x-1/2 w-4/5 h-6 bg-black/35 blur-xl rounded-full" />
          <img 
            src={heroImg} 
            alt="Premium groceries delivery illustration" 
            className="w-full h-auto drop-shadow-[0_10px_30px_rgba(0,0,0,0.15)] animate-float" 
          />
        </motion.div>

      </section>

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
  );
};

export default LandingPage;
