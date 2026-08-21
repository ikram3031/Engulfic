'use client';

import { useState } from 'react';
import {  useNavigate  } from 'react-router-dom';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/lib/utils';
import { X, ShoppingCart, Trash2, ArrowRight, Eye } from 'lucide-react';

export default function CartDrawer({ onCheckout }) {
  const navigate = useNavigate();
  const {
    cart,
    isOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    promoCode,
    applyPromoCode,
    removePromoCode,
    getSubtotal,
    getDiscountAmount,
    getShippingCost,
    getTotal,
    getTotalItemsCount,
  } = useCartStore();

  const [inputCode, setInputCode] = useState('');
  const [promoMessage, setPromoMessage] = useState(null);

  if (!isOpen) return null;

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const shipping = getShippingCost();
  const total = getTotal();
  const itemsCount = getTotalItemsCount();

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!inputCode) return;
    const res = applyPromoCode(inputCode);
    setPromoMessage(res);
  };

  const handleViewCart = () => {
    closeCart();
    navigate('/cart');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white/95 dark:bg-[#08080a]/95 backdrop-blur-2xl border-l border-slate-200 dark:border-white/10 text-slate-900 dark:text-white shadow-2xl flex flex-col justify-between transition-colors duration-300">
          {/* Drawer Header */}
          <div className="p-6 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-slate-50/80 dark:bg-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/20 rounded-full border border-orange-500/30 text-orange-500 dark:text-orange-400">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black uppercase tracking-wider font-sans text-slate-900 dark:text-white">YOUR CART</h2>
                <p className="text-xs text-slate-500 dark:text-white/50 font-mono">{itemsCount} {itemsCount === 1 ? 'Garment' : 'Garments'}</p>
              </div>
            </div>

            <button
              onClick={closeCart}
              className="p-2 text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white rounded-full bg-slate-200/60 dark:bg-white/10 transition border border-slate-300 dark:border-white/10"
              aria-label="Close Cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>



          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 text-slate-400 dark:text-white/40 space-y-4">
                <ShoppingCart className="w-14 h-14 opacity-40 stroke-[1]" />
                <div>
                  <p className="text-base font-bold uppercase tracking-wider text-slate-800 dark:text-white">Your Cart is Empty</p>
                  <p className="text-xs text-slate-500 dark:text-white/50 mt-1 max-w-xs">Explore our latest collection and add your favorite garments to the cart.</p>
                </div>
                <button
                  onClick={closeCart}
                  className="px-6 py-2.5 bg-orange-500 border border-orange-400/30 text-white text-xs font-bold uppercase rounded-full hover:bg-orange-600 transition shadow-lg"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.cartItemId}
                  className="bg-slate-100/90 dark:bg-white/5 p-4 rounded-2xl border border-slate-200 dark:border-white/10 flex gap-4 items-center backdrop-blur-md shadow-sm hover:border-orange-500/40 transition"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-24 object-cover object-center rounded-xl bg-slate-200 dark:bg-black/40 border border-slate-300 dark:border-white/10 shrink-0"
                    referrerPolicy="no-referrer"
                  />

                  {/* Product Details */}
                  <div className="flex-1 flex flex-col justify-between gap-1.5">
                    <div>
                      {/* Category Pill */}
                      <span className="inline-block text-[10px] font-mono uppercase font-bold tracking-wider text-orange-600 dark:text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-md border border-orange-500/20 mb-1">
                        {(typeof item.category === 'object' ? (item.category?.name || '') : item.category) || 'Garment'}
                      </span>
                      {/* Product Name */}
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{item.name}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-white/50 font-mono mt-0.5">
                        Size: <span className="text-slate-800 dark:text-white font-semibold">{item.selectedSize}</span> • Color: <span className="text-slate-800 dark:text-white font-semibold">{item.selectedColor}</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-1">
                      {/* Amount controls */}
                      <div className="flex items-center bg-slate-200/80 dark:bg-black/50 border border-slate-300 dark:border-white/15 rounded-xl p-0.5 text-xs">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-slate-700 dark:text-white/70 hover:text-slate-900 dark:hover:text-white hover:bg-slate-300 dark:hover:bg-white/10 rounded-lg transition font-bold"
                          aria-label="Subtract quantity"
                        >
                          -
                        </button>
                        <span className="w-7 text-center font-mono font-bold text-slate-900 dark:text-white text-xs">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-slate-700 dark:text-white/70 hover:text-slate-900 dark:hover:text-white hover:bg-slate-300 dark:hover:bg-white/10 rounded-lg transition font-bold"
                          aria-label="Add quantity"
                        >
                          +
                        </button>
                      </div>

                      {/* Item Price */}
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-sm font-black font-mono text-slate-900 dark:text-white block">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                          {item.quantity > 1 && (
                            <span className="text-[10px] text-slate-400 dark:text-white/40 font-mono block">
                              ({formatPrice(item.price)} each)
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="text-slate-400 dark:text-white/40 hover:text-red-500 transition p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer Calculations & Checkout */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-slate-200 dark:border-white/10 bg-slate-50/95 dark:bg-black/80 backdrop-blur-xl space-y-4">
              {/* Totals Breakdown */}
              <div className="space-y-1.5 text-xs font-mono text-slate-600 dark:text-white/60 pt-1">
                <div className="flex justify-between text-base font-black text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-white/10">
                  <span>Total</span>
                  <span className="text-orange-600 dark:text-orange-400 font-mono">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Actions: View Cart & Proceed to Checkout */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  onClick={handleViewCart}
                  className="py-3.5 bg-slate-200/80 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-900 dark:text-white font-bold uppercase tracking-wider text-xs rounded-xl flex items-center justify-center gap-2 border border-slate-300 dark:border-white/10 transition"
                >
                  <Eye className="w-4 h-4 text-orange-500" />
                  <span>View Cart</span>
                </button>

                <button
                  onClick={() => {
                    closeCart();
                    if (onCheckout) {
                      onCheckout();
                    } else {
                      navigate('/checkout');
                    }
                  }}
                  className="py-3.5 bg-orange-500 text-white hover:bg-orange-600 font-black uppercase tracking-wider text-xs rounded-xl flex items-center justify-center gap-2 shadow-2xl border border-orange-400/30 transition-all"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
