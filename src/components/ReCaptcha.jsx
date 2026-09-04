'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, RefreshCw, AlertCircle, ShieldCheck } from 'lucide-react';

const CHALLENGE_IMAGES = [
  { id: 1, image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=200&q=80', isTarget: true },
  { id: 2, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=200&q=80', isTarget: false },
  { id: 3, image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=200&q=80', isTarget: true },
  { id: 4, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=200&q=80', isTarget: false },
  { id: 5, image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=200&q=80', isTarget: true },
  { id: 6, image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=200&q=80', isTarget: false },
  { id: 7, image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=200&q=80', isTarget: true },
  { id: 8, image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=200&q=80', isTarget: false },
  { id: 9, image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=200&q=80', isTarget: true },
];

// Renders interactive security verification challenge widget with streetwear authentication pattern
const ReCaptcha = ({ onVerify, verified, className = '' }) => {
  const [checking, setChecking] = useState(false);
  const [showChallenge, setShowChallenge] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [challengeError, setChallengeError] = useState(null);

  const handleCheckboxClick = () => {
    if (verified || checking) return;

    setChecking(true);
    setTimeout(() => {
      setChecking(false);
      setShowChallenge(true);
    }, 600);
  };

  const handleImageClick = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    setChallengeError(null);
  };

  const handleVerify = () => {
    const correctIds = CHALLENGE_IMAGES.filter((item) => item.isTarget).map((item) => item.id);
    const incorrectIds = CHALLENGE_IMAGES.filter((item) => !item.isTarget).map((item) => item.id);

    const hasSelectedAllCorrect = correctIds.every((id) => selectedIds.includes(id));
    const hasSelectedAnyIncorrect = selectedIds.some((id) => incorrectIds.includes(id));

    if (hasSelectedAllCorrect && !hasSelectedAnyIncorrect) {
      onVerify(true);
      setShowChallenge(false);
      setChallengeError(null);
    } else {
      setChallengeError('Verification failed. Please select all streetwear apparel.');
      setSelectedIds([]);
    }
  };

  const handleRefresh = () => {
    setSelectedIds([]);
    setChallengeError(null);
  };

  return (
    <div className={`relative w-full ${className}`}>
      <div className="flex items-center justify-between p-3 px-4 bg-white dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-2xl select-none shadow-sm transition-colors">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleCheckboxClick}
            disabled={verified || checking}
            className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition cursor-pointer shrink-0 outline-none ${
              verified
                ? 'bg-orange-500 border-orange-500 text-white shadow-md'
                : checking
                ? 'border-slate-400 dark:border-white/30 bg-slate-100 dark:bg-white/5'
                : 'border-slate-300 dark:border-white/20 bg-slate-50 dark:bg-white/5 hover:border-orange-500'
            }`}
          >
            {verified ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              >
                <Check className="h-4 w-4 stroke-[3]" />
              </motion.div>
            ) : checking ? (
              <div className="h-3.5 w-3.5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            ) : null}
          </button>
          
          <span className="text-xs font-mono font-bold text-slate-800 dark:text-white/90">
            {"I'm not a robot"}
          </span>
        </div>

        <div className="flex flex-col items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5 text-orange-500" />
          <span className="text-[8px] font-mono font-bold text-slate-400 dark:text-white/40 uppercase tracking-tighter mt-0.5">
            reCAPTCHA
          </span>
        </div>
      </div>

      <AnimatePresence>
        {showChallenge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-xs bg-white dark:bg-[#0c0c0c] border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white shadow-2xl rounded-3xl overflow-hidden font-mono text-xs"
            >
              <div className="bg-slate-100 dark:bg-white/5 p-4 border-b border-slate-200 dark:border-white/10">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 rounded-md">
                  Security Check
                </span>
                <h4 className="text-xs font-bold mt-2 text-slate-900 dark:text-white leading-snug">
                  Select all images with <span className="text-orange-500 underline font-black">Streetwear Apparel</span>.
                </h4>
              </div>

              <div className="p-3">
                {challengeError && (
                  <div className="mb-2.5 p-2 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl text-[11px] flex items-center gap-2">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{challengeError}</span>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-1.5">
                  {CHALLENGE_IMAGES.map((item) => {
                    const isSelected = selectedIds.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleImageClick(item.id)}
                        className={`relative aspect-square cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-150 ${
                          isSelected
                            ? 'border-orange-500 scale-95 ring-2 ring-orange-500/30'
                            : 'border-transparent hover:opacity-80'
                        }`}
                      >
                        <img
                          src={item.image}
                          alt="Challenge option"
                          className="h-full w-full object-cover"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-orange-500/30 flex items-center justify-center backdrop-blur-[1px]">
                            <div className="bg-orange-500 text-white rounded-full p-1 shadow-md">
                              <Check className="h-3.5 w-3.5 stroke-[3]" />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-white/5 p-3 px-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleRefresh}
                  className="p-2 text-slate-500 dark:text-white/60 hover:text-orange-500 transition rounded-xl"
                  title="Refresh Challenge"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowChallenge(false)}
                    className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800 dark:text-white/60 dark:hover:text-white font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleVerify}
                    className="px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold uppercase rounded-xl transition shadow-md"
                  >
                    Verify
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReCaptcha;
