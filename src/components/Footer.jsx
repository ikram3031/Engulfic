'use client';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Check,
  Loader2,
  AlertCircle,
  Instagram,
  Twitter,
  Globe,
  MapPin,
  Mail,
  Clock,
  Truck,
} from 'lucide-react';
import { subscribeNewsletter } from '@/lib/api';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.trim()) return;

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await subscribeNewsletter(email.trim());
      setSuccessMessage(res.message || 'Subscribed! Welcome to Engulfic.');
      setEmail('');
    } catch (err) {
      setErrorMessage(err.message || 'Failed to subscribe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="bg-slate-900 dark:bg-[#050505]/80 backdrop-blur-xl text-white border-t border-slate-800 dark:border-white/10 pt-16 pb-28 lg:pb-12 relative z-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Newsletter Section */}
        <div className="bg-slate-800/80 dark:bg-white/5 p-8 sm:p-12 rounded-3xl border border-slate-700 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-md shadow-2xl">
          <div className="max-w-md space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-orange-400">
              <Sparkles className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
              <span>THE ENGULFIC INSIDER</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
              JOIN THE ENGULFIC CLUB
            </h3>
            <p className="text-xs text-slate-300 dark:text-white/60">
              Subscribe to receive updates on new arrivals, seasonal collections, and exclusive member offers.
            </p>
          </div>

          <div className="w-full md:w-auto min-w-[320px]">
            {successMessage ? (
              <div className="flex items-center gap-2.5 p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl text-emerald-400 text-xs font-mono font-bold">
                <Check className="w-5 h-5 shrink-0 text-emerald-400" />
                <span>{successMessage}</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email address..."
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    required
                    disabled={isLoading}
                    className="w-full bg-slate-900/80 dark:bg-black/40 border border-slate-700 dark:border-white/10 rounded-2xl px-4 py-3.5 text-xs text-white placeholder-slate-400 dark:placeholder-white/30 focus:outline-none focus:border-orange-500 font-sans disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-3.5 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-white font-black uppercase tracking-wider text-xs rounded-2xl transition shrink-0 border border-orange-400/30 shadow-lg flex items-center justify-center min-w-[80px] cursor-pointer"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Join'
                    )}
                  </button>
                </div>
                {errorMessage && (
                  <div className="flex items-center gap-1.5 text-red-400 text-[11px] font-mono px-2">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>

        {/* Brand Grid Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-xs">
          {/* Col 1: ENGULFIC Heading & Description */}
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl font-black text-orange-500 tracking-tight font-sans uppercase">
              ENGULFIC
            </h2>
            <p className="text-slate-400 dark:text-white/60 leading-relaxed font-light text-xs">
              Explore Engulfic's contemporary collection of premium apparel including shirts, jeans, sweatshirts, baggy pants, and essential unisex streetwear tailored for effortless modern styling.
            </p>
            <div className="flex items-center gap-3 text-slate-400 dark:text-white/50 pt-2">
              <Instagram className="w-4 h-4 hover:text-orange-400 cursor-pointer transition-colors" />
              <Twitter className="w-4 h-4 hover:text-orange-400 cursor-pointer transition-colors" />
              <Globe className="w-4 h-4 hover:text-orange-400 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Col 2: CATEGORIES */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider font-mono">CATEGORIES</h4>
            <ul className="space-y-2 text-slate-400 dark:text-white/60 font-light">
              <li><Link to="/category/drop-shoulder-t-shirts" className="hover:text-orange-400 transition">T-Shirts</Link></li>
              <li><Link to="/category/shirts" className="hover:text-orange-400 transition">Shirts</Link></li>
              <li><Link to="/category/sweatshirts" className="hover:text-orange-400 transition">Sweatshirts</Link></li>
              <li><Link to="/category/baggy-pants" className="hover:text-orange-400 transition">Pants</Link></li>
            </ul>
          </div>

          {/* Col 3: QUICK LINKS */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider font-mono">QUICK LINKS</h4>
            <ul className="space-y-2 text-slate-400 dark:text-white/60 font-light">
              <li><Link to="/about" className="hover:text-orange-400 transition">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-orange-400 transition">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-orange-400 transition">FAQ & Help</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-orange-400 transition">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-orange-400 transition">Terms & Conditions</Link></li>
              <li><Link to="/refund-policy" className="hover:text-orange-400 transition">Return & Refund Policy</Link></li>
            </ul>
          </div>

          {/* Col 4: CONTACT INFO */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider font-mono">CONTACT INFO</h4>
            <ul className="space-y-3 text-slate-400 dark:text-white/60 font-light">
              <li className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
                <span>Mugda, Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-orange-500 shrink-0" />
                <a href="mailto:contact@engulfic.com" className="hover:text-orange-400 transition">
                  contact@engulfic.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-orange-500 shrink-0" />
                <span>Available: 10:00 AM – 8:00 PM</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-orange-500 shrink-0" />
                <span>Nationwide Express Delivery</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Developed by */}
        <div className="pt-8 border-t border-slate-800 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400 dark:text-white/40 font-mono">
          <p>© 2026 ENGULFIC. All rights reserved.</p>
          <p>
            Developed by{' '}
            <a
              href="https://wa.me/8801784220265"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-500 hover:text-orange-400 font-bold underline transition-colors"
            >
              Plexivia
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
