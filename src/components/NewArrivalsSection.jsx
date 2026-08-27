'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import { ProductCardSkeleton } from '@/components/skeletons';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NewArrivalsSection({ onShowToast }) {
  const { data: newArrivals = [], isLoading } = useQuery({
    queryKey: ['newArrivalsCarousel'],
    queryFn: () => fetchProducts({ sortBy: 'newest', limit: 12 }),
  });

  const [api, setApi] = React.useState(null);
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);

  React.useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on('select', onSelect);
    api.on('reInit', onSelect);

    return () => {
      api.off('select', onSelect);
      api.off('reInit', onSelect);
    };
  }, [api]);

  // Fast auto-rotate effect (2500ms interval) with hover pause
  React.useEffect(() => {
    if (!api || isPaused) return;

    const interval = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [api, isPaused]);

  return (
    <section id="new-arrivals-section" className="py-6 sm:py-14 w-full max-w-full sm:max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 overflow-hidden">
      {/* Section Header */}
      <div className="flex items-end justify-between mb-4 sm:mb-8 gap-2 sm:gap-4 border-b border-slate-200 dark:border-white/10 pb-3 sm:pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-mono text-orange-500 mb-1 uppercase tracking-widest font-bold">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>FRESH FROM THE RUNWAY</span>
          </div>
          <h2 className="text-xl sm:text-4xl font-black uppercase tracking-tight text-slate-900 dark:text-white font-sans">
            NEW ARRIVALS
          </h2>
        </div>

        <Link
          to="/catalog?sortBy=newest"
          className="inline-flex items-center gap-1.5 px-3 sm:px-5 py-1.5 sm:py-2.5 bg-transparent hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-black border border-slate-900 dark:border-white/40 text-slate-900 dark:text-white font-bold uppercase tracking-wider text-[10px] sm:text-xs rounded-full transition-all shrink-0"
        >
          <span>View All</span>
          <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
          {[1, 2, 3, 4].map((i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : newArrivals.length > 0 ? (
        <div 
          className="relative w-full max-w-full px-0"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <Carousel
            setApi={setApi}
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full max-w-full"
          >
            {/* CarouselContent with negative margin matching item padding */}
            <CarouselContent className="-ml-1.5 sm:-ml-2 md:-ml-4">
              {newArrivals.map((product) => (
                /* carousel-item-2col: strictly 2 cards on mobile, 3 on tablet, 4 on desktop */
                <CarouselItem
                  key={product.id || product.slug}
                  className="carousel-item-2col pl-1.5 sm:pl-2 md:pl-4"
                >
                  <ProductCard
                    product={product}
                    onShowToast={onShowToast}
                    hideDetails={false}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Navigation Arrows (Visible on Left & Right) */}
            <CarouselPrevious className="flex" />
            <CarouselNext className="flex" />
          </Carousel>

          {/* Dots Indicator */}
          {count > 1 && (
            <div className="flex justify-center items-center gap-1.5 sm:gap-2 mt-4 sm:mt-6">
              {Array.from({ length: count }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => api?.scrollTo(idx)}
                  className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === current
                      ? 'w-6 sm:w-8 bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)]'
                      : 'w-1.5 sm:w-2 bg-slate-300 dark:bg-white/20 hover:bg-orange-300 dark:hover:bg-orange-500/50'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      ) : null}
    </section>
  );
}
