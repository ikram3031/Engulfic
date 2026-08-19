'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/Breadcrumb';
import Footer from '@/components/Footer';
import SearchModal from '@/components/SearchModal';
import { FileText, Gavel, ShieldAlert } from 'lucide-react';

export default function TermsPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-white flex flex-col justify-between transition-colors duration-300">
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />

      <div className="flex-1">
        <Breadcrumb items={[{ label: 'Terms & Conditions' }]} />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
          <div className="border-b border-slate-200 dark:border-white/10 pb-6 space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-orange-500 uppercase">
              <Gavel className="w-4 h-4" />
              <span>TERMS OF SERVICE</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">TERMS & CONDITIONS</h1>
            <p className="text-xs font-mono text-slate-500 dark:text-white/60">
              EFFECTIVE DATE: JULY 2026 • ENGULFIC GLOBAL STORE AGREEMENT
            </p>
          </div>

          <div className="space-y-6 text-sm text-slate-700 dark:text-white/80 font-sans leading-relaxed">
            <section className="p-6 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl space-y-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white uppercase font-mono flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-500" />
                1. General Provisions & Pricing
              </h2>
              <p>
                By accessing Engulfic, you agree to adhere to these terms. All prices are listed in Bangladeshi Taka (BDT ৳). Engulfic reserves the right to modify pricing, garment availability, or promotions without prior notice.
              </p>
            </section>

            <section className="p-6 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl space-y-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white uppercase font-mono flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-orange-500" />
                2. Intellectual Property
              </h2>
              <p>
                All garment designs, logos, imagery, and branding assets are the exclusive intellectual property of ENGULFIC. Reproduction or distribution without explicit written consent is strictly prohibited.
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
