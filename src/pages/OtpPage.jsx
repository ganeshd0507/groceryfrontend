import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FiChevronLeft, FiCheck } from 'react-icons/fi';
import { loginSuccess } from '../redux/authSlice';
import { useToast } from '../components/Toast';

const OtpPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const triggerToast = useToast();

  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(30);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index, value) => {
    // Only allow numeric input
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace delete
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        inputRefs[index - 1].current.focus();
      }
    }
  };

  const handleResend = () => {
    if (timer > 0) return;
    setTimer(30);
    triggerToast('OTP code resent successfully to +91 98765 43210!', 'info');
  };

  const handleVerify = (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 4) {
      triggerToast('Please complete the 4-digit code!', 'warning');
      return;
    }

    // Mock successful OTP verify
    const mockUserPayload = {
      user: {
        name: 'Alex Mercer (Verified)',
        email: 'alex.mercer@gmail.com',
        phone: '+91 98765 43210',
        savedAddresses: [
          { id: '1', tag: 'Home', address: 'Apartment 402, DLF Phase 3, Gurgaon, Haryana' }
        ],
        wishlist: [],
        orders: []
      },
      token: 'mock-jwt-otp-token'
    };

    dispatch(loginSuccess(mockUserPayload));
    triggerToast('OTP Verification Successful!', 'success');
    navigate('/');
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-6 px-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/40 rounded-3xl p-6 sm:p-10 w-full max-w-md shadow-2xl relative">
        
        {/* Back button */}
        <button 
          onClick={() => navigate('/login')}
          className="absolute top-6 left-6 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:opacity-85 text-slate-400 transition-opacity"
        >
          <FiChevronLeft className="w-4 h-4 stroke-[3]" />
        </button>

        <div className="text-center space-y-2 mb-8 mt-4">
          <h2 className="text-2xl font-black font-display text-slate-900 dark:text-white">OTP Verification</h2>
          <p className="text-xs text-slate-400 font-bold">We sent a 4-digit code to your phone number +91 ***** **210</p>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          
          {/* OTP Digit inputs */}
          <div className="flex justify-center space-x-3">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={inputRefs[idx]}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-14 h-14 bg-slate-50 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 focus:border-emerald-500/80 outline-none rounded-2xl text-center text-xl font-black focus:ring-4 focus:ring-emerald-500/10 text-slate-900 dark:text-white transition-all"
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black shadow-lg shadow-emerald-500/10 active:scale-95 transition-all flex items-center justify-center space-x-2"
          >
            <FiCheck className="w-4.5 h-4.5 stroke-[3]" />
            <span>Verify & Log In</span>
          </button>
        </form>

        <div className="text-center mt-6 text-xs font-semibold text-slate-400">
          {timer > 0 ? (
            <span>Resend code in <span className="text-slate-900 dark:text-white font-black">{timer}s</span></span>
          ) : (
            <button 
              onClick={handleResend}
              className="text-emerald-600 dark:text-emerald-400 font-extrabold hover:underline"
            >
              Resend Code OTP
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default OtpPage;
