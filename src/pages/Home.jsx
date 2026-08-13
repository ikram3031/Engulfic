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
import { useThemeStore } from '@/store/useThemeStore';

export default function Home() {
  const router = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

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

      {/* Category Cards Section (1 per row mobile, 2 per row desktop) */}
      <CategoryGrid />

      {/* Footer with Policy & Info Links */}
      <Footer />

      {/* Slide-over Cart Drawer */}
      <CartDrawer onCheckout={() => navigate('/checkout')} />

      {/* Modals & Controls */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />



      {/* Scroll To Top Global Button */}
      <ScrollToTop />

      {/* Toast Feedback */}
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />
    </main>
  );
}
