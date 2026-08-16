'use client';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/Breadcrumb';
import Footer from '@/components/Footer';

import Toast from '@/components/Toast';
import SearchModal from '@/components/SearchModal';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/lib/utils';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Tag,
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles
} from 'lucide-react';

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    getSubtotal,
    getDiscountAmount,
    getShippingCost,
    getTotal,
    promoCode,
    applyPromoCode,
    removePromoCode,
    clearCart
  } = useCartStore();

  const [inputCode, setInputCode] = useState('');
  const [promoMessage, setPromoMessage] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const shipping = getShippingCost();
  const total = getTotal();

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const res = applyPromoCode(inputCode);
    setPromoMessage(res);
    if (res.success) {
      setToastMessage(res.message);
      setInputCode('');
    }
  };

  const freeShippingThreshold = 250;
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-white flex flex-col justify-between transition-colors duration-300">
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />

      <div className="flex-1">
        {/* Clickable Breadcrumbs */}
        <Breadcrumb items={[{ label: 'Shopping Cart' }]} />

        {/* Page Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-b border-slate-200 dark:border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono text-orange-500 mb-1">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span>EXPRESS CHECKOUT CART</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
                SHOPPING CART ({cart.reduce((a, b) => a + b.quantity, 0)})
              </h1>
            </div>

            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 hover:bg-red-500 text-xs font-mono font-bold uppercase rounded-xl transition self-start sm:self-auto hover:text-white"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear Cart</span>
              </button>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {cart.length === 0 ? (
            <div className="text-center py-20 px-4 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl max-w-2xl mx-auto space-y-6">
              <div className="inline-flex p-5 rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/20">
                <ShoppingCart className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black uppercase tracking-wide">YOUR SHOPPING CART IS EMPTY</h2>
                <p className="text-xs font-mono text-slate-500 dark:text-white/60 max-w-md mx-auto">
                  Add items from our signature shirts, Japanese selvedge denim, or baggy pleated trousers to complete your order.
                </p>
              </div>
              <Link to="/"
                className="inline-flex items-center gap-2 px-8 py-4 bg-orange-500 text-white font-bold uppercase tracking-wider text-xs rounded-2xl hover:bg-orange-600 transition shadow-xl"
              >
                <span>CONTINUE SHOPPING</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Left Items Column */}
              <div className="lg:col-span-8 space-y-6">
                {/* Free Shipping Progress Indicator */}
                <div className="p-5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
                      <Truck className="w-4 h-4 text-orange-500" />
                      {subtotal >= 2000
                        ? 'YOU UNLOCKED FREE EXPRESS SHIPPING NATIONWIDE!'
                        : `FREE NATIONWIDE DELIVERY ON ORDERS OVER ${formatPrice(2000)}`}
                    </span>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.cartItemId}
                      className="p-4 sm:p-6 bg-slate-100/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl flex flex-col sm:flex-row items-center gap-6 shadow-sm hover:border-orange-500/30 transition"
                    >
                      {/* Product Image */}
                      <Link to={`/shop/${item.id}`} className="w-24 h-32 shrink-0 rounded-xl overflow-hidden bg-slate-200 dark:bg-black/40 border border-slate-300 dark:border-white/10">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover object-center"
                          referrerPolicy="no-referrer"
                        />
                      </Link>

                      {/* Product Info */}
                      <div className="flex-1 space-y-2 text-center sm:text-left">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 dark:text-white/50">
                          {typeof item.category === 'object' ? (item.category?.name || '') : item.category}
                        </span>
                        <Link to={`/shop/${item.id}`}>
                          <h3 className="text-base font-bold text-slate-900 dark:text-white hover:text-orange-500 transition line-clamp-1">
                            {item.name}
                          </h3>
                        </Link>

                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-600 dark:text-white/60 font-mono">
                          <span>Size: <strong className="text-slate-900 dark:text-white">{item.selectedSize}</strong></span>
                          <span>•</span>
                          <span>Color: <strong className="text-slate-900 dark:text-white">{item.selectedColor}</strong></span>
                        </div>

                        <div className="text-lg font-black text-slate-900 dark:text-white font-mono pt-1">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                      </div>

                      {/* Quantity & Actions */}
                      <div className="flex items-center sm:flex-col justify-between sm:justify-end gap-4 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-white/10">
                        <div className="flex items-center border border-slate-300 dark:border-white/20 rounded-xl overflow-hidden bg-white dark:bg-black/40">
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-white transition"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-xs font-mono font-bold text-slate-900 dark:text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-white transition"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="p-2 text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded-lg transition"
                          title="Remove Item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Order Summary Column */}
              <div className="lg:col-span-4 space-y-6">
                <div className="p-6 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl space-y-6 shadow-xl">
                  <h2 className="text-xl font-black uppercase tracking-wide border-b border-slate-200 dark:border-white/10 pb-4">
                    ORDER SUMMARY
                  </h2>

                  {/* Promo Code Input */}
                  <form onSubmit={handleApplyPromo} className="space-y-2">
                    <label className="block text-xs font-mono text-slate-500 dark:text-white/60">
                      Promo Code
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value)}
                        placeholder="e.g. ENGULF20"
                        className="flex-1 bg-white dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono uppercase focus:outline-none focus:border-orange-500"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-slate-900 dark:bg-white/10 hover:bg-orange-500 text-white font-bold text-xs uppercase rounded-xl transition"
                      >
                        Apply
                      </button>
                    </div>
                    {promoCode && (
                      <div className="flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-mono pt-1">
                        <span className="flex items-center gap-1">
                          <Tag className="w-3.5 h-3.5" />
                          Code {promoCode} Applied
                        </span>
                        <button
                          type="button"
                          onClick={removePromoCode}
                          className="text-red-500 underline text-[10px]"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </form>

                  {/* Pricing Breakdown */}
                  <div className="space-y-3 font-mono text-xs border-t border-b border-slate-200 dark:border-white/10 py-4">
                    <div className="flex justify-between text-slate-600 dark:text-white/70">
                      <span>Subtotal</span>
                      <span className="text-slate-900 dark:text-white font-bold">{formatPrice(subtotal)}</span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                        <span>Discount ({promoCode})</span>
                        <span>-{formatPrice(discount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-slate-600 dark:text-white/70">
                      <span>Estimated Shipping</span>
                      <span>{shipping === 0 ? <strong className="text-emerald-600 dark:text-emerald-400">FREE</strong> : formatPrice(shipping)}</span>
                    </div>

                    <div className="flex justify-between text-base font-black text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-white/10">
                      <span>TOTAL</span>
                      <span className="text-orange-500 font-bold">{formatPrice(total)}</span>
                    </div>
                  </div>

                  {/* Checkout & Continue Shopping CTAs */}
                  <div className="space-y-3">
                    <Link to="/checkout"
                      className="w-full py-4 bg-orange-500 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-orange-600 transition shadow-2xl border border-orange-400/30 flex items-center justify-center gap-2"
                    >
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    <Link to="/"
                      className="w-full py-3 bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-white border border-slate-200 dark:border-white/10 font-bold uppercase tracking-wider text-xs rounded-2xl flex items-center justify-center gap-2 transition hover:bg-slate-200 dark:hover:bg-white/10"
                    >
                      <span>Continue to Shopping</span>
                    </Link>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-slate-500 dark:text-white/50 pt-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>256-Bit Encrypted Secure Checkout</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />


      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />
    </main>
  );
}
