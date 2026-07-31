'use client';

import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

export default function Loader({ fullScreen = true }) {
  const [progress, setProgress] = useState(12);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 180);

    return () => clearInterval(timer);
  }, []);

  const containerClasses = fullScreen
    ? 'fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-white transition-colors duration-300'
    : 'w-full py-16 flex flex-col items-center justify-center bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-white transition-colors duration-300';

  return (
    <div className={containerClasses}>
      <div className="relative flex items-center justify-center w-52 h-52">
        {/* Outer Ring: Rotating Clockwise (Left to Right) */}
        <div className="absolute inset-0 rounded-full border-2 border-dashed border-orange-500/40 dark:border-orange-500/50 animate-[spin_12s_linear_infinite]" />

        {/* Counter Ring: Rotating Counter-Clockwise (Right to Left) */}
        <div className="absolute inset-3 rounded-full border-2 border-slate-300 dark:border-zinc-800 border-t-orange-500 dark:border-t-orange-400 animate-[spin_6s_linear_infinite_reverse]" />

        {/* Inner Accent Glowing Ring */}
        <div className="absolute inset-8 rounded-full bg-gradient-to-tr from-orange-500/10 via-transparent to-amber-500/10 animate-pulse" />

        {/* Circular Curved Rotating Text */}
        <svg className="absolute inset-0 w-full h-full animate-[spin_16s_linear_infinite]" viewBox="0 0 100 100">
          <path
            id="textPath"
            d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
            fill="none"
          />
          <text className="text-[7px] font-mono font-bold tracking-widest fill-slate-700 dark:fill-zinc-300 uppercase">
            <textPath href="#textPath" startOffset="0%">
              • ENGULFIC ARCHIVE • HIGH COUTURE • EST 2026 • LUXURY STREETWEAR
            </textPath>
          </text>
        </svg>

        {/* Center Text Logo & Counter */}
        <div className="relative flex flex-col items-center justify-center text-center space-y-1 z-10 select-none">
          <span className="text-xs font-black tracking-widest text-orange-500 font-sans uppercase flex items-center gap-1">
            <Sparkles className="w-3 h-3 animate-spin" />
            ENGULFIC
          </span>
          <div className="text-3xl font-mono font-black tracking-tight text-slate-900 dark:text-white">
            {progress}%
          </div>
          <span className="text-[9px] font-mono text-slate-400 dark:text-zinc-500 uppercase tracking-widest">
            Loading Archive
          </span>
        </div>
      </div>

      {/* Progress Bar Indicator */}
      <div className="mt-8 w-48 h-1.5 bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden p-0.5 border border-slate-300/50 dark:border-zinc-700/50">
        <div
          className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(249,115,22,0.6)]"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
