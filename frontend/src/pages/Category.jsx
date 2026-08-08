'use client';

import { useState, use } from 'react';
import {  useSearchParams, useNavigate  } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/Breadcrumb';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import Toast from '@/components/Toast';
import SearchModal from '@/components/SearchModal';
import { CATEGORY_METADATA, PRODUCTS } from '@/lib/products';
import { Sparkles, SlidersHorizontal, ArrowUpDown, Layers } from 'lucide-react';

export default function CategoryPage({ params }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const searchParams = useSearchParams();
  const router = useNavigate();

  const subQuery = searchParams.get('sub');

  const categoryMeta = CATEGORY_METADATA.find((c) => c.slug === slug) || {
    name: slug.replace(/-/g, ' ').toUpperCase(),
    description: 'Explore curated high fashion products.',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=1200',
    tagline: 'Signature Engulfic Archive',
    subcategories: []
  };

  const selectedSub = subQuery || 'All';
  const [sortBy, setSortBy] = useState('featured');
  const [selectedGender, setSelectedGender] = useState('All');
  const [toastMessage, setToastMessage] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSubSelect = (sub) => {
    if (sub === 'All') {
      navigate(`/category/${slug}`);
    } else {
      navigate(`/category/${slug}?sub=${encodeURIComponent(sub)}`);
    }
  };

  // Filter products by category slug or collection slug
  let filteredProducts = PRODUCTS.filter((p) => {
    if (slug === 'new-arrivals') return p.isNew;
    if (slug === 'sale') return p.originalPrice > p.price;
    if (slug === 'best-sellers') return p.isBestSeller;
    if (slug === 'essentials') return p.price <= 2800 || p.isBestSeller;
    if (slug === 'graphic-collection') return p.name.toLowerCase().includes('graphic') || (p.subcategory && p.subcategory.toLowerCase().includes('graphic'));
    if (slug === 'oversized-collection') return p.name.toLowerCase().includes('oversized') || (p.subcategory && p.subcategory.toLowerCase().includes('oversized'));
    if (slug === 'sports-collection') return p.categorySlug === 'jerseys' || p.category.toLowerCase().includes('jersey');
    if (slug === 'limited-edition') return p.stockCount <= 18 || p.isNew;

    const pSlug = p.categorySlug || p.category.toLowerCase().replace(/\s+/g, '-');
    return pSlug === slug;
  });

  // Filter by Subcategory if selected
  if (selectedSub && selectedSub !== 'All') {
    filteredProducts = filteredProducts.filter((p) => {
      if (!p.subcategory) return false;
      const pSub = p.subcategory.toLowerCase();
      const sSub = selectedSub.toLowerCase();
      return pSub === sSub || pSub.includes(sSub) || sSub.includes(pSub);
    });
  }

  // Filter by Gender
  if (selectedGender !== 'All') {
    filteredProducts = filteredProducts.filter(
      (p) => p.gender === selectedGender || p.gender === 'Unisex'
    );
  }

  // Sort
  if (sortBy === 'price-asc') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    filteredProducts.sort((a, b) => b.rating - a.rating);
  }

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

  if (selectedSub !== 'All') {
    breadcrumbItems.push({ label: selectedSub });
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-white flex flex-col justify-between transition-colors duration-300">
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />

      <div className="flex-1">
        {/* Clickable Breadcrumbs */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Hero Category Banner */}
        <div className="relative h-[260px] sm:h-[320px] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-4 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-white/10">
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
              <span>
                {selectedSub !== 'All' ? `SUBCATEGORY: ${selectedSub}` : 'COLLECTION ARCHIVE'}
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight font-sans">
              {categoryMeta.name}
              {selectedSub !== 'All' && (
                <span className="block text-2xl sm:text-3xl text-orange-400 mt-1 font-mono font-medium">
                  {selectedSub}
                </span>
              )}
            </h1>
            <p className="text-xs sm:text-sm text-white/80 font-mono line-clamp-2 leading-relaxed">
              {categoryMeta.description}
            </p>
          </div>
        </div>

        {/* Subcategories Selector Bar */}
        {categoryMeta.subcategories && categoryMeta.subcategories.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 border-b border-slate-200 dark:border-white/10">
            <div className="flex items-center gap-2 mb-3 text-xs font-mono text-slate-500 dark:text-white/60 font-bold uppercase tracking-wider">
              <Layers className="w-4 h-4 text-orange-500" />
              <span>SUBCATEGORIES IN {categoryMeta.name}:</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <button
                onClick={() => handleSubSelect('All')}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition shrink-0 uppercase border ${
                  selectedSub === 'All'
                    ? 'bg-orange-500 text-white border-orange-400 shadow-lg'
                    : 'bg-slate-200 dark:bg-white/5 text-slate-700 dark:text-white/70 border-slate-300 dark:border-white/10 hover:border-orange-500'
                }`}
              >
                All
              </button>
              {categoryMeta.subcategories.map((sub, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSubSelect(sub)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition shrink-0 uppercase border ${
                    selectedSub === sub
                      ? 'bg-orange-500 text-white border-orange-400 shadow-lg'
                      : 'bg-slate-200 dark:bg-white/5 text-slate-700 dark:text-white/70 border-slate-300 dark:border-white/10 hover:border-orange-500'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Filters & Sorting Controls */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-b border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
            <span className="text-xs font-mono text-slate-500 dark:text-white/50 uppercase shrink-0">
              GENDER:
            </span>
            {['All', 'Men', 'Women', 'Unisex'].map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGender(g)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition shrink-0 ${
                  selectedGender === g
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'bg-slate-200 dark:bg-white/5 text-slate-700 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-xs font-mono text-slate-500 dark:text-white/50">
              SHOWING <strong className="text-slate-900 dark:text-white">{filteredProducts.length}</strong> GARMENTS
            </span>

            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-orange-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-200 dark:bg-white/10 border border-slate-300 dark:border-white/20 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
              >
                <option value="featured" className="dark:bg-zinc-900">Featured</option>
                <option value="price-asc" className="dark:bg-zinc-900">Price: Low to High</option>
                <option value="price-desc" className="dark:bg-zinc-900">Price: High to Low</option>
                <option value="rating" className="dark:bg-zinc-900">Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Catalog Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-slate-100 dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-white/10 space-y-4">
              <p className="text-xs font-mono text-slate-500 dark:text-white/60">
                NO PRODUCTS MATCH THE SELECTED FILTERS.
              </p>
              <button
                onClick={() => {
                  setSelectedGender('All');
                  handleSubSelect('All');
                }}
                className="px-6 py-2.5 bg-orange-500 text-white font-bold text-xs uppercase rounded-xl"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
              {filteredProducts.map((product) => (
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
