'use client';

import { Sparkles, ShoppingCart, Eye } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '@/lib/api';

export default function LookbookSection({ onQuickView }) {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['lookbookProducts'],
    queryFn: () => fetchProducts({ limit: 3 }),
  });

  const trench = products[0];
  const boots = products[1];
  const bag = products[2];

  return (
    <section id="lookbook" className="bg-[#050505] py-20 border-t border-white/10 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-orange-400 text-xs font-mono tracking-widest uppercase mb-3 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
            <span>INTERACTIVE RUNWAY EDITORIAL</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">
            SHOP THE <span className="text-orange-500">CURATED</span> LOOK
          </h2>
          <p className="text-xs sm:text-sm text-white/60 mt-3 font-light">
            Hover or click over the runway hotspots below to inspect and shop individual garments directly from the autumn collection showcase.
          </p>
        </div>

        {/* Lookbook Showcase Container */}
        <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-white/5 aspect-[16/9] sm:aspect-[21/9] shadow-2xl backdrop-blur-md">
          <img
            src="https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=2000"
            alt="Fashion Lookbook Showcase"
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />

          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/80 via-transparent to-transparent pointer-events-none" />

          {/* Hotspot 1: Trench Coat (Top Left) */}
          {trench && (
            <div className="absolute top-[35%] left-[30%] group">
              <button
                onClick={() => onQuickView(trench)}
                className="relative w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold shadow-xl animate-bounce hover:animate-none hover:scale-125 transition-transform border border-orange-400/40"
                title="View Trench Coat"
              >
                <span className="absolute inset-0 rounded-full bg-orange-500 animate-ping opacity-75" />
                <ShoppingCart className="w-4 h-4 z-10" />
              </button>

              <div className="absolute left-12 top-0 hidden group-hover:flex flex-col bg-black/80 border border-white/20 p-3.5 rounded-2xl w-52 backdrop-blur-xl shadow-2xl z-30">
                <p className="text-xs font-bold text-white line-clamp-1">{trench.name}</p>
                <p className="text-[10px] text-orange-400 font-mono mt-0.5">৳{trench.price}</p>
                <button
                  onClick={() => onQuickView(trench)}
                  className="mt-2 py-1.5 px-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-[10px] uppercase rounded-lg transition-colors cursor-pointer"
                >
                  Quick View
                </button>
              </div>
            </div>
          )}

          {/* Hotspot 2: Leather Bag (Center Right) */}
          {bag && (
            <div className="absolute top-[50%] left-[65%] group">
              <button
                onClick={() => onQuickView(bag)}
                className="relative w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold shadow-xl hover:scale-125 transition-transform border border-orange-400/40"
                title="View Leather Bag"
              >
                <span className="absolute inset-0 rounded-full bg-orange-500 animate-ping opacity-75" />
                <ShoppingCart className="w-4 h-4 z-10" />
              </button>

              <div className="absolute right-12 top-0 hidden group-hover:flex flex-col bg-black/80 border border-white/20 p-3.5 rounded-2xl w-52 backdrop-blur-xl shadow-2xl z-30">
                <p className="text-xs font-bold text-white line-clamp-1">{bag.name}</p>
                <p className="text-[10px] text-orange-400 font-mono mt-0.5">৳{bag.price}</p>
                <button
                  onClick={() => onQuickView(bag)}
                  className="mt-2 py-1.5 px-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-[10px] uppercase rounded-lg transition-colors cursor-pointer"
                >
                  Quick View
                </button>
              </div>
            </div>
          )}

          {/* Hotspot 3: Sculptural Derby Boots (Bottom Center) */}
          {boots && (
            <div className="absolute top-[75%] left-[48%] group">
              <button
                onClick={() => onQuickView(boots)}
                className="relative w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold shadow-xl hover:scale-125 transition-transform border border-orange-400/40"
                title="View Derby Boots"
              >
                <span className="absolute inset-0 rounded-full bg-orange-500 animate-ping opacity-75" />
                <ShoppingCart className="w-4 h-4 z-10" />
              </button>

              <div className="absolute left-12 top-0 hidden group-hover:flex flex-col bg-black/80 border border-white/20 p-3.5 rounded-2xl w-52 backdrop-blur-xl shadow-2xl z-30">
                <p className="text-xs font-bold text-white line-clamp-1">{boots.name}</p>
                <p className="text-[10px] text-orange-400 font-mono mt-0.5">৳{boots.price}</p>
                <button
                  onClick={() => onQuickView(boots)}
                  className="mt-2 py-1.5 px-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-[10px] uppercase rounded-lg transition-colors cursor-pointer"
                >
                  Quick View
                </button>
              </div>
            </div>
          )}

          {/* Bottom Title bar */}
          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-xs font-mono text-white/70 p-3 bg-black/40 backdrop-blur-md rounded-xl border border-white/10">
            <span>RUNWAY LOOK #04 • AUTUMN 2026</span>
            <span className="hidden sm:inline text-orange-400 font-bold">3 GARMENTS FEATURED</span>
          </div>
        </div>
      </div>
    </section>
  );
}
