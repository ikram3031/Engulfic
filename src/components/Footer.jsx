'use client';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Check, Instagram, Twitter, Globe } from 'lucide-react';
import Logo from '@/components/Logo';

// Site footer component with newsletter, policy links, and brand accreditation
export const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
    }
  };

  return (
    <footer className="bg-slate-900 dark:bg-[#050505]/80 backdrop-blur-xl text-white border-t border-slate-800 dark:border-white/10 pt-16 pb-12 relative z-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Newsletter Section */}
        <div className="bg-slate-800/80 dark:bg-white/5 p-8 sm:p-12 rounded-3xl border border-slate-700 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-md shadow-2xl">
          <div className="max-w-md space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-orange-400">
              <Sparkles className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
              <span>THE ENGULFIC ATELIER INSIDER</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
              JOIN THE RUNWAY CLUB
            </h3>
            <p className="text-xs text-slate-300 dark:text-white/60">
              Subscribe to receive private runway invites, early capsule drops, and a $50 voucher on your first order over $300.
            </p>
          </div>

          <div className="w-full md:w-auto min-w-[300px]">
            {subscribed ? (
              <div className="flex items-center gap-2 p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl text-emerald-400 text-xs font-mono font-bold">
                <Check className="w-5 h-5" />
                <span>Subscribed! Check your inbox for code VIP50</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-slate-900/80 dark:bg-black/40 border border-slate-700 dark:border-white/10 rounded-2xl px-4 py-3.5 text-xs text-white placeholder-slate-400 dark:placeholder-white/30 focus:outline-none focus:border-orange-500 font-sans"
                />
                <button
                  type="submit"
                  className="px-6 py-3.5 bg-orange-500 text-white font-black uppercase tracking-wider text-xs rounded-2xl hover:bg-orange-600 transition shrink-0 border border-orange-400/30 shadow-lg"
                >
                  Join
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Brand Grid Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-xs">
          <div className="space-y-3">
            <Link to="/" className="inline-block">
              <Logo className="h-7 w-auto object-contain" alt="ENGULFIC" />
            </Link>
            <p className="text-slate-400 dark:text-white/60 leading-relaxed font-light">
              Pioneering architectural silhouettes, Japanese selvedge denim, and organic cotton foundations. Designed in Paris & Tokyo.
            </p>
            <div className="flex items-center gap-3 text-slate-400 dark:text-white/50 pt-2">
              <Instagram className="w-4 h-4 hover:text-orange-400 cursor-pointer transition-colors" />
              <Twitter className="w-4 h-4 hover:text-orange-400 cursor-pointer transition-colors" />
              <Globe className="w-4 h-4 hover:text-orange-400 cursor-pointer transition-colors" />
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider font-mono">CATEGORIES</h4>
            <ul className="space-y-2 text-slate-400 dark:text-white/60 font-light">
              <li><Link to="/category/shirts" className="hover:text-orange-400 transition">Shirts Collection</Link></li>
              <li><Link to="/category/jeans" className="hover:text-orange-400 transition">Jeans & Selvedge</Link></li>
              <li><Link to="/category/denim" className="hover:text-orange-400 transition">Denim Jackets & Vests</Link></li>
              <li><Link to="/category/baggy" className="hover:text-orange-400 transition">Baggy Trousers</Link></li>
              <li><Link to="/category/long-sleeve-t-shirt" className="hover:text-orange-400 transition">Long Sleeve Tees</Link></li>
              <li><Link to="/category/short-sleeve-t-shirt" className="hover:text-orange-400 transition">Short Sleeve Tees</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider font-mono">COMPANY & POLICIES</h4>
            <ul className="space-y-2 text-slate-400 dark:text-white/60 font-light">
              <li><Link to="/about" className="hover:text-orange-400 transition">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-orange-400 transition">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-orange-400 transition">FAQ & Help</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-orange-400 transition">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-orange-400 transition">Terms & Conditions</Link></li>
              <li><Link to="/refund-policy" className="hover:text-orange-400 transition">Return & Refund Policy</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider font-mono">FLAGSHIP STORES</h4>
            <ul className="space-y-2 text-slate-400 dark:text-white/60 font-light">
              <li>Paris: 28 Rue du Faubourg Saint-Honoré</li>
              <li>Tokyo: 5-7-21 Minamiaoyama, Minato-ku</li>
              <li>New York: 452 West Broadway, SoHo</li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-slate-800 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400 dark:text-white/40 font-mono">
          <p>© {new Date().getFullYear()} ENGULFIC INC. ALL RIGHTS RESERVED.</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-white">Terms & Conditions</Link>
            <span>•</span>
            <Link to="/refund-policy" className="hover:text-white">Refund Policy</Link>
            <span>•</span>
            <Link to="/faq" className="hover:text-white">FAQ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
