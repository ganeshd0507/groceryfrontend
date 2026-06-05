/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const triggerToast = useCallback((message, type = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prevToasts) => [...prevToasts, { id, message, type }]);

    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
  };

  const getToastStyles = (type) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-950/60',
          border: 'border-emerald-500/20',
          text: 'text-emerald-800 dark:text-emerald-300',
          icon: <FiCheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        };
      case 'error':
        return {
          bg: 'bg-rose-50 dark:bg-rose-950/60',
          border: 'border-rose-500/20',
          text: 'text-rose-800 dark:text-rose-300',
          icon: <FiAlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
        };
      case 'warning':
        return {
          bg: 'bg-amber-50 dark:bg-amber-950/60',
          border: 'border-amber-500/20',
          text: 'text-amber-800 dark:text-amber-300',
          icon: <FiAlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
        };
      default:
        return {
          bg: 'bg-slate-50 dark:bg-slate-900/80',
          border: 'border-slate-200 dark:border-slate-800',
          text: 'text-slate-800 dark:text-slate-200',
          icon: <FiInfo className="w-5 h-5 text-slate-500" />
        };
    }
  };

  return (
    <ToastContext.Provider value={triggerToast}>
      {children}
      
      {/* Toast Portal/Container */}
      <div className="fixed top-6 right-6 z-50 flex flex-col space-y-3 pointer-events-none max-w-sm w-full">
        <AnimatePresence>
          {toasts.map((t) => {
            const styles = getToastStyles(t.type);
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`pointer-events-auto p-4 rounded-2xl border ${styles.bg} ${styles.border} ${styles.text} shadow-xl flex items-center justify-between space-x-3 backdrop-blur-md`}
              >
                <div className="flex items-center space-x-3">
                  {styles.icon}
                  <span className="text-xs sm:text-sm font-bold tracking-tight">{t.message}</span>
                </div>
                <button
                  onClick={() => removeToast(t.id)}
                  className="p-1 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
                >
                  <FiX className="w-4 h-4 opacity-60 hover:opacity-100" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
export default ToastContext;
