'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useThemeStore } from '@/store/useThemeStore';
import { useAuthStore } from '@/store/useAuthStore';
import { CATEGORY_METADATA } from '@/lib/products';
import {
  ShoppingCart,
  Heart,
  Search,
  Menu,
  X,
  Sun,
  Moon,
  ArrowRight,
  ChevronDown,
  User,
  LogOut,
  UserCheck,
  Sparkles,
} from 'lucide-react';
import ProfileModal from '@/components/ProfileModal';

export default function Navbar({ onOpenSearch }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);

  const pathname = usePathname();

  const totalCartCount = useCartStore((state) => state.getTotalItemsCount());
  const toggleCart = useCartStore((state) => state.toggleCart);
  const wishlistCount = useWishlistStore((state) => state.wishlist.length);
  const { theme, toggleTheme, initTheme } = useThemeStore();
  const { isLoggedIn, user, logout } = useAuthStore();

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-zinc-950/85 backdrop-blur-2xl border-b border-slate-200/80 dark:border-white/10 text-slate-900 dark:text-zinc-100 transition-colors duration-300">
        {/* Top Announcement Bar with Scrolling Marquee Text */}
        <div className="bg-zinc-950 text-white border-b border-white/10 py-2 overflow-hidden text-xs font-mono select-none relative z-10 flex items-center">
          <div className="animate-marquee whitespace-nowrap flex items-center gap-8 py-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="text-orange-400 font-bold uppercase tracking-wider">
                  Membership sign-in.
                </span>
                <span className="text-zinc-200">
                  Sign in and get <strong className="text-orange-400">5% extra discount</strong>.
                </span>
                <span className="text-zinc-600">•</span>
                <span className="text-zinc-300">Nationwide Free Home Delivery</span>
                <span className="text-zinc-600">•</span>
                <span className="text-orange-400 font-bold">CODE: ENGULF20 FOR 20% OFF</span>
                <span className="text-zinc-600">•</span>
                <span className="text-zinc-300">100% Pure & Authentic Couture</span>
                <span className="text-zinc-600">•</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Navigation Bar - Balanced Symmetrical Layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between relative">
          {/* Left Side: Navigation Links / Mobile Hamburger & Search */}
          <div className="flex items-center gap-2 sm:gap-4 flex-1 justify-start">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 dark:text-white/80 hover:text-slate-900 dark:hover:text-white rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 transition"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Mobile Search Button directly beside Hamburger */}
            <button
              onClick={onOpenSearch}
              className="lg:hidden p-2 text-slate-700 dark:text-white/80 hover:text-slate-900 dark:hover:text-white rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 transition"
              aria-label="Open Search"
              title="Search Archive"
            >
              <Search className="w-5 h-5 text-orange-500" />
            </button>
          </div>

          {/* Centered Brand Name Logo */}
          <div className="absolute left-1/2 -translate-x-1/2 text-center">
            <Link href="/" className="inline-block group">
              <span className="text-xl sm:text-2xl md:text-3xl font-black tracking-tighter text-slate-900 dark:text-white uppercase font-sans">
                ENGULFIC
              </span>
            </Link>
          </div>

          {/* Right Side Controls: Search, Auth Status (My Account / Logout / Login), Cart, Theme */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-end">
            {/* Search Bar / Button (Desktop) */}
            <button
              onClick={onOpenSearch}
              className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-full bg-slate-100 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 text-xs text-slate-700 dark:text-zinc-200 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-zinc-700 transition backdrop-blur-md"
              title="Search Archive"
              aria-label="Search Archive"
            >
              <Search className="w-4 h-4 text-orange-500" />
              <span className="font-mono text-slate-600 dark:text-zinc-400">Search...</span>
            </button>

            {/* Dynamic Auth Buttons: My Account & Logout when logged in; Login / Register when not */}
            {isLoggedIn ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/profile"
                  className="px-3.5 py-1.5 rounded-full bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/30 text-orange-600 dark:text-orange-400 font-bold text-xs uppercase tracking-wider transition flex items-center gap-1.5"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>My Account</span>
                </Link>

                <button
                  onClick={logout}
                  className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-zinc-900/80 hover:bg-red-500/10 text-slate-600 dark:text-zinc-300 hover:text-red-500 border border-slate-200 dark:border-zinc-800 transition text-xs font-mono flex items-center gap-1"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsProfileOpen(true)}
                className="hidden sm:flex px-3.5 py-1.5 rounded-full bg-orange-500 text-white font-bold text-xs uppercase tracking-wider hover:bg-orange-600 transition shadow-md items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5" />
                <span>Login / Register</span>
              </button>
            )}

            {/* Wishlist Icon */}
            <Link
              href="/wishlist"
              className="relative p-2 sm:p-2.5 text-slate-700 dark:text-zinc-200 hover:text-orange-500 dark:hover:text-orange-400 transition rounded-full bg-slate-100 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-800 backdrop-blur-md"
              title="Wishlist"
            >
              <Heart className="w-4 h-4 sm:w-4 sm:h-4" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center border border-white dark:border-zinc-950 shadow-md">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <button
              onClick={toggleCart}
              className="relative p-2 sm:p-2.5 text-slate-700 dark:text-zinc-200 hover:text-orange-500 dark:hover:text-orange-400 transition rounded-full bg-slate-100 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-800 backdrop-blur-md group"
              title="Open Cart Drawer"
              aria-label="Open Shopping Cart Drawer"
            >
              <ShoppingCart className="w-4 h-4 sm:w-4 sm:h-4 text-slate-800 dark:text-zinc-100 group-hover:text-orange-500 transition-colors" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white font-mono font-bold text-[10px] min-w-5 h-5 px-1 rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-zinc-950 animate-scaleIn">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`hidden sm:flex p-2 sm:p-2.5 transition rounded-full border shadow-sm ${
                theme === 'light'
                  ? 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800'
                  : 'bg-zinc-900 text-amber-400 border-zinc-800 hover:bg-zinc-800 shadow-[0_0_12px_rgba(251,191,36,0.25)]'
              }`}
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4 text-amber-300 fill-amber-300" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400 fill-amber-400" />
              )}
            </button>
          </div>
        </div>

        {/* FULL-WIDTH DESKTOP NAVIGATION BAR (Positioned under the main header) */}
        <div className="hidden lg:block w-full bg-slate-100/90 dark:bg-zinc-900/90 border-t border-slate-200/80 dark:border-white/10 text-slate-900 dark:text-zinc-100 backdrop-blur-md shadow-sm">
          <div className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-center gap-8 text-xs font-bold uppercase tracking-widest relative">
            
            {/* 1. HOME */}
            <Link
              href="/"
              className={`py-3 hover:text-orange-500 transition-colors relative ${
                pathname === '/' ? 'text-orange-500 font-extrabold' : ''
              }`}
            >
              Home
              {pathname === '/' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full" />
              )}
            </Link>

            {/* 2. NEW ARRIVALS */}
            <Link
              href="/category/new-arrivals"
              className={`py-3 hover:text-orange-500 transition-colors relative ${
                pathname === '/category/new-arrivals' ? 'text-orange-500 font-extrabold' : ''
              }`}
            >
              New Arrivals
              {pathname === '/category/new-arrivals' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full" />
              )}
            </Link>

            {/* 3. SHOP (MEGA MENU) */}
            <div className="group py-3 cursor-pointer">
              <span className="hover:text-orange-500 transition-colors flex items-center gap-1">
                Shop
                <span className="text-[9px] text-slate-400 dark:text-zinc-500 transition-transform group-hover:rotate-180">▼</span>
              </span>

              {/* Shop Mega Menu Dropdown Container */}
              <div className="absolute left-0 right-0 top-full hidden group-hover:block bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xl border-b border-slate-200 dark:border-zinc-800 shadow-2xl p-8 z-50 text-slate-900 dark:text-white animate-fadeIn">
                <div className="max-w-7xl mx-auto grid grid-cols-5 gap-6 text-left">
                  {/* Sweatshirts Column */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black text-orange-500 uppercase tracking-wider pb-1 border-b border-slate-200 dark:border-zinc-800">
                      Sweatshirts
                    </h4>
                    <ul className="space-y-2 text-xs font-medium text-slate-600 dark:text-zinc-300">
                      <li>
                        <Link href={`/category/sweatshirts?sub=${encodeURIComponent('Oversized Sweatshirt')}`} className="hover:text-orange-500 transition block">
                          Oversized Sweatshirt
                        </Link>
                      </li>
                      <li>
                        <Link href={`/category/sweatshirts?sub=${encodeURIComponent('Oversized Graphic Sweatshirt')}`} className="hover:text-orange-500 transition block">
                          Oversized Graphic Sweatshirt
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* Baggy Pants Column */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black text-orange-500 uppercase tracking-wider pb-1 border-b border-slate-200 dark:border-zinc-800">
                      Baggy Pants
                    </h4>
                    <ul className="space-y-2 text-xs font-medium text-slate-600 dark:text-zinc-300">
                      <li>
                        <Link href={`/category/pants?sub=${encodeURIComponent('Baggy Sweatpants')}`} className="hover:text-orange-500 transition block">
                          Baggy Sweatpants
                        </Link>
                      </li>
                      <li>
                        <Link href={`/category/pants?sub=${encodeURIComponent('Baggy Graphic Sweatpants')}`} className="hover:text-orange-500 transition block">
                          Baggy Graphic Sweatpants
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* Shirts Column */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black text-orange-500 uppercase tracking-wider pb-1 border-b border-slate-200 dark:border-zinc-800">
                      Shirts
                    </h4>
                    <ul className="space-y-2 text-xs font-medium text-slate-600 dark:text-zinc-300">
                      <li>
                        <Link href={`/category/shirts?sub=${encodeURIComponent('Oversized Shirt')}`} className="hover:text-orange-500 transition block">
                          Oversized Shirt
                        </Link>
                      </li>
                      <li>
                        <Link href={`/category/shirts?sub=${encodeURIComponent('Casual Shirt')}`} className="hover:text-orange-500 transition block">
                          Casual Shirt
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* Drop Shoulder T-Shirts Column */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black text-orange-500 uppercase tracking-wider pb-1 border-b border-slate-200 dark:border-zinc-800">
                      Drop Shoulder T-Shirts
                    </h4>
                    <ul className="space-y-2 text-xs font-medium text-slate-600 dark:text-zinc-300">
                      <li>
                        <Link href={`/category/tees?sub=${encodeURIComponent('Drop Shoulder Tee')}`} className="hover:text-orange-500 transition block">
                          Drop Shoulder Tee
                        </Link>
                      </li>
                      <li>
                        <Link href={`/category/tees?sub=${encodeURIComponent('Graphic Drop Shoulder Tee')}`} className="hover:text-orange-500 transition block">
                          Graphic Drop Shoulder Tee
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* Jerseys Column */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black text-orange-500 uppercase tracking-wider pb-1 border-b border-slate-200 dark:border-zinc-800">
                      Jerseys
                    </h4>
                    <ul className="space-y-2 text-xs font-medium text-slate-600 dark:text-zinc-300">
                      <li>
                        <Link href={`/category/jerseys?sub=${encodeURIComponent('Player Edition Jersey')}`} className="hover:text-orange-500 transition block">
                          Player Edition Jersey
                        </Link>
                      </li>
                      <li>
                        <Link href={`/category/jerseys?sub=${encodeURIComponent('Fan Edition Jersey')}`} className="hover:text-orange-500 transition block">
                          Fan Edition Jersey
                        </Link>
                      </li>
                      <li>
                        <Link href={`/category/jerseys?sub=${encodeURIComponent('Retro Jersey')}`} className="hover:text-orange-500 transition block">
                          Retro Edition Jersey
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. COLLECTIONS (DROPDOWN) */}
            <div className="group py-3 relative cursor-pointer">
              <span className="hover:text-orange-500 transition-colors flex items-center gap-1">
                Collections
                <span className="text-[9px] text-slate-400 dark:text-zinc-500 transition-transform group-hover:rotate-180">▼</span>
              </span>

              <div className="absolute left-1/2 -translate-x-1/2 top-full w-60 hidden group-hover:block bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xl border border-slate-200 dark:border-zinc-800 shadow-xl rounded-2xl p-4 z-50 text-slate-900 dark:text-white space-y-2 text-left animate-fadeIn">
                <Link href="/category/new-arrivals" className="block py-1.5 px-3 rounded-lg hover:bg-orange-500/10 hover:text-orange-500 transition text-xs font-medium">
                  New Arrivals
                </Link>
                <Link href="/category/sweatshirts" className="block py-1.5 px-3 rounded-lg hover:bg-orange-500/10 hover:text-orange-500 transition text-xs font-medium">
                  Best Sellers
                </Link>
                <Link href="/category/tees" className="block py-1.5 px-3 rounded-lg hover:bg-orange-500/10 hover:text-orange-500 transition text-xs font-medium">
                  Essentials
                </Link>
                <Link href="/category/pants" className="block py-1.5 px-3 rounded-lg hover:bg-orange-500/10 hover:text-orange-500 transition text-xs font-medium">
                  Graphic Collection
                </Link>
                <Link href="/category/shirts" className="block py-1.5 px-3 rounded-lg hover:bg-orange-500/10 hover:text-orange-500 transition text-xs font-medium">
                  Oversized Collection
                </Link>
                <Link href="/category/jerseys" className="block py-1.5 px-3 rounded-lg hover:bg-orange-500/10 hover:text-orange-500 transition text-xs font-medium">
                  Sports Collection
                </Link>
                <Link href="/category/jerseys" className="block py-1.5 px-3 rounded-lg hover:bg-orange-500/10 hover:text-orange-500 transition text-xs font-medium text-orange-500 font-bold">
                  Limited Edition
                </Link>
              </div>
            </div>

            {/* 5. SALE */}
            <Link
              href="/category/sale"
              className="py-3 hover:text-orange-500 transition-colors text-orange-500 font-black flex items-center gap-1"
            >
              <span>Sale</span>
              <span className="px-1.5 py-0.5 bg-orange-500 text-white text-[9px] rounded-full font-mono uppercase">
                Hot
              </span>
            </Link>

            {/* 6. ABOUT (DROPDOWN) */}
            <div className="group py-3 relative cursor-pointer">
              <span className="hover:text-orange-500 transition-colors flex items-center gap-1">
                About
                <span className="text-[9px] text-slate-400 dark:text-zinc-500 transition-transform group-hover:rotate-180">▼</span>
              </span>

              <div className="absolute left-1/2 -translate-x-1/2 top-full w-48 hidden group-hover:block bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xl border border-slate-200 dark:border-zinc-800 shadow-xl rounded-2xl p-4 z-50 text-slate-900 dark:text-white space-y-2 text-left animate-fadeIn">
                <Link href="/about" className="block py-1.5 px-3 rounded-lg hover:bg-orange-500/10 hover:text-orange-500 transition text-xs font-medium">
                  Our Story
                </Link>
                <Link href="/about#sustainability" className="block py-1.5 px-3 rounded-lg hover:bg-orange-500/10 hover:text-orange-500 transition text-xs font-medium">
                  Sustainability
                </Link>
                <Link href="/faq" className="block py-1.5 px-3 rounded-lg hover:bg-orange-500/10 hover:text-orange-500 transition text-xs font-medium">
                  Size Guide
                </Link>
                <Link href="/contact" className="block py-1.5 px-3 rounded-lg hover:bg-orange-500/10 hover:text-orange-500 transition text-xs font-medium">
                  Contact
                </Link>
              </div>
            </div>

            {/* 7. CONTACT */}
            <Link
              href="/contact"
              className={`py-3 hover:text-orange-500 transition-colors ${
                pathname === '/contact' ? 'text-orange-500 font-extrabold' : ''
              }`}
            >
              Contact
            </Link>

            {/* 8. ACCOUNT (DROPDOWN) */}
            <div className="group py-3 relative cursor-pointer">
              <span className="hover:text-orange-500 transition-colors flex items-center gap-1">
                Account
                <span className="text-[9px] text-slate-400 dark:text-zinc-500 transition-transform group-hover:rotate-180">▼</span>
              </span>

              <div className="absolute right-0 top-full w-48 hidden group-hover:block bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xl border border-slate-200 dark:border-zinc-800 shadow-xl rounded-2xl p-4 z-50 text-slate-900 dark:text-white space-y-2 text-left animate-fadeIn">
                {!isLoggedIn ? (
                  <>
                    <button
                      onClick={() => setIsProfileOpen(true)}
                      className="w-full text-left py-1.5 px-3 rounded-lg hover:bg-orange-500/10 hover:text-orange-500 transition text-xs font-medium"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => setIsProfileOpen(true)}
                      className="w-full text-left py-1.5 px-3 rounded-lg hover:bg-orange-500/10 hover:text-orange-500 transition text-xs font-medium"
                    >
                      Register
                    </button>
                  </>
                ) : (
                  <Link
                    href="/profile"
                    className="block py-1.5 px-3 rounded-lg hover:bg-orange-500/10 hover:text-orange-500 transition text-xs font-medium"
                  >
                    My Profile
                  </Link>
                )}
                <Link href="/profile?tab=orders" className="block py-1.5 px-3 rounded-lg hover:bg-orange-500/10 hover:text-orange-500 transition text-xs font-medium">
                  Orders
                </Link>
                <Link href="/wishlist" className="block py-1.5 px-3 rounded-lg hover:bg-orange-500/10 hover:text-orange-500 transition text-xs font-medium">
                  Wishlist ({wishlistCount})
                </Link>
              </div>
            </div>

          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xl border-b border-slate-200 dark:border-white/10 px-6 py-6 animate-fadeIn text-slate-900 dark:text-white space-y-6">
            {/* Category Navigation Links (AT TOP) */}
            <div className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-widest">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-slate-100 dark:border-white/5 text-slate-900 dark:text-white font-bold hover:text-orange-500 flex items-center justify-between"
              >
                <span>Home</span>
                <ArrowRight className="w-4 h-4 text-orange-500" />
              </Link>

              <Link
                href="/category/new-arrivals"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-slate-100 dark:border-white/5 text-slate-800 dark:text-zinc-200 hover:text-orange-500 flex items-center justify-between"
              >
                <span>New Arrivals</span>
                <ArrowRight className="w-4 h-4 text-slate-400 dark:text-white/30" />
              </Link>

              {/* Shop Section Accordion */}
              <div className="py-2 border-b border-slate-100 dark:border-white/5 space-y-2">
                <button
                  type="button"
                  onClick={() => setShopOpen(!shopOpen)}
                  className="w-full text-orange-500 font-extrabold text-xs flex items-center justify-between focus:outline-none"
                >
                  <span>Shop</span>
                  <ChevronDown className={`w-4 h-4 text-orange-500 transition-transform duration-200 ${shopOpen ? 'rotate-180' : ''}`} />
                </button>
                {shopOpen && (
                  <div className="pl-3 space-y-2 text-[11px] capitalize normal-case text-slate-600 dark:text-zinc-400 animate-fadeIn pt-1">
                    <div className="font-bold text-slate-800 dark:text-zinc-200">Sweatshirts</div>
                    <Link href={`/category/sweatshirts?sub=${encodeURIComponent('Oversized Sweatshirt')}`} onClick={() => setMobileMenuOpen(false)} className="block pl-2 hover:text-orange-500">Oversized Sweatshirt</Link>
                    <Link href={`/category/sweatshirts?sub=${encodeURIComponent('Oversized Graphic Sweatshirt')}`} onClick={() => setMobileMenuOpen(false)} className="block pl-2 hover:text-orange-500">Oversized Graphic Sweatshirt</Link>

                    <div className="font-bold text-slate-800 dark:text-zinc-200 pt-1">Baggy Pants</div>
                    <Link href={`/category/pants?sub=${encodeURIComponent('Baggy Sweatpants')}`} onClick={() => setMobileMenuOpen(false)} className="block pl-2 hover:text-orange-500">Baggy Sweatpants</Link>
                    <Link href={`/category/pants?sub=${encodeURIComponent('Baggy Graphic Sweatpants')}`} onClick={() => setMobileMenuOpen(false)} className="block pl-2 hover:text-orange-500">Baggy Graphic Sweatpants</Link>

                    <div className="font-bold text-slate-800 dark:text-zinc-200 pt-1">Shirts</div>
                    <Link href={`/category/shirts?sub=${encodeURIComponent('Oversized Shirt')}`} onClick={() => setMobileMenuOpen(false)} className="block pl-2 hover:text-orange-500">Oversized Shirt</Link>
                    <Link href={`/category/shirts?sub=${encodeURIComponent('Casual Shirt')}`} onClick={() => setMobileMenuOpen(false)} className="block pl-2 hover:text-orange-500">Casual Shirt</Link>

                    <div className="font-bold text-slate-800 dark:text-zinc-200 pt-1">Drop Shoulder T-Shirts</div>
                    <Link href={`/category/tees?sub=${encodeURIComponent('Drop Shoulder Tee')}`} onClick={() => setMobileMenuOpen(false)} className="block pl-2 hover:text-orange-500">Drop Shoulder Tee</Link>
                    <Link href={`/category/tees?sub=${encodeURIComponent('Graphic Drop Shoulder Tee')}`} onClick={() => setMobileMenuOpen(false)} className="block pl-2 hover:text-orange-500">Graphic Drop Shoulder Tee</Link>

                    <div className="font-bold text-slate-800 dark:text-zinc-200 pt-1">Jerseys</div>
                    <Link href={`/category/jerseys?sub=${encodeURIComponent('Player Edition Jersey')}`} onClick={() => setMobileMenuOpen(false)} className="block pl-2 hover:text-orange-500">Player Edition</Link>
                    <Link href={`/category/jerseys?sub=${encodeURIComponent('Fan Edition Jersey')}`} onClick={() => setMobileMenuOpen(false)} className="block pl-2 hover:text-orange-500">Fan Edition</Link>
                    <Link href={`/category/jerseys?sub=${encodeURIComponent('Retro Jersey')}`} onClick={() => setMobileMenuOpen(false)} className="block pl-2 hover:text-orange-500">Retro Edition</Link>
                  </div>
                )}
              </div>

              {/* Collections Section Accordion */}
              <div className="py-2 border-b border-slate-100 dark:border-white/5 space-y-1">
                <button
                  type="button"
                  onClick={() => setCollectionsOpen(!collectionsOpen)}
                  className="w-full text-orange-500 font-extrabold text-xs flex items-center justify-between focus:outline-none"
                >
                  <span>Collections</span>
                  <ChevronDown className={`w-4 h-4 text-orange-500 transition-transform duration-200 ${collectionsOpen ? 'rotate-180' : ''}`} />
                </button>
                {collectionsOpen && (
                  <div className="pl-3 space-y-1 text-[11px] capitalize normal-case text-slate-600 dark:text-zinc-400 animate-fadeIn pt-1">
                    <Link href="/category/new-arrivals" onClick={() => setMobileMenuOpen(false)} className="block hover:text-orange-500">New Arrivals</Link>
                    <Link href="/category/sweatshirts" onClick={() => setMobileMenuOpen(false)} className="block hover:text-orange-500">Best Sellers</Link>
                    <Link href="/category/tees" onClick={() => setMobileMenuOpen(false)} className="block hover:text-orange-500">Essentials</Link>
                    <Link href="/category/pants" onClick={() => setMobileMenuOpen(false)} className="block hover:text-orange-500">Graphic Collection</Link>
                    <Link href="/category/shirts" onClick={() => setMobileMenuOpen(false)} className="block hover:text-orange-500">Oversized Collection</Link>
                    <Link href="/category/jerseys" onClick={() => setMobileMenuOpen(false)} className="block hover:text-orange-500">Sports Collection</Link>
                    <Link href="/category/jerseys" onClick={() => setMobileMenuOpen(false)} className="block hover:text-orange-500 font-bold text-orange-500">Limited Edition</Link>
                  </div>
                )}
              </div>

              <Link
                href="/category/sale"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-slate-100 dark:border-white/5 text-orange-500 font-extrabold flex items-center justify-between"
              >
                <span>Sale</span>
                <span className="px-2 py-0.5 bg-orange-500 text-white text-[9px] rounded-full">HOT</span>
              </Link>

              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-slate-100 dark:border-white/5 text-slate-800 dark:text-zinc-200 hover:text-orange-500 flex items-center justify-between"
              >
                <span>About</span>
                <ArrowRight className="w-4 h-4 text-slate-400 dark:text-white/30" />
              </Link>

              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-slate-800 dark:text-zinc-200 hover:text-orange-500 flex items-center justify-between"
              >
                <span>Contact</span>
                <ArrowRight className="w-4 h-4 text-slate-400 dark:text-white/30" />
              </Link>
            </div>

            {/* Bottom Actions Section (PLACED AT THE BOTTOM) */}
            <div className="pt-2 space-y-4">
              {/* 1. Membership Offer Text Banner */}
              <div className="p-3 bg-orange-500/10 border border-orange-500/25 rounded-2xl text-xs font-mono text-slate-800 dark:text-zinc-200 flex items-center gap-2.5 shadow-sm">
                <Sparkles className="w-4 h-4 text-orange-500 flex-shrink-0" />
                <span className="text-[11px] leading-tight">
                  <strong className="text-orange-500 uppercase font-extrabold">Membership Offer:</strong> Sign in & get <strong className="text-orange-600 dark:text-orange-400">5% EXTRA OFF</strong> on all purchases.
                </span>
              </div>

              {/* 2. Grid of 2 Buttons: Login & Register or My Account & Logout */}
              <div className="grid grid-cols-2 gap-3">
                {!isLoggedIn ? (
                  <>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setIsProfileOpen(true);
                      }}
                      className="p-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl text-center text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition border border-orange-400/30"
                    >
                      <User className="w-4 h-4" />
                      <span>Login</span>
                    </button>

                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setIsProfileOpen(true);
                      }}
                      className="p-3.5 bg-slate-100 dark:bg-zinc-900 hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-900 dark:text-white rounded-2xl text-center text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border border-slate-300 dark:border-zinc-800 transition shadow-sm"
                    >
                      <UserCheck className="w-4 h-4 text-orange-500" />
                      <span>Register</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl text-center text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition border border-orange-400/30"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>My Account</span>
                    </Link>

                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="p-3.5 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-2xl text-center text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border border-red-500/30 transition"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </>
                )}
              </div>

              {/* 3. Mobile Search Bar */}
              <div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onOpenSearch) onOpenSearch();
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white transition"
                >
                  <div className="flex items-center gap-2.5">
                    <Search className="w-4 h-4 text-orange-500" />
                    <span className="font-mono text-xs">Search products, categories...</span>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 rounded font-mono">
                    Search
                  </span>
                </button>
              </div>

              {/* 4. High-Contrast Theme Bar */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-mono font-bold text-slate-500 dark:text-zinc-400 uppercase">
                  Appearance Theme
                </span>

                <button
                  onClick={toggleTheme}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono font-black border transition shadow-lg ${
                    theme === 'light'
                      ? 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800'
                      : 'bg-zinc-900 text-amber-400 border-zinc-800 hover:bg-zinc-800 shadow-[0_0_12px_rgba(251,191,36,0.25)]'
                  }`}
                  title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} mode`}
                >
                  {theme === 'light' ? (
                    <Moon className="w-4 h-4 text-amber-300 fill-amber-300" />
                  ) : (
                    <Sun className="w-4 h-4 text-amber-400 fill-amber-400" />
                  )}
                  <span className="uppercase">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Member Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </>
  );
}

