'use client';

import { useState } from 'react';
import { PRODUCTS } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import { Sparkles, TrendingUp } from 'lucide-react';

export default function BestSellingProducts({ onShowToast }) {
  const [activeTab, setActiveTab] = useState('All');

  // Filter products by Best Sellers or top products, and selected gender tab
  const bestSellers = PRODUCTS.filter((p) => p.isBestSeller || p.rating >= 4.8);

  const displayedProducts = bestSellers
    .filter((p) => {
      if (activeTab === 'Men') {
        return p.gender === 'Men' || p.gender === 'Unisex';
      }
      if (activeTab === 'Women') {
        return p.gender === 'Women' || p.gender === 'Unisex';
      }
      return true; // All
    })
    .slice(0, 12); // Display 12 products max

  return (
    <section id="bestsellers-section" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono text-orange-500 mb-2 uppercase tracking-widest">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>MOST COVETED GARMENTS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-slate-900 dark:text-white font-sans">
            BEST SELLING PRODUCTS
          </h2>
        </div>

        {/* Gender Tabs: All, Men, Women (NO in-stock or sort filters here) */}
        <div className="flex items-center gap-1.5 bg-slate-200/80 dark:bg-white/5 p-1.5 rounded-full border border-slate-300 dark:border-white/10 backdrop-blur-xl">
          {['All', 'Men', 'Women'].map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                  isActive
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                    : 'text-slate-700 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid: Mobile = 2 products per row (grid-cols-2), Desktop = 4 products per row (lg:grid-cols-4) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
        {displayedProducts.map((product) => (
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
