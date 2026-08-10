'use client';

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/Breadcrumb';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import Toast from '@/components/Toast';
import SearchModal from '@/components/SearchModal';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts, fetchCategories } from '@/lib/api';
import { Sparkles, SlidersHorizontal, Search, ArrowUpDown, Grid, LayoutList } from 'lucide-react';

export default function CatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });

  const { data: filteredProducts = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products', selectedCategory, searchQuery, sortBy],
    queryFn: () => fetchProducts({ 
      category: selectedCategory !== 'All' ? selectedCategory.toLowerCase() : undefined, 
      searchQuery: searchQuery || undefined, 
      sortBy 
    })
  });

  const categoriesList = ['All', ...categories.map(c => c.name)];

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
                Explore all signature Engulfic streetwear garments.
              </p>
            </div>

            {/* Quick Stats Pill */}
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-slate-200/60 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-2xl text-xs font-mono">
              <span className="text-orange-500 font-bold">{filteredProducts.length}</span>
              <span className="text-slate-600 dark:text-white/70">Pieces Showing</span>
            </div>
          </div>

          {/* Primary Category Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categoriesList.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
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

          {/* Secondary Controls Bar (Search, Subcategories, Gender, Sort) */}
          <div className="p-4 sm:p-6 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl space-y-4 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Live Search Input */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 dark:text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search catalog..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-2xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="hidden lg:block lg:col-span-2"></div>
              
              {/* Sort By Dropdown */}
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-2xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="featured">Sort: Featured</option>
                  <option value="newest">Sort: Newest First</option>
                  <option value="rating">Sort: Highest Rating</option>
                  <option value="name-asc">Sort: Name (A-Z)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product Cards Grid */}
          {isLoadingProducts ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 pt-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div key={n} className="animate-pulse bg-slate-200 dark:bg-white/5 rounded-3xl aspect-[3/4]"></div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 pt-4">
              {filteredProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onShowToast={(msg) => setToastMessage(msg)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl space-y-4">
              <p className="text-base font-mono font-bold uppercase text-orange-500">
                NO MATCHING PIECES FOUND
              </p>
              <p className="text-xs font-mono text-slate-500 dark:text-white/60 max-w-sm mx-auto">
                Try resetting search query.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
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
