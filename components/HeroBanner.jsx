'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, ShieldCheck, Truck, RefreshCw, ShoppingCart } from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    tag: 'NEW RUNWAY COLLECTION 2026',
    title: 'WINTER FASHION',
    highlight: 'SALE',
    discount: 'UP TO 50% OFF',
    description: 'Elevate your signature wardrobe with Japanese selvedge denim, Italian virgin merino wool & avant-garde tailoring.',
    ctaPrimary: 'Shop Winter Sale',
    ctaSecondary: 'View Lookbook',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2000',
    fallbackImg: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=2000',
  },
  {
    id: 2,
    tag: 'NEW SEASON ESSENTIALS',
    title: 'AVANT-GARDE',
    highlight: 'SILHOUETTES',
    discount: 'SPRING / SUMMER 2026',
    description: 'Sculptural cuts, architectural streetwear, and heavy selvedge fabrics crafted for modern confidence.',
    ctaPrimary: 'Explore New Arrivals',
    ctaSecondary: 'Shop Category',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=2000',
    fallbackImg: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2000',
  },
  {
    id: 3,
    tag: 'CURATED ARCHIVE & OUTERWEAR',
    title: 'PREMIUM COUTURE',
    highlight: 'LIMITED EDITION',
    discount: 'FREE HOME DELIVERY',
    description: 'Hand-finished Italian leather jackets, oversized trench coats & signature luxury accessories.',
    ctaPrimary: 'Shop Outerwear',
    ctaSecondary: 'Browse All',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=2000',
    fallbackImg: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=2000',
  }
];

export default function HeroBanner({ onExploreClick }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [nextSlide, isPaused]);

  const slide = SLIDES[currentSlide];

  return (
    <section 
      className="relative overflow-hidden bg-zinc-950 text-white min-h-[620px] h-auto sm:min-h-[700px] md:min-h-[750px] flex flex-col justify-between"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Image Carousel Slides */}
      {SLIDES.map((s, index) => {
        const isActive = index === currentSlide;
        return (
          <div
            key={s.id}
            className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
            }`}
          >
            <img
              src={s.image}
              alt={s.title}
              className="w-full h-full object-cover object-center transition-transform duration-10000 ease-out"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.src = s.fallbackImg;
              }}
            />
            {/* Dynamic Contrast Gradient Overlays for High Legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-zinc-950/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/90 via-zinc-950/60 to-transparent" />
          </div>
        );
      })}

      {/* Decorative Ambient Glowing Flares */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-orange-600/20 rounded-full blur-[140px] pointer-events-none animate-float-slow" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-500/15 rounded-full blur-[140px] pointer-events-none animate-float-slow" style={{ animationDelay: '-6s' }} />

      {/* Main Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4 sm:pt-16 sm:pb-10 md:pt-24 md:pb-16 w-full my-auto">
        <div className="max-w-2xl">
          {/* Tag & Season Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/60 border border-white/15 text-orange-400 text-[11px] sm:text-xs font-mono tracking-widest uppercase mb-3 sm:mb-6 backdrop-blur-xl shadow-2xl">
            <Sparkles className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
            <span>{slide.tag}</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.98] sm:leading-[0.95] text-white uppercase font-sans drop-shadow-lg">
            {slide.title} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-200 to-white">
              {slide.highlight}
            </span>
          </h1>

          {/* Discount/Subheading Badge */}
          <div className="mt-2.5 sm:mt-3">
            <span className="inline-block font-mono text-xs sm:text-base font-extrabold text-orange-400 tracking-wider uppercase bg-orange-500/20 border border-orange-500/30 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-md">
              {slide.discount}
            </span>
          </div>

          {/* Description */}
          <p className="mt-3 sm:mt-5 text-xs sm:text-base md:text-lg text-zinc-200 font-light leading-relaxed max-w-xl drop-shadow line-clamp-3 sm:line-clamp-none">
            {slide.description}
          </p>

          {/* Call To Action Buttons */}
          <div className="mt-5 sm:mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
            <button
              onClick={onExploreClick}
              className="px-6 py-3 sm:px-8 sm:py-4 bg-orange-500 text-white font-extrabold uppercase tracking-wider text-xs sm:text-sm hover:bg-orange-600 transition-all rounded-full flex items-center gap-2.5 sm:gap-3 group shadow-2xl shadow-orange-500/30 border border-orange-400/30"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{slide.ctaPrimary}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onExploreClick}
              className="px-5 py-3 sm:px-6 sm:py-4 bg-black/50 border border-white/20 text-white font-bold uppercase tracking-wider text-xs sm:text-sm hover:bg-white/15 hover:border-white/30 transition-all rounded-full backdrop-blur-md"
            >
              {slide.ctaSecondary}
            </button>
          </div>
        </div>
      </div>

      {/* Slider Controls & Progress Indicator */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-6 sm:pb-8">
        <div className="flex items-center justify-between gap-4 pt-4 sm:pt-6 border-t border-white/10">
          {/* Pagination Indicators & Numbers */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-1.5 sm:gap-2">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 ${
                    i === currentSlide
                      ? 'w-8 sm:w-10 bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.8)]'
                      : 'w-2 sm:w-2.5 bg-white/30 hover:bg-white/60'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
            <span className="text-[11px] sm:text-xs font-mono text-white/70 tracking-widest font-bold">
              0{currentSlide + 1} / 0{SLIDES.length}
            </span>
          </div>

          {/* Next / Previous Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={prevSlide}
              className="p-2 sm:p-3 rounded-full bg-black/60 hover:bg-orange-500 text-white/80 hover:text-white border border-white/15 transition backdrop-blur-md group"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={nextSlide}
              className="p-2 sm:p-3 rounded-full bg-black/60 hover:bg-orange-500 text-white/80 hover:text-white border border-white/15 transition backdrop-blur-md group"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* E-Commerce Value Props Bar */}
        <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 text-xs text-white/80">
          <div className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3.5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md">
            <div className="p-1.5 sm:p-2 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex-shrink-0">
              <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div>
              <p className="font-bold text-white uppercase tracking-wide text-[11px] sm:text-xs">Nationwide Free Home Delivery</p>
              <p className="text-white/60 text-[10px] sm:text-[11px]">Fast doorstep delivery across all regions</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3.5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md">
            <div className="p-1.5 sm:p-2 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex-shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div>
              <p className="font-bold text-white uppercase tracking-wide text-[11px] sm:text-xs">100% Pure & Authentic Products</p>
              <p className="text-white/60 text-[10px] sm:text-[11px]">Directly sourced artisan craftsmanship</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3.5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md">
            <div className="p-1.5 sm:p-2 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex-shrink-0">
              <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div>
              <p className="font-bold text-white uppercase tracking-wide text-[11px] sm:text-xs">Money Back Guarantee</p>
              <p className="text-white/60 text-[10px] sm:text-[11px]">30-day effortless risk-free returns</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
