'use client';

import { useState, useEffect } from 'react';
import { X, User, ShieldCheck, Tag, Sparkles, CheckCircle2, LogIn, Heart, ShoppingCart, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { checkMemberEmail, loginMember, registerMember, verifyMemberOtp, resendMemberOtp, forgotMemberPassword, resetMemberPassword } from '@/lib/api';

export default function ProfileModal({ isOpen, onClose, onShowToast }) {
  const { isLoggedIn, user, login, logout } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  
  // Auth Modes: 'check-email' | 'login' | 'register' | 'otp' | 'forgot' | 'reset'
  const [mode, setMode] = useState('check-email');
  const [otpCode, setOtpCode] = useState('');
  const [otpContext, setOtpContext] = useState(''); // 'login' | 'register' | 'forgot'
  const [resendTimer, setResendTimer] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Countdown timer for OTP resend capability
  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  if (!isOpen) return null;

  // Step 1: Check if the email exists on the backend
  const handleCheckEmail = async (e) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    setErrorMsg('');
    try {
      const response = await checkMemberEmail({ email });
      // If verification or OTP is required, route to OTP screen
      if (response.requiresOtp || response.isEmailVerified === false) {
        setOtpContext('login');
        setMode('otp');
        setResendTimer(180);
      } else {
        // Email exists and is verified, route to password input for login
        setMode('login');
      }
    } catch (err) {
      // If email doesn't exist, route to registration screen
      setMode('register');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2 (Option A): Log in with credentials
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    try {
      const response = await loginMember({ email, password });
      if (response.requiresOtp || response.isEmailVerified === false) {
        setOtpContext('login');
        setMode('otp');
        setResendTimer(180);
      } else {
        const tokenBundle = {
          accessToken: response.accessToken,
          refreshToken: response.refreshToken
        };
        const memberData = response.member || response.data || response;
        login(memberData, tokenBundle);
        if (onShowToast) {
          onShowToast(`Welcome back, ${memberData.name}! 5% extra discount unlocked.`);
        }
        onClose();
      }
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2 (Option B): Register a new member
  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    try {
      if (!phone.trim()) {
        setErrorMsg('Phone number is required.');
        setIsLoading(false);
        return;
      }

      // Normalize phone to +880 format
      const normalizedPhone = phone.trim().startsWith('+')
        ? phone.trim()
        : `+880${phone.trim().replace(/^0/, '')}`;

      if (!/^\+8801[3-9]\d{8}$/.test(normalizedPhone)) {
        setErrorMsg('Please enter a valid Bangladeshi phone number (+8801XXXXXXXXX or 01XXXXXXXXX).');
        setIsLoading(false);
        return;
      }

      await registerMember({
        name: name.trim(),
        email: email.trim(),
        phone: normalizedPhone,
        password
      });
      setOtpContext('register');
      setMode('otp');
      setResendTimer(180);
      if (onShowToast) {
        onShowToast('Verification OTP sent to your email.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Verify the 6-digit OTP code
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    try {
      const response = await verifyMemberOtp({ email, otp: otpCode, context: otpContext });
      if (otpContext === 'forgot') {
        setMode('reset');
      } else {
        const tokenBundle = {
          accessToken: response.accessToken,
          refreshToken: response.refreshToken
        };
        const memberData = response.member || response.data || response;
        login(memberData, tokenBundle);
        if (onShowToast) {
          onShowToast('Account successfully verified and logged in!');
        }
        onClose();
      }
    } catch (err) {
      setErrorMsg(err.message || 'Invalid OTP code.');
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP handler
  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setErrorMsg('');
    try {
      await resendMemberOtp({ email, context: otpContext });
      setResendTimer(180);
      if (onShowToast) {
        onShowToast('New OTP has been dispatched.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to resend OTP.');
    }
  };

  // Forgot password initialization
  const handleForgotPassword = async () => {
    if (!email) {
      setErrorMsg('Please enter your email first.');
      return;
    }
    setIsLoading(true);
    setErrorMsg('');
    try {
      await forgotMemberPassword({ email });
      setOtpContext('forgot');
      setMode('otp');
      setResendTimer(180);
      if (onShowToast) {
        onShowToast('Password reset OTP sent.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to send password reset request.');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset password submission
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    try {
      await resetMemberPassword({ email, password, otp: otpCode });
      if (onShowToast) {
        onShowToast('Password reset successful. Please log in.');
      }
      setMode('login');
      setPassword('');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/85 backdrop-blur-xl animate-fadeIn">
      <div
        className="relative w-full max-w-md bg-white dark:bg-[#050505]/95 border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-2xl text-slate-900 dark:text-white p-6 sm:p-8 backdrop-blur-2xl transition-colors duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white rounded-full border border-slate-200 dark:border-white/10 transition backdrop-blur-md"
        >
          <X className="w-5 h-5" />
        </button>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-mono rounded-xl">
            {errorMsg}
          </div>
        )}

        {!isLoggedIn ? (
          <>
            {mode === 'check-email' && (
              <form onSubmit={handleCheckEmail} className="space-y-5">
                <div className="text-center space-y-2">
                  <div className="inline-flex p-3 bg-orange-500/10 text-orange-500 rounded-full border border-orange-500/20 mb-1">
                    <User className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-black uppercase tracking-tight font-sans">Member Portal</h2>
                  <p className="text-xs text-slate-500 dark:text-white/60">
                    Enter your email to sign in or create an account.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-500 dark:text-white/50 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 font-mono"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold uppercase tracking-widest text-xs rounded-xl transition shadow-xl border border-orange-400/30 flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
                  <span>Continue</span>
                </button>
              </form>
            )}

            {mode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-black uppercase tracking-tight font-sans">Member Sign In</h2>
                  <p className="text-xs text-slate-500 dark:text-white/60">Enter password for <strong className="text-slate-900 dark:text-white">{email}</strong></p>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-500 dark:text-white/50 mb-1">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 font-mono"
                  />
                </div>

                <div className="flex justify-between items-center text-xs mt-1">
                  <button type="button" onClick={() => setMode('check-email')} className="text-orange-500 hover:text-orange-600 font-bold underline underline-offset-4 decoration-orange-500/30 hover:decoration-orange-500 font-mono transition-colors">
                    Change Email
                  </button>
                  <button type="button" onClick={handleForgotPassword} className="text-orange-500 hover:text-orange-600 font-bold underline underline-offset-4 decoration-orange-500/30 hover:decoration-orange-500 font-mono transition-colors">
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold uppercase tracking-widest text-xs rounded-xl transition shadow-xl border border-orange-400/30 flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
                  <span>Sign In</span>
                </button>
              </form>
            )}

            {mode === 'register' && (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-black uppercase tracking-tight font-sans">Create Account</h2>
                  <p className="text-xs text-slate-500 dark:text-white/60">Complete the details to register <strong className="text-slate-900 dark:text-white">{email}</strong></p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-mono text-slate-500 dark:text-white/50 mb-1">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your Name"
                      required
                      className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-500 dark:text-white/50 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+88017XXXXXXXX"
                      required
                      className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-500 dark:text-white/50 mb-1">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 font-mono"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs mt-1">
                  <button type="button" onClick={() => setMode('check-email')} className="text-orange-500 hover:text-orange-600 font-bold underline underline-offset-4 decoration-orange-500/30 hover:decoration-orange-500 font-mono transition-colors">
                    Change Email
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold uppercase tracking-widest text-xs rounded-xl transition shadow-xl border border-orange-400/30 flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
                  <span>Register</span>
                </button>
              </form>
            )}

            {mode === 'otp' && (
              <form onSubmit={handleVerifyOtp} className="space-y-5">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-black uppercase tracking-tight font-sans">Verify OTP</h2>
                  <p className="text-xs text-slate-500 dark:text-white/60">We sent a 6-digit OTP code to {email}</p>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-500 dark:text-white/50 mb-1">OTP Code</label>
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="123456"
                    required
                    maxLength={6}
                    className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 font-mono text-center tracking-widest text-lg font-black"
                  />
                </div>

                <div className="flex justify-between items-center text-xs font-mono">
                  <button type="button" onClick={() => setMode('check-email')} className="text-slate-500 hover:text-orange-500">
                    Back
                  </button>
                  <button
                    type="button"
                    disabled={resendTimer > 0}
                    onClick={handleResendOtp}
                    className={`text-slate-500 hover:text-orange-500 ${resendTimer > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {resendTimer > 0 ? `Resend OTP (${resendTimer}s)` : 'Resend OTP'}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold uppercase tracking-widest text-xs rounded-xl transition shadow-xl border border-orange-400/30 flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
                  <span>Verify OTP</span>
                </button>
              </form>
            )}

            {mode === 'reset' && (
              <form onSubmit={handleResetPassword} className="space-y-5">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-black uppercase tracking-tight font-sans">Reset Password</h2>
                  <p className="text-xs text-slate-500 dark:text-white/60 font-mono">Reset password for {email}</p>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-500 dark:text-white/50 mb-1">New Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 font-mono"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold uppercase tracking-widest text-xs rounded-xl transition shadow-xl border border-orange-400/30 flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
                  <span>Change Password</span>
                </button>
              </form>
            )}
          </>
        ) : (
          <div className="space-y-6 text-center">
            <div className="inline-flex p-4 bg-emerald-500/20 text-emerald-500 rounded-full border border-emerald-500/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="px-3 py-1 bg-orange-500/20 text-orange-500 text-[11px] font-mono rounded-full border border-orange-500/30">
                VIP Member
              </span>
              <h2 className="text-2xl font-black uppercase tracking-wide mt-2">Welcome, {user?.name}!</h2>
              <p className="text-xs text-slate-500 dark:text-white/60 mt-0.5">{user?.email}</p>
            </div>

            <div className="bg-slate-100 dark:bg-white/5 p-4 rounded-2xl border border-slate-200 dark:border-white/10 text-left space-y-2.5 text-xs font-mono">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-white/10">
                <span className="text-slate-500 dark:text-white/60">Extra 5% Coupon:</span>
                <span className="px-2 py-0.5 bg-orange-500 text-white font-black rounded text-[11px]">
                  ENGULF5
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-white/60">Express Shipping:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Priority
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <Link to="/wishlist"
                onClick={onClose}
                className="p-3 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl text-xs font-bold uppercase flex items-center justify-center gap-2 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white"
              >
                <Heart className="w-4 h-4 text-orange-500" />
                <span>Wishlist</span>
              </Link>
              <Link to="/cart"
                onClick={onClose}
                className="p-3 bg-orange-500/10 hover:bg-orange-500/20 rounded-xl text-xs font-bold uppercase flex items-center justify-center gap-2 border border-orange-500/30 text-orange-600 dark:text-orange-400"
              >
                <ShoppingCart className="w-4 h-4 text-orange-500" />
                <span>My Cart</span>
              </Link>
            </div>

            <button
              onClick={() => {
                logout();
                if (onShowToast) onShowToast('Signed out successfully.');
              }}
              className="w-full py-2.5 text-xs text-slate-500 dark:text-white/50 hover:text-red-500 font-mono transition"
            >
              Sign Out of Account
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
