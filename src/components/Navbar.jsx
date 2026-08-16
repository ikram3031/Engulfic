'use client';

import { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useThemeStore } from '@/store/useThemeStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from '@/lib/api';
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

function buildGroupedCategories(rawCategories) {
  if (!rawCategories || rawCategories.length === 0) {
    return [
      {
        name: 'Drop Shoulder T-Shirts',
        slug: 'drop-shoulder-t-shirts',
        subcategories: [
          { name: 'Graphic Drop Shoulder Tee', slug: 'graphic-drop-shoulder-tee' },
          { name: 'Drop Shoulder Tee', slug: 'drop-shoulder-tee' },
        ]
      },
      {
        name: 'Shirts',
        slug: 'shirts',
        subcategories: [
          { name: 'Casual Shirt', slug: 'casual-shirt' },
          { name: 'Oversized Shirt', slug: 'oversized-shirt' },
        ]
      },
      {
        name: 'Sweatshirts',
        slug: 'sweatshirts',
        subcategories: [
          { name: 'Solid Sweatshirt', slug: 'solid-sweatshirt' },
          { name: 'Oversized Graphic Sweatshirt', slug: 'oversized-graphic-sweatshirt' },
        ]
      },
      {
        name: 'Baggy Pants',
        slug: 'baggy-pants',
        subcategories: [
          { name: 'Baggy Sweatpants', slug: 'baggy-sweatpants' },
          { name: 'Baggy Graphic Sweatpants', slug: 'baggy-graphic-sweatpants' },
        ]
      },
      {
        name: 'Jerseys',
        slug: 'jerseys',
        subcategories: [
          { name: 'Player Edition', slug: 'player-edition' },
          { name: 'Fan Edition', slug: 'fan-edition' },
          { name: 'Retro Edition', slug: 'retro-edition' },
        ]
      }
    ];
  }

  const parents = rawCategories.filter(c => !c.parent);
  const children = rawCategories.filter(c => c.parent);

  if (parents.length === 0) {
    return rawCategories.map(c => ({
      name: c.name,
      slug: c.slug,
      subcategories: []
    }));
  }

  return parents.map(p => {
    const pId = String(p.id || p._id || p.slug);
    const pSlug = p.slug;
    const subcats = children.filter(c => {
      const cParentId = typeof c.parent === 'object' ? String(c.parent.id || c.parent._id || c.parent.slug) : String(c.parent);
      return cParentId === pId || cParentId === pSlug;
    }).map(c => ({
      name: c.name,
      slug: c.slug
    }));

    return {
      name: p.name,
      slug: p.slug,
      subcategories: subcats
    };
  });
}

