import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import { FaGoogle, FaApple } from 'react-icons/fa';
import { loginStart, loginSuccess, loginFailure } from '../redux/authSlice';
import { apiService } from '../services/apiService';
import { useToast } from '../components/Toast';

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const triggerToast = useToast();
  
  const { isLoading } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    dispatch(loginStart());
    try {
      const response = await apiService.login(email, password);
      dispatch(loginSuccess(response));
      triggerToast(`Welcome back, ${response.user.name}!`, 'success');
      navigate('/');
    } catch (err) {
      dispatch(loginFailure(err.message || 'Login failed'));
      triggerToast(err.message || 'Invalid email or password', 'error');
    }
  };

  const handleSocialClick = (platform) => {
    const useMockApi = import.meta.env.VITE_USE_MOCK_API !== 'false';
    if (!useMockApi) {
      triggerToast('Social Login is not supported with the real backend. Please sign in with email and password or register a new account.', 'warning');
      return;
    }
    dispatch(loginStart());
    setTimeout(() => {
      const mockResponse = {
        user: {
          name: `Social User (${platform})`,
          email: `${platform.toLowerCase()}user@gmail.com`,
          phone: '+91 99887 76655',
          savedAddresses: [
            { id: '1', tag: 'Home', address: 'Cyber City, Gurgaon, Haryana' }
          ],
          wishlist: [],
          orders: []
        },
        token: 'mock-oauth-token-1245'
      };
      dispatch(loginSuccess(mockResponse));
      triggerToast(`Successfully logged in via ${platform}!`, 'success');
      navigate('/');
    }, 400);
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-6 px-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/40 rounded-3xl p-6 sm:p-10 w-full max-w-md shadow-2xl relative overflow-hidden">
        
        {/* Decorative circle */}
        <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-emerald-500/5 dark:bg-emerald-400/5" />
        
        <div className="text-center space-y-2 mb-8 relative">
          <h2 className="text-2xl font-black font-display text-slate-900 dark:text-white">Welcome Back</h2>
          <p className="text-xs text-slate-400 font-bold">Sign in to your freshbasket account to access orders</p>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-4 relative">
          
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Email Address</label>
            <div className="relative group">
              <input
                required
                type="email"
                placeholder="alex@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-950 border border-transparent focus:border-emerald-500/30 rounded-2xl text-xs font-semibold outline-none focus:ring-4 focus:ring-emerald-500/10 text-slate-900 dark:text-white"
              />
              <FiMail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Password</label>
              <Link to="/otp" className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold hover:underline">Forgot?</Link>
            </div>
            <div className="relative group">
              <input
                required
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-950 border border-transparent focus:border-emerald-500/30 rounded-2xl text-xs font-semibold outline-none focus:ring-4 focus:ring-emerald-500/10 text-slate-900 dark:text-white"
              />
              <FiLock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black shadow-lg shadow-emerald-500/10 active:scale-95 transition-all flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In Securely</span>
                <FiArrowRight className="w-4 h-4 stroke-[3]" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <div className="flex-grow h-px bg-slate-100 dark:bg-slate-800" />
          <span className="mx-3">Or Connect With</span>
          <div className="flex-grow h-px bg-slate-100 dark:bg-slate-800" />
        </div>

        {/* Social SSO Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => handleSocialClick('Google')}
            className="py-2.5 px-4 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-850 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl flex items-center justify-center space-x-2 text-xs font-bold transition-all text-slate-700 dark:text-slate-200"
          >
            <FaGoogle className="w-4.5 h-4.5 text-rose-500" />
            <span>Google</span>
          </button>
          
          <button
            onClick={() => handleSocialClick('Apple')}
            className="py-2.5 px-4 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-850 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl flex items-center justify-center space-x-2 text-xs font-bold transition-all text-slate-700 dark:text-slate-200"
          >
            <FaApple className="w-4.5 h-4.5 text-slate-900 dark:text-white" />
            <span>Apple</span>
          </button>
        </div>

        {/* Register Links */}
        <div className="text-center text-xs font-semibold text-slate-450 mt-4">
          <span>New to freshbasket? </span>
          <Link to="/register" className="text-emerald-600 dark:text-emerald-400 font-extrabold hover:underline">Create Account</Link>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
