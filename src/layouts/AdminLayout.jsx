import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  FiPieChart, FiBox, FiShoppingBag, FiArrowLeft, 
  FiMenu, FiX, FiMoon, FiSun, FiUser 
} from 'react-icons/fi';
import { toggleDarkMode, selectDarkMode } from '../redux/authSlice';

const AdminLayout = ({ children }) => {
  const darkMode = useSelector(selectDarkMode);
  const dispatch = useDispatch();
  const location = useLocation();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  const menuItems = [
    { name: 'Analytics & Sales', path: '/admin', icon: FiPieChart },
    { name: 'Inventory Manager', path: '/admin?tab=inventory', icon: FiBox },
    { name: 'Active Orders', path: '/admin?tab=orders', icon: FiShoppingBag },
  ];

  return (
    <div className={`min-h-screen flex ${darkMode ? 'dark text-slate-100 bg-slate-950' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200/50 dark:border-slate-800/50 shadow-sm shrink-0 transition-colors duration-300">
        
        {/* Brand */}
        <div className="h-20 flex items-center px-6 border-b border-slate-100 dark:border-slate-800">
          <Link to="/" className="text-xl font-black font-display tracking-tight text-emerald-600 dark:text-emerald-500">
            fresh<span className="text-amber-500 font-bold">admin</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            // Handle active checks for query params or exact path
            const isActive = location.pathname + location.search === item.path;
            
            return (
              <Link
                key={idx}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/10'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Back to Client */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <Link
            to="/"
            className="flex items-center justify-center space-x-2 w-full py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/55 rounded-2xl text-xs font-black transition-all"
          >
            <FiArrowLeft className="h-4.5 w-4.5" />
            <span>Store Front</span>
          </Link>
        </div>

      </aside>

      {/* Main Content Side */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Mobile Header */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 bg-white dark:bg-slate-900 border-b border-slate-200/50 dark:border-slate-800/50 lg:hidden shadow-sm z-30 shrink-0 transition-colors duration-300">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800"
            >
              <FiMenu className="h-5 w-5" />
            </button>
            <Link to="/" className="text-lg font-black font-display text-emerald-600 dark:text-emerald-500">
              fresh<span className="text-amber-500">admin</span>
            </Link>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => dispatch(toggleDarkMode())}
              className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-850"
            >
              {darkMode ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
            </button>
            <Link to="/dashboard" className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-850">
              <FiUser className="h-5 w-5 text-emerald-600" />
            </Link>
          </div>
        </header>

        {/* Top bar for Desktop */}
        <header className="hidden lg:flex items-center justify-between h-20 px-8 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/50 shrink-0 transition-colors duration-300">
          <h2 className="text-lg font-black font-display">Administrative Center</h2>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => dispatch(toggleDarkMode())}
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-850 text-slate-500 dark:text-slate-400 hover:bg-slate-100 transition-colors"
            >
              {darkMode ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
            </button>
            <div className="flex items-center space-x-3 p-1.5 pr-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-850 rounded-2xl">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                A
              </div>
              <div>
                <p className="text-xs font-bold leading-tight">Admin Manager</p>
                <p className="text-[10px] text-slate-400 font-semibold">Store Operator</p>
              </div>
            </div>
          </div>
        </header>

        {/* Inner Content Area */}
        <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>

      </div>

      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden animate-fadeIn"
        />
      )}

      {/* Mobile Drawer */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200/50 dark:border-slate-800/50 p-6 flex flex-col justify-between transition-transform duration-300 lg:hidden ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-xl font-black font-display tracking-tight text-emerald-600 dark:text-emerald-500">
              fresh<span className="text-amber-500">admin</span>
            </Link>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>

          <nav className="space-y-1.5">
            {menuItems.map((item, idx) => {
              const Icon = item.icon;
              const isActive = location.pathname + location.search === item.path;
              
              return (
                <Link
                  key={idx}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/10'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div>
          <Link
            to="/"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center justify-center space-x-2 w-full py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/50 rounded-2xl text-xs font-black transition-all"
          >
            <FiArrowLeft className="h-4.5 w-4.5" />
            <span>Store Front</span>
          </Link>
        </div>
      </aside>

    </div>
  );
};

export default AdminLayout;
