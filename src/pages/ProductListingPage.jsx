import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FiFilter, FiSliders, FiX, FiCheck } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { apiService } from '../services/apiService';
import { 
  setProductsStart, setProductsSuccess, setProductsFailure, 
  setCategoriesSuccess, updateFilter, resetFilters, setSortBy,
  selectFilteredProducts 
} from '../redux/productSlice';
import ProductCard from '../components/ProductCard';
import { GridSkeleton } from '../components/SkeletonLoader';
import { useToast } from '../components/Toast';

const ProductListingPage = () => {
  const dispatch = useDispatch();
  const triggerToast = useToast();
  
  const { items: products, categories, filters, sortBy, loading } = useSelector((state) => state.products);
  const filteredProducts = useSelector(selectFilteredProducts);

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(setProductsStart());
      try {
        const prodData = await apiService.getProducts();
        dispatch(setProductsSuccess(prodData));
        const catData = await apiService.getCategories();
        dispatch(setCategoriesSuccess(catData));
      } catch (err) {
        dispatch(setProductsFailure(err.message || 'Failed to load products list'));
      }
    };
    
    fetchData();
  }, [dispatch]);

  const handleFilterChange = (key, value) => {
    dispatch(updateFilter({ key, value }));
  };

  const handleClearAll = () => {
    dispatch(resetFilters());
    triggerToast('Filters reset successfully', 'info');
  };

  const sortOptions = [
    { label: 'Relevance / Popular', value: 'default' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
    { label: 'Top Customer Ratings', value: 'rating-desc' }
  ];

  const sidebarContent = (
    <div className="space-y-6">
      
      {/* Category filter */}
      <div className="space-y-3">
        <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider">Categories</h4>
        <div className="space-y-1.5">
          <button
            onClick={() => handleFilterChange('category', 'all')}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
              filters.category === 'all'
                ? 'bg-emerald-500 text-white shadow-md'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
            }`}
          >
            <span>All Categories</span>
            {filters.category === 'all' && <FiCheck className="w-3.5 h-3.5" />}
          </button>
          
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleFilterChange('category', cat.id)}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                filters.category === cat.id
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              <span>{cat.name}</span>
              {filters.category === cat.id && <FiCheck className="w-3.5 h-3.5" />}
            </button>
          ))}
        </div>
      </div>

      {/* Price filter */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider">Max Price</h4>
          <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">₹{filters.maxPrice}</span>
        </div>
        <input
          type="range"
          min="0"
          max="200"
          step="5"
          value={filters.maxPrice}
          onChange={(e) => handleFilterChange('maxPrice', Number(e.target.value))}
          className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none"
        />
        <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold">
          <span>₹0</span>
          <span>₹100</span>
          <span>₹200+</span>
        </div>
      </div>

      {/* Rating filter */}
      <div className="space-y-3">
        <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider">Ratings</h4>
        <div className="flex flex-wrap gap-2">
          {[0, 4, 4.5, 4.8].map((rat) => (
            <button
              key={rat}
              onClick={() => handleFilterChange('rating', rat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filters.rating === rat
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              {rat === 0 ? 'All' : `${rat}★ & Up`}
            </button>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div className="space-y-3">
        <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider">Availability</h4>
        <label className="flex items-center space-x-3 cursor-pointer group select-none">
          <input
            type="checkbox"
            checked={filters.onlyInStock}
            onChange={(e) => handleFilterChange('onlyInStock', e.target.checked)}
            className="w-4.5 h-4.5 accent-emerald-600 rounded-lg cursor-pointer"
          />
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-white transition-colors">
            Hide Out of Stock
          </span>
        </label>
      </div>

      {/* Reset */}
      <button
        onClick={handleClearAll}
        className="w-full py-2.5 border border-slate-200 dark:border-slate-800 hover:border-rose-500 hover:text-rose-500 dark:hover:border-rose-500 text-slate-500 dark:text-slate-400 text-xs font-black rounded-xl transition-all"
      >
        Clear Filters
      </button>

    </div>
  );

  return (
    <div className="pb-12">
      
      {/* Top Banner Overview */}
      <div className="rounded-3xl p-6 bg-emerald-50 dark:bg-slate-900 border border-emerald-100/50 dark:border-slate-800 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black font-display text-slate-950 dark:text-white">
            {filters.category !== 'all' ? categories.find(c => c.id === filters.category)?.name : 'Shop All Products'}
          </h2>
          <p className="text-xs text-slate-400 font-bold">Showing {filteredProducts.length} premium grocery items</p>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <button 
            onClick={() => setMobileFiltersOpen(true)}
            className="flex-1 md:hidden flex items-center justify-center space-x-2 py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 font-bold text-xs"
          >
            <FiSliders className="w-4 h-4" />
            <span>Filter</span>
          </button>
          
          <div className="flex-1 md:flex-initial relative flex items-center">
            <span className="hidden sm:inline text-xs text-slate-400 font-bold mr-2 whitespace-nowrap">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => dispatch(setSortBy(e.target.value))}
              className="w-full md:w-56 px-3 py-2 text-xs font-bold bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800 rounded-xl outline-none focus:border-emerald-500 transition-all cursor-pointer"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:block w-64 shrink-0 p-6 bg-white dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/40 rounded-3xl h-fit shadow-sm">
          {sidebarContent}
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {loading ? (
            <GridSkeleton count={8} />
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200/30 dark:border-slate-800/30 rounded-3xl p-8 max-w-md mx-auto space-y-4 shadow-sm">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <FiFilter className="w-8 h-8" />
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">No products match your criteria</h3>
              <p className="text-xs text-slate-400">Try modifying price limits, checking query keywords, or resetting filters.</p>
              <button 
                onClick={handleClearAll}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} triggerToast={triggerToast} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer Backdrops */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 z-50 bg-black backdrop-blur-xs md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-850 p-6 z-50 overflow-y-auto flex flex-col md:hidden"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
                <h3 className="text-lg font-black font-display text-slate-900 dark:text-white">Filters</h3>
                <button 
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-grow">
                {sidebarContent}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ProductListingPage;
