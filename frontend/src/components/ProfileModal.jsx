'use client';

import { useState } from 'react';
import { X, User, ShieldCheck, Tag, Sparkles, CheckCircle2, ArrowRight, LogIn, Heart, ShoppingCart, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

export default function ProfileModal({ isOpen, onClose, onShowToast }) {
  const { isLoggedIn, user, login, logout } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email) return;
    const loggedUser = login(email);
    if (onShowToast) {
      onShowToast(`Welcome back, ${loggedUser.name}! 5% extra discount unlocked.`);
    }
  };

  const handleLogout = () => {
    logout();
    if (onShowToast) {
      onShowToast('Signed out of Engulfic Member Account');
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

        {!isLoggedIn ? (
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 bg-orange-500/10 text-orange-500 rounded-full border border-orange-500/20 mb-1">
                <User className="w-8 h-8" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-mono text-[11px] rounded-full border border-orange-500/20">
                <Sparkles className="w-3 h-3 animate-pulse" />
                <span>MEMBERSHIP SIGN-IN</span>
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tight font-sans text-slate-900 dark:text-white">
                Member Portal
              </h2>
              <p className="text-xs text-slate-500 dark:text-white/60">
                Sign in to claim your <strong>5% extra discount</strong> and track orders.
              </p>
            </div>

            <div className="space-y-3">
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

            <div className="p-3.5 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-start gap-2.5 text-xs font-mono text-slate-700 dark:text-white/80">
              <Tag className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-orange-500 block">Member Benefit</span>
                <span>Use code <strong className="text-orange-500">ENGULF5</strong> at checkout for an extra 5% discount on all garments!</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold uppercase tracking-widest text-xs rounded-xl transition shadow-xl border border-orange-400/30 flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In & Unlock Discount</span>
            </button>
          </form>
        ) : (
          <div className="space-y-6 text-center">
            <div className="inline-flex p-4 bg-emerald-500/20 text-emerald-500 rounded-full border border-emerald-500/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="px-3 py-1 bg-orange-500/20 text-orange-500 text-[11px] font-mono rounded-full border border-orange-500/30">
                {user?.tier}
              </span>
              <h2 className="text-2xl font-black uppercase tracking-wide mt-2">Welcome, {user?.name}!</h2>
              <p className="text-xs text-slate-500 dark:text-white/60 mt-0.5">{user?.email}</p>
            </div>

            <div className="bg-slate-100 dark:bg-white/5 p-4 rounded-2xl border border-slate-200 dark:border-white/10 text-left space-y-2.5 text-xs font-mono">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-white/10">
                <span className="text-slate-500 dark:text-white/60">Extra 5% Coupon:</span>
                <span className="px-2 py-0.5 bg-orange-500 text-white font-black rounded text-[11px]">
                  {user?.discountCode}
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
              onClick={handleLogout}
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
