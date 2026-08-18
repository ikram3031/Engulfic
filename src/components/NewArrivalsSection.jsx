'use client';

import React, { useState, useEffect } from 'react';
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

  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCount(2);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(3);
      } else {
        setVisibleCount(4);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const items = newArrivals;
  const maxIndex = Math.max(0, items.length - visibleCount);
  const safeCurrentIndex = Math.min(currentIndex, maxIndex);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % (maxIndex + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + maxIndex + 1) % (maxIndex + 1));
  };

  useEffect(() => {
    if (isPaused || maxIndex <= 0) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, maxIndex]);

  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [maxIndex, currentIndex]);

  return (
    <section id="new-arrivals-section" className="py-8 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono text-orange-500 mb-2 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>FRESH FROM THE RUNWAY</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-slate-900 dark:text-white font-sans">
            NEW ARRIVALS
          </h2>
        </div>
        <Link
          to="/catalog?sortBy=newest"
          className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white font-bold uppercase tracking-wider text-xs rounded-full hover:bg-orange-500 hover:text-white transition shadow-md"
        >
          <span>View All New</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {isLoading ? (
        <div className="overflow-hidden w-full px-1">
          <div className="flex transition-transform duration-1000 ease-out">
            {Array.from({ length: visibleCount }).map((_, i) => (
              <div key={i} className="flex-shrink-0 px-1.5 sm:px-2.5" style={{ width: `${100 / visibleCount}%` }}>
                <div className="animate-pulse bg-slate-200 dark:bg-white/10 rounded-2xl aspect-[3/4]" />
              </div>
            ))}
          </div>
        </div>
      ) : items.length > 0 ? (
        <div className="relative group/carousel">
          {maxIndex > 0 && (
            <button
              onClick={prevSlide}
              className="absolute -left-2 sm:-left-5 top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center w-11 h-11 rounded-full bg-black/60 hover:bg-orange-500 text-white transition-all shadow-lg border border-white/10 hover:scale-105"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          <div
            className="overflow-hidden w-full px-1"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div
              className="flex transition-transform duration-1000 ease-out"
              style={{
                transform: `translateX(-${safeCurrentIndex * (100 / visibleCount)}%)`,
              }}
            >
              {items.map((product) => (
                <div
                  key={product.id}
                  className="flex-shrink-0 px-1.5 sm:px-2.5"
                  style={{ width: `${100 / visibleCount}%` }}
                >
                  <ProductCard
                    product={product}
                    onShowToast={onShowToast}
                    hideDetails={false}
                  />
                </div>
              ))}
            </div>
          </div>

          {maxIndex > 0 && (
            <button
              onClick={nextSlide}
              className="absolute -right-2 sm:-right-5 top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center w-11 h-11 rounded-full bg-black/60 hover:bg-orange-500 text-white transition-all shadow-lg border border-white/10 hover:scale-105"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Carousel Dots */}
          {maxIndex > 0 && (
            <div className="flex justify-center mt-6 gap-2">
              {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    index === safeCurrentIndex
                      ? 'w-8 bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.8)]'
                      : 'w-2.5 bg-slate-300 dark:bg-white/20 hover:bg-orange-300 dark:hover:bg-orange-500/50'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      ) : null}
    </section>
  );
}
