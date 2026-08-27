import React from 'react';

export default function Loader({ fullScreen = true, text = 'HAUTE STREETWEAR • DHAKA' }) {
  const containerClasses = fullScreen
    ? 'fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050505] text-white select-none'
    : 'w-full py-16 flex flex-col items-center justify-center bg-transparent text-slate-900 dark:text-white select-none';

  return (
    <div className={containerClasses}>
      <div className="relative flex flex-col items-center justify-center space-y-4 px-6 text-center">
        {/* Brand Logo */}
        <div className="space-y-1.5 animate-pulse">
          <span className="block text-2xl sm:text-3xl font-black uppercase tracking-[0.3em] font-['Josefin_Sans'] text-slate-900 dark:text-white">
            ENGULFIC
          </span>
          <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.4em] text-orange-500 font-semibold font-sans">
            {text}
          </p>
        </div>

        {/* Minimalist Micro Shimmer Line */}
        <div className="w-24 sm:w-28 h-[1.5px] bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden relative">
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-orange-500 to-transparent animate-[shimmer_0.8s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
}
