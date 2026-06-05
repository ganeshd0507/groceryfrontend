import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiChevronLeft, FiShoppingBag, FiTruck, FiStar, FiShield, FiHeart, FiPlus, FiMinus } from 'react-icons/fi';

import { apiService } from '../services/apiService';
import { DetailSkeleton } from '../components/SkeletonLoader';
import ProductCard from '../components/ProductCard';
import { addToCart, updateQuantity, cartSelector } from '../redux/cartSlice';
import { toggleWishlist, selectWishlist, selectIsAuthenticated } from '../redux/authSlice';
import { useToast } from '../components/Toast';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const triggerToast = useToast();

  const cart = useSelector(cartSelector);
  const wishlist = useSelector(selectWishlist);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { items: allProducts } = useSelector((state) => state.products);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');

  // Find cart status
  const cartItem = cart.items.find((item) => item.id === id);
  const quantity = cartItem ? cartItem.quantity : 0;
  const isWishlisted = wishlist.includes(id);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await apiService.getProductById(id);
        setProduct(data);
        setActiveImage(data.image);
      } catch {
        triggerToast('Failed to fetch product details', 'error');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id, navigate, triggerToast]);

  const handleAddClick = () => {
    if (!product || !product.inStock) return;
    dispatch(addToCart({ product, quantity: 1 }));
    triggerToast(`Added ${product.name} to cart!`, 'success');
  };

  const handleIncrement = () => {
    dispatch(updateQuantity({ id: product.id, quantity: quantity + 1 }));
  };

  const handleDecrement = () => {
    dispatch(updateQuantity({ id: product.id, quantity: quantity - 1 }));
    if (quantity === 1) {
      triggerToast(`Removed ${product.name} from cart`, 'info');
    }
  };

  const handleWishlistClick = () => {
    if (!isAuthenticated) {
      triggerToast('Please login to manage wishlist!', 'warning');
      return;
    }
    dispatch(toggleWishlist(product.id));
    triggerToast(
      isWishlisted ? `Removed ${product.name} from wishlist` : `Added ${product.name} to wishlist!`,
      isWishlisted ? 'info' : 'success'
    );
  };

  if (loading) {
    return <DetailSkeleton />;
  }

  if (!product) {
    return null;
  }

  // Related products logic (same category, not including this product)
  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="space-y-12 pb-12">
      
      {/* Back button */}
      <div>
        <Link 
          to="/products"
          className="inline-flex items-center space-x-2 text-xs font-black text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
        >
          <FiChevronLeft className="w-4 h-4 stroke-[3]" />
          <span>BACK TO SHOPPING</span>
        </Link>
      </div>

      {/* Main Detail Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        
        {/* Images Gallery */}
        <div className="space-y-4">
          <div className="aspect-square bg-white dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/40 rounded-3xl overflow-hidden flex items-center justify-center p-4 shadow-sm relative">
            <img 
              src={activeImage} 
              alt={product.name} 
              className="max-h-full max-w-full object-contain rounded-2xl hover:scale-105 transition-transform duration-500" 
            />
            {product.discount > 0 && (
              <span className="absolute top-4 left-4 bg-rose-500 text-white font-black text-xs uppercase px-3 py-1 rounded-full tracking-wider shadow-sm">
                {product.discount}% OFF
              </span>
            )}
          </div>
          
          {/* Thumbnails (if multiple images exist) */}
          {product.images && product.images.length > 1 && (
            <div className="flex space-x-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border p-1 bg-white dark:bg-slate-900 transition-all ${
                    activeImage === img
                      ? 'border-emerald-500 shadow-sm ring-2 ring-emerald-500/20'
                      : 'border-slate-200/50 dark:border-slate-800'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover rounded-xl" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-1 rounded-lg">
              {product.category.replace('-', ' & ')}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight mt-2">{product.name}</h1>
            
            <div className="flex items-center space-x-3 text-xs font-bold text-slate-400">
              <div className="flex items-center text-amber-500 bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded-lg font-black text-xs">
                <FiStar className="h-3.5 w-3.5 fill-current mr-1" />
                <span>{product.rating}</span>
              </div>
              <span>•</span>
              <span>{product.reviewsCount} Customer Reviews</span>
            </div>
          </div>

          <div className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
            {product.description}
          </div>

          {/* Sizing & Stock status */}
          <div className="flex items-center space-x-6 border-y border-slate-200/40 dark:border-slate-800/40 py-4">
            <div>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Pack Net Weight</p>
              <p className="text-sm font-bold mt-1 text-slate-950 dark:text-white">{product.weight}</p>
            </div>
            
            <div className="h-8 border-l border-slate-200/40 dark:border-slate-800/40" />

            <div>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Availability</p>
              {product.inStock ? (
                <p className="text-sm font-bold mt-1 text-emerald-600 dark:text-emerald-400 flex items-center">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
                  In Stock (Fresh daily)
                </p>
              ) : (
                <p className="text-sm font-bold mt-1 text-rose-500 flex items-center">
                  <span className="w-2 h-2 rounded-full bg-rose-500 mr-2" />
                  Temporarily Sold Out
                </p>
              )}
            </div>
          </div>

          {/* Pricing & Add Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200/20 dark:border-slate-800/20">
            <div>
              <p className="text-[10px] text-slate-400 font-medium uppercase">Total Price</p>
              <div className="flex items-center space-x-2 mt-0.5">
                <span className="text-2xl font-black text-slate-950 dark:text-white">₹{product.price}</span>
                {product.oldPrice && product.oldPrice > product.price && (
                  <span className="text-sm text-slate-400 line-through font-bold">₹{product.oldPrice}</span>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3 w-full sm:w-auto">
              {/* Wishlist Button */}
              <button
                onClick={handleWishlistClick}
                className={`p-3 rounded-2xl border transition-all ${
                  isWishlisted 
                    ? 'bg-rose-50 text-rose-500 border-rose-100 dark:bg-rose-950/20 dark:border-rose-900' 
                    : 'bg-white dark:bg-slate-950 border-slate-200/60 dark:border-slate-800 hover:text-rose-500'
                }`}
              >
                <FiHeart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>

              {/* Add To Cart */}
              <div className="flex-1 sm:flex-none">
                {!product.inStock ? (
                  <button
                    disabled
                    className="w-full px-8 py-3 bg-slate-200 dark:bg-slate-800 text-slate-400 rounded-2xl text-sm font-black cursor-not-allowed text-center"
                  >
                    Out of Stock
                  </button>
                ) : quantity > 0 ? (
                  <div className="bg-emerald-600 text-white rounded-2xl py-2.5 px-4 flex items-center justify-between space-x-6 shadow-md shadow-emerald-500/10 font-bold text-sm">
                    <button onClick={handleDecrement} className="p-1 rounded hover:bg-emerald-700/80 transition-colors">
                      <FiMinus className="h-4.5 w-4.5 stroke-[3]" />
                    </button>
                    <span className="font-black text-base">{quantity}</span>
                    <button onClick={handleIncrement} className="p-1 rounded hover:bg-emerald-700/80 transition-colors">
                      <FiPlus className="h-4.5 w-4.5 stroke-[3]" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleAddClick}
                    className="w-full px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-sm font-black transition-all shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-95 flex items-center justify-center space-x-2"
                  >
                    <FiShoppingBag className="w-4 h-4" />
                    <span>Add to Basket</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Delivery ETA & Safety info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/20 dark:border-slate-800/20 flex items-start space-x-3">
              <FiTruck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-xs font-black">Superfast Delivery</h4>
                <p className="text-[11px] text-slate-400 font-bold mt-0.5">Delivered to your door in {product.eta}.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/20 dark:border-slate-800/20 flex items-start space-x-3">
              <FiShield className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-xs font-black">100% Quality Assurance</h4>
                <p className="text-[11px] text-slate-400 font-bold mt-0.5">Hygienically sorted and safely stored.</p>
              </div>
            </div>
          </div>

        </div>

      </section>

      {/* Nutrition Details Panel */}
      {product.nutrition && (
        <section className="p-6 bg-white dark:bg-slate-900 border border-slate-200/30 dark:border-slate-800/30 rounded-3xl shadow-sm space-y-4">
          <div>
            <h3 className="text-lg font-black font-display">Nutritional Value</h3>
            <p className="text-xs text-slate-400 font-bold">Approximate nutrition values per 100g serving</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {Object.entries(product.nutrition).map(([key, val]) => (
              <div key={key} className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200/10 rounded-2xl text-center">
                <p className="text-[10px] text-slate-400 uppercase font-medium">{key}</p>
                <p className="text-sm font-black text-slate-900 dark:text-white mt-1">{val}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related Products slider */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black font-display">Related Products</h2>
            <p className="text-xs text-slate-400 font-bold">Other choices you might be interested in</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} triggerToast={triggerToast} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};

export default ProductDetailsPage;
