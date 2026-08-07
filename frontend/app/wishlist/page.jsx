'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/Breadcrumb';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import Toast from '@/components/Toast';
import SearchModal from '@/components/SearchModal';
import { useWishlistStore } from '@/store/useWishlistStore';
import { Heart, ShoppingCart, Trash2, ArrowRight, Sparkles } from 'lucide-react';

export default function WishlistPage() {
  const { wishlist, clearWishlist } = useWishlistStore();
  const [toastMessage, setToastMessage] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3500);
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-white flex flex-col justify-between transition-colors duration-300">
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />

      <div className="flex-1">
        {/* Clickable Breadcrumbs */}
        <Breadcrumb items={[{ label: 'Saved Wishlist' }]} />

        {/* Header Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-b border-slate-200 dark:border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono text-orange-500 mb-1">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span>SAVED ARCHIVE</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
                YOUR WISHLIST ({wishlist.length})
              </h1>
            </div>

            {wishlist.length > 0 && (
              <button
                onClick={clearWishlist}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 hover:bg-red-500 text-xs font-mono font-bold uppercase rounded-xl transition self-start sm:self-auto hover:text-white"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear All Saved</span>
              </button>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {wishlist.length === 0 ? (
            <div className="text-center py-20 px-4 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl max-w-2xl mx-auto space-y-6">
              <div className="inline-flex p-5 rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/20">
                <Heart className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black uppercase tracking-wide">YOUR WISHLIST IS EMPTY</h2>
                <p className="text-xs font-mono text-slate-500 dark:text-white/60 max-w-md mx-auto">
                  Save your favorite runway garments, denim, and organic tees to view or move them to your cart anytime.
                </p>
              </div>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-8 py-4 bg-orange-500 text-white font-bold uppercase tracking-wider text-xs rounded-2xl hover:bg-orange-600 transition shadow-xl"
              >
                <span>EXPLORE ARCHIVE</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
              {wishlist.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onShowToast={showToast}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />
    </main>
  );
}
