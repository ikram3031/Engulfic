'use client';

import React, { useState, useEffect, useRef } from 'react';
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

  const [visibleCount, setVisibleCount] = useState(() => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 2;
      if (window.innerWidth < 1024) return 3;
      return 4;
    }
    return 2;
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Touch swipe handling
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

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
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : Math.min(prev + 1, maxIndex)));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : Math.max(prev - 1, 0)));
  };

  // Touch event handlers for mobile swiping
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = e.targetTouches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 40; // minimum swipe distance in px
    if (diff > threshold) {
      nextSlide();
    } else if (diff < -threshold) {
      prevSlide();
    }
    setIsPaused(false);
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
    <section id="new-arrivals-section" className="py-8 sm:py-10 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono text-orange-500 mb-2 uppercase tracking-widest">
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

          {/* Navigation buttons for both mobile & desktop */}
          {items.length > visibleCount && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={prevSlide}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-200 dark:bg-white/10 hover:bg-orange-500 hover:text-white text-slate-800 dark:text-white flex items-center justify-center transition shadow-sm border border-slate-300 dark:border-white/10"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={nextSlide}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-200 dark:bg-white/10 hover:bg-orange-500 hover:text-white text-slate-800 dark:text-white flex items-center justify-center transition shadow-sm border border-slate-300 dark:border-white/10"
                aria-label="Next slide"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="overflow-hidden w-full">
          <div className="flex">
            {Array.from({ length: visibleCount }).map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 px-1.5 sm:px-2.5"
                style={{ width: `${100 / visibleCount}%` }}
              >
                <div className="animate-pulse bg-slate-200 dark:bg-white/10 rounded-2xl aspect-[3/4]" />
              </div>
            ))}
          </div>
        </div>
      ) : items.length > 0 ? (
        <div className="relative group/carousel">
          <div
            className="overflow-hidden w-full -mx-1.5 sm:-mx-2.5 px-0"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${safeCurrentIndex * (100 / visibleCount)}%)`,
              }}
            >
              {items.map((product) => (
                <div
                  key={product.id || product.slug}
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

          {/* Carousel Dots */}
          {maxIndex > 0 && (
            <div className="flex justify-center mt-5 sm:mt-6 gap-1.5 sm:gap-2">
              {Array.from({ length: Math.min(maxIndex + 1, 8) }).map((_, index) => {
                const isActive = index === safeCurrentIndex || (safeCurrentIndex >= 7 && index === 7);
                return (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      isActive
                        ? 'w-6 sm:w-8 bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)]'
                        : 'w-2 bg-slate-300 dark:bg-white/20 hover:bg-orange-300 dark:hover:bg-orange-500/50'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                );
              })}
            </div>
          )}
        </div>
      ) : null}
    </section>
  );
}