export default function Navbar({ onOpenSearch }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);

  const { pathname } = useLocation();
  const { data: categories = [] } = useQuery({ queryKey: ['categories'], queryFn: fetchCategories });

  const groupedCategories = useMemo(() => buildGroupedCategories(categories), [categories]);

  const totalCartCount = useCartStore((state) => state.getTotalItemsCount());
  const toggleCart = useCartStore((state) => state.toggleCart);
  const toastMessage = useCartStore((state) => state.toastMessage);
  const setToastMessage = useCartStore((state) => state.setToastMessage);
  const wishlistCount = useWishlistStore((state) => state.wishlist.length);
  const { theme, toggleTheme, initTheme } = useThemeStore();
  const { isLoggedIn, logout } = useAuthStore();

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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 grid grid-cols-3 items-center">
            {/* Left Column */}
            <div className="flex items-center justify-start gap-3">
              {isLoggedIn ? (
                <div className="flex items-center gap-3">
                  <button
                    onClick={logout}
                    className="p-3 rounded-full bg-slate-100 dark:bg-zinc-900/80 hover:bg-red-500/10 text-slate-600 dark:text-zinc-300 hover:text-red-500 border border-slate-200 dark:border-zinc-800 transition text-xs font-mono flex items-center justify-center cursor-pointer"
                    title="Sign Out"
                    aria-label="Sign Out"
                  >
                    <LogOut className="w-5 h-5 rotate-180" />
                  </button>

                  <Link to="/profile"
                    className="p-3 rounded-full bg-slate-100 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-200 hover:text-orange-500 transition flex items-center justify-center"
                    title="My Account"
                    aria-label="My Account"
                  >
                    <UserCheck className="w-5 h-5 text-orange-500" />
                  </Link>
                </div>
              ) : (
                <button
                  onClick={() => setIsProfileOpen(true)}
                  className="p-3 rounded-full bg-slate-100 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-200 hover:text-orange-500 transition flex items-center justify-center"
                  title="Sign In / Register"
                  aria-label="Sign In / Register"
                >
                  <User className="w-5 h-5" />
                </button>
              )}

              <button
                onClick={onOpenSearch}
                className="p-3 rounded-full bg-slate-100 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-200 hover:text-orange-500 dark:hover:text-orange-400 hover:border-orange-500 transition shadow-sm flex items-center justify-center cursor-pointer group"
                title="Search Archive"
                aria-label="Search Archive"
              >
                <Search className="w-5 h-5 text-slate-700 dark:text-zinc-200 group-hover:text-orange-500 transition-colors" />
              </button>
            </div>

            {/* Center Column */}
            <div className="flex items-center justify-center">
              <Link to="/" className="inline-block group">
                <span className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white uppercase font-sans group-hover:text-orange-500 transition-colors">
                  ENGULFIC
                </span>
              </Link>
            </div>

            {/* Right Column */}
            <div className="flex items-center justify-end gap-3">
              <Link to="/wishlist"
                className="relative p-3 rounded-full bg-slate-100 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-200 hover:text-orange-500 transition flex items-center justify-center"
                title="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white font-mono font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center border border-white dark:border-zinc-950 shadow-md">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <button
                onClick={toggleCart}
                className="relative p-3 rounded-full bg-slate-100 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-200 hover:text-orange-500 transition flex items-center justify-center"
                title="Open Cart Drawer"
                aria-label="Open Shopping Cart Drawer"
              >
                <ShoppingCart className="w-5 h-5 text-slate-800 dark:text-zinc-100" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white font-mono font-bold text-[10px] min-w-5 h-5 px-1 rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-zinc-950">
                    {totalCartCount}
                  </span>
                )}
              </button>

              <button
                onClick={toggleTheme}
                className={`p-3 rounded-full border transition flex items-center justify-center ${
                  theme === 'light'
                    ? 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800'
                    : 'bg-zinc-900 text-amber-400 border-zinc-800 hover:bg-zinc-800'
                }`}
                title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
                aria-label="Toggle Theme"
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5 text-amber-300 fill-amber-300" />
                ) : (
                  <Sun className="w-5 h-5 text-amber-400 fill-amber-400" />
                )}
              </button>
            </div>
          </div>

          {/* BOTTOM TIER: Centered Menu Items Row */}
          <div className="border-t border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-black/20 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <nav className="flex items-center justify-center gap-6 xl:gap-10 text-xs font-bold uppercase tracking-widest">
                {/* 1. T-SHIRT */}
                <Link to="/category/drop-shoulder-t-shirts"
                  className={`py-3.5 hover:text-orange-500 transition-colors relative flex items-center ${
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
                  className={`py-3.5 hover:text-orange-500 transition-colors relative flex items-center ${
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
                  className={`py-3.5 hover:text-orange-500 transition-colors relative flex items-center ${
                    pathname.includes('sweatshirts') ? 'text-orange-500 font-extrabold' : ''
                  }`}
                >
                  Sweatshirts
                </Link>

                {/* 4. PANTS */}
                <Link to="/category/baggy-pants"
                  className={`py-3.5 hover:text-orange-500 transition-colors relative flex items-center ${
                    pathname.includes('pants') ? 'text-orange-500 font-extrabold' : ''
                  }`}
                >
                  Pants
                </Link>

                {/* 5. JERSEYS */}
                <Link to="/category/jerseys"
                  className={`py-3.5 hover:text-orange-500 transition-colors relative flex items-center ${
                    pathname.includes('jerseys') ? 'text-orange-500 font-extrabold' : ''
                  }`}
                >
                  Jerseys
                </Link>

                {/* 6. SHOP (MEGA MENU) */}
                <div className="group py-3.5 cursor-pointer">
                  <span className="hover:text-orange-500 transition-colors flex items-center gap-1">
                    Shop
                    <ChevronDown className="w-3 h-3 text-slate-400 dark:text-zinc-500 transition-transform group-hover:rotate-180" />
                  </span>

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
                  className="py-3.5 hover:text-orange-500 transition-colors text-orange-500 font-black flex items-center gap-1"
                >
                  <span>Sale</span>
                  <span className="px-1.5 py-0.5 bg-orange-500 text-white text-[9px] rounded-full font-mono uppercase">
                    Hot
                  </span>
                </Link>

                {/* 9. ABOUT */}
                <div className="group py-3.5 relative cursor-pointer">
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
    </>
  );
}
