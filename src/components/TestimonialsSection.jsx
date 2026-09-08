'use client';

import * as React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Star, Quote, CheckCircle, Sparkles } from 'lucide-react';

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Tanzir Ahmed',
    role: 'Verified Buyer',
    location: 'Gulshan, Dhaka',
    avatar: 'TA',
    rating: 5,
    title: 'Top notch premium quality',
    review:
      'The heavyweight luxury cotton sweatshirt I ordered exceeded my expectations. The fitting around the shoulders is immaculate, and the fabric softness is unparalleled in Bangladesh right now.',
    product: 'Oversized Street Hoodie & Sweatshirt',
    date: '2 days ago'
  },
  {
    id: 2,
    name: 'Nusrat Jahan Mim',
    role: 'Verified Customer',
    location: 'Dhanmondi, Dhaka',
    avatar: 'NJ',
    rating: 5,
    title: 'Super fast delivery & flawless packaging',
    review:
      'Received my parcel within 24 hours in Dhanmondi. The packaging felt like unboxing an international luxury designer brand. Extremely impressed with Engulfic’s customer service!',
    product: 'Minimalist Relaxed Fit Pant',
    date: '5 days ago'
  },
  {
    id: 3,
    name: 'Sayed Farhan Al-Mahmud',
    role: 'Verified Buyer',
    location: 'Chittagong',
    avatar: 'SF',
    rating: 5,
    title: 'Worth every single Taka',
    review:
      'Finding real minimalist, elegant aesthetics in BD clothing brands is tough. Engulfic nailed the proportions, stitching quality, and rich matte texture. Highly recommended for fashion enthusiasts.',
    product: 'Signature Structured Oversized Tee',
    date: '1 week ago'
  },
  {
    id: 4,
    name: 'Ishrat Khandokar',
    role: 'Verified Customer',
    location: 'Uttara, Dhaka',
    avatar: 'IK',
    rating: 5,
    title: 'Unmatched comfort and modern cut',
    review:
      'Ordered 2 shirts for an upcoming event. The fabric breathability in our tropical weather is fantastic. The drape and collar stay crisp throughout the day. Definitely ordering again!',
    product: 'Classic Oxford Minimalist Shirt',
    date: '1 week ago'
  },
  {
    id: 5,
    name: 'Zubair Hossain',
    role: 'Verified Buyer',
    location: 'Sylhet',
    avatar: 'ZH',
    rating: 5,
    title: 'Genuine international standard',
    review:
      'The attention to seam details and drop-shoulder silhouette is pure perfection. COD delivery in Sylhet was smooth, courier called beforehand. Engulfic is truly setting a new benchmark.',
    product: 'Essential Autumn Drop Cargo & Tee',
    date: '2 weeks ago'
  }
];

// Renders the customer testimonials carousel with dark/light glassmorphic cards
const TestimonialsSection = () => {
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

  // Autoplay rotation every 3500ms when not hovered
  React.useEffect(() => {
    if (!api || isPaused) return;

    const interval = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [api, isPaused]);

  return (
    <section id="testimonials-section" className="py-14 sm:py-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden relative">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] bg-orange-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] sm:text-xs font-mono tracking-widest uppercase mb-3 backdrop-blur-md font-bold">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>VOICES OF THE RUNWAY</span>
        </div>
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-slate-900 dark:text-white font-sans">
          CLIENT <span className="text-orange-500">EXPERIENCES</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-white/60 mt-3 font-normal max-w-lg mx-auto">
          Hear from patrons across Bangladesh who embrace the bespoke craftsmanship and uncompromising silhouette of Engulfic.
        </p>
      </div>

      {/* Carousel Container */}
      <div
        className="relative w-full"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <Carousel
          setApi={setApi}
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-3 sm:-ml-4">
            {TESTIMONIALS.map((item) => (
              <CarouselItem
                key={item.id}
                className="pl-3 sm:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
              >
                <div className="h-full p-6 sm:p-7 rounded-3xl bg-slate-100/90 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 hover:border-orange-500/40 dark:hover:border-orange-500/40 transition-all duration-300 flex flex-col justify-between shadow-lg hover:shadow-2xl hover:shadow-orange-500/5 group relative backdrop-blur-sm">
                  {/* Decorative Quote mark */}
                  <Quote className="absolute top-6 right-6 w-8 h-8 text-slate-300/60 dark:text-white/10 group-hover:text-orange-500/20 transition-colors pointer-events-none" />

                  {/* Top: Star rating & Date */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="flex items-center gap-1 text-amber-500">
                        {[...Array(item.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 fill-amber-400 text-amber-400"
                          />
                        ))}
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 dark:text-white/40">
                        {item.date}
                      </span>
                    </div>

                    {/* Review Title & Body */}
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-2 line-clamp-1 group-hover:text-orange-500 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-white/70 leading-relaxed font-light mb-6">
                      “{item.review}”
                    </p>
                  </div>

                  {/* Bottom: Reviewer details & Purchased product */}
                  <div className="pt-4 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-500 font-bold font-mono text-xs flex items-center justify-center shrink-0 shadow-sm">
                        {item.avatar}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {item.name}
                          </span>
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        </div>
                        <p className="text-[10px] font-mono text-slate-500 dark:text-white/50 truncate">
                          {item.location}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[9px] font-mono uppercase tracking-wider block text-orange-500 font-bold">
                        Verified Purchase
                      </span>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Carousel Navigation Arrows */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <CarouselPrevious className="static translate-y-0 translate-x-0 w-9 h-9 rounded-full bg-white dark:bg-white/10 hover:bg-orange-500 hover:text-white dark:hover:bg-orange-500 border border-slate-300 dark:border-white/20 transition-all text-slate-800 dark:text-white shadow-md" />
            
            {/* Pagination Dots */}
            <div className="flex items-center gap-1.5 px-2">
              {Array.from({ length: count || 5 }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => api?.scrollTo(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    current === idx
                      ? 'w-6 bg-orange-500'
                      : 'w-1.5 bg-slate-300 dark:bg-white/20 hover:bg-slate-400'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <CarouselNext className="static translate-y-0 translate-x-0 w-9 h-9 rounded-full bg-white dark:bg-white/10 hover:bg-orange-500 hover:text-white dark:hover:bg-orange-500 border border-slate-300 dark:border-white/20 transition-all text-slate-800 dark:text-white shadow-md" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default TestimonialsSection;
