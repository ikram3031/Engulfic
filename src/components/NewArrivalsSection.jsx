'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import { Sparkles, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NewArrivalsSection({ onShowToast }) {
  const { data: newArrivals = [], isLoading } = useQuery({
    queryKey: ['newArrivals'],
    queryFn: () => fetchProducts({ sortBy: 'newest', limit: 12 }) // Fetch newest products
  });

  const carouselRef = useRef(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const scrollCarousel = useCallback((index) => {
    if (carouselRef.current && newArrivals.length > 0) {
      const itemWidth = carouselRef.current.children[0]?.offsetWidth;
      if (itemWidth) {
        carouselRef.current.scrollTo({
          left: index * itemWidth,
          behavior: 'smooth'
        });
        setCurrentSlideIndex(index);
      }
    }
  }, [newArrivals.length]);

  const scrollNext = useCallback(() => {
    if (carouselRef.current && newArrivals.length > 0) {
      const { scrollWidth, scrollLeft, clientWidth } = carouselRef.current;
      const itemWidth = carouselRef.current.children[0]?.offsetWidth;

      if (!itemWidth) return;

      let nextScrollLeft = scrollLeft + itemWidth;
      let nextIndex = currentSlideIndex + 1;

      // If we're at or near the end, loop back to the beginning
      // A small buffer (e.g., itemWidth / 2) is used to account for potential sub-pixel rendering or gaps
      if (scrollLeft + clientWidth >= scrollWidth - itemWidth / 2) {
        nextScrollLeft = 0;
        nextIndex = 0;
      }

      carouselRef.current.scrollTo({
        left: nextScrollLeft,
        behavior: 'smooth'
      });
      // The actual currentSlideIndex will be updated by the scroll event listener
    }
  }, [currentSlideIndex, newArrivals.length]);

  const scrollPrev = useCallback(() => {
    if (carouselRef.current && newArrivals.length > 0) {
      const { scrollLeft } = carouselRef.current;
      const itemWidth = carouselRef.current.children[0]?.offsetWidth;

      if (!itemWidth) return;

      let prevScrollLeft = scrollLeft - itemWidth;
      if (scrollLeft <= itemWidth / 2) {
        prevScrollLeft = (newArrivals.length - 1) * itemWidth;
      }

      carouselRef.current.scrollTo({
        left: prevScrollLeft,
        behavior: 'smooth'
      });
    }
  }, [newArrivals.length]);

  useEffect(() => {
    if (isLoading || newArrivals.length === 0 || isHovered) return;

    const interval = setInterval(() => {
      scrollNext();
    }, 4000); // Auto-scroll every 4 seconds

    return () => clearInterval(interval);
  }, [isLoading, newArrivals, isHovered, scrollNext]);

  useEffect(() => {
    const carouselElement = carouselRef.current;
    if (!carouselElement) return;

    const handleScroll = () => {
      const scrollLeft = carouselElement.scrollLeft;
      const itemWidth = carouselElement.children[0]?.offsetWidth;
      if (itemWidth && newArrivals.length > 0) {
        // Calculate the index of the first fully visible item
        const newIndex = Math.round(scrollLeft / itemWidth);
        setCurrentSlideIndex(Math.min(newIndex, newArrivals.length - 1)); // Ensure index doesn't exceed bounds
      }
    };

    carouselElement.addEventListener('scroll', handleScroll);
    return () => carouselElement.removeEventListener('scroll', handleScroll);
  }, [newArrivals.length]);

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
          to="/catalog?sortBy=newest" // Link to catalog with newest filter
          className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white font-bold uppercase tracking-wider text-xs rounded-full hover:bg-orange-500 hover:text-white transition shadow-md"
        >
          <span>View All New</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Product Carousel (Horizontal Scroll) */}
      <div className="relative group/carousel">
        {/* Left Arrow Button (visible on desktop) */}
        {!isLoading && newArrivals.length > 0 && (
          <button
            onClick={scrollPrev}
            className="absolute -left-5 top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center w-11 h-11 rounded-full bg-black/60 hover:bg-orange-500 text-white transition-all shadow-lg border border-white/10 hover:scale-105"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        <div
          ref={carouselRef}
          className="flex overflow-x-auto w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth snap-x snap-mandatory pb-6 gap-3 sm:gap-5"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => ( // Show 4 skeleton cards for loading
                <div key={i} className="flex-none w-[calc(50%-6px)] sm:w-[calc(33.333%-14px)] lg:w-[calc(25%-15px)] snap-start">
                  <div className="animate-pulse bg-slate-200 dark:bg-white/10 rounded-2xl aspect-[3/4]" />
                </div>
              ))
            : newArrivals.map((product) => (
                <div key={product.id} className="flex-none w-[calc(50%-6px)] sm:w-[calc(33.333%-14px)] lg:w-[calc(25%-15px)] snap-start">
                  <ProductCard
                    product={product}
                    onShowToast={onShowToast}
                    hideDetails={false}
                  />
                </div>
              ))}
        </div>

        {/* Right Arrow Button (visible on desktop) */}
        {!isLoading && newArrivals.length > 0 && (
          <button
            onClick={scrollNext}
            className="absolute -right-5 top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center w-11 h-11 rounded-full bg-black/60 hover:bg-orange-500 text-white transition-all shadow-lg border border-white/10 hover:scale-105"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Carousel Dots */}
      {!isLoading && newArrivals.length > 0 && (
        <div className="flex justify-center mt-6 gap-2">
          {newArrivals.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollCarousel(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === currentSlideIndex
                  ? 'w-8 bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.8)]'
                  : 'w-2.5 bg-slate-300 dark:bg-white/20 hover:bg-orange-300 dark:hover:bg-orange-500/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
