import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export default function PageTransitionLoader({ minDuration = 250 }) {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Only trigger when moving from one page to another
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setIsLoading(true);
    setIsVisible(true);

    const minTimer = setTimeout(() => {
      setIsVisible(false);
      const exitTimer = setTimeout(() => {
        setIsLoading(false);
      }, 200);
      return () => clearTimeout(exitTimer);
    }, minDuration);

    return () => clearTimeout(minTimer);
  }, [location.pathname, location.search, minDuration]);

  if (!isLoading) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#050505] text-white transition-opacity duration-200 ease-out select-none ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Top and Bottom runway accent borders */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />

      <div className="relative flex flex-col items-center justify-center space-y-4 px-6 text-center">
        {/* Brand Logo with Luxury Letterspacing */}
        <div className="space-y-1.5">
          <span className="block text-2xl sm:text-4xl font-black uppercase tracking-[0.35em] text-white font-['Josefin_Sans']">
            ENGULFIC
          </span>
          <div className="flex items-center justify-center gap-2 text-[9px] sm:text-[10px] uppercase tracking-[0.45em] text-orange-500 font-semibold font-sans">
            <span>HAUTE STREETWEAR</span>
            <span className="text-orange-500/60">•</span>
            <span>DHAKA</span>
          </div>
        </div>

        {/* Minimalist Micro Shimmer Line */}
        <div className="w-24 sm:w-32 h-[1.5px] bg-white/10 rounded-full overflow-hidden relative">
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-orange-500 to-transparent animate-[shimmer_0.6s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
}
