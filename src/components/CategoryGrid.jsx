'use client';

import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from '@/lib/api';
import menuData from '@/lib/menu.json';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function CategoryGrid() {
  const { data: apiCategories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });

  const categoriesFromMenu = menuData.map(menuItem => {
    const apiMatch = apiCategories.find(c => c.slug === menuItem.slug || c.name.toLowerCase() === menuItem.name.toLowerCase());
    return {
      id: apiMatch?.id || menuItem.slug,
      name: menuItem.name,
      slug: menuItem.slug,
      imageUrl: apiMatch?.imageUrl || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800',
      productCount: apiMatch?.productCount ?? 'N/A',
      description: apiMatch?.description || '',
    };
  });

  const categories = [
    ...categoriesFromMenu,
    { id: 'sale', name: 'On Sale!', slug: 'sale', imageUrl: 'https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&q=80&w=800', productCount: 'Hot', description: 'Explore discounted pieces from past seasons.' }
  ];

  if (isLoading) {
    return (
      <section id="categories-section" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="w-32 h-4 bg-slate-200 dark:bg-white/10 rounded-full mb-2 animate-pulse" />
              <div className="w-64 h-10 bg-slate-200 dark:bg-white/10 rounded-lg animate-pulse" />
            </div>
            <div className="w-48 h-4 bg-slate-200 dark:bg-white/10 rounded-full animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-[420px] sm:h-[460px] rounded-3xl bg-slate-200 dark:bg-white/5 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="categories-section" className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-orange-500 mb-2 uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>CURATED ARCHIVE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-slate-900 dark:text-white font-sans">
              CATEGORIES
            </h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-white/60 max-w-md font-mono">
            Explore our signature collections tailored from heavy French terry, Italian cotton poplin, and 300GSM organic jersey.
          </p>
        </div>

        {/* Grid: 1 col mobile, 2 col tablet, 3 col desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {categories.map((cat, idx) => (
            <div
              key={cat.id || cat.slug}
              className="group relative h-[420px] sm:h-[460px] rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-xl transition-all duration-500 hover:shadow-2xl hover:border-orange-500/50 flex flex-col justify-between p-5 sm:p-6"
            >
              {/* Background Image with Scale Animation */}
              <img
                src={cat.imageUrl}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                referrerPolicy="no-referrer"
              />

              {/* Gradient Overlay for Text Legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30 group-hover:from-black/95 transition-colors duration-500" />

              {/* Top Pill / Badge */}
              <div className="relative z-10 flex items-center justify-between gap-1">
                <span className="px-3 py-1 bg-black/70 backdrop-blur-md border border-white/20 text-white text-[10px] sm:text-[11px] font-mono font-bold uppercase rounded-full tracking-wider shadow-lg">
                  0{idx + 1}. {cat.slug === 'sale' ? 'SALE' : 'CATEGORY'}
                </span>
                <span className="px-2.5 py-1 bg-orange-500/90 text-white text-[10px] sm:text-[11px] font-mono font-bold uppercase rounded-full tracking-wider shadow-lg">
                  {cat.productCount}
                </span>
              </div>

              {/* Bottom Content Area */}
              <div className="relative z-10 space-y-3">
                <Link to={`/category/${cat.slug}`} className="block">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider font-sans group-hover:text-orange-400 transition-colors line-clamp-1">
                      {idx + 1}. {cat.name}
                    </h3>
                    <div className="p-2.5 bg-orange-500 text-white rounded-full opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300 shadow-xl border border-orange-400/30 flex-shrink-0">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>



                <div className="pt-1 flex items-center justify-between">
                  <p className="text-xs text-white/70 font-mono line-clamp-1">
                    {cat.description}
                  </p>
                  <Link
                    to={`/category/${cat.slug}`}
                    className="flex items-center gap-1 text-xs font-bold uppercase text-orange-400 tracking-widest font-mono hover:underline flex-shrink-0"
                  >
                    <span>Explore</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
