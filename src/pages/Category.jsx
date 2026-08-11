'use client';

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/Breadcrumb';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import Toast from '@/components/Toast';
import SearchModal from '@/components/SearchModal';
import { useAppStore } from '@/core/store/useAppStore';
import { Sparkles, ArrowUpDown } from 'lucide-react';

export default function CategoryPage() {
  const { slug } = useParams();

  const [sortBy, setSortBy] = useState('featured');
  const [toastMessage, setToastMessage] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Store bindings
  const products = useAppStore((state) => state.products);
  const fetchProducts = useAppStore((state) => state.fetchProducts);
  const isProductsLoading = useAppStore((state) => state.isProductsLoading);
  const categories = useAppStore((state) => state.categories);

  // Fetch category products whenever slug or sortBy changes
  useEffect(() => {
    fetchProducts({
      category: slug,
      sortBy: sortBy === 'newest' ? 'createdAt' : sortBy === 'name-asc' ? 'name' : 'createdAt',
      order: sortBy === 'price-asc' ? 'asc' : 'desc'
    });
  }, [slug, sortBy, fetchProducts]);

  const categoryMeta = categories.find((c) => c.slug === slug) || {
    name: slug ? slug.replace(/-/g, ' ').toUpperCase() : '',
    description: 'Explore curated high fashion products.',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=1200',
    tagline: 'Signature Engulfic Archive'
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3500);
  };

  const breadcrumbItems = [
    { label: 'Catalog', href: '/catalog' },
    { label: categoryMeta.name, href: `/category/${slug}` }
  ];

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-white flex flex-col justify-between transition-colors duration-300">
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />

      <div className="flex-1">
        {/* Clickable Breadcrumbs */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Hero Category Banner */}
        <div className="relative h-[260px] sm:h-[320px] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-4 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-white/10">
          <img
            src={categoryMeta.image || categoryMeta.imageUrl || 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=1200'}
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

        {/* Filters & Sorting Controls */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-b border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-xs font-mono text-slate-500 dark:text-white/50">
              SHOWING <strong className="text-slate-900 dark:text-white">{products.length}</strong> GARMENTS
            </span>

            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-orange-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-200 dark:bg-white/10 border border-slate-300 dark:border-white/20 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
              >
                <option value="featured" className="dark:bg-zinc-900">Featured</option>
                <option value="newest" className="dark:bg-zinc-900">Newest</option>
                <option value="price-asc" className="dark:bg-zinc-900">Price: Low to High</option>
                <option value="price-desc" className="dark:bg-zinc-900">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Catalog Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {isProductsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div key={n} className="animate-pulse bg-slate-200 dark:bg-white/5 rounded-3xl aspect-[3/4]"></div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 bg-slate-100 dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-white/10 space-y-4">
              <p className="text-xs font-mono text-slate-500 dark:text-white/60">
                NO PRODUCTS FOUND.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
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

      <Footer />

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />
    </main>
  );
}
