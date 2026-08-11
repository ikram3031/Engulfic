'use client';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchProducts } from '@/core/lib/api';
import { X, Search, ArrowRight, Loader2, PackageX } from 'lucide-react';

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Debounced search logic (300ms delay) to prevent spamming backend API
  useEffect(() => {
    if (!query || String(query).trim().length === 0) {
      setResults([]);
      return;
    }
    const q = String(query).trim();
    setIsLoading(true);
    setError('');

    const timer = setTimeout(async () => {
      try {
        const items = await fetchProducts({ q, limit: 12 });
        setResults(items.slice(0, 12));
      } catch (err) {
        setError('Failed to load results');
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 dark:bg-black/80 backdrop-blur-xl animate-fadeIn">
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-[#050505]/90 border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-2xl text-slate-900 dark:text-white p-6 space-y-4 backdrop-blur-2xl transition-colors duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input Bar */}
        <div className="relative pr-12">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-orange-500 z-10" />
          <input
            type="text"
            placeholder="Search shirts, jeans, denim, baggy, long sleeve..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 focus:outline-none focus:border-orange-500 font-sans relative z-0"
          />
        </div>

        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white rounded-full border border-slate-200 dark:border-white/10 transition backdrop-blur-md z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto space-y-3 pt-2">
          {error && (
            <div className="text-center py-4 text-red-500 text-xs font-mono">
              {error}
            </div>
          )}

          {query.trim().length === 0 ? (
            <div className="text-center py-8 text-slate-400 dark:text-white/40 text-xs font-mono">
              Type to search Engulfic&apos;s modern fashion collection...
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center gap-2 py-8 text-orange-500 font-mono text-xs">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>SEARCHING ARCHIVE...</span>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-8 text-slate-400 dark:text-white/40 text-xs">
              <PackageX className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <span>No garments found matching &quot;{query}&quot;</span>
            </div>
          ) : (
            results.map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  onClose();
                  navigate(`/product/${product.slug || product.id}`);
                }}
                className="flex items-center justify-between p-3 bg-slate-100/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl hover:border-orange-500/50 hover:bg-slate-200/60 dark:hover:bg-white/10 transition cursor-pointer group backdrop-blur-md"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-14 h-18 object-cover rounded-xl bg-slate-200 dark:bg-black/40 border border-slate-300 dark:border-white/10"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-orange-500 transition">
                      {product.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-white/50 font-mono mt-0.5">
                      {product.category}
                    </p>
                  </div>
                </div>

                <div className="p-2 text-slate-400 dark:text-white/40 group-hover:text-slate-900 dark:group-hover:text-white transition">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
