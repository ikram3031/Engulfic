'use client';

import { useFilterStore } from '@/store/useFilterStore';
import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from '@/lib/api';
import { SlidersHorizontal, RotateCcw, Check } from 'lucide-react';

export default function CategoryPills({ totalResults }) {
  const {
    category,
    setCategory,
    sortBy,
    setSortBy,
    inStockOnly,
    setInStockOnly,
    resetFilters,
  } = useFilterStore();

  const { data: categoryData = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });

  const categoryList = ['All', ...categoryData.map(c => c.name)];

  return (
    <div id="catalog-section" className="bg-slate-100 dark:bg-white/5 backdrop-blur-md border-y border-slate-200 dark:border-white/10 py-6 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Top Row: Sort & Reset */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-end gap-4">
          {/* Sort & Quick Controls */}
          <div className="flex flex-wrap items-center gap-3 text-xs w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={() => setInStockOnly(!inStockOnly)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border transition-all backdrop-blur-md ${
                inStockOnly
                  ? 'bg-orange-500/20 border-orange-500 text-orange-600 dark:text-orange-400 font-bold'
                  : 'bg-slate-200 dark:bg-black/30 border-slate-300 dark:border-white/10 text-slate-700 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div
                className={`w-3 h-3 rounded-full border flex items-center justify-center ${
                  inStockOnly ? 'bg-orange-500 border-orange-500' : 'border-slate-400 dark:border-white/40'
                }`}
              >
                {inStockOnly && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
              </div>
              <span>In Stock Only</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 bg-slate-200 dark:bg-black/30 px-3.5 py-1.5 rounded-full border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white/80 backdrop-blur-md">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500 dark:text-white/50" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs text-slate-900 dark:text-white focus:outline-none cursor-pointer font-medium"
              >
                <option value="featured" className="dark:bg-zinc-950 text-slate-900 dark:text-white">Sort: Featured</option>
                <option value="price-asc" className="dark:bg-zinc-950 text-slate-900 dark:text-white">Price: Low to High</option>
                <option value="price-desc" className="dark:bg-zinc-950 text-slate-900 dark:text-white">Price: High to Low</option>
                <option value="rating" className="dark:bg-zinc-950 text-slate-900 dark:text-white">Highest Rated</option>
                <option value="new" className="dark:bg-zinc-950 text-slate-900 dark:text-white">New Arrivals</option>
              </select>
            </div>

            <button
              onClick={resetFilters}
              className="p-1.5 text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white transition rounded-full border border-slate-300 dark:border-white/10 bg-slate-200 dark:bg-black/30 backdrop-blur-md"
              title="Reset Filters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 border-t border-slate-200 dark:border-white/10">
          {categoryList.map((cat) => {
            const isSelected = category === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25 border border-orange-400/30'
                    : 'bg-slate-200 dark:bg-black/30 text-slate-700 dark:text-white/60 hover:text-slate-900 dark:hover:text-white border border-slate-300 dark:border-white/10 backdrop-blur-md'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Active Filter Chips */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-white/50 pt-1">
          <span>
            Showing <strong className="text-slate-900 dark:text-white font-mono">{totalResults ?? 0}</strong> curated garments
          </span>
          {(category !== 'All' || inStockOnly || sortBy !== 'featured') && (
            <span className="text-orange-500 text-[11px] font-mono">Filters active</span>
          )}
        </div>
      </div>
    </div>
  );
}
