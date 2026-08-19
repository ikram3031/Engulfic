'use client';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWishlistStore } from '@/store/useWishlistStore';
import { Heart, Star, ArrowRight } from 'lucide-react';

export default function ProductCard({ product, onShowToast, hideDetails = false }) {
  const [hovered, setHovered] = useState(false);

  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const isWishlisted = isInWishlist(product?.slug || product?.id);

  if (!product) return null;

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

  const categoryName = typeof product.category === 'object' ? (product.category?.name || '') : (product.category || '');

  return (
    <Link
      to={`/shop/${product.slug || product.id}`}
      className="group bg-slate-100/90 dark:bg-white/5 backdrop-blur-md rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 hover:border-orange-500/50 hover:bg-slate-200/70 dark:hover:bg-white/10 transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-xl text-left block h-full w-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-200 dark:bg-black/40 block rounded-t-xl sm:rounded-t-2xl">
        {/* Base Image */}
        <img
          src={product.image}
          alt={product.name || 'Product'}
          className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-105 ${
            hovered && product.secondaryImage ? 'opacity-0' : 'opacity-100'
          }`}
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Hover Secondary Image */}
        {product.secondaryImage && (
          <img
            src={product.secondaryImage}
            alt={`${product.name} alternate`}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-out ${
              hovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
            }`}
            referrerPolicy="no-referrer"
            loading="lazy"
          />
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10">
          {hasDiscount ? (
            <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-red-600 text-white font-black text-[9px] sm:text-[10px] uppercase tracking-wider rounded-md shadow-md">
              -{discountPercent}% OFF
            </span>
          ) : product.isNew ? (
            <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-orange-500 text-white font-black text-[9px] sm:text-[10px] uppercase tracking-wider rounded-md shadow-md">
              NEW
            </span>
          ) : product.stockCount <= 10 && product.stockCount > 0 ? (
            <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-black/75 text-orange-300 backdrop-blur-md text-[9px] sm:text-[10px] font-mono border border-orange-500/30 rounded-md">
              {product.stockCount} LEFT
            </span>
          ) : null}
        </div>

        {/* Wishlist Button */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10">
          <button
            type="button"
            onClick={handleToggleWishlist}
            className="p-1.5 sm:p-2 rounded-full backdrop-blur-md transition-all shadow-md border border-white/20 bg-black/40 text-white hover:bg-orange-500 cursor-pointer"
            title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            aria-label="Wishlist"
          >
            <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWishlisted ? 'fill-white' : ''}`} />
          </button>
        </div>
      </div>

      {/* Product Details Section - Clean with no variation and no price */}
      <div className="p-2.5 sm:p-4 flex flex-col flex-1 justify-between gap-1.5 sm:gap-2">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-[9px] sm:text-xs text-slate-500 dark:text-white/50 font-mono mb-0.5">
            <span className="truncate pr-1 uppercase tracking-wider">{categoryName}</span>
            {product.rating > 0 && (
              <div className="flex items-center gap-0.5 text-orange-500">
                <Star className="w-3 h-3 fill-orange-500" />
                <span className="font-bold text-[10px] sm:text-xs text-slate-800 dark:text-white/90">{product.rating}</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="text-xs sm:text-sm md:text-base font-bold text-slate-900 dark:text-white tracking-tight hover:text-orange-500 transition line-clamp-1 leading-snug">
            {product.name}
          </h3>
        </div>

        {/* Action Link */}
        <div className="flex items-center justify-center pt-1.5 sm:pt-2 border-t border-slate-200 dark:border-white/10 mt-auto">
          <span className="text-[10px] sm:text-xs font-mono font-bold text-orange-500 uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-1 transition-all">
            <span>View Piece</span>
            <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
