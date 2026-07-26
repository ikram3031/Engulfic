'use client';

import Link from 'next/link';
import { CATEGORY_METADATA } from '@/lib/products';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function CategoryGrid() {
  return (
    <section id="categories-section" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono text-orange-500 mb-2 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>CURATED CATEGORIES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-slate-900 dark:text-white font-sans">
            BROWSE BY CATEGORY
          </h2>
        </div>
        <p className="text-xs text-slate-600 dark:text-white/60 max-w-md font-mono">
          Explore our signature collections tailored from Italian cotton poplin, Japanese selvedge denim, and 300GSM organic jersey.
        </p>
      </div>

      {/* Grid: 2 Cards per Row (grid-cols-1 md:grid-cols-2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {CATEGORY_METADATA.map((cat) => (
          <Link
            key={cat.id}
            href={`/category/${cat.slug}`}
            className="group relative h-[420px] sm:h-[480px] rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-xl transition-all duration-500 hover:shadow-2xl hover:border-orange-500/50 block"
          >
            {/* Background Image with Scale Animation */}
            <img
              src={cat.image}
              alt={cat.name}
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
              referrerPolicy="no-referrer"
            />

            {/* Gradient Overlay for Text Legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 group-hover:from-black/95 transition-colors duration-500" />

            {/* Top Pill / Badge */}
            <div className="absolute top-6 left-6 z-10">
              <span className="px-3.5 py-1.5 bg-black/60 backdrop-blur-md border border-white/20 text-white text-[11px] font-mono font-bold uppercase rounded-full tracking-wider shadow-lg">
                {cat.itemCount}
              </span>
            </div>

            {/* Bottom Content Area */}
            <div className="absolute bottom-0 left-0 right-0 p-8 z-10 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider font-sans group-hover:text-orange-400 transition-colors">
                  {cat.name}
                </h3>
                <div className="p-3 bg-orange-500 text-white rounded-full opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300 shadow-xl border border-orange-400/30">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>

              <p className="text-xs text-white/80 font-mono line-clamp-2 leading-relaxed">
                {cat.tagline}
              </p>

              <div className="pt-2 flex items-center gap-2 text-xs font-bold uppercase text-orange-400 tracking-widest font-mono group-hover:translate-x-1 transition-transform">
                <span>View Collection</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
