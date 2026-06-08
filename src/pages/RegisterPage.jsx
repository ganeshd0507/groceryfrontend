import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiUser, FiMail, FiPhone, FiArrowRight, FiLock } from 'react-icons/fi';
import { loginStart, loginSuccess, loginFailure } from '../redux/authSlice';
import { apiService } from '../services/apiService';
import { useToast } from '../components/Toast';

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const triggerToast = useToast();

  const { isLoading } = useSelector((state) => state.auth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('USER');

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !phone) return;

    dispatch(loginStart());
    try {
      const response = await apiService.register({ name, email, password, phone, role });
      dispatch(loginSuccess(response));
      triggerToast(`Account created! Welcome, ${name}!`, 'success');
      navigate('/');
    } catch (err) {
      dispatch(loginFailure(err.message || 'Registration failed'));
      triggerToast(err.message || 'Failed to create account', 'error');
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-6 px-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/40 rounded-3xl p-6 sm:p-10 w-full max-w-md shadow-2xl relative overflow-hidden">
        
        {/* Decorative circle */}
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-emerald-500/5 dark:bg-emerald-400/5" />
        
        <div className="text-center space-y-2 mb-8 relative">
          <h2 className="text-2xl font-black font-display text-slate-900 dark:text-white">Create Account</h2>
          <p className="text-xs text-slate-400 font-bold">Join freshbasket today for rapid 10-minute deliveries</p>
        </div>

        <form onSubmit={handleRegisterSubmit} className="space-y-4 relative text-left">
          
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Full Name</label>
            <div className="relative group">
              <input
                required
                type="text"
                placeholder="Alex Mercer"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-950 border border-transparent focus:border-emerald-500/30 rounded-2xl text-xs font-semibold outline-none focus:ring-4 focus:ring-emerald-500/10 text-slate-900 dark:text-white"
              />
              <FiUser className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500" />
            </div>
          </div>

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
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Password</label>
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

          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Phone Number</label>
            <div className="relative group">
              <input
                required
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-950 border border-transparent focus:border-emerald-500/30 rounded-2xl text-xs font-semibold outline-none focus:ring-4 focus:ring-emerald-500/10 text-slate-900 dark:text-white"
              />
              <FiPhone className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Account Type</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-950 border border-transparent focus:border-emerald-500/30 rounded-2xl text-xs font-semibold outline-none focus:ring-4 focus:ring-emerald-500/10 text-slate-900 dark:text-white cursor-pointer"
            >
              <option value="USER">Customer Account (User)</option>
              <option value="ADMIN">Store Manager (Admin)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black shadow-lg shadow-emerald-500/10 active:scale-95 transition-all flex items-center justify-center space-x-2 pt-3"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Register & Continue</span>
                <FiArrowRight className="w-4 h-4 stroke-[3]" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs font-semibold text-slate-450 mt-6 border-t border-slate-100 dark:border-slate-800/50 pt-4">
          <span>Already have an account? </span>
          <Link to="/login" className="text-emerald-600 dark:text-emerald-400 font-extrabold hover:underline">Sign In</Link>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;
