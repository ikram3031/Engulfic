'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

const SLIDE_URLS = [
  'https://server.engulfic.com/uploads/assets/slider-1.webp',
  'https://server.engulfic.com/uploads/assets/slider-2.webp',
  'https://server.engulfic.com/uploads/assets/slider-3.webp'
];

const HeroBanner = ({ onExploreClick }) => {
  const [validSlides, setValidSlides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize Embla Carousel with Autoplay
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'center' },
    [Autoplay({ delay: 5000, stopOnInteraction: true })]
  );

  const [currentSlide, setCurrentSlide] = useState(0);

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

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback((index) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrentSlide(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  if (isLoading) {
    return (
      <section className="relative overflow-hidden bg-zinc-900 w-full aspect-[4/3] sm:aspect-[16/9] md:h-[600px] lg:h-[720px] animate-pulse">
      </section>
    );
  }

  const hasSlides = validSlides.length > 0;

  return (
    <section className={`relative overflow-hidden w-full aspect-[4/3] sm:aspect-[16/9] md:aspect-auto md:h-[600px] lg:h-[720px] flex flex-col justify-between ${hasSlides ? 'bg-zinc-950' : 'bg-slate-800 dark:bg-zinc-900'} text-white`}>
      {hasSlides ? (
        <div className="overflow-hidden w-full h-full" ref={emblaRef}>
          <div className="flex h-full touch-pan-y">
            {validSlides.map((url, index) => (
              <div
                key={index}
                className="relative flex-[0_0_100%] min-w-0 h-full"
              >
                <img
                  src={url}
                  alt={`Hero Slide ${index + 1}`}
                  className="w-full h-full object-cover object-center block"
                  draggable={false}
                />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-700 to-slate-900 dark:from-zinc-800 dark:to-zinc-950" />
      )}

      {/* Slider Controls & Progress Indicator */}
      {validSlides.length > 1 && (
        <div className="absolute bottom-2 sm:bottom-6 left-0 right-0 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pointer-events-none">
          <div className="flex items-center justify-between gap-4 pt-2 sm:pt-4 border-t border-white/20 pointer-events-auto">
            {/* Pagination Indicators & Numbers */}
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-1 sm:gap-2">
                {validSlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => scrollTo(i)}
                    className={`h-1.5 sm:h-2.5 rounded-full transition-all duration-300 ${
                      i === currentSlide
                        ? 'w-6 sm:w-10 bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.8)]'
                        : 'w-1.5 sm:w-2.5 bg-white/40 hover:bg-white/80'
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
              <span className="text-[10px] sm:text-xs font-mono text-white/90 tracking-widest font-bold drop-shadow-md hidden sm:inline-block">
                0{currentSlide + 1} / 0{validSlides.length}
              </span>
            </div>

            {/* Next / Previous Controls */}
            <div className="flex items-center gap-1 sm:gap-3">
              <button
                onClick={scrollPrev}
                className="p-1.5 sm:p-3 rounded-full bg-black/40 hover:bg-orange-500 text-white border border-white/30 transition backdrop-blur-md group"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-3.5 h-3.5 sm:w-5 sm:h-5 group-hover:-translate-x-0.5 transition-transform" />
              </button>
              <button
                onClick={scrollNext}
                className="p-1.5 sm:p-3 rounded-full bg-black/40 hover:bg-orange-500 text-white border border-white/30 transition backdrop-blur-md group"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-3.5 h-3.5 sm:w-5 sm:h-5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroBanner;
