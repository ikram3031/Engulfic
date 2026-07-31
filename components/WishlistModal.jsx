'use client';

import { useWishlistStore } from '@/store/useWishlistStore';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/lib/utils';
import { X, Heart, ShoppingCart, Trash2 } from 'lucide-react';

export default function WishlistModal({ isOpen, onClose, onShowToast }) {
  const { wishlist, toggleWishlist } = useWishlistStore();
  const addToCart = useCartStore((state) => state.addToCart);

  if (!isOpen) return null;

  const handleMoveToCart = (product) => {
    addToCart(product, product.sizes[0] || 'M', product.colors[0]?.name || 'Default');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-xl animate-fadeIn">
      <div
        className="relative w-full max-w-lg bg-white dark:bg-[#050505]/90 border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-2xl text-slate-900 dark:text-white p-6 space-y-4 max-h-[85vh] flex flex-col backdrop-blur-2xl transition-colors duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white rounded-full border border-slate-200 dark:border-white/10 transition backdrop-blur-md"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-200 dark:border-white/10 pb-4">
          <div className="p-2 bg-orange-500/20 text-orange-500 rounded-full border border-orange-500/30">
            <Heart className="w-5 h-5 fill-orange-500" />
          </div>
          <div>
            <h2 className="text-lg font-black uppercase tracking-wider font-sans text-slate-900 dark:text-white">YOUR WISHLIST</h2>
            <p className="text-xs text-slate-500 dark:text-white/50 font-mono">{wishlist.length} Saved Garments</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3">
          {wishlist.length === 0 ? (
            <div className="text-center py-12 text-slate-400 dark:text-white/40 space-y-2">
              <Heart className="w-10 h-10 mx-auto opacity-30" />
              <p className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-white/70">No Saved Garments</p>
              <p className="text-[11px] text-slate-500 dark:text-white/40">Tap the heart icon on any garment to save it for later.</p>
            </div>
          ) : (
            wishlist.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-slate-100/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl backdrop-blur-md"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-18 object-cover rounded-xl bg-slate-200 dark:bg-black/40 border border-slate-300 dark:border-white/10"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{item.name}</h4>
                    <span className="text-xs font-mono text-orange-500 font-bold block mt-0.5">
                      {formatPrice(item.price)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleMoveToCart(item)}
                    className="px-3 py-1.5 bg-orange-500 text-white hover:bg-orange-600 font-bold text-xs rounded-xl flex items-center gap-1.5 transition border border-orange-400/30"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Cart</span>
                  </button>

                  <button
                    onClick={() => toggleWishlist(item)}
                    className="p-2 text-slate-400 dark:text-white/40 hover:text-red-500 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
