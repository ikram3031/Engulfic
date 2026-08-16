'use client';

import { useState, useEffect } from 'react';
import {  useNavigate  } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import HeroBanner from '@/components/HeroBanner';
import CategoryGrid from '@/components/CategoryGrid';
import CartDrawer from '@/components/CartDrawer';
import SearchModal from '@/components/SearchModal';
import ScrollToTop from '@/components/ScrollToTop';
import Footer from '@/components/Footer';
import Toast from '@/components/Toast';
import NewArrivalsSection from '@/components/NewArrivalsSection';
import BestSellingProducts from '@/components/BestSellingProducts';
import LookbookSection from '@/components/LookbookSection';
import QuickViewModal from '@/components/QuickViewModal';
import { useThemeStore } from '@/store/useThemeStore';
import { Truck, ShieldCheck, RefreshCw } from 'lucide-react';

export default function Home() {
  const router = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const initTheme = useThemeStore((state) => state.initTheme);

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3500);
  };

  const handleScrollToCategories = () => {
    const element = document.getElementById('categories-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-white flex flex-col justify-between relative overflow-x-hidden transition-colors duration-300">
      {/* Background ambient lighting orbs for glassmorphism in dark mode */}
      <div className="fixed top-20 right-1/4 w-[500px] h-[500px] bg-purple-600/10 dark:bg-purple-900/15 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-1/3 left-10 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[160px] pointer-events-none -z-10" />

      {/* Sticky Header Navbar */}
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />

      {/* Hero Section */}
      <HeroBanner onExploreClick={handleScrollToCategories} />

      {/* E-Commerce Value Props Bar */}
      <div className="bg-white dark:bg-[#080808] border-b border-slate-200 dark:border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md">
            <div className="p-2 rounded-xl bg-orange-500/20 text-orange-500 border border-orange-500/30 flex-shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-850 dark:text-white uppercase tracking-wide text-[11px] sm:text-xs">Nationwide Free Home Delivery</p>
              <p className="text-slate-500 dark:text-white/60 text-[10px] sm:text-[11px]">Fast doorstep delivery across all regions</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md">
            <div className="p-2 rounded-xl bg-orange-500/20 text-orange-500 border border-orange-500/30 flex-shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-855 dark:text-white uppercase tracking-wide text-[11px] sm:text-xs">100% Pure & Authentic Products</p>
              <p className="text-slate-500 dark:text-white/60 text-[10px] sm:text-[11px]">Directly sourced artisan craftsmanship</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md">
            <div className="p-2 rounded-xl bg-orange-500/20 text-orange-500 border border-orange-500/30 flex-shrink-0">
              <RefreshCw className="w-4 h-4 animate-spin-slow" />
            </div>
            <div>
              <p className="font-bold text-slate-855 dark:text-white uppercase tracking-wide text-[11px] sm:text-xs">Money Back Guarantee</p>
              <p className="text-slate-500 dark:text-white/60 text-[10px] sm:text-[11px]">30-day effortless risk-free returns</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Cards Section (1 per row mobile, 2 per row desktop) */}
      <CategoryGrid />

      {/* New Arrivals Section */}
      <NewArrivalsSection onShowToast={showToast} />

      {/* Best Selling Products Section */}
      <BestSellingProducts onShowToast={showToast} />

      {/* Interactive Lookbook Section */}
      <LookbookSection onQuickView={setQuickViewProduct} />

      {/* Footer with Policy & Info Links */}
      <Footer />

      {/* Slide-over Cart Drawer */}
      <CartDrawer onCheckout={() => navigate('/checkout')} />

      {/* Modals & Controls */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onShowToast={showToast}
        />
      )}
      {/* Scroll To Top Global Button */}
      <ScrollToTop />

      {/* Toast Feedback */}
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />
    </main>
  );
}
