'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/Breadcrumb';
import Footer from '@/components/Footer';
import SearchModal from '@/components/SearchModal';
import { Ruler, Sparkles, Check } from 'lucide-react';

export default function SizeGuidePage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('sweatshirts');

  const sizeTables = {
    sweatshirts: {
      title: 'Sweatshirts & Oversized Crews',
      unit: 'Inches (Chest / Length / Shoulder)',
      rows: [
        { size: 'XS', chest: '44"', length: '27"', shoulder: '21.5"' },
        { size: 'S', chest: '46"', length: '28"', shoulder: '22.5"' },
        { size: 'M', chest: '48"', length: '29"', shoulder: '23.5"' },
        { size: 'L', chest: '50"', length: '30"', shoulder: '24.5"' },
        { size: 'XL', chest: '52"', length: '31"', shoulder: '25.5"' },
      ]
    },
    pants: {
      title: 'Baggy Pants & Sweatpants',
      unit: 'Inches (Waist / Inseam / Leg Opening)',
      rows: [
        { size: 'XS', waist: '28 - 30"', inseam: '30"', leg: '9.5"' },
        { size: 'S', waist: '30 - 32"', inseam: '31"', leg: '10.0"' },
        { size: 'M', waist: '32 - 34"', inseam: '31.5"', leg: '10.5"' },
        { size: 'L', waist: '34 - 36"', inseam: '32"', leg: '11.0"' },
        { size: 'XL', waist: '36 - 38"', inseam: '32.5"', leg: '11.5"' },
      ]
    },
    shirts: {
      title: 'Oversized & Casual Shirts',
      unit: 'Inches (Chest / Length / Sleeve)',
      rows: [
        { size: 'XS', chest: '42"', length: '28"', sleeve: '23.5"' },
        { size: 'S', chest: '44"', length: '29"', sleeve: '24.0"' },
        { size: 'M', chest: '46"', length: '30"', sleeve: '24.5"' },
        { size: 'L', chest: '48"', length: '31"', sleeve: '25.0"' },
        { size: 'XL', chest: '50"', length: '32"', sleeve: '25.5"' },
      ]
    },
    tees: {
      title: 'Drop Shoulder T-Shirts',
      unit: 'Inches (Chest / Length / Drop Sleeve)',
      rows: [
        { size: 'XS', chest: '44"', length: '27.5"', sleeve: '9.0"' },
        { size: 'S', chest: '46"', length: '28.5"', sleeve: '9.5"' },
        { size: 'M', chest: '48"', length: '29.5"', sleeve: '10.0"' },
        { size: 'L', chest: '50"', length: '30.5"', sleeve: '10.5"' },
        { size: 'XL', chest: '52"', length: '31.5"', sleeve: '11.0"' },
      ]
    },
    jerseys: {
      title: 'Player & Fan Edition Jerseys',
      unit: 'Inches (Chest / Length)',
      rows: [
        { size: 'S', chest: '42"', length: '28.5"' },
        { size: 'M', chest: '44"', length: '29.5"' },
        { size: 'L', chest: '46"', length: '30.5"' },
        { size: 'XL', chest: '48"', length: '31.5"' },
      ]
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-white flex flex-col justify-between transition-colors duration-300">
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />

      <div className="flex-1">
        <Breadcrumb items={[{ label: 'Size Guide' }]} />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-orange-500 uppercase tracking-widest font-bold">
              <Ruler className="w-4 h-4 text-orange-500" />
              <span>ENGULFIC ARCHITECTURAL FITS</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">OFFICIAL SIZE GUIDE</h1>
            <p className="text-xs font-mono text-slate-500 dark:text-white/60">
              Engulfic garments feature signature oversized proportions. Select a category below for accurate garment measurements.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {Object.keys(sizeTables).map((key) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-mono font-bold uppercase transition border shrink-0 ${
                  activeTab === key
                    ? 'bg-orange-500 text-white border-orange-400 shadow-lg'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-white/70 border-slate-200 dark:border-white/10 hover:border-orange-500'
                }`}
              >
                {key}
              </button>
            ))}
          </div>

          {/* Table Container */}
          <div className="p-6 sm:p-8 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200 dark:border-white/10">
              <h2 className="text-xl font-black uppercase tracking-tight">{sizeTables[activeTab].title}</h2>
              <span className="text-xs font-mono text-orange-500 font-bold">{sizeTables[activeTab].unit}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-white/50 uppercase">
                    <th className="py-3 px-4">Size</th>
                    {activeTab === 'sweatshirts' && (
                      <>
                        <th className="py-3 px-4">Chest Width</th>
                        <th className="py-3 px-4">Body Length</th>
                        <th className="py-3 px-4">Shoulder Drop</th>
                      </>
                    )}
                    {activeTab === 'pants' && (
                      <>
                        <th className="py-3 px-4">Waist (Elastic)</th>
                        <th className="py-3 px-4">Inseam</th>
                        <th className="py-3 px-4">Leg Opening</th>
                      </>
                    )}
                    {activeTab === 'shirts' && (
                      <>
                        <th className="py-3 px-4">Chest</th>
                        <th className="py-3 px-4">Length</th>
                        <th className="py-3 px-4">Sleeve</th>
                      </>
                    )}
                    {activeTab === 'tees' && (
                      <>
                        <th className="py-3 px-4">Chest</th>
                        <th className="py-3 px-4">Length</th>
                        <th className="py-3 px-4">Drop Sleeve</th>
                      </>
                    )}
                    {activeTab === 'jerseys' && (
                      <>
                        <th className="py-3 px-4">Chest</th>
                        <th className="py-3 px-4">Length</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                  {sizeTables[activeTab].rows.map((row, i) => (
                    <tr key={i} className="hover:bg-orange-500/5 transition">
                      <td className="py-3.5 px-4 font-bold text-orange-500">{row.size}</td>
                      {activeTab === 'sweatshirts' && (
                        <>
                          <td className="py-3.5 px-4">{row.chest}</td>
                          <td className="py-3.5 px-4">{row.length}</td>
                          <td className="py-3.5 px-4">{row.shoulder}</td>
                        </>
                      )}
                      {activeTab === 'pants' && (
                        <>
                          <td className="py-3.5 px-4">{row.waist}</td>
                          <td className="py-3.5 px-4">{row.inseam}</td>
                          <td className="py-3.5 px-4">{row.leg}</td>
                        </>
                      )}
                      {activeTab === 'shirts' && (
                        <>
                          <td className="py-3.5 px-4">{row.chest}</td>
                          <td className="py-3.5 px-4">{row.length}</td>
                          <td className="py-3.5 px-4">{row.sleeve}</td>
                        </>
                      )}
                      {activeTab === 'tees' && (
                        <>
                          <td className="py-3.5 px-4">{row.chest}</td>
                          <td className="py-3.5 px-4">{row.length}</td>
                          <td className="py-3.5 px-4">{row.sleeve}</td>
                        </>
                      )}
                      {activeTab === 'jerseys' && (
                        <>
                          <td className="py-3.5 px-4">{row.chest}</td>
                          <td className="py-3.5 px-4">{row.length}</td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </main>
  );
}
