import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiPlus, FiMinus, FiStar, FiHeart } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { addToCart, updateQuantity, cartSelector } from '../redux/cartSlice';
import { toggleWishlist, selectWishlist, selectIsAuthenticated } from '../redux/authSlice';

const ProductCard = ({ product, triggerToast }) => {
  const dispatch = useDispatch();
  const cart = useSelector(cartSelector);
  const wishlist = useSelector(selectWishlist);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Find if item is in cart and its quantity
  const cartItem = cart.items.find((item) => item.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;
  
  // Find if item is in wishlist
  const isWishlisted = wishlist.includes(product.id);

  const handleAddClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) return;
    dispatch(addToCart({ product, quantity: 1 }));
    if (triggerToast) {
      triggerToast(`Added ${product.name} to cart!`, 'success');
    }
  };

  const handleIncrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(updateQuantity({ id: product.id, quantity: quantity + 1 }));
  };

  const handleDecrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(updateQuantity({ id: product.id, quantity: quantity - 1 }));
    if (quantity === 1 && triggerToast) {
      triggerToast(`Removed ${product.name} from cart`, 'info');
    }
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      if (triggerToast) triggerToast('Please login to manage wishlist!', 'warning');
      return;
    }
    dispatch(toggleWishlist(product.id));
    if (triggerToast) {
      triggerToast(
        isWishlisted ? `Removed ${product.name} from wishlist` : `Added ${product.name} to wishlist!`,
        isWishlisted ? 'info' : 'success'
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="glass-card flex flex-col justify-between rounded-3xl p-3 sm:p-4 relative group select-none h-full card-hover-effect"
    >
      {/* Badges / Discount */}
      <div className="absolute top-3 left-3 z-10 flex flex-col space-y-1">
        {product.discount > 0 && product.inStock && (
          <span className="bg-rose-500 text-white font-black text-[9px] uppercase px-2 py-0.5 rounded-full tracking-wider shadow-sm">
            {product.discount}% OFF
          </span>
        )}
        {!product.inStock && (
          <span className="bg-slate-400 text-white font-black text-[9px] uppercase px-2 py-0.5 rounded-full tracking-wider shadow-sm">
            Sold Out
          </span>
        )}
        {product.badge && product.badge !== 'Out of Stock' && product.badge !== `${product.discount}% OFF` && (
          <span className="bg-amber-500 text-white font-black text-[9px] uppercase px-2 py-0.5 rounded-full tracking-wider shadow-sm">
            {product.badge}
          </span>
        )}
      </div>

      {/* Wishlist Heart */}
      <button
        onClick={handleWishlistClick}
        className={`absolute top-3 right-3 z-10 p-2 rounded-xl backdrop-blur-md transition-all ${
          isWishlisted 
            ? 'bg-rose-50 text-rose-500 border border-rose-100/50' 
            : 'bg-white/80 text-slate-400 border border-slate-100/50 hover:text-rose-500 dark:bg-slate-900/80 dark:border-slate-800'
        }`}
      >
        <FiHeart className={`h-4.5 w-4.5 transition-transform active:scale-75 ${isWishlisted ? 'fill-current' : ''}`} />
      </button>

      {/* Link wrap image & info */}
      <Link to={`/product/${product.id}`} className="block flex-grow">
        
        {/* Product Image */}
        <div className="w-full aspect-square bg-slate-100 dark:bg-slate-900 rounded-2xl overflow-hidden mb-3 relative flex items-center justify-center">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 loading-lazy"
          />
        </div>

        {/* Rating and Reviews */}
        <div className="flex items-center space-x-1 mb-1">
          <div className="flex items-center text-amber-500 bg-amber-50 dark:bg-amber-950/20 px-1.5 py-0.5 rounded-lg text-[10px] font-bold">
            <FiStar className="h-3 w-3 fill-current mr-0.5" />
            <span>{product.rating}</span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">({product.reviewsCount})</span>
        </div>

        {/* Name and weight */}
        <h4 className="text-sm font-extrabold text-slate-800 dark:text-white leading-snug line-clamp-2 min-h-[40px] mb-1">
          {product.name}
        </h4>
        
        <p className="text-[11px] text-slate-400 dark:text-slate-500 font-bold mb-3">
          {product.weight}
        </p>

      </Link>

      {/* Pricing and Action */}
      <div className="flex items-center justify-between mt-auto">
        <div className="flex flex-col">
          <div className="flex items-center space-x-1.5">
            <span className="text-base font-black text-slate-900 dark:text-white">₹{product.price}</span>
            {product.oldPrice && product.oldPrice > product.price && (
              <span className="text-xs text-slate-400 line-through font-semibold">₹{product.oldPrice}</span>
            )}
          </div>
          <p className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center">
            ⚡ {product.eta}
          </p>
        </div>

        {/* Add Button Section */}
        <div className="w-20 flex justify-end">
          {!product.inStock ? (
            <button
              disabled
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-400 rounded-xl text-xs font-black w-full cursor-not-allowed"
            >
              OUT
            </button>
          ) : quantity > 0 ? (
            <div className="flex items-center justify-between bg-emerald-600 text-white rounded-xl py-1 px-1.5 w-full shadow-md shadow-emerald-500/10 transition-all select-none">
              <button 
                onClick={handleDecrement}
                className="hover:bg-emerald-700/80 p-1 rounded-lg transition-colors"
              >
                <FiMinus className="h-3.5 w-3.5 stroke-[3]" />
              </button>
              <span className="text-xs font-black">{quantity}</span>
              <button 
                onClick={handleIncrement}
                className="hover:bg-emerald-700/80 p-1 rounded-lg transition-colors"
              >
                <FiPlus className="h-3.5 w-3.5 stroke-[3]" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddClick}
              className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/30 hover:border-emerald-500 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white rounded-xl text-xs font-black w-full transition-all active:scale-95 flex items-center justify-center space-x-1"
            >
              <span>ADD</span>
            </button>
          )}
        </div>
      </div>

    </motion.div>
  );
};

export default ProductCard;
