'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/Breadcrumb';
import Footer from '@/components/Footer';
import SearchModal from '@/components/SearchModal';
import { Sparkles, Compass, Layers, Globe } from 'lucide-react';

export default function AboutPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-white flex flex-col justify-between transition-colors duration-300">
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />

      <div className="flex-1">
        <Breadcrumb items={[{ label: 'About Us' }]} />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
          {/* Header */}
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-orange-500 uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>THE ENGULFIC ARCHITECTURE</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight">
              REDEFINING MODERN LUXURY
            </h1>
            <p className="text-xs font-mono text-slate-500 dark:text-white/60 leading-relaxed">
              DHAKA • BANGLADESH • PREMIUM STREETWEAR
            </p>
          </div>

          {/* Banner Image */}
          <div className="relative h-[350px] sm:h-[450px] rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-white/10">
            <img
              src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1200"
              alt="Engulfic Atelier"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
            <div className="absolute bottom-8 left-8 right-8 text-white space-y-1">
              <span className="text-xs font-mono text-orange-400">ENGULFIC ATELIER</span>
              <p className="text-xl sm:text-2xl font-black uppercase">Sculptural silhouettes & premium heavy cotton garments</p>
            </div>
          </div>

          {/* Core Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl space-y-3">
              <Compass className="w-6 h-6 text-orange-500" />
              <h3 className="text-base font-bold uppercase font-sans">Premium Fabrics</h3>
              <p className="text-xs font-mono text-slate-600 dark:text-white/70 leading-relaxed">
                Every fabric is hand-selected for high density, rich hand-feel, and enduring structural durability.
              </p>
            </div>

            <div className="p-6 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl space-y-3">
              <Layers className="w-6 h-6 text-orange-500" />
              <h3 className="text-base font-bold uppercase font-sans">Architectural Proportions</h3>
              <p className="text-xs font-mono text-slate-600 dark:text-white/70 leading-relaxed">
                From heavyweight drop shoulder tees to wide-leg trousers, our silhouettes prioritize clean drape and everyday comfort.
              </p>
            </div>

            <div className="p-6 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl space-y-3">
              <Globe className="w-6 h-6 text-orange-500" />
              <h3 className="text-base font-bold uppercase font-sans">Nationwide Delivery</h3>
              <p className="text-xs font-mono text-slate-600 dark:text-white/70 leading-relaxed">
                Fast, fully tracked doorstep delivery across all 64 districts of Bangladesh with secure packaging.
              </p>
            </div>
          </div>

          {/* Sustainability & Ethics Section */}
          <div id="sustainability" className="p-8 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-orange-500 uppercase tracking-widest font-bold">
              <span>ECO-RESPONSIBLE MANUFACTURING</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
              OUR SUSTAINABILITY COMMITMENT
            </h2>
            <p className="text-xs sm:text-sm font-mono text-slate-600 dark:text-white/80 leading-relaxed">
              At Engulfic, luxury means accountability. We operate on a small-batch, zero-overproduction model.
              All heavy French terry and jersey cottons are 100% GOTS-certified organic cotton, dyed using non-toxic water-recycled processes in closed-loop facilities.
              Our shipping boxes and garment bags are crafted from 100% biodegradable cornstarch and recycled paper.
            </p>
          </div>
        </div>
      </div>

      <Footer />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </main>
  );
}
