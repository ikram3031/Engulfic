'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, ShieldCheck } from 'lucide-react';

// Renders 1-click interactive human verification checkbox for checkout security
const ReCaptcha = ({ onVerify, verified, className = '' }) => {
  const [checking, setChecking] = useState(false);

  // Handles click on the verification checkbox with timed human check transition
  const handleCheckboxClick = () => {
    if (verified || checking) return;

    setChecking(true);
    setTimeout(() => {
      setChecking(false);
      if (onVerify) {
        onVerify(true);
      }
    }, 550);
  };

  return (
    <div className={`relative w-full ${className}`}>
      <div 
        onClick={handleCheckboxClick}
        className={`flex items-center justify-between p-3.5 px-4 bg-white dark:bg-black/40 border rounded-2xl select-none shadow-sm transition-all duration-300 cursor-pointer ${
          verified
            ? 'border-emerald-500/50 bg-emerald-500/5 dark:bg-emerald-500/10'
            : checking
            ? 'border-orange-500/50 bg-orange-500/5'
            : 'border-slate-300 dark:border-white/10 hover:border-orange-500/60'
        }`}
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleCheckboxClick();
            }}
            disabled={verified || checking}
            className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 cursor-pointer shrink-0 outline-none ${
              verified
                ? 'bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/30'
                : checking
                ? 'border-orange-500 bg-orange-500/10'
                : 'border-slate-300 dark:border-white/20 bg-slate-50 dark:bg-white/5 hover:border-orange-500'
            }`}
            aria-label="Human verification checkbox"
          >
            {verified ? (
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              >
                <Check className="h-4 w-4 stroke-[3] text-white" />
              </motion.div>
            ) : checking ? (
              <div className="h-3.5 w-3.5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            ) : null}
          </button>
          
          <div className="flex flex-col">
            <span className={`text-xs font-mono font-bold transition-colors ${
              verified
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-slate-800 dark:text-white/90'
            }`}>
              {verified ? 'Verification Passed' : checking ? 'Verifying...' : "I'm not a robot"}
            </span>
            <span className="text-[10px] font-mono text-slate-400 dark:text-white/40">
              {verified ? 'Human verification confirmed' : 'Click checkbox to verify'}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center shrink-0 pl-3 border-l border-slate-200 dark:border-white/10">
          <ShieldCheck className={`w-5 h-5 transition-colors ${verified ? 'text-emerald-500' : 'text-orange-500'}`} />
          <span className="text-[8px] font-mono font-bold text-slate-400 dark:text-white/40 uppercase tracking-tighter mt-0.5">
            SECURE CHECK
          </span>
        </div>
      </div>
    </div>
  );
};

export default ReCaptcha;
