'use client';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchCategories, getImageBaseUrl } from '@/lib/api';
import { ArrowRight, Sparkles } from 'lucide-react';

// Local asset fallbacks
import tShirtImg from '@/assets/T-shirt.webp';
import sweatshirtImg from '@/assets/sweatshirt.webp';
import pantImg from '@/assets/pant.webp';
import shirtImg from '@/assets/shirt.webp';

const CATEGORY_CONFIG = [
  {
    id: 't-shirt',
    name: 'T-Shirt',
    slug: 'graphic-drop-shoulder-tee',
    uploadPath: '/uploads/assets/T-shirt.webp',
    fallbackImg: tShirtImg,
    description: 'Heavyweight oversized drop shoulder tees in 300GSM organic cotton.'
  },
  {
    id: 'sweatshirt',
    name: 'Sweatshirt',
    slug: 'sweatshirts',
    uploadPath: '/uploads/assets/sweatshirt.webp',
    fallbackImg: sweatshirtImg,
    description: 'Relaxed fit architectural silhouettes in premium French terry.'
  },
  {
    id: 'pant',
    name: 'Pant',
    slug: 'baggy-sweatpants',
    uploadPath: '/uploads/assets/pant.webp',
    fallbackImg: pantImg,
    description: 'Signature baggy cut trousers with tailored drape and comfort.'
  },
  {
    id: 'shirt',
    name: 'Shirt',
    slug: 'casual-shirt',
    uploadPath: '/uploads/assets/shirt.webp',
    fallbackImg: shirtImg,
    description: 'Contemporary oversized and casual shirts in Italian cotton poplin.'
  }
];

export default function CategoryGrid() {
  const { data: apiCategories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });

  const baseUrl = getImageBaseUrl();

  const categories = CATEGORY_CONFIG.map(config => {
    const apiMatch = apiCategories.find(
      c => c.slug === config.slug || c.name?.toLowerCase() === config.name?.toLowerCase()
    );

    return {
      ...config,
      productCount: apiMatch?.productCount ?? 'View',
      description: apiMatch?.description || config.description,
      primaryImageUrl: `${baseUrl}${config.uploadPath}`,
    };
  });

  if (isLoading) {
    return (
      <section id="categories-section" className="py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
            <div>
              <div className="w-32 h-4 bg-slate-200 dark:bg-white/10 rounded-full mb-2 animate-pulse" />
              <div className="w-64 h-10 bg-slate-200 dark:bg-white/10 rounded-lg animate-pulse" />
            </div>
            <div className="w-48 h-4 bg-slate-200 dark:bg-white/10 rounded-full animate-pulse" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-[210px] sm:h-[320px] md:h-[400px] lg:h-[450px] rounded-2xl sm:rounded-3xl bg-slate-200 dark:bg-white/5 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="categories-section" className="py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-5 sm:mb-6 gap-3 sm:gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-orange-500 mb-1.5 uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>CURATED ARCHIVE</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-slate-900 dark:text-white font-sans">
              CATEGORIES
            </h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-white/60 max-w-md font-mono">
            Explore our signature collections tailored from heavy French terry, Italian cotton poplin, and 300GSM organic jersey.
          </p>
        </div>

        {/* Grid: 2 col mobile, 4 col desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
          {categories.map((cat, idx) => (
            <CategoryCard key={cat.id || cat.slug} cat={cat} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryCard({ cat }) {
  const [imgSrc, setImgSrc] = useState(cat.primaryImageUrl);

  return (
    <div className="group relative h-[210px] sm:h-[320px] md:h-[400px] lg:h-[450px] rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-lg hover:shadow-2xl transition-all duration-500 hover:border-orange-500/50 flex flex-col justify-end p-3.5 sm:p-5 md:p-6">
      {/* Background Image with Scale Animation & Fallback */}
      <img
        src={imgSrc}
        alt={cat.name}
        onError={() => {
          if (imgSrc !== cat.fallbackImg) {
            setImgSrc(cat.fallbackImg);
          }
        }}
        className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
        referrerPolicy="no-referrer"
      />

      {/* Gradient Overlay for Text Legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent group-hover:from-black/95 transition-colors duration-500" />

      {/* Bottom Content Area */}
      <div className="relative z-10">
        <Link to={`/category/${cat.slug}`} className="block">
          <div className="flex items-center justify-between gap-1">
            <h3 className="text-sm sm:text-xl md:text-2xl font-black text-white uppercase tracking-wider font-sans group-hover:text-orange-400 transition-colors line-clamp-1">
              {cat.name}
            </h3>
            <div className="p-1.5 sm:p-2.5 bg-orange-500 text-white rounded-full opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transform sm:translate-x-2 sm:group-hover:translate-x-0 transition-all duration-300 shadow-xl border border-orange-400/30 flex-shrink-0">
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
