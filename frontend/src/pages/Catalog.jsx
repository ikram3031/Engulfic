'use client';

import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/Breadcrumb';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import Toast from '@/components/Toast';
import SearchModal from '@/components/SearchModal';
import { useAppStore } from '@/core/store/useAppStore';
import { Sparkles, Search, Loader2 } from 'lucide-react';

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State for filters and inputs
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'featured');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Store bindings
  const products = useAppStore((state) => state.products);
  const fetchProducts = useAppStore((state) => state.fetchProducts);
  const isProductsLoading = useAppStore((state) => state.isProductsLoading);
  const categories = useAppStore((state) => state.categories);

  const pageSize = 20;

  // Sync state changes with URL Search Params
  useEffect(() => {
    const params = {};
    if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory;
    if (searchQuery) params.q = searchQuery;
    if (sortBy && sortBy !== 'featured') params.sortBy = sortBy;
    if (page > 1) params.page = String(page);
    setSearchParams(params);
  }, [selectedCategory, searchQuery, sortBy, page, setSearchParams]);

  // Load products based on page, category, search, and sort choices
  useEffect(() => {
    const loadProducts = async () => {
      const opts = {
        skip: (page - 1) * pageSize,
        limit: pageSize,
        sortBy: sortBy === 'newest' ? 'createdAt' : sortBy === 'name-asc' ? 'name' : 'createdAt',
        order: sortBy === 'price-asc' ? 'asc' : 'desc',
      };
      if (selectedCategory && selectedCategory !== 'All') {
        opts.category = selectedCategory.toLowerCase();
      }
      if (searchQuery) {
        opts.q = searchQuery;
      }

      try {
        const result = await fetchProducts(opts);
        const totalRows = result._totalRows ?? result.length;
        setTotalProducts(totalRows);
        setTotalPages(Math.max(1, Math.ceil(totalRows / pageSize)));
      } catch (err) {
        console.error('Failed to load products page', err);
      }
    };

    loadProducts();
  }, [page, selectedCategory, searchQuery, sortBy, fetchProducts]);

  const categoriesList = ['All', ...categories.map(c => c.name || c.title)];

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-white flex flex-col justify-between transition-colors duration-300">
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />

      <div className="flex-1">
        {/* Breadcrumb */}
        <Breadcrumb items={[{ label: 'Catalog' }]} />

        {/* Hero Catalog Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono text-orange-500 uppercase tracking-widest font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>ARCHIVE COLLECTION</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">
                FULL PRODUCT CATALOG
              </h1>
              <p className="text-xs sm:text-sm font-mono text-slate-500 dark:text-white/60 mt-1">
                Explore all signature Engulfic garments.
              </p>
            </div>

            {/* Quick Stats Pill */}
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-slate-200/60 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-2xl text-xs font-mono">
              <span className="text-orange-500 font-bold">{totalProducts}</span>
              <span className="text-slate-600 dark:text-white/70">Pieces Available</span>
            </div>
          </div>

          {/* Primary Category Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categoriesList.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-2xl text-xs font-mono font-bold uppercase transition border shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-orange-500 text-white border-orange-400 shadow-lg shadow-orange-500/20'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-white/70 border-slate-200 dark:border-white/10 hover:border-orange-500'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Secondary Controls Bar (Search, Sort) */}
          <div className="p-4 sm:p-6 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl space-y-4 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Live Search Input */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 dark:text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search catalog..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-2xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="hidden lg:block lg:col-span-2"></div>
              
              {/* Sort By Dropdown */}
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-4 py-2.5 bg-white dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-2xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="featured">Sort: Featured</option>
                  <option value="newest">Sort: Newest First</option>
                  <option value="price-asc">Sort: Price Low to High</option>
                  <option value="price-desc">Sort: Price High to Low</option>
                  <option value="name-asc">Sort: Name (A-Z)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product Cards Grid */}
          {isProductsLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 pt-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div key={n} className="animate-pulse bg-slate-200 dark:bg-white/5 rounded-3xl aspect-[3/4]"></div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="space-y-8">
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 pt-4">
                {products.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onShowToast={(msg) => setToastMessage(msg)}
                  />
                ))}
              </div>

              {/* Simple Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 pt-6 border-t border-slate-200 dark:border-white/10">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    className="px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase bg-slate-100 dark:bg-white/5 disabled:opacity-50 transition border border-slate-200 dark:border-white/10"
                  >
                    Prev
                  </button>
                  <span className="text-xs font-mono">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                    className="px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase bg-slate-100 dark:bg-white/5 disabled:opacity-50 transition border border-slate-200 dark:border-white/10"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl space-y-4">
              <p className="text-base font-mono font-bold uppercase text-orange-500">
                NO MATCHING PIECES FOUND
              </p>
              <p className="text-xs font-mono text-slate-500 dark:text-white/60 max-w-sm mx-auto">
                Try resetting search query or categories.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                  setPage(1);
                }}
                className="px-6 py-2.5 bg-orange-500 text-white rounded-2xl text-xs font-mono font-bold uppercase hover:bg-orange-600 transition"
              >
                RESET CATALOG FILTERS
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage('')} />}
    </main>
  );
}
