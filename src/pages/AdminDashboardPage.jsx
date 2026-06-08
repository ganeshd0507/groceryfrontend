import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  FiPieChart, FiBox, FiShoppingBag, FiDollarSign, 
  FiAlertTriangle, FiTrash2, FiEdit2, FiPlus, FiX 
} from 'react-icons/fi';
import { apiService } from '../services/apiService';
import { 
  setProductsStart, setProductsSuccess, setProductsFailure,
  setCategoriesSuccess, addCategoryLocal,
  addProductLocal, updateProductLocal, deleteProductLocal 
} from '../redux/productSlice';
import { useToast } from '../components/Toast';
import { selectUser, selectIsAuthenticated } from '../redux/authSlice';

const AdminDashboardPage = () => {
  const dispatch = useDispatch();
  const triggerToast = useToast();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'analytics';

  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const useMockApi = import.meta.env.VITE_USE_MOCK_API !== 'false';

  const { items: products, categories, loading } = useSelector((state) => state.products);

  useEffect(() => {
    if (useMockApi) return;
    if (!isAuthenticated) {
      triggerToast('Access denied. Please sign in as an admin!', 'warning');
      navigate('/login');
    } else if (user?.role !== 'ADMIN') {
      triggerToast('Access denied. Admin privileges required!', 'warning');
      navigate('/dashboard');
    }
  }, [isAuthenticated, user, navigate, triggerToast, useMockApi]);

  // States
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddModalCategoty, setShowAddModalCategoty] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Product Form states
  const [prodId, setProdId] = useState('');
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState('');
  const [prodPrice, setProdPrice] = useState(0);
  const [prodOldPrice, setProdOldPrice] = useState(0);
  const [prodWeight, setProdWeight] = useState('500 g');
  const [prodDescription, setProdDescription] = useState('');
  const [prodImage, setProdImage] = useState('https://images.unsplash.com/photo-1610348725531-843dff163e2c?auto=format&fit=crop&q=80&w=400');
  const [prodImages, setProdImages] = useState('');
  const [prodInStock, setProdInStock] = useState(true);
  const [prodDiscount, setProdDiscount] = useState(0);
  const [prodEta, setProdEta] = useState('10 mins');

  const [categoryName, setCategoryName] = useState('');
  const [count, setCount] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
    const fetchAdminData = async () => {
      // Fetch products
      dispatch(setProductsStart());
      try {
        const data = await apiService.getProducts();
        dispatch(setProductsSuccess(data));
      } catch {
        dispatch(setProductsFailure('Failed to load products'));
      }

      // Fetch categories
      try {
        const data = await apiService.getCategories();
        dispatch(setCategoriesSuccess(data));
      } catch {
        triggerToast('Failed to load categories', 'error');
      }

      // Fetch orders
      setOrdersLoading(true);
      try {
        const orderData = await apiService.getOrders();
        setOrders(orderData);
      } catch {
        triggerToast('Failed to load active orders', 'error');
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchAdminData();
  }, [dispatch, triggerToast]);

  useEffect(() => {
    if (categories.length > 0 && !prodCategory) {
      setProdCategory(categories[0].id);
    }
  }, [categories, prodCategory]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const imagesArray = prodImages
      ? prodImages.split(',').map(img => img.trim()).filter(img => img)
      : [];
    const payload = {
      id: prodId || undefined,
      name: prodName,
      category: prodCategory,
      price: Number(prodPrice),
      oldPrice: prodOldPrice ? Number(prodOldPrice) : Number(prodPrice),
      weight: prodWeight,
      description: prodDescription,
      image: prodImage,
      images: imagesArray,
      inStock: prodInStock,
      discount: Number(prodDiscount),
      eta: prodEta
    };

    try {
      const response = await apiService.addProduct(payload);
      dispatch(addProductLocal(response));
      triggerToast('Product added successfully to inventory!', 'success');
      setShowAddModal(false);
      resetForm();
    } catch {
      triggerToast('Failed to add product', 'error');
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    const payload = {
      name: categoryName,
      image: image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=200',
      count: count ? Number(count) : 0
    };

    try {
      const response = await apiService.addCategory(payload);
      dispatch(addCategoryLocal(response));
      triggerToast('Category added successfully!', 'success');
      setShowAddModalCategoty(false);
      resetCategoryForm();
    } catch {
      triggerToast('Failed to add category', 'error');
    }
  };

  const handleEditClick = (prod) => {
    setSelectedProduct(prod);
    setProdId(prod.id);
    setProdName(prod.name);
    setProdCategory(prod.category);
    setProdPrice(prod.price);
    setProdOldPrice(prod.oldPrice || 0);
    setProdWeight(prod.weight);
    setProdDescription(prod.description);
    setProdImage(prod.image);
    setProdImages(prod.images ? prod.images.join(', ') : '');
    setProdInStock(prod.inStock);
    setProdDiscount(prod.discount || 0);
    setProdEta(prod.eta || '10 mins');
    setShowEditModal(true);
  };

  const handleEditProductSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const imagesArray = prodImages
      ? prodImages.split(',').map(img => img.trim()).filter(img => img)
      : [];

    const payload = {
      name: prodName,
      category: prodCategory,
      price: Number(prodPrice),
      oldPrice: prodOldPrice ? Number(prodOldPrice) : Number(prodPrice),
      weight: prodWeight,
      description: prodDescription,
      image: prodImage,
      images: imagesArray,
      inStock: prodInStock,
      discount: Number(prodDiscount),
      eta: prodEta
    };

    try {
      const response = await apiService.updateProduct(selectedProduct.id, payload);
      dispatch(updateProductLocal(response));
      triggerToast('Product details updated successfully!', 'success');
      setShowEditModal(false);
      setSelectedProduct(null);
      resetForm();
    } catch {
      triggerToast('Failed to update product details', 'error');
    }
  };

  const handleDeleteClick = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name} from catalog?`)) {
      try {
        await apiService.deleteProduct(id);
        dispatch(deleteProductLocal(id));
        triggerToast('Product deleted from inventory catalog', 'info');
      } catch {
        triggerToast('Failed to delete product', 'error');
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await apiService.updateOrderStatus(id, newStatus);
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
      triggerToast(`Order status updated to ${newStatus}`, 'success');
    } catch {
      triggerToast('Failed to update order status', 'error');
    }
  };

  const resetForm = () => {
    setProdId('');
    setProdName('');
    setProdCategory(categories[0]?.id || '');
    setProdPrice(0);
    setProdOldPrice(0);
    setProdWeight('500 g');
    setProdDescription('');
    setProdImage('https://images.unsplash.com/photo-1610348725531-843dff163e2c?auto=format&fit=crop&q=80&w=400');
    setProdImages('');
    setProdInStock(true);
    setProdDiscount(0);
    setProdEta('10 mins');
  };

  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const resetCategoryForm = () => {
    setCategoryName('');
    setImage('');
    setCount('');
  };

  // Financial aggregates
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const outOfStockItems = products.filter(p => !p.inStock).length;
  
  // Tab menu controls
  const adminTabs = [
    { id: 'analytics', label: 'Sales Overview', icon: FiPieChart },
    { id: 'inventory', label: 'Manage Inventory', icon: FiBox },
    { id: 'orders', label: 'Active Orders', icon: FiShoppingBag }
  ];

  return (
    <div className="space-y-8 pb-12">
      
      {/* Top statistics overview bar */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/20 dark:border-slate-800/20 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] text-slate-450 uppercase font-black tracking-wider">Total Sales Revenue</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">₹{totalRevenue}</p>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl text-emerald-650 dark:text-emerald-400">
            <FiDollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/20 dark:border-slate-800/20 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] text-slate-450 uppercase font-black tracking-wider">Active Bookings</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{totalOrders}</p>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-2xl text-blue-600 dark:text-blue-400">
            <FiShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/20 dark:border-slate-800/20 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] text-slate-450 uppercase font-black tracking-wider">Stock Alerts</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{outOfStockItems}</p>
          </div>
          <div className="p-3 bg-rose-50 dark:bg-rose-950/20 rounded-2xl text-rose-600 dark:text-rose-450">
            <FiAlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/20 dark:border-slate-800/20 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] text-slate-450 uppercase font-black tracking-wider">Unique SKUs</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{products.length}</p>
          </div>
          <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-2xl text-amber-600 dark:text-amber-400">
            <FiBox className="w-6 h-6" />
          </div>
        </div>

      </section>

      {/* Tabs Layout */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200/40 dark:border-slate-800/45 pb-3">
        {adminTabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setSearchParams({ tab: tab.id })}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-2xl text-xs font-black transition-all ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Panels */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200/30 dark:border-slate-800/30 p-4 sm:p-6 rounded-3xl shadow-sm">
        
        {/* Tab 1: Analytics & charts */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">Weekly Revenue Stream</h3>
              <p className="text-xs text-slate-450 font-bold">Mock visualization using responsive SVG coordinates</p>
            </div>
            
            {/* Custom SVG Line Chart */}
            <div className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/10 rounded-3xl p-4">
              <svg className="w-full h-64" viewBox="0 0 700 200" preserveAspectRatio="none">
                {/* Grid Lines */}
                <line x1="50" y1="30" x2="650" y2="30" stroke="#f1f5f9" strokeWidth="1" className="dark:stroke-slate-850" />
                <line x1="50" y1="80" x2="650" y2="80" stroke="#f1f5f9" strokeWidth="1" className="dark:stroke-slate-850" />
                <line x1="50" y1="130" x2="650" y2="130" stroke="#f1f5f9" strokeWidth="1" className="dark:stroke-slate-850" />
                <line x1="50" y1="170" x2="650" y2="170" stroke="#cbd5e1" strokeWidth="1" className="dark:stroke-slate-800" />
                
                {/* Chart Path */}
                <path
                  d="M 50 170 L 150 130 L 250 150 L 350 80 L 450 90 L 550 50 L 650 30"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                
                {/* Area under Chart */}
                <path
                  d="M 50 170 L 150 130 L 250 150 L 350 80 L 450 90 L 550 50 L 650 30 L 650 170 Z"
                  fill="url(#chart-grad)"
                  opacity="0.12"
                />
                
                {/* Gradients */}
                <defs>
                  <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </linearGradient>
                </defs>
                
                {/* Dots at pivots */}
                {[
                  { x: 50, y: 170, label: 'Mon' },
                  { x: 150, y: 130, label: 'Tue' },
                  { x: 250, y: 150, label: 'Wed' },
                  { x: 350, y: 80, label: 'Thu' },
                  { x: 450, y: 90, label: 'Fri' },
                  { x: 550, y: 50, label: 'Sat' },
                  { x: 650, y: 30, label: 'Sun' }
                ].map((pivot, idx) => (
                  <g key={idx}>
                    <circle cx={pivot.x} cy={pivot.y} r="5" fill="#10b981" stroke="#fff" strokeWidth="1.5" />
                    <text x={pivot.x} y="190" textAnchor="middle" fill="#94a3b8" className="text-[10px] font-black font-sans">{pivot.label}</text>
                  </g>
                ))}
              </svg>
            </div>
            
            {/* Summary grids */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-slate-100 dark:border-slate-850 p-5 rounded-3xl space-y-4">
                <h4 className="text-xs font-black uppercase text-slate-400">Inventory Status breakdown</h4>
                <div className="flex items-center space-x-6 justify-center py-4">
                  <div className="text-center">
                    <p className="text-lg font-black text-emerald-650">{products.length - outOfStockItems}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Available</p>
                  </div>
                  <div className="w-px h-10 bg-slate-200 dark:bg-slate-800" />
                  <div className="text-center">
                    <p className="text-lg font-black text-rose-500">{outOfStockItems}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Sold Out</p>
                  </div>
                </div>
              </div>

              <div className="border border-slate-100 dark:border-slate-850 p-5 rounded-3xl space-y-4">
                <h4 className="text-xs font-black uppercase text-slate-400">Order Delivery Fulfilments</h4>
                <div className="flex items-center space-x-6 justify-center py-4">
                  <div className="text-center">
                    <p className="text-lg font-black text-slate-900 dark:text-white">
                      {orders.filter(o => o.status === 'Delivered').length}
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Fulfilled</p>
                  </div>
                  <div className="w-px h-10 bg-slate-200 dark:bg-slate-800" />
                  <div className="text-center">
                    <p className="text-lg font-black text-amber-500">
                      {orders.filter(o => o.status !== 'Delivered').length}
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Pending Delivery</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Manage Inventory */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-3">
              <div>
                <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">Catalog Inventory</h3>
                <p className="text-xs text-slate-400 font-semibold">Listing all available stock SKUs</p>
              </div>
              <button
                onClick={openAddModal}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center space-x-1.5 shadow-md shadow-emerald-500/10 active:scale-95"
              >
                <FiPlus className="stroke-[3]" />
                <span>NEW PRODUCT</span>
              </button>

              <button
                onClick={() => setShowAddModalCategoty(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center space-x-1.5 shadow-md shadow-emerald-500/10 active:scale-95"
              >
                <FiPlus className="stroke-[3]" />
                <span>NEW CATEGORY</span>
              </button>
            </div>

            {loading ? (
              <div className="space-y-4 animate-pulse py-4">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="h-12 bg-slate-100 dark:bg-slate-850 rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200/40 dark:border-slate-800 text-[10px] text-slate-400 uppercase font-black">
                      <th className="py-3 px-4">Item Details</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Stock</th>
                      <th className="py-3 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-850 text-xs font-bold">
                    {products.map((prod) => (
                      <tr key={prod.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                        <td className="py-3 px-4 flex items-center space-x-3">
                          <img src={prod.image} alt={prod.name} className="w-9 h-9 object-cover rounded-lg border bg-slate-50 dark:bg-slate-950 dark:border-slate-850" />
                          <div>
                            <p className="font-extrabold text-slate-900 dark:text-white leading-tight">{prod.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold mt-0.5">{prod.weight}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-500 dark:text-slate-400 uppercase tracking-wide text-[10px]">{prod.category}</td>
                        <td className="py-3 px-4">
                          <span className="text-slate-900 dark:text-white">₹{prod.price}</span>
                          {prod.oldPrice > prod.price && (
                            <span className="text-slate-400 line-through ml-1 text-[10px]">₹{prod.oldPrice}</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-lg text-[9px] uppercase tracking-wider font-bold ${
                            prod.inStock
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/20'
                              : 'bg-rose-50 text-rose-650 border border-rose-100 dark:bg-rose-950/20'
                          }`}>
                            {prod.inStock ? 'In Stock' : 'Sold Out'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex justify-center space-x-1.5">
                            <button
                              onClick={() => handleEditClick(prod)}
                              className="p-1.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                            >
                              <FiEdit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(prod.id, prod.name)}
                              className="p-1.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-rose-500 transition-colors"
                            >
                              <FiTrash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Active Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">Active Bookings Monitor</h3>
              <p className="text-xs text-slate-400 font-semibold">Monitor and change status updates of client fulfillments</p>
            </div>

            {ordersLoading ? (
              <div className="space-y-4 animate-pulse">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div key={idx} className="h-16 bg-slate-100 dark:bg-slate-850 rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200/40 dark:border-slate-800 text-[10px] text-slate-400 uppercase font-black">
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Subtotal</th>
                      <th className="py-3 px-4">Shipping Location</th>
                      <th className="py-3 px-4">Fulfilment Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-850 text-xs font-semibold text-slate-500">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                        <td className="py-3 px-4 font-black text-slate-900 dark:text-white">{ord.id}</td>
                        <td className="py-3 px-4">{new Date(ord.date).toLocaleDateString()}</td>
                        <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">₹{ord.total}</td>
                        <td className="py-3 px-4 truncate max-w-[180px]">{ord.address}</td>
                        <td className="py-3 px-4">
                          <select
                            value={ord.status}
                            onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                            className={`px-2 py-1 rounded-xl outline-none border text-[10px] font-black cursor-pointer uppercase ${
                              ord.status === 'Delivered'
                                ? 'bg-emerald-50 text-emerald-650 border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900'
                                : 'bg-amber-50 text-amber-650 border-amber-100 dark:bg-amber-950/20 dark:border-amber-900'
                            }`}
                          >
                            <option value="Processing">Processing</option>
                            <option value="Dispatched">Dispatched</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </section>

      {/* Add Category Modal */}
      {showAddModalCategoty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-lg border border-slate-100 dark:border-slate-800 shadow-2xl relative my-8">
            <button 
              onClick={() => setShowAddModalCategoty(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:opacity-85 transition-opacity"
            >
              <FiX className="h-5 w-5" />
            </button>
            
            <h3 className="text-lg font-black font-display mb-4 text-slate-900 dark:text-white">Add New Catalog Category</h3>
            
            <form onSubmit={handleAddCategory} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
              
              <div className="sm:col-span-2 space-y-1">
                <label className="text-[10px] text-slate-450 font-bold uppercase">Name</label>
                <input required type="text" placeholder="Organic Fruits" value={categoryName} onChange={e => setCategoryName(e.target.value)} className="w-full p-2.5 bg-slate-100 dark:bg-slate-950 rounded-xl outline-none text-slate-900 dark:text-white border border-transparent focus:border-emerald-500/20" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-450 font-bold uppercase">Image URL</label>
                <input type="text" placeholder="https://images.unsplash.com/..." value={image} onChange={e => setImage(e.target.value)} className="w-full p-2.5 bg-slate-100 dark:bg-slate-950 rounded-xl outline-none text-slate-900 dark:text-white border border-transparent focus:border-emerald-500/20" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-450 font-bold uppercase">Initial Count</label>
                <input type="number" placeholder="0" value={count} onChange={e => setCount(e.target.value)} className="w-full p-2.5 bg-slate-100 dark:bg-slate-950 rounded-xl outline-none text-slate-900 dark:text-white border border-transparent focus:border-emerald-500/20" />
              </div>

              <button
                type="submit"
                className="sm:col-span-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black shadow-md"
              >
                Save New Category
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-lg border border-slate-100 dark:border-slate-800 shadow-2xl relative my-8 text-slate-900 dark:text-white">
            <button 
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:opacity-85 transition-opacity"
            >
              <FiX className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            </button>
            
            <h3 className="text-lg font-black font-display mb-4 text-slate-900 dark:text-white">Add New Catalog Product</h3>
            
            <form onSubmit={handleAddProduct} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
              
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase">Product ID (Optional)</label>
                <input type="text" placeholder="e.g. P001" value={prodId} onChange={e => setProdId(e.target.value)} className="w-full p-2.5 bg-slate-100 dark:bg-slate-950 rounded-xl outline-none text-slate-900 dark:text-white border border-transparent focus:border-emerald-500/20" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase">Name</label>
                <input required type="text" placeholder="Organic Strawberries" value={prodName} onChange={e => setProdName(e.target.value)} className="w-full p-2.5 bg-slate-100 dark:bg-slate-950 rounded-xl outline-none text-slate-900 dark:text-white border border-transparent focus:border-emerald-500/20" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase">Category</label>
                <select value={prodCategory} onChange={e => setProdCategory(e.target.value)} className="w-full p-2.5 bg-slate-100 dark:bg-slate-950 rounded-xl outline-none text-slate-900 dark:text-white border border-transparent focus:border-emerald-500/20 cursor-pointer">
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase">Price (₹)</label>
                <input required type="number" value={prodPrice} onChange={e => setProdPrice(e.target.value)} className="w-full p-2.5 bg-slate-100 dark:bg-slate-950 rounded-xl outline-none text-slate-900 dark:text-white border border-transparent focus:border-emerald-500/20" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase">Old Price (₹)</label>
                <input type="number" value={prodOldPrice} onChange={e => setProdOldPrice(e.target.value)} className="w-full p-2.5 bg-slate-100 dark:bg-slate-950 rounded-xl outline-none text-slate-900 dark:text-white border border-transparent focus:border-emerald-500/20" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase">Discount (%)</label>
                <input type="number" value={prodDiscount} onChange={e => setProdDiscount(e.target.value)} className="w-full p-2.5 bg-slate-100 dark:bg-slate-950 rounded-xl outline-none text-slate-900 dark:text-white border border-transparent focus:border-emerald-500/20" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase">Weight (e.g. 500 g)</label>
                <input required type="text" placeholder="250 g" value={prodWeight} onChange={e => setProdWeight(e.target.value)} className="w-full p-2.5 bg-slate-100 dark:bg-slate-950 rounded-xl outline-none text-slate-900 dark:text-white border border-transparent focus:border-emerald-500/20" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase">ETA Checker (e.g. 10 mins)</label>
                <input required type="text" placeholder="10 mins" value={prodEta} onChange={e => setProdEta(e.target.value)} className="w-full p-2.5 bg-slate-100 dark:bg-slate-950 rounded-xl outline-none text-slate-900 dark:text-white border border-transparent focus:border-emerald-500/20" />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase">Main Image URL</label>
                <input required type="text" placeholder="https://example.com/images/apple.jpg" value={prodImage} onChange={e => setProdImage(e.target.value)} className="w-full p-2.5 bg-slate-100 dark:bg-slate-950 rounded-xl outline-none text-slate-900 dark:text-white border border-transparent focus:border-emerald-500/20" />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase">Additional Image URLs (Comma-separated)</label>
                <textarea placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg" value={prodImages} onChange={e => setProdImages(e.target.value)} className="w-full p-2.5 bg-slate-100 dark:bg-slate-950 rounded-xl outline-none text-slate-900 dark:text-white min-h-[50px] border border-transparent focus:border-emerald-500/20" />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase">Description</label>
                <textarea value={prodDescription} onChange={e => setProdDescription(e.target.value)} className="w-full p-2.5 bg-slate-100 dark:bg-slate-950 rounded-xl outline-none text-slate-900 dark:text-white min-h-[60px] border border-transparent focus:border-emerald-500/20" />
              </div>

              <div className="sm:col-span-2 flex items-center space-x-3 py-1 text-slate-700 dark:text-slate-350">
                <input type="checkbox" checked={prodInStock} onChange={e => setProdInStock(e.target.checked)} className="w-4.5 h-4.5 accent-emerald-600" id="prodInStock" />
                <label htmlFor="prodInStock" className="cursor-pointer font-bold">Product is in Stock</label>
              </div>

              {categories.length === 0 ? (
                <div className="sm:col-span-2 text-rose-500 font-bold bg-rose-50 dark:bg-rose-950/20 p-3 rounded-xl border border-rose-100 dark:border-rose-900 text-center">
                  Please add at least one category before adding a product.
                </div>
              ) : (
                <button
                  type="submit"
                  className="sm:col-span-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black shadow-md shadow-emerald-500/10 active:scale-95"
                >
                  Save New Product
                </button>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-lg border border-slate-100 dark:border-slate-800 shadow-2xl relative my-8 text-slate-900 dark:text-white">
            <button 
              onClick={() => setShowEditModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:opacity-85 transition-opacity"
            >
              <FiX className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            </button>
            
            <h3 className="text-lg font-black font-display mb-4 text-slate-900 dark:text-white">Modify Catalog Item</h3>
            
            <form onSubmit={handleEditProductSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
              
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase">Name</label>
                <input required type="text" value={prodName} onChange={e => setProdName(e.target.value)} className="w-full p-2.5 bg-slate-100 dark:bg-slate-950 rounded-xl outline-none text-slate-900 dark:text-white border border-transparent focus:border-emerald-500/20" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase">Category</label>
                <select value={prodCategory} onChange={e => setProdCategory(e.target.value)} className="w-full p-2.5 bg-slate-100 dark:bg-slate-950 rounded-xl outline-none text-slate-900 dark:text-white border border-transparent focus:border-emerald-500/20 cursor-pointer">
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase">Price (₹)</label>
                <input required type="number" value={prodPrice} onChange={e => setProdPrice(e.target.value)} className="w-full p-2.5 bg-slate-100 dark:bg-slate-950 rounded-xl outline-none text-slate-900 dark:text-white border border-transparent focus:border-emerald-500/20" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase">Old Price (₹)</label>
                <input type="number" value={prodOldPrice} onChange={e => setProdOldPrice(e.target.value)} className="w-full p-2.5 bg-slate-100 dark:bg-slate-950 rounded-xl outline-none text-slate-900 dark:text-white border border-transparent focus:border-emerald-500/20" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase">Discount (%)</label>
                <input type="number" value={prodDiscount} onChange={e => setProdDiscount(e.target.value)} className="w-full p-2.5 bg-slate-100 dark:bg-slate-950 rounded-xl outline-none text-slate-900 dark:text-white border border-transparent focus:border-emerald-500/20" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase">Weight</label>
                <input required type="text" value={prodWeight} onChange={e => setProdWeight(e.target.value)} className="w-full p-2.5 bg-slate-100 dark:bg-slate-950 rounded-xl outline-none text-slate-900 dark:text-white border border-transparent focus:border-emerald-500/20" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase">ETA Delivery</label>
                <input required type="text" value={prodEta} onChange={e => setProdEta(e.target.value)} className="w-full p-2.5 bg-slate-100 dark:bg-slate-950 rounded-xl outline-none text-slate-900 dark:text-white border border-transparent focus:border-emerald-500/20" />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase">Main Image URL</label>
                <input required type="text" value={prodImage} onChange={e => setProdImage(e.target.value)} className="w-full p-2.5 bg-slate-100 dark:bg-slate-950 rounded-xl outline-none text-slate-900 dark:text-white border border-transparent focus:border-emerald-500/20" />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase">Additional Image URLs (Comma-separated)</label>
                <textarea placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg" value={prodImages} onChange={e => setProdImages(e.target.value)} className="w-full p-2.5 bg-slate-100 dark:bg-slate-950 rounded-xl outline-none text-slate-900 dark:text-white min-h-[50px] border border-transparent focus:border-emerald-500/20" />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase">Description</label>
                <textarea value={prodDescription} onChange={e => setProdDescription(e.target.value)} className="w-full p-2.5 bg-slate-100 dark:bg-slate-950 rounded-xl outline-none text-slate-900 dark:text-white min-h-[60px] border border-transparent focus:border-emerald-500/20" />
              </div>

              <div className="sm:col-span-2 flex items-center space-x-3 py-1 text-slate-700 dark:text-slate-350">
                <input type="checkbox" checked={prodInStock} onChange={e => setProdInStock(e.target.checked)} className="w-4.5 h-4.5 accent-emerald-600" id="editProdInStock" />
                <label htmlFor="editProdInStock" className="cursor-pointer font-bold">Product is in Stock</label>
              </div>

              <button
                type="submit"
                className="sm:col-span-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black shadow-md shadow-emerald-500/10 active:scale-95"
              >
                Save Modifications
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboardPage;
