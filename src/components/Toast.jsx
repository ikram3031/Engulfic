'use client';

import { Sparkles, X } from 'lucide-react';

export default function Toast({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce">
      <div className="bg-[#050505]/90 border border-orange-500/40 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-xl">
        <Sparkles className="w-4 h-4 text-orange-400 shrink-0 animate-pulse" />
        <span className="text-xs font-mono font-bold text-white">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 text-white/50 hover:text-white p-1 rounded-full hover:bg-white/10 transition"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
