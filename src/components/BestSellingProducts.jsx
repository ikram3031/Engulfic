'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import { Sparkles, TrendingUp } from 'lucide-react';

export default function BestSellingProducts({ onShowToast }) {
  const { data: displayedProducts = [], isLoading } = useQuery({
    queryKey: ['bestSellingProducts'],
    queryFn: () => fetchProducts({ sortBy: 'rating', limit: 8 })
  });

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


      </div>

      {/* Grid: Mobile = 2 products per row (grid-cols-2), Desktop = 4 products per row (lg:grid-cols-4) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-slate-200 dark:bg-white/10 rounded-3xl aspect-[3/4]" />
            ))
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
