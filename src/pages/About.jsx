import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/Breadcrumb';
import Footer from '@/components/Footer';
import SearchModal from '@/components/SearchModal';
import { Sparkles, ShieldCheck, Scissors, Sparkle, RefreshCw, Truck, HeartHandshake } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-white flex flex-col justify-between transition-colors duration-300">
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />

      <div className="flex-1">
        <Breadcrumb items={[{ label: 'About Engulfic' }]} />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16 sm:space-y-24">
          {/* Hero Section */}
          <div className="text-center space-y-5 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-semibold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>THE ENGULFIC ARCHIVE</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white uppercase leading-tight font-['Josefin_Sans']">
              Redefining Modern Luxury Streetwear
            </h1>
            
            <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-300 leading-relaxed font-normal">
              Born in Dhaka with a global vision, <strong className="text-slate-900 dark:text-white font-semibold">Engulfic</strong> merges heavyweight architectural tailoring with minimalist streetwear culture. Every piece is an exploration of form, volume, and uncompromising textile integrity.
            </p>
          </div>

          {/* Hero Visual Banner */}
          <div className="relative h-[320px] sm:h-[480px] rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-white/10">
            <img
              src="https://server.engulfic.com/uploads/assets/slider-2.webp"
              alt="Engulfic Atelier & Craftsmanship"
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 sm:right-10 text-white space-y-2">
              <span className="text-xs uppercase tracking-widest text-orange-400 font-bold">
                CRAFTED IN BANGLADESH • ENGINEERED FOR THE WORLD
              </span>
              <p className="text-xl sm:text-3xl font-black uppercase tracking-tight font-['Josefin_Sans']">
                Sculptural Silhouettes. Heavyweight Organic Cottons.
              </p>
            </div>
          </div>

          {/* Brand Story: The Genesis */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-6 space-y-5">
              <div className="text-xs uppercase font-bold text-orange-500 tracking-widest">
                OUR GENESIS
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-slate-900 dark:text-white font-['Josefin_Sans']">
                Rejecting Fast Fashion. Embracing Permanent Form.
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
                Engulfic was founded on a simple conviction: streetwear in South Asia deserved the precision, weight, and silhouette integrity found only in high-end global runway fashion.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
                Instead of flimsy synthetics and mass-produced graphics, we began designing from the fiber upwards. Custom knitting our own 300GSM organic cottons, prototyping drop-shoulder armhole curves for months, and developing garment dye washes that age gracefully over years of wear.
              </p>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="p-6 bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-white/10 rounded-2xl space-y-3">
                <span className="text-3xl sm:text-4xl font-black text-orange-500 font-['Josefin_Sans']">300+</span>
                <h3 className="text-xs sm:text-sm font-bold uppercase text-slate-900 dark:text-white">GSM Cotton Terry</h3>
                <p className="text-xs text-slate-600 dark:text-zinc-400 leading-normal">
                  Heavyweight, structured drapes that never cling or lose shape.
                </p>
              </div>

              <div className="p-6 bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-white/10 rounded-2xl space-y-3">
                <span className="text-3xl sm:text-4xl font-black text-orange-500 font-['Josefin_Sans']">100%</span>
                <h3 className="text-xs sm:text-sm font-bold uppercase text-slate-900 dark:text-white">Pre-Shrunk Weave</h3>
                <p className="text-xs text-slate-600 dark:text-zinc-400 leading-normal">
                  Zero post-wash distortion or collar baconing guaranteed.
                </p>
              </div>

              <div className="p-6 bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-white/10 rounded-2xl space-y-3">
                <span className="text-3xl sm:text-4xl font-black text-orange-500 font-['Josefin_Sans']">64</span>
                <h3 className="text-xs sm:text-sm font-bold uppercase text-slate-900 dark:text-white">Districts Covered</h3>
                <p className="text-xs text-slate-600 dark:text-zinc-400 leading-normal">
                  Fast door-to-door insured tracked delivery nationwide.
                </p>
              </div>

              <div className="p-6 bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-white/10 rounded-2xl space-y-3">
                <span className="text-3xl sm:text-4xl font-black text-orange-500 font-['Josefin_Sans']">0%</span>
                <h3 className="text-xs sm:text-sm font-bold uppercase text-slate-900 dark:text-white">Overproduction</h3>
                <p className="text-xs text-slate-600 dark:text-zinc-400 leading-normal">
                  Small batch limited edition seasonal drops and archives.
                </p>
              </div>
            </div>
          </div>

          {/* Pillars of Craftsmanship */}
          <div className="space-y-8">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">
                THE FOUR PILLARS
              </span>
              <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-slate-900 dark:text-white font-['Josefin_Sans']">
                Precision in Every Stitch
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Pillar 1 */}
              <div className="p-6 bg-white dark:bg-zinc-900/40 border border-slate-200 dark:border-white/10 rounded-2xl space-y-3 hover:border-orange-500/40 transition-colors">
                <Scissors className="w-6 h-6 text-orange-500" />
                <h3 className="text-sm font-bold uppercase text-slate-900 dark:text-white">
                  Drop-Shoulder Geometry
                </h3>
                <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                  Engineered armhole offsets and wider chest boxes creating an effortless, boxy streetwear drape without excessive length.
                </p>
              </div>

              {/* Pillar 2 */}
              <div className="p-6 bg-white dark:bg-zinc-900/40 border border-slate-200 dark:border-white/10 rounded-2xl space-y-3 hover:border-orange-500/40 transition-colors">
                <ShieldCheck className="w-6 h-6 text-orange-500" />
                <h3 className="text-sm font-bold uppercase text-slate-900 dark:text-white">
                  Reinforced Collar & Ribbing
                </h3>
                <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                  Double-needle taped necklines and high-density elastane-infused ribbing ensure collar structure stays firm through dozens of washes.
                </p>
              </div>

              {/* Pillar 3 */}
              <div className="p-6 bg-white dark:bg-zinc-900/40 border border-slate-200 dark:border-white/10 rounded-2xl space-y-3 hover:border-orange-500/40 transition-colors">
                <RefreshCw className="w-6 h-6 text-orange-500" />
                <h3 className="text-sm font-bold uppercase text-slate-900 dark:text-white">
                  Sustainable Small-Batch
                </h3>
                <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                  We produce strictly limited drops to eliminate landfill waste. When a collection archive sells out, it rarely restocks.
                </p>
              </div>

              {/* Pillar 4 */}
              <div className="p-6 bg-white dark:bg-zinc-900/40 border border-slate-200 dark:border-white/10 rounded-2xl space-y-3 hover:border-orange-500/40 transition-colors">
                <HeartHandshake className="w-6 h-6 text-orange-500" />
                <h3 className="text-sm font-bold uppercase text-slate-900 dark:text-white">
                  Ethical Fair Wages
                </h3>
                <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                  Every tailor and artisan working on Engulfic collections receives fair living wages, safe modern atelier conditions, and healthcare benefits.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 dark:bg-zinc-900 text-white text-center space-y-6 border border-slate-800 dark:border-white/10">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-widest">
              <Sparkle className="w-4 h-4 text-orange-500" />
              <span>EXPERIENCE ENGULFIC</span>
            </div>
            
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight max-w-2xl mx-auto font-sans">
              ELEVATE YOUR EVERYDAY WARDROBE
            </h2>
            
            <p className="text-xs sm:text-sm text-zinc-300 max-w-xl mx-auto leading-relaxed font-sans">
              Explore our premium collection of modern streetwear. From heavyweight Drop Shoulder T-Shirts to signature Baggy Pants and classic Sweatshirts, find your perfect fit today.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                to="/catalog"
                className="px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider rounded-full transition-all duration-300 shadow-md hover:scale-105"
              >
                Shop Now
              </Link>
              <Link
                to="/contact"
                className="px-8 py-3.5 bg-transparent hover:bg-white/10 text-white border border-white/20 font-bold text-xs uppercase tracking-wider rounded-full transition-all duration-300"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </main>
  );
}
