'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDE_URLS = [
  'https://server.engulfic.com/uploads/assets/slider-1.webp',
  'https://server.engulfic.com/uploads/assets/slider-2.webp',
  'https://server.engulfic.com/uploads/assets/slider-3.webp'
];

const HeroBanner = ({ onExploreClick }) => {
  const [validSlides, setValidSlides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const checkImages = async () => {
      const checkImg = (src) => new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = src;
      });
      
      const valid = [];
      for (const url of SLIDE_URLS) {
        const isValid = await checkImg(url);
        if (isValid) valid.push(url);
      }
      
      if (isMounted) {
        setValidSlides(valid);
        setIsLoading(false);
      }
    };
    
    checkImages();
    return () => { isMounted = false; };
  }, []);

  const nextSlide = useCallback(() => {
    if (validSlides.length <= 1) return;
    setCurrentSlide((prev) => (prev + 1) % validSlides.length);
  }, [validSlides.length]);

  const prevSlide = useCallback(() => {
    if (validSlides.length <= 1) return;
    setCurrentSlide((prev) => (prev - 1 + validSlides.length) % validSlides.length);
  }, [validSlides.length]);

  useEffect(() => {
    if (isPaused || validSlides.length <= 1 || isLoading) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [nextSlide, isPaused, validSlides.length, isLoading]);

  if (isLoading) {
    return (
      <section className="relative overflow-hidden bg-zinc-900 min-h-[580px] sm:min-h-[650px] md:min-h-[700px] lg:h-[720px] animate-pulse">
      </section>
    );
  }

  const hasSlides = validSlides.length > 0;

  return (
    <section 
      className={`relative overflow-hidden ${hasSlides ? 'bg-zinc-950' : 'bg-slate-800 dark:bg-zinc-900'} text-white min-h-[580px] sm:min-h-[650px] md:min-h-[700px] lg:h-[720px] flex flex-col justify-between`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Images */}
      {hasSlides ? (
        validSlides.map((url, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={url}
              className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <img
                src={url}
                alt={`Hero Slide ${index + 1}`}
                className="w-full h-full object-cover object-center"
              />
              {/* Minimal Gradient just to make controls/text visible at the bottom */}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent" />
            </div>
          );
        })
      ) : (
        /* Fallback solid color when no images */
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-700 to-slate-900 dark:from-zinc-800 dark:to-zinc-950" />
      )}

      {/* Main Hero Content - Simplified */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4 sm:pt-16 sm:pb-10 md:pt-24 md:pb-16 w-full my-auto flex flex-col items-center justify-end h-full min-h-[500px]">
        {/* Minimal CTA button only, letting image shine */}
        <div className="mb-8 sm:mb-16">
          <button
            onClick={onExploreClick}
            className="px-6 py-3 sm:px-8 sm:py-4 bg-orange-500 text-white font-extrabold uppercase tracking-wider text-xs sm:text-sm hover:bg-orange-600 transition-all rounded-full flex items-center gap-2.5 sm:gap-3 group shadow-xl hover:shadow-orange-500/30"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Slider Controls & Progress Indicator (Only show if more than 1 slide) */}
      {validSlides.length > 1 && (
        <div className="absolute bottom-6 left-0 right-0 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center justify-between gap-4 pt-4 border-t border-white/20">
            {/* Pagination Indicators & Numbers */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-1.5 sm:gap-2">
                {validSlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 ${
                      i === currentSlide
                        ? 'w-8 sm:w-10 bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.8)]'
                        : 'w-2 sm:w-2.5 bg-white/40 hover:bg-white/80'
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
              <span className="text-[11px] sm:text-xs font-mono text-white/90 tracking-widest font-bold drop-shadow-md">
                0{currentSlide + 1} / 0{validSlides.length}
              </span>
            </div>

            {/* Next / Previous Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={prevSlide}
                className="p-2 sm:p-3 rounded-full bg-black/40 hover:bg-orange-500 text-white border border-white/30 transition backdrop-blur-md group"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-0.5 transition-transform" />
              </button>
              <button
                onClick={nextSlide}
                className="p-2 sm:p-3 rounded-full bg-black/40 hover:bg-orange-500 text-white border border-white/30 transition backdrop-blur-md group"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroBanner;
