'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/Breadcrumb';
import Footer from '@/components/Footer';
import SearchModal from '@/components/SearchModal';
import { RotateCcw, Truck, CheckCircle2 } from 'lucide-react';

export default function RefundPolicyPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-white flex flex-col justify-between transition-colors duration-300">
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />

      <div className="flex-1">
        <Breadcrumb items={[{ label: 'Return & Refund Policy' }]} />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
          <div className="border-b border-slate-200 dark:border-white/10 pb-6 space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-orange-500 uppercase">
              <RotateCcw className="w-4 h-4" />
              <span>RETURNS & EXCHANGES</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">RETURN & REFUND POLICY</h1>
            <p className="text-xs font-mono text-slate-500 dark:text-white/60">
              30-DAY COMPLIMENTARY RETURN WINDOW WORLDWIDE
            </p>
          </div>

          <div className="space-y-6 text-sm text-slate-700 dark:text-white/80 font-sans leading-relaxed">
            <section className="p-6 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl space-y-3">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white uppercase font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-orange-500" />
                30-Day Unconditional Return Policy
              </h2>
              <p>
                If you are not completely satisfied with your garment size or fit, you may initiate a return within 30 days of receiving your package. Garments must remain unworn, unwashed, with all original Engulfic security tags attached.
              </p>
            </section>

            <section className="p-6 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl space-y-3">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white uppercase font-mono flex items-center gap-2">
                <Truck className="w-4 h-4 text-orange-500" />
                Pre-Paid DHL Return Label
              </h2>
              <p>
                We provide a pre-paid DHL express return label for all domestic and international orders over $250. Simply generate your return portal slip at returns.engulfic.com or contact concierge@engulfic.com.
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </main>
  );
}
