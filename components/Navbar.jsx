'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useThemeStore } from '@/store/useThemeStore';
import { CATEGORY_METADATA } from '@/lib/products';
import { ShoppingBag, ShoppingCart, Heart, Search, Menu, X, Sparkles, Sun, Moon, ArrowRight } from 'lucide-react';

export default function Navbar({ onOpenSearch }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const totalCartCount = useCartStore((state) => state.getTotalItemsCount());
  const toggleCart = useCartStore((state) => state.toggleCart);
  const wishlistCount = useWishlistStore((state) => state.wishlist.length);
  const { theme, toggleTheme, initTheme } = useThemeStore();

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 text-slate-900 dark:text-zinc-100 transition-colors duration-300">
      {/* Top Announcement Bar */}
      <div className="bg-slate-100 dark:bg-white/5 border-b border-slate-200 dark:border-white/10 px-4 py-1.5 text-xs text-center font-medium tracking-wide flex items-center justify-center gap-2 backdrop-blur-md">
        <Sparkles className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
        <span className="text-slate-800 dark:text-white/90 font-semibold uppercase tracking-wider">Nationwide Free Home Delivery</span>
        <span className="hidden sm:inline-block text-slate-300 dark:text-white/30">|</span>
        <span className="hidden sm:inline-block text-orange-600 dark:text-orange-400 font-mono">CODE: ENGULF20 FOR 20% OFF</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Mobile Left: Hamburger Icon ONLY */}
        <div className="flex items-center lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 text-slate-700 dark:text-white/80 hover:text-slate-900 dark:hover:text-white rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 transition"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Brand Logo - Centered on Mobile */}
        <div className="flex-1 lg:flex-none text-center lg:text-left">
          <Link href="/" className="inline-block group">
            <span className="text-2xl sm:text-3xl font-black tracking-tighter text-slate-900 dark:text-white uppercase font-sans">
              ENGULFIC
            </span>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold uppercase tracking-widest text-slate-600 dark:text-white/70">
          <Link
            href="/"
            className={`py-1 transition-all relative ${
              pathname === '/' ? 'text-slate-900 dark:text-white font-bold' : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Archive
            {pathname === '/' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full" />
            )}
          </Link>

          {CATEGORY_METADATA.map((cat) => {
            const catPath = `/category/${cat.slug}`;
            const isActive = pathname === catPath;
            return (
              <Link
                key={cat.id}
                href={catPath}
                className={`py-1 transition-all relative ${
                  isActive ? 'text-slate-900 dark:text-white font-bold' : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: On Mobile only Cart Icon is visible. On Desktop: Search, Theme Toggle, Wishlist, Cart */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Desktop Search Button */}
          <button
            onClick={onOpenSearch}
            className="hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-white/20 transition backdrop-blur-md"
          >
            <Search className="w-4 h-4 text-orange-500" />
            <span>Search...</span>
            <kbd className="px-1.5 py-0.5 text-[10px] bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-white/70 rounded font-mono">
              ⌘K
            </kbd>
          </button>

          {/* Desktop Light / Dark Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            className="hidden lg:flex p-2.5 text-slate-700 dark:text-white/80 hover:text-slate-900 dark:hover:text-white transition rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10 backdrop-blur-md"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-slate-800" />
            ) : (
              <Sun className="w-4 h-4 text-orange-400" />
            )}
          </button>

          {/* Desktop Wishlist Page Link */}
          <Link
            href="/wishlist"
            className="hidden lg:flex relative p-2.5 text-slate-700 dark:text-white/80 hover:text-slate-900 dark:hover:text-white transition rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10 backdrop-blur-md"
            title="Wishlist Page"
          >
            <Heart className="w-4 h-4" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center border border-white/20 shadow-lg">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Mobile & Desktop Cart Icon Button */}
          <button
            onClick={toggleCart}
            className="relative p-2.5 text-slate-700 dark:text-white/80 hover:text-orange-500 dark:hover:text-orange-400 transition rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10 backdrop-blur-md group"
            title="Open Cart Drawer"
            aria-label="Open Shopping Cart Drawer"
          >
            <ShoppingCart className="w-5 h-5 text-slate-800 dark:text-white group-hover:text-orange-500 transition-colors" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white font-mono font-bold text-[10px] min-w-5 h-5 px-1 rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-zinc-950 animate-scaleIn">
                {totalCartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown with Search Bar, Wishlist Icon, Hamburger Toggle, Theme Switch & Categories */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xl border-b border-slate-200 dark:border-white/10 px-6 py-6 animate-fadeIn text-slate-900 dark:text-white space-y-5">
          {/* Mobile Search Bar inside Hamburger Menu */}
          <div>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenSearch) onOpenSearch();
              }}
              className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white transition"
            >
              <div className="flex items-center gap-2.5">
                <Search className="w-4 h-4 text-orange-500" />
                <span className="font-mono text-xs">Search products, categories...</span>
              </div>
              <span className="px-2 py-0.5 text-[10px] bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-white/70 rounded font-mono">
                Search
              </span>
            </button>
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-white/50">
              Navigation & Preferences
            </span>
            {/* Theme toggle inside hamburger drawer */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/10 text-xs font-mono font-bold text-slate-800 dark:text-white border border-slate-200 dark:border-white/10"
            >
              {theme === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5 text-orange-400" />}
              <span>Theme: {theme === 'light' ? 'Light' : 'Dark'}</span>
            </button>
          </div>

          <div className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-widest">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 border-b border-slate-100 dark:border-white/5 text-slate-700 dark:text-white/70 hover:text-orange-500 flex items-center justify-between"
            >
              <span>All Archive</span>
              <ArrowRight className="w-4 h-4 text-slate-400 dark:text-white/30" />
            </Link>

            {CATEGORY_METADATA.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 border-b border-slate-100 dark:border-white/5 text-slate-700 dark:text-white/70 hover:text-orange-500 flex items-center justify-between"
              >
                <span>{cat.name}</span>
                <ArrowRight className="w-4 h-4 text-slate-400 dark:text-white/30" />
              </Link>
            ))}

            {/* Dedicated Wishlist Link inside Mobile Drawer */}
            <Link
              href="/wishlist"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 border-b border-slate-100 dark:border-white/5 text-slate-700 dark:text-white/70 hover:text-orange-500 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-orange-500" />
                <span>My Wishlist</span>
              </div>
              <span className="px-2 py-0.5 bg-orange-500 text-white rounded-full text-[10px] font-mono">
                {wishlistCount}
              </span>
            </Link>

            <div className="pt-3 grid grid-cols-2 gap-3">
              <Link
                href="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3.5 bg-slate-100 dark:bg-white/5 rounded-2xl text-center text-xs font-bold uppercase flex items-center justify-center gap-2 border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10"
              >
                <Heart className="w-4 h-4 text-orange-500" />
                <span>Wishlist ({wishlistCount})</span>
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  toggleCart();
                }}
                className="p-3.5 bg-orange-500 text-white rounded-2xl text-center text-xs font-bold uppercase flex items-center justify-center gap-2 shadow-lg hover:bg-orange-600"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Bag ({totalCartCount})</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
