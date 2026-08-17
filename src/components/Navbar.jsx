'use client';

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useThemeStore } from '@/store/useThemeStore';
import { useAuthStore } from '@/store/useAuthStore';
import menuData from '@/lib/menu.json';
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
import Toast from '@/components/Toast';

export default function Navbar({ onOpenSearch }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { pathname } = useLocation();
  const groupedCategories = menuData;

  const totalCartCount = useCartStore((state) => state.getTotalItemsCount());
  const toggleCart = useCartStore((state) => state.toggleCart);
  const toastMessage = useCartStore((state) => state.toastMessage);
  const setToastMessage = useCartStore((state) => state.setToastMessage);
  const wishlistCount = useWishlistStore((state) => state.wishlist.length);
  const { theme, toggleTheme, initTheme } = useThemeStore();
  const { isLoggedIn, logout } = useAuthStore();

  useEffect(() => {
    initTheme();
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [initTheme]);

  return (
    <>
      {/* Top Announcement Bar with Scrolling Marquee Text (Non-sticky, scrolls off screen) */}
      <div className="bg-zinc-950 text-white border-b border-white/10 py-2 overflow-hidden text-xs font-mono select-none relative z-50 flex items-center">
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

      <header className="relative lg:sticky lg:top-0 z-40 bg-white/80 dark:bg-zinc-950/85 backdrop-blur-2xl border-b border-slate-200/80 dark:border-white/10 text-slate-900 dark:text-zinc-100 transition-all duration-300 group/header">

        {/* MOBILE NAVIGATION BAR (lg:hidden) */}
        <div className="lg:hidden max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Left: Mobile Menu & Search */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 dark:text-white/80 hover:text-slate-900 dark:hover:text-white rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 transition"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <button
              onClick={onOpenSearch}
              className="p-2 text-slate-700 dark:text-white/80 hover:text-slate-900 dark:hover:text-white rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 transition"
              aria-label="Open Search"
              title="Search Archive"
            >
              <Search className="w-5 h-5 text-orange-500" />
            </button>
          </div>

          {/* Center: Mobile Logo */}
          <div className="text-center">
            <Link to="/" className="inline-block group">
              <span className="text-xl sm:text-2xl font-black tracking-tighter text-slate-900 dark:text-white uppercase font-sans">
                ENGULFIC
              </span>
            </Link>
          </div>

          {/* Right: Cart & User Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleCart}
              className="relative p-2 text-slate-700 dark:text-zinc-200 hover:text-orange-500 transition rounded-full bg-slate-100 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800"
              aria-label="Open Cart Drawer"
            >
              <ShoppingCart className="w-4 h-4 text-slate-800 dark:text-zinc-100" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white font-mono font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* DESKTOP TWO-TIER NAVBAR LAYOUT (hidden on mobile, visible lg+) */}
        <div className="hidden lg:block">
          {/* TOP TIER */}
          <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-3 items-center transition-all duration-300 ${
            isScrolled ? 'py-2' : 'py-4'
          }`}>
            {/* Left Column */}
            <div className="flex items-center justify-start gap-2">
              {isLoggedIn ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={logout}
                    className={`rounded-full bg-slate-100 dark:bg-zinc-900/80 hover:bg-red-500/10 text-slate-600 dark:text-zinc-300 hover:text-red-500 border border-slate-200 dark:border-zinc-800 transition-all duration-300 text-xs font-mono flex items-center justify-center cursor-pointer ${
                      isScrolled ? 'p-2' : 'p-3'
                    }`}
                    title="Sign Out"
                    aria-label="Sign Out"
                  >
                    <LogOut className={`transition-all duration-300 rotate-180 ${isScrolled ? 'w-4 h-4' : 'w-5 h-5'}`} />
                  </button>

                  <Link to="/profile"
                    className={`rounded-full bg-slate-100 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-200 hover:text-orange-500 transition-all duration-300 flex items-center justify-center ${
                      isScrolled ? 'p-2' : 'p-3'
                    }`}
                    title="My Account"
                    aria-label="My Account"
                  >
                    <UserCheck className={`transition-all duration-300 text-orange-500 ${isScrolled ? 'w-4 h-4' : 'w-5 h-5'}`} />
                  </Link>
                </div>
              ) : (
                <button
                  onClick={() => setIsProfileOpen(true)}
                  className={`rounded-full bg-slate-100 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-200 hover:text-orange-500 transition-all duration-300 flex items-center justify-center ${
                    isScrolled ? 'p-2' : 'p-3'
                  }`}
                  title="Sign In / Register"
                  aria-label="Sign In / Register"
                >
                  <User className={`transition-all duration-300 ${isScrolled ? 'w-4 h-4' : 'w-5 h-5'}`} />
                </button>
              )}

              <button
                onClick={onOpenSearch}
                className={`rounded-full bg-slate-100 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-200 hover:text-orange-500 dark:hover:text-orange-400 hover:border-orange-500 transition-all duration-300 shadow-sm flex items-center justify-center cursor-pointer group ${
                  isScrolled ? 'p-2' : 'p-3'
                }`}
                title="Search Archive"
                aria-label="Search Archive"
              >
                <Search className={`text-slate-700 dark:text-zinc-200 group-hover:text-orange-500 transition-all duration-300 ${isScrolled ? 'w-4 h-4' : 'w-5 h-5'}`} />
              </button>
            </div>

            {/* Center Column */}
            <div className="flex items-center justify-center">
              <Link to="/" className="inline-block group">
                <span className={`font-black tracking-tighter text-slate-900 dark:text-white uppercase font-sans group-hover:text-orange-500 transition-all duration-300 ${
                  isScrolled ? 'text-xl' : 'text-3xl'
                }`}>
                  ENGULFIC
                </span>
              </Link>
            </div>

            {/* Right Column */}
            <div className="flex items-center justify-end gap-2">
              <Link to="/wishlist"
                className={`relative rounded-full bg-slate-100 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-200 hover:text-orange-500 transition-all duration-300 flex items-center justify-center ${
                  isScrolled ? 'p-2' : 'p-3'
                }`}
                title="Wishlist"
              >
                <Heart className={`transition-all duration-300 ${isScrolled ? 'w-4 h-4' : 'w-5 h-5'}`} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white font-mono font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center border border-white dark:border-zinc-950 shadow-md">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <button
                onClick={toggleCart}
                className={`relative rounded-full bg-slate-100 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-200 hover:text-orange-500 transition-all duration-300 flex items-center justify-center ${
                  isScrolled ? 'p-2' : 'p-3'
                }`}
                title="Open Cart Drawer"
                aria-label="Open Shopping Cart Drawer"
              >
                <ShoppingCart className={`text-slate-800 dark:text-zinc-100 transition-all duration-300 ${isScrolled ? 'w-4 h-4' : 'w-5 h-5'}`} />
                {totalCartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white font-mono font-bold text-[10px] min-w-5 h-5 px-1 rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-zinc-950">
                    {totalCartCount}
                  </span>
                )}
              </button>

              <button
                onClick={toggleTheme}
                className={`rounded-full border transition-all duration-300 flex items-center justify-center ${
                  theme === 'light'
                    ? 'bg-slate-900 text-white border-slate-900 hover:bg-orange-500 hover:border-orange-500'
                    : 'bg-zinc-900 text-orange-500 border-zinc-800 hover:bg-zinc-800 hover:border-orange-500/50'
                } ${isScrolled ? 'p-2' : 'p-3'}`}
                title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
                aria-label="Toggle Theme"
              >
                {theme === 'light' ? (
                  <Moon className={`text-orange-400 fill-orange-400 transition-all duration-300 ${isScrolled ? 'w-4 h-4' : 'w-5 h-5'}`} />
                ) : (
                  <Sun className={`text-orange-500 fill-orange-500 transition-all duration-300 ${isScrolled ? 'w-4 h-4' : 'w-5 h-5'}`} />
                )}
              </button>
            </div>
          </div>

          {/* BOTTOM TIER: Centered Menu Items Row */}
          <div className="border-t border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-black/20 relative transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <nav className="flex items-center justify-center gap-6 xl:gap-10 text-xs font-bold uppercase tracking-widest transition-all duration-300">
                {/* 1. T-SHIRT */}
                <Link to="/category/drop-shoulder-t-shirts"
                  className={`hover:text-orange-500 transition-all duration-300 relative flex items-center ${
                    isScrolled ? 'py-1.5' : 'py-3.5'
                  } ${
                    pathname.includes('drop-shoulder-t-shirts') || pathname.includes('tees') ? 'text-orange-500 font-extrabold' : ''
                  }`}
                >
                  T-Shirt
                  {(pathname.includes('drop-shoulder-t-shirts') || pathname.includes('tees')) && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full" />
                  )}
                </Link>

                {/* 2. SHIRTS */}
                <Link to="/category/shirts"
                  className={`hover:text-orange-500 transition-all duration-300 relative flex items-center ${
                    isScrolled ? 'py-1.5' : 'py-3.5'
                  } ${
                    pathname.includes('/category/shirts') ? 'text-orange-500 font-extrabold' : ''
                  }`}
                >
                  Shirts
                  {pathname.includes('/category/shirts') && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full" />
                  )}
                </Link>

                {/* 3. SWEATSHIRTS */}
                <Link to="/category/sweatshirts"
                  className={`hover:text-orange-500 transition-all duration-300 relative flex items-center ${
                    isScrolled ? 'py-1.5' : 'py-3.5'
                  } ${
                    pathname.includes('sweatshirts') ? 'text-orange-500 font-extrabold' : ''
                  }`}
                >
                  Sweatshirts
                </Link>

                {/* 4. PANTS */}
                <Link to="/category/baggy-pants"
                  className={`hover:text-orange-500 transition-all duration-300 relative flex items-center ${
                    isScrolled ? 'py-1.5' : 'py-3.5'
                  } ${
                    pathname.includes('pants') ? 'text-orange-500 font-extrabold' : ''
                  }`}
                >
                  Pants
                </Link>

                {/* 6. SHOP (MEGA MENU) */}
                <div className={`group cursor-pointer transition-all duration-300 ${
                  isScrolled ? 'py-1.5' : 'py-3.5'
                }`}>
                  <Link to="/shop" className="hover:text-orange-500 transition-colors flex items-center gap-1">
                    <span>Shop</span>
                    <ChevronDown className="w-3 h-3 text-slate-400 dark:text-zinc-500 transition-transform group-hover:rotate-180" />
                  </Link>

                  {/* Shop Mega Menu Dropdown Container */}
                  <div className="absolute left-0 right-0 top-full hidden group-hover:block bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xl border-b border-slate-200 dark:border-zinc-800 shadow-2xl p-8 z-50 text-slate-900 dark:text-white animate-fadeIn cursor-default">
                    <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 text-left">
                      {groupedCategories.map((parentCat, pIdx) => (
                        <div key={parentCat.slug || pIdx} className="space-y-3">
                          <Link 
                            to={`/category/${parentCat.slug}`} 
                            className="text-xs font-black hover:text-orange-500 text-slate-800 dark:text-zinc-200 uppercase tracking-wider pb-1.5 border-b border-slate-200 dark:border-zinc-800 block transition-colors flex items-center justify-between group/title"
                          >
                            <span>{parentCat.name}</span>
                            <ArrowRight className="w-3 h-3 text-orange-500 opacity-0 group-hover/title:opacity-100 transition-opacity" />
                          </Link>
                          
                          <div className="space-y-2 text-xs font-mono">
                            {parentCat.subcategories && parentCat.subcategories.length > 0 ? (
                               parentCat.subcategories.map((sub, sIdx) => (
                                 <Link
                                   key={sub.slug || sIdx}
                                   to={`/category/${sub.slug}`}
                                   className="block text-slate-600 dark:text-zinc-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors py-0.5"
                                 >
                                   {sub.name}
                                 </Link>
                               ))
                            ) : (
                              <Link
                                to={`/category/${parentCat.slug}`}
                                className="block text-slate-600 dark:text-zinc-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors py-0.5"
                              >
                                All {parentCat.name}
                              </Link>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 8. SALE */}
                <Link to="/category/sale"
                  className={`hover:text-orange-500 transition-all duration-300 text-orange-500 font-black flex items-center gap-1 ${
                    isScrolled ? 'py-1.5' : 'py-3.5'
                  }`}
                >
                  <span>Sale</span>
                  <span className="px-1.5 py-0.5 bg-orange-500 text-white text-[9px] rounded-full font-mono uppercase">
                    Hot
                  </span>
                </Link>

                {/* 9. ABOUT */}
                <div className={`group relative cursor-pointer transition-all duration-300 ${
                  isScrolled ? 'py-1.5' : 'py-3.5'
                }`}>
                  <span className="hover:text-orange-500 transition-colors flex items-center gap-1">
                    About
                    <ChevronDown className="w-3 h-3 text-slate-400 dark:text-zinc-500 transition-transform group-hover:rotate-180" />
                  </span>

                  <div className="absolute left-1/2 -translate-x-1/2 top-full w-48 hidden group-hover:block bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xl border border-slate-200 dark:border-zinc-800 shadow-xl rounded-2xl p-4 z-50 text-slate-900 dark:text-white space-y-2 text-left animate-fadeIn">
                    <Link to="/about" className="block py-1.5 px-3 rounded-lg hover:bg-orange-500/10 hover:text-orange-500 transition text-xs font-medium">
                      Our Story
                    </Link>
                    <Link to="/about#sustainability" className="block py-1.5 px-3 rounded-lg hover:bg-orange-500/10 hover:text-orange-500 transition text-xs font-medium">
                      Sustainability
                    </Link>
                    <Link to="/size-guide" className="block py-1.5 px-3 rounded-lg hover:bg-orange-500/10 hover:text-orange-500 transition text-xs font-medium">
                      Size Guide
                    </Link>
                    <Link to="/contact" className="block py-1.5 px-3 rounded-lg hover:bg-orange-500/10 hover:text-orange-500 transition text-xs font-medium">
                      Contact
                    </Link>
                  </div>
                </div>

                {/* 10. CONTACT */}
                <Link to="/contact"
                  className={`py-3.5 hover:text-orange-500 transition-colors flex items-center ${
                    pathname === '/contact' ? 'text-orange-500 font-extrabold' : ''
                  }`}
                >
                  Contact
                </Link>
              </nav>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xl border-b border-slate-200 dark:border-white/10 px-6 py-6 animate-fadeIn text-slate-900 dark:text-white space-y-6">
            <div className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-widest">
              <Link to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-slate-100 dark:border-white/5 text-slate-900 dark:text-white font-bold hover:text-orange-500 flex items-center justify-between"
              >
                <span>Home</span>
                <ArrowRight className="w-4 h-4 text-orange-500" />
              </Link>

              <Link to="/category/drop-shoulder-t-shirts"
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
                  <div className="pl-3 space-y-4 text-xs font-mono animate-fadeIn pt-2 pb-2">
                    {groupedCategories.map((parentCat, pIdx) => (
                      <div key={parentCat.slug || pIdx} className="space-y-1.5">
                        <Link 
                          to={`/category/${parentCat.slug}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="font-extrabold text-slate-900 dark:text-white hover:text-orange-500 uppercase tracking-wide block border-b border-slate-100 dark:border-white/5 pb-1"
                        >
                          {parentCat.name}
                        </Link>
                        {parentCat.subcategories && parentCat.subcategories.map((sub, sIdx) => (
                          <Link 
                            key={sub.slug || sIdx}
                            to={`/category/${sub.slug}`} 
                            onClick={() => setMobileMenuOpen(false)} 
                            className="block text-slate-600 dark:text-zinc-400 hover:text-orange-500 pl-2 py-0.5"
                          >
                            • {sub.name}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Link to="/category/sale"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-slate-100 dark:border-white/5 text-orange-500 font-extrabold flex items-center justify-between"
              >
                <span>Sale</span>
                <span className="px-2 py-0.5 bg-orange-500 text-white text-[9px] rounded-full">HOT</span>
              </Link>

              <Link to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-slate-100 dark:border-white/5 text-slate-800 dark:text-zinc-200 hover:text-orange-500 flex items-center justify-between"
              >
                <span>About</span>
                <ArrowRight className="w-4 h-4 text-slate-400 dark:text-white/30" />
              </Link>

              <Link to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-slate-800 dark:text-zinc-200 hover:text-orange-500 flex items-center justify-between"
              >
                <span>Contact</span>
                <ArrowRight className="w-4 h-4 text-slate-400 dark:text-white/30" />
              </Link>
            </div>

            {/* Bottom Actions Section */}
            <div className="pt-2 space-y-4">
              <div className="p-3 bg-orange-500/10 border border-orange-500/25 rounded-2xl text-xs font-mono text-slate-800 dark:text-zinc-200 flex items-center gap-2.5 shadow-sm">
                <Sparkles className="w-4 h-4 text-orange-500 flex-shrink-0" />
                <span className="text-[11px] leading-tight">
                  <strong className="text-orange-500 uppercase font-extrabold">Membership Offer:</strong> Sign in & get <strong className="text-orange-600 dark:text-orange-400">5% EXTRA OFF</strong> on all purchases.
                </span>
              </div>

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
                    <Link to="/profile"
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

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage('')} />
      )}

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-t border-slate-200 dark:border-white/10 shadow-[0_-4px_16px_rgba(0,0,0,0.1)] px-4 py-2 flex items-center justify-between pb-safe">
        {/* Left: Menu & Shop (Categories) */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex flex-col items-center justify-center text-slate-600 dark:text-zinc-400 hover:text-orange-500 dark:hover:text-orange-400 transition gap-0.5 active:scale-95"
            aria-label="Toggle Mobile Menu"
          >
            <Menu className="w-5 h-5" />
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider">Menu</span>
          </button>
          
          <Link
            to="/catalog"
            className="flex flex-col items-center justify-center text-slate-600 dark:text-zinc-400 hover:text-orange-500 dark:hover:text-orange-400 transition gap-0.5"
          >
            <Sparkles className="w-5 h-5 text-orange-500" />
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider">Shop</span>
          </Link>
        </div>

        {/* Center: Home Floating Button */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-4">
          <Link
            to="/"
            className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-500 text-white shadow-lg shadow-orange-500/30 border-2 border-white dark:border-zinc-950 hover:scale-105 active:scale-95 transition-all"
            title="Home"
          >
            <span className="font-black text-xs font-mono uppercase tracking-tighter">EG</span>
          </Link>
        </div>

        {/* Right: Search & Cart */}
        <div className="flex items-center gap-6">
          <button
            onClick={onOpenSearch}
            className="flex flex-col items-center justify-center text-slate-600 dark:text-zinc-400 hover:text-orange-500 dark:hover:text-orange-400 transition gap-0.5 active:scale-95"
            aria-label="Search Catalog"
          >
            <Search className="w-5 h-5" />
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider">Search</span>
          </button>

          <button
            onClick={toggleCart}
            className="flex flex-col items-center justify-center text-slate-600 dark:text-zinc-400 hover:text-orange-500 dark:hover:text-orange-400 transition gap-0.5 relative active:scale-95"
            aria-label="Toggle Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[9px] font-black text-white font-mono shadow-[0_0_8px_rgba(249,115,22,0.6)]">
                {totalCartCount}
              </span>
            )}
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider">Cart</span>
          </button>
        </div>
      </div>
    </>
  );
}
