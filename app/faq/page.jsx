'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/Breadcrumb';
import Footer from '@/components/Footer';
import SearchModal from '@/components/SearchModal';
import { HelpCircle, ChevronDown, Sparkles } from 'lucide-react';

export default function FAQPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'What shipping options do you offer for domestic and global orders?',
      a: 'Engulfic partners exclusively with DHL Express for fully insured air courier shipping. We offer complimentary global express shipping on all orders over $250 USD.'
    },
    {
      q: 'How do your baggy trousers and oversized shirts fit?',
      a: 'Our silhouettes are engineered with precise architectural drape. Oversized shirts and baggy trousers are designed to fit true to size for a relaxed runway silhouette. If you prefer a traditional tailored fit, we recommend downsizing by one size.'
    },
    {
      q: 'How should I care for Japanese selvedge denim and raw indigo garments?',
      a: 'Raw selvedge denim should be worn as long as possible before the first wash to develop organic whiskering. When washing, wash cold inside out with mild detergent and hang dry.'
    },
    {
      q: 'What is your return and exchange policy?',
      a: 'We offer a 30-day return window worldwide. Items must be unworn and in original condition with security tags attached. Pre-paid DHL return labels are available through our portal.'
    },
    {
      q: 'Which promo codes are available for new orders?',
      a: 'You can use code ENGULF20 at checkout for 20% off your order, or VIP50 for exclusive 50% VIP tier savings.'
    }
  ];

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-white flex flex-col justify-between transition-colors duration-300">
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />

      <div className="flex-1">
        <Breadcrumb items={[{ label: 'Frequently Asked Questions' }]} />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-orange-500 uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>ENGULFIC HELP CENTER</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">FREQUENTLY ASKED QUESTIONS</h1>
            <p className="text-xs font-mono text-slate-500 dark:text-white/60">
              Find answers regarding sizing, Japanese selvedge care, express delivery, and returns.
            </p>
          </div>

          <div className="space-y-4 pt-4">
            {faqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden transition"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 dark:text-white hover:text-orange-500 transition font-sans"
                  >
                    <span className="uppercase">{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-orange-500 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 text-xs sm:text-sm font-mono text-slate-600 dark:text-white/70 leading-relaxed border-t border-slate-200 dark:border-white/10 pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Footer />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </main>
  );
}
