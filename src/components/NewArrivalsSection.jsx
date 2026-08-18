'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import { Sparkles, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NewArrivalsSection({ onShowToast }) {
  const { data: newArrivals = [], isLoading } = useQuery({
    queryKey: ['newArrivals'],
    queryFn: () => fetchProducts({ sortBy: 'newest', limit: 12 })
  });

  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const items = newArrivals;

  const updateScrollState = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    const totalPages = Math.ceil(scrollWidth / clientWidth);
    const currentPage = Math.round(scrollLeft / clientWidth);
    setActiveIndex(Math.min(currentPage, Math.max(0, totalPages - 1)));
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);
    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [items]);

  const scrollByPage = (direction) => {
    if (!scrollRef.current) return;
    const { clientWidth } = scrollRef.current;
    const amount = direction === 'next' ? clientWidth : -clientWidth;
    scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  };

  const scrollToIndex = (pageIndex) => {
    if (!scrollRef.current) return;
    const { clientWidth } = scrollRef.current;
    scrollRef.current.scrollTo({ left: pageIndex * clientWidth, behavior: 'smooth' });
  };

  return (
    <section id="new-arrivals-section" className="py-8 sm:py-10 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-5 sm:mb-6 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono text-orange-500 mb-1.5 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>FRESH FROM THE RUNWAY</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-slate-900 dark:text-white font-sans">
            NEW ARRIVALS
          </h2>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3">
          <Link
            to="/catalog?sortBy=newest"
            className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white font-bold uppercase tracking-wider text-xs rounded-full hover:bg-orange-500 hover:text-white transition shadow-sm"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {/* Nav buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => scrollByPage('prev')}
              disabled={!canScrollLeft}
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition shadow-sm border ${
                canScrollLeft
                  ? 'bg-slate-200 dark:bg-white/10 hover:bg-orange-500 hover:text-white text-slate-800 dark:text-white border-slate-300 dark:border-white/10 cursor-pointer'
                  : 'bg-slate-100 dark:bg-white/5 text-slate-300 dark:text-white/20 border-slate-200 dark:border-white/5 cursor-not-allowed'
              }`}
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => scrollByPage('next')}
              disabled={!canScrollRight}
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition shadow-sm border ${
                canScrollRight
                  ? 'bg-slate-200 dark:bg-white/10 hover:bg-orange-500 hover:text-white text-slate-800 dark:text-white border-slate-300 dark:border-white/10 cursor-pointer'
                  : 'bg-slate-100 dark:bg-white/5 text-slate-300 dark:text-white/20 border-slate-200 dark:border-white/5 cursor-not-allowed'
              }`}
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse bg-slate-200 dark:bg-white/10 rounded-2xl aspect-[3/4]" />
          ))}
        </div>
      ) : items.length > 0 ? (
        <div>
          {/* Mobile-First 2-col Scroll Track */}
          <div
            ref={scrollRef}
            className="flex gap-3 sm:gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar py-1"
          >
            {items.map((product) => (
              <div
                key={product.id || product.slug}
                className="w-[calc(50%-6px)] min-w-[calc(50%-6px)] sm:w-[calc(33.333%-11px)] sm:min-w-[calc(33.333%-11px)] lg:w-[calc(25%-12px)] lg:min-w-[calc(25%-12px)] flex-shrink-0 snap-start"
              >
                <ProductCard
                  product={product}
                  onShowToast={onShowToast}
                  hideDetails={false}
                />
              </div>
            ))}
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-5 sm:mt-6 gap-1.5 sm:gap-2">
            {Array.from({ length: Math.min(Math.ceil(items.length / 2), 6) }).map((_, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={idx}
                  onClick={() => scrollToIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isActive
                      ? 'w-6 sm:w-8 bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)]'
                      : 'w-2 bg-slate-300 dark:bg-white/20 hover:bg-orange-300 dark:hover:bg-orange-500/50'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              );
            })}
          </div>
        </div>
      ) : null}
    </section>
  );
}
