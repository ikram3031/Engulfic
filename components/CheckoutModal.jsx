'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/lib/utils';
import { X, CheckCircle2, CreditCard, Lock, ArrowRight, Sparkles } from 'lucide-react';

export default function CheckoutModal({ isOpen, onClose }) {
  const { getTotal, clearCart } = useCartStore();
  const [step, setStep] = useState(1); // 1: Info, 2: Payment, 3: Confirmation
  const [orderId, setOrderId] = useState('');

  const [formData, setFormData] = useState({
    firstName: 'Tanvir',
    lastName: 'Ahmed',
    email: 'tanvir@example.com',
    address: '1214 Mugdapara',
    city: 'Dhaka',
    postalCode: '1214',
    country: 'Bangladesh',
    paymentMethod: 'cod',
    cardNumber: '•••• •••• •••• 4242',
    expDate: '12/28',
    cvv: '988',
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCompleteOrder = (e) => {
    e.preventDefault();
    const generatedId = `ENG-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderId(generatedId);
    setStep(3);
    clearCart();
  };

  const total = getTotal();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/85 backdrop-blur-xl animate-fadeIn overflow-y-auto">
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-[#050505]/95 border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-2xl text-slate-900 dark:text-white p-6 sm:p-8 my-8 backdrop-blur-2xl transition-colors duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white rounded-full border border-slate-200 dark:border-white/10 transition backdrop-blur-md"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 1 && (
          <form onSubmit={() => setStep(2)} className="space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs text-orange-500 font-mono mb-1">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span>EXPRESS CHECKOUT</span>
              </div>
              <h2 className="text-2xl font-black uppercase tracking-wide">Shipping Address</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-500 dark:text-white/50 mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-500 dark:text-white/50 mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-500 dark:text-white/50 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-500 dark:text-white/50 mb-1">Street Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 font-mono"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-500 dark:text-white/50 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-500 dark:text-white/50 mb-1">Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-500 dark:text-white/50 mb-1">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 font-mono"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
              <span className="text-sm font-bold font-mono text-orange-500">Total: {formatPrice(total)}</span>
              <button
                type="submit"
                className="px-6 py-3 bg-orange-500 text-white font-bold uppercase tracking-wider text-xs rounded-xl hover:bg-orange-600 flex items-center gap-2 transition border border-orange-400/30 shadow-lg"
              >
                <span>Continue to Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleCompleteOrder} className="space-y-6">
            <div>
              <span className="text-xs text-orange-500 font-mono uppercase">STEP 2 OF 2</span>
              <h2 className="text-2xl font-black uppercase tracking-wide">Payment Method</h2>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                className={`p-4 rounded-xl border flex items-center gap-3 text-xs font-bold transition ${
                  formData.paymentMethod === 'cod'
                    ? 'border-orange-500 bg-orange-500/10 text-orange-600 dark:text-white'
                    : 'border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-white/50'
                }`}
              >
                <Lock className="w-5 h-5 text-orange-500" />
                <span>Cash on Delivery (COD)</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, paymentMethod: 'card' })}
                className={`p-4 rounded-xl border flex items-center gap-3 text-xs font-bold transition ${
                  formData.paymentMethod === 'card'
                    ? 'border-orange-500 bg-orange-500/10 text-orange-600 dark:text-white'
                    : 'border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-white/50'
                }`}
              >
                <CreditCard className="w-5 h-5 text-orange-500" />
                <span>bKash / Nagad / Card</span>
              </button>
            </div>

            {formData.paymentMethod === 'card' ? (
              <div className="space-y-4 bg-slate-100/80 dark:bg-white/5 p-4 rounded-2xl border border-slate-200 dark:border-white/10 backdrop-blur-md">
                <div>
                  <label className="block text-xs font-mono text-slate-500 dark:text-white/50 mb-1">Card / Mobile Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    required
                    className="w-full bg-white dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-slate-500 dark:text-white/50 mb-1">Expiry / PIN</label>
                    <input
                      type="text"
                      name="expDate"
                      value={formData.expDate}
                      onChange={handleChange}
                      required
                      className="w-full bg-white dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-500 dark:text-white/50 mb-1">TrxID / CVV</label>
                    <input
                      type="password"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleChange}
                      required
                      maxLength={6}
                      className="w-full bg-white dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 font-mono"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl text-xs font-mono text-slate-700 dark:text-white/80 space-y-1">
                <p className="font-bold text-orange-500">Cash on Delivery Selected</p>
                <p>Pay cash directly to the delivery person upon receiving your garments.</p>
              </div>
            )}

            <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-slate-500 dark:text-white/50 hover:text-slate-900 dark:hover:text-white font-mono"
              >
                ← Back to Address
              </button>

              <button
                type="submit"
                className="px-8 py-3.5 bg-orange-500 text-white font-black uppercase tracking-widest text-xs rounded-xl hover:bg-orange-600 transition shadow-xl border border-orange-400/30"
              >
                Confirm Order ({formatPrice(total)})
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <div className="text-center py-6 space-y-6">
            <div className="inline-flex p-4 rounded-full bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 mb-2">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div>
              <span className="px-3 py-1 bg-orange-500/20 text-orange-600 dark:text-orange-300 text-xs font-mono rounded-full border border-orange-500/30">
                ORDER CONFIRMED
              </span>
              <h2 className="text-3xl font-black uppercase mt-3 tracking-wide">Thank You, {formData.firstName}!</h2>
              <p className="text-xs text-slate-500 dark:text-white/60 mt-1">
                Your order <strong className="text-orange-500 font-mono">{orderId}</strong> has been received and is being prepared at our Mugdapara atelier.
              </p>
            </div>

            <div className="bg-slate-100 dark:bg-white/5 p-6 rounded-2xl border border-slate-200 dark:border-white/10 text-left space-y-3 text-xs text-slate-700 dark:text-white/70 font-mono backdrop-blur-md">
              <div className="flex justify-between border-b border-slate-200 dark:border-white/10 pb-2">
                <span>Shipping To:</span>
                <span className="text-slate-900 dark:text-white font-bold">{formData.firstName} {formData.lastName}, {formData.address}, {formData.city}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 dark:border-white/10 pb-2">
                <span>Estimated Delivery:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">24-48 Hours (Home Delivery)</span>
              </div>
              <div className="flex justify-between">
                <span>Total Amount:</span>
                <span className="text-orange-500 font-black text-sm">{formatPrice(total)}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-4 bg-orange-500 text-white hover:bg-orange-600 font-extrabold uppercase tracking-widest text-xs rounded-xl transition border border-orange-400/30 shadow-xl"
            >
              Back to Store
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
