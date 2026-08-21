'use client';

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/Breadcrumb';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import Toast from '@/components/Toast';
import SearchModal from '@/components/SearchModal';
import CategorySidebar from '@/components/CategorySidebar';
import menuData from '@/lib/menu.json';
import { useAppStore } from '@/core/store/useAppStore';
import { Sparkles, ArrowUpDown, SlidersHorizontal } from 'lucide-react';

export default function CategoryPage() {
  const { slug } = useParams();

  const [sortBy, setSortBy] = useState('featured');
  const [toastMessage, setToastMessage] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Store bindings
  const products = useAppStore((state) => state.products);
  const fetchProducts = useAppStore((state) => state.fetchProducts);
  const isProductsLoading = useAppStore((state) => state.isProductsLoading);

  // Fetch category products whenever slug or sortBy changes
  useEffect(() => {
    fetchProducts({
      category: slug,
      sortBy: sortBy === 'newest' ? 'createdAt' : sortBy === 'name-asc' ? 'name' : 'createdAt',
      order: sortBy === 'price-asc' ? 'asc' : 'desc'
    });
  }, [slug, sortBy, fetchProducts]);

  // Resolve category metadata from menuData
  let foundCategoryName = slug ? slug.replace(/-/g, ' ').toUpperCase() : 'COLLECTION';
  menuData.forEach((parent) => {
    if (parent.slug === slug) {
      foundCategoryName = parent.name;
    }
    parent.subcategories?.forEach((sub) => {
      if (sub.slug === slug) {
        foundCategoryName = sub.name;
      }
    });
  });

  const categoryMeta = {
    name: foundCategoryName,
    description: 'Explore curated high fashion products from signature archive collections.',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=1200'
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3500);
  };

  const breadcrumbItems = [
    { label: 'Shop', href: '/shop' },
    { label: categoryMeta.name, href: `/category/${slug}` }
  ];

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-white flex flex-col justify-between transition-colors duration-300">
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />

      <div className="flex-1">
        {/* Clickable Breadcrumbs */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Hero Category Banner */}
        <div className="relative h-[220px] sm:h-[280px] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-4 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-white/10">
          <img
            src={categoryMeta.image}
            alt={categoryMeta.name}
            className="absolute inset-0 w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />

          <div className="relative z-10 h-full flex flex-col justify-center max-w-xl text-white space-y-3 p-6 sm:p-10">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-orange-400 uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>COLLECTION ARCHIVE</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight font-sans">
              {categoryMeta.name}
            </h1>
            <p className="text-xs sm:text-sm text-white/80 font-mono line-clamp-2 leading-relaxed">
              {categoryMeta.description}
            </p>
          </div>
        </div>

        {/* Main Category Content Area with Sidebar Layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
          
          {/* Category Sidebar Column (Desktop & Mobile Drawer) */}
          <CategorySidebar
            activeSlug={slug}
            isMobileOpen={isMobileSidebarOpen}
            onCloseMobile={() => setIsMobileSidebarOpen(false)}
          />

          {/* Right Main Catalog Area */}
          <div className="flex-1 space-y-6">
            
            {/* Top Controls Bar */}
            <div className="p-4 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
              <div className="flex items-center gap-3">
                {/* Mobile Filter Drawer Trigger Button */}
                <button
                  onClick={() => setIsMobileSidebarOpen(true)}
                  className="lg:hidden px-3.5 py-2 bg-orange-500 text-white font-bold uppercase rounded-xl flex items-center gap-2 shadow-md"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Categories</span>
                </button>

                <span className="text-slate-500 dark:text-white/60">
                  SHOWING <strong className="text-slate-900 dark:text-white">{products.length}</strong> PIECES
                </span>
              </div>

              {/* Sort Controls */}
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-orange-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="featured">Sort: Featured</option>
                  <option value="newest">Sort: Newest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            {isProductsLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="animate-pulse bg-slate-200 dark:bg-white/5 rounded-3xl aspect-[3/4]"></div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16 bg-slate-100 dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-white/10 space-y-4 font-mono">
                <p className="text-xs text-orange-500 font-bold uppercase">
                  NO PRODUCTS FOUND IN THIS CATEGORY.
                </p>
                <p className="text-xs text-slate-500 dark:text-white/60 max-w-xs mx-auto">
                  Browse other category sections or check full catalog.
                </p>
                <Link
                  to="/shop"
                  className="inline-block px-5 py-2.5 bg-orange-500 text-white rounded-xl text-xs font-bold uppercase shadow-lg hover:bg-orange-600 transition"
                >
                  VIEW ALL PRODUCTS
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {products.map((product) => (
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
      </div>

      <Footer />

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />
    </main>
  );
}
