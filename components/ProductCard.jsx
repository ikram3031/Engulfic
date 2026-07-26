'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { formatPrice } from '@/lib/utils';
import { Heart, ShoppingBag, Star, ArrowRight } from 'lucide-react';

export default function ProductCard({ product, onShowToast }) {
  const [hovered, setHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || 'Default');
  const router = useRouter();

  const addToCart = useCartStore((state) => state.addToCart);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    addToCart(product, selectedSize, selectedColor);
    if (onShowToast) {
      onShowToast(`Added "${product.name}" (${selectedSize}) to Bag`);
    }
  };

  const handleToggleWishlist = (e) => {
    e.stopPropagation();
    e.preventDefault();
    toggleWishlist(product);
    if (onShowToast) {
      onShowToast(
        isWishlisted
          ? `Removed "${product.name}" from Wishlist`
          : `Saved "${product.name}" to Wishlist`
      );
    }
  };

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div
      className="group bg-slate-100/80 dark:bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 hover:border-orange-500/50 hover:bg-slate-200/60 dark:hover:bg-white/10 transition-all duration-300 flex flex-col justify-between shadow-lg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top Image Container - Links to product details page */}
      <Link href={`/product/${product.id}`} className="relative aspect-[3/4] w-full overflow-hidden bg-slate-200 dark:bg-black/40 block">
        <img
          src={hovered && product.secondaryImage ? product.secondaryImage : product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          referrerPolicy="no-referrer"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isNew && (
            <span className="px-2.5 py-1 bg-orange-500 text-white font-black text-[10px] uppercase tracking-wider rounded-md shadow-lg border border-orange-400/30">
              NEW RUNWAY
            </span>
          )}
          {hasDiscount && (
            <span className="px-2.5 py-1 bg-red-600/90 text-white font-black text-[10px] uppercase tracking-wider rounded-md shadow-lg border border-red-500/30">
              -{discountPercent}% OFF
            </span>
          )}
          {product.stockCount <= 10 && (
            <span className="px-2.5 py-1 bg-black/70 text-orange-300 backdrop-blur-md text-[10px] font-mono border border-orange-500/30 rounded-md">
              ONLY {product.stockCount} LEFT
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <div className="absolute top-3 right-3 z-10">
          <button
            onClick={handleToggleWishlist}
            className={`p-2.5 rounded-full backdrop-blur-md transition-all shadow-lg border border-white/20 ${
              isWishlisted
                ? 'bg-orange-500 text-white border-orange-400'
                : 'bg-black/40 text-white hover:bg-orange-500'
            }`}
            title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Quick Add Button Overlay on Hover */}
        <div className="absolute inset-x-3 bottom-3 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
          <button
            onClick={handleAddToCart}
            className="w-full py-3 bg-orange-500 text-white hover:bg-orange-600 font-bold uppercase tracking-wider text-xs rounded-xl flex items-center justify-center gap-2 shadow-xl border border-orange-400/30 transition-colors backdrop-blur-md"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add to Bag ({selectedSize})</span>
          </button>
        </div>
      </Link>

      {/* Product Details Section */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-white/50 font-mono mb-1">
            <span>{product.category} • {product.gender}</span>
            <div className="flex items-center gap-1 text-orange-500">
              <Star className="w-3.5 h-3.5 fill-orange-500" />
              <span className="font-bold text-slate-800 dark:text-white/90">{product.rating}</span>
            </div>
          </div>

          <Link href={`/product/${product.id}`} className="block">
            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight hover:text-orange-500 transition line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-slate-500 dark:text-white/50 line-clamp-1 mt-1 font-light">
            {product.tagline}
          </p>
        </div>

        {/* Color Swatches & Size Picker */}
        <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-white/10">
          {/* Colors */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 dark:text-white/40 font-mono text-[11px]">COLOR</span>
            <div className="flex items-center gap-1.5">
              {product.colors.map((c, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedColor(c.name);
                  }}
                  className={`w-3.5 h-3.5 rounded-full border transition-all ${
                    selectedColor === c.name
                      ? 'ring-2 ring-orange-500 scale-110 border-slate-900 dark:border-white'
                      : 'border-slate-300 dark:border-white/20 opacity-70 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 dark:text-white/40 font-mono text-[11px]">SIZE</span>
            <div className="flex items-center gap-1">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedSize(s);
                  }}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
                    selectedSize === s
                      ? 'bg-orange-500 text-white'
                      : 'bg-slate-200 dark:bg-white/5 text-slate-700 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Price & Add Button */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-black text-slate-900 dark:text-white font-mono">
                {formatPrice(product.price)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-slate-400 dark:text-white/40 line-through font-mono">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              className="p-2 text-slate-700 dark:text-white/70 hover:text-orange-500 transition hover:bg-slate-200 dark:hover:bg-white/10 rounded-lg"
              title="Add to Bag"
            >
              <ShoppingBag className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
