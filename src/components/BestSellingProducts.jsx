import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import { Sparkles, TrendingUp } from 'lucide-react';

export default function BestSellingProducts({ onShowToast }) {
  const [activeTab, setActiveTab] = useState('All');

  // Fetch all products to find which categories actually have products
  const { data: allProducts = [] } = useQuery({
    queryKey: ['allProductsForBestSellersFilter'],
    queryFn: () => fetchProducts({ limit: 100 })
  });

  const tabs = [
    { name: 'All', slug: 'All' },
    { name: 'T-Shirt', slug: 'drop-shoulder-t-shirts' },
    { name: 'Shirts', slug: 'shirts' },
    { name: 'Sweatshirts', slug: 'sweatshirts' },
    { name: 'Pants', slug: 'baggy-pants' }
  ];

  // Determine active categories slugs based on fetched products
  const activeCategorySlugs = new Set(
    allProducts.flatMap(p => {
      if (!p) return [];
      const list = Array.isArray(p.categories) ? p.categories : [];
      const slugs = list.map(c => typeof c === 'object' ? c.slug : c).filter(Boolean);
      if (p.categorySlug) slugs.push(p.categorySlug);
      return slugs.map(s => String(s).toLowerCase());
    })
  );

  // Filter tabs to only show categories that contain products
  const availableTabs = tabs.filter(tab => 
    tab.slug === 'All' || activeCategorySlugs.has(tab.slug.toLowerCase())
  );

  // If the active tab gets hidden, reset it to 'All'
  useEffect(() => {
    if (availableTabs.length > 0 && !availableTabs.some(t => t.name === activeTab)) {
      setActiveTab('All');
    }
  }, [availableTabs, activeTab]);

  const currentTab = tabs.find(t => t.name === activeTab);

  const { data: displayedProducts = [], isLoading } = useQuery({
    queryKey: ['bestSellingProducts', activeTab],
    queryFn: () => fetchProducts({
      category: currentTab.slug === 'All' ? undefined : currentTab.slug,
      sortBy: 'rating',
      limit: 4
    })
  });

  return (
    <section id="bestsellers-section" className="py-8 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-6 space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-orange-500 uppercase tracking-widest justify-center">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>MOST COVETED GARMENTS</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-slate-900 dark:text-white font-sans">
          BEST SELLING PRODUCTS
        </h2>
      </div>

      {/* Tabs Menu (Horizontal Scroll on Mobile, Centered on Desktop) */}
      <div className="flex sm:flex-wrap items-center justify-start sm:justify-center gap-2 sm:gap-3 mb-8 w-full max-w-3xl mx-auto overflow-x-auto no-scrollbar py-1">
        {availableTabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex-shrink-0 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 border ${
              activeTab === tab.name
                ? 'bg-orange-500 text-white border-orange-400 shadow-[0_0_12px_rgba(249,115,22,0.4)] scale-105'
                : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white/60 border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Grid: 2 columns on mobile, 4 columns on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-slate-200 dark:bg-white/10 rounded-3xl aspect-[3/4]" />
            ))
          : displayedProducts.length === 0
          ? (
              <div className="col-span-full text-center py-12 text-slate-500 dark:text-white/50 font-mono text-xs">
                No runway pieces found in this category.
              </div>
            )
          : displayedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onShowToast={onShowToast}
              />
            ))}
      </div>
    </section>
  );
}
