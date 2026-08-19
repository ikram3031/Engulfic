'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/Breadcrumb';
import Footer from '@/components/Footer';
import SearchModal from '@/components/SearchModal';
import Toast from '@/components/Toast';
import { Mail, Phone, MapPin, Send, Sparkles } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [toastMessage, setToastMessage] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setToastMessage('Thank you! Your message has been sent to Engulfic Concierge.');
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setToastMessage(''), 4000);
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-white flex flex-col justify-between transition-colors duration-300">
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />

      <div className="flex-1">
        <Breadcrumb items={[{ label: 'Contact Us' }]} />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
          {/* Header */}
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-orange-500 uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>ENGULFIC CONCIERGE</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">GET IN TOUCH</h1>
            <p className="text-xs font-mono text-slate-500 dark:text-white/60">
              Our client care specialists are available 24/7 for size consultations and order tracking.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Contact Form */}
            <div className="lg:col-span-7 p-8 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl shadow-xl space-y-6">
              <h2 className="text-xl font-black uppercase tracking-wide">SEND A MESSAGE</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-500 dark:text-white/60 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                      placeholder="e.g. Julian Vane"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-500 dark:text-white/60 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                      placeholder="julian@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-500 dark:text-white/60 mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-white dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                    placeholder="Order Inquiry / Custom Sizing"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-500 dark:text-white/60 mb-1">Message</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-white dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                    placeholder="How can our concierge assist you?"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-orange-500 text-white font-black uppercase tracking-widest text-xs rounded-xl hover:bg-orange-600 transition shadow-xl border border-orange-400/30 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>TRANSMIT MESSAGE</span>
                </button>
              </form>
            </div>

            {/* Flagship Locations Info */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl space-y-4">
                <h3 className="text-base font-bold uppercase font-mono border-b border-slate-200 dark:border-white/10 pb-3">
                  CLIENT CARE CONTACTS
                </h3>

                <div className="space-y-3 text-xs font-mono">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-orange-500" />
                    <span>contact@engulfic.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-orange-500" />
                    <span>Available Sat – Thu: 10:00 AM – 8:00 PM</span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl space-y-4">
                <h3 className="text-base font-bold uppercase font-mono border-b border-slate-200 dark:border-white/10 pb-3">
                  HEADQUARTERS & STUDIO
                </h3>

                <div className="space-y-4 text-xs font-mono text-slate-700 dark:text-white/80">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 dark:text-white block">ENGULFIC STUDIO</strong>
                      <span>Mugda, Dhaka, Bangladesh</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />
    </main>
  );
}
