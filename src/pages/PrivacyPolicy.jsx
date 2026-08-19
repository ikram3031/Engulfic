'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/Breadcrumb';
import Footer from '@/components/Footer';
import SearchModal from '@/components/SearchModal';
import { ShieldCheck, Lock, Eye, FileText } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-white flex flex-col justify-between transition-colors duration-300">
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />

      <div className="flex-1">
        {/* Clickable Breadcrumb */}
        <Breadcrumb items={[{ label: 'Privacy Policy' }]} />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
          <div className="border-b border-slate-200 dark:border-white/10 pb-6 space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-orange-500 uppercase">
              <ShieldCheck className="w-4 h-4" />
              <span>LEGAL & COMPLIANCE</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">PRIVACY POLICY</h1>
            <p className="text-xs font-mono text-slate-500 dark:text-white/60">
              LAST UPDATED: JULY 2026 • ENGULFIC MAISON PRIVACY PROTOCOL
            </p>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-sm text-slate-700 dark:text-white/80 font-sans leading-relaxed">
            <section className="p-6 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl space-y-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white uppercase font-mono flex items-center gap-2">
                <Lock className="w-4 h-4 text-orange-500" />
                1. Information Collection
              </h2>
              <p>
                At Engulfic, we respect your privacy and process personal information strictly to facilitate orders, custom atelier tailoring, global express shipping, and seamless account experiences.
              </p>
            </section>

            <section className="p-6 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl space-y-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white uppercase font-mono flex items-center gap-2">
                <Eye className="w-4 h-4 text-orange-500" />
                2. Data Usage & Protection
              </h2>
              <p>
                We collect your shipping address, payment tokens (via encrypted 256-bit payment gateways), and email address solely to dispatch order confirmations and tracking updates. We never sell or trade your data to third-party advertisers.
              </p>
            </section>

            <section className="p-6 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl space-y-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white uppercase font-mono flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-500" />
                3. Your Rights & Cookies
              </h2>
              <p>
                You may request complete deletion of your personal account data or export a copy at any time by emailing contact@engulfic.com. Essential cookies are utilized to preserve cart contents and preference settings across visits.
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
