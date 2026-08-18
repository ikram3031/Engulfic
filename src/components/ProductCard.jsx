'use client';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import {  useNavigate  } from 'react-router-dom';
import { useWishlistStore } from '@/store/useWishlistStore';
import { formatPrice } from '@/lib/utils';
import { Heart, Star, ArrowRight } from 'lucide-react';

export default function ProductCard({ product, onShowToast, hideDetails = false }) {
  const [hovered, setHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || product.variants?.[0]?.size || '');
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.name || '');
  const router = useNavigate();

  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const isWishlisted = isInWishlist(product.slug || product.id);

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
    <Link
      to={`/shop/${product.slug || product.id}`}
      className="group bg-slate-100/80 dark:bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 hover:border-orange-500/50 hover:bg-slate-200/60 dark:hover:bg-white/10 transition-all duration-500 ease-out flex flex-col justify-between shadow-lg hover:shadow-2xl hover:shadow-orange-500/10 dark:hover:shadow-orange-500/15 text-left block h-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top Image Container - Part of card click link */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-200 dark:bg-black/40 block">
        {/* Base Image */}
        <img
          src={product.image}
          alt={product.name}
          className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-[1200ms] cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-110 ${
            hovered && product.secondaryImage ? 'opacity-0' : 'opacity-100'
          }`}
          referrerPolicy="no-referrer"
        />

        {/* Hover Secondary Image */}
        {product.secondaryImage && (
          <img
            src={product.secondaryImage}
            alt={`${product.name} alternate`}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-[1200ms] cubic-bezier(0.16, 1, 0.3, 1) ${
              hovered ? 'opacity-100 scale-110' : 'opacity-0 scale-100'
            }`}
            referrerPolicy="no-referrer"
          />
        )}

        {/* Badges - Render at most one chip based on priority */}
        <div className="absolute top-3 left-3 z-10">
          {hasDiscount ? (
            <span className="px-2.5 py-1 bg-red-600/90 text-white font-black text-[10px] uppercase tracking-wider rounded-md shadow-lg border border-red-500/30">
              -{discountPercent}% OFF
            </span>
          ) : product.isNew ? (
            <span className="px-2.5 py-1 bg-orange-500 text-white font-black text-[10px] uppercase tracking-wider rounded-md shadow-lg border border-orange-400/30">
              NEW RUNWAY
            </span>
          ) : product.stockCount <= 10 ? (
            <span className="px-2.5 py-1 bg-black/70 text-orange-300 backdrop-blur-md text-[10px] font-mono border border-orange-500/30 rounded-md">
              ONLY {product.stockCount} LEFT
            </span>
          ) : null}
        </div>

        {/* Wishlist Button */}
        <div className="absolute top-3 right-3 z-10">
          <button
            onClick={handleToggleWishlist}
            className="p-2.5 rounded-full backdrop-blur-md transition-all shadow-lg border border-white/20 bg-black/40 text-white hover:bg-orange-500"
            title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
          </button>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="p-3 sm:p-5 flex flex-col flex-1 justify-between gap-2 sm:gap-4">
        <div>
          <div className="flex items-center justify-between text-[10px] sm:text-xs text-slate-500 dark:text-white/50 font-mono mb-1">
            <span className="truncate pr-2">{typeof product.category === 'object' ? (product.category?.name || '') : product.category}</span>
            {product.rating > 0 && (
              <div className="hidden sm:flex items-center gap-1 text-orange-500">
                <Star className="w-3.5 h-3.5 fill-orange-500" />
                <span className="font-bold text-slate-800 dark:text-white/90">{product.rating}</span>
              </div>
            )}
          </div>

          <div className="block">
            <h3 className="text-xs sm:text-base font-bold text-slate-900 dark:text-white tracking-tight hover:text-orange-500 transition line-clamp-1 leading-tight">
              {product.name}
            </h3>
          </div>

          {!hideDetails && (
            <p className="hidden sm:block text-xs text-slate-500 dark:text-white/50 line-clamp-1 mt-1 font-light">
              {product.tagline}
            </p>
          )}

          {/* Price display */}
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-sm sm:text-base font-black text-orange-500 font-mono">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-slate-400 dark:text-white/40 line-through font-mono">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>

        {!hideDetails && (
          <>
            {/* Color Swatches & Size Picker (Hidden on Mobile) */}
            <div className="pt-2 border-t border-slate-200 dark:border-white/10">
              <div className="hidden sm:flex sm:flex-col justify-center min-h-[44px] space-y-2 pb-2">
                {product.variants?.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {product.variants.map((v, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedSize(v.size);
                        }}
                        className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold transition-all ${
                          selectedSize === v.size
                            ? 'bg-orange-500 text-white'
                            : 'bg-slate-200 dark:bg-white/5 text-slate-700 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        {v.size}
                      </button>
                    ))}
                  </div>
                ) : (
                  <>
                    {/* Colors */}
                    {product.colors?.length > 0 && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 dark:text-white/40 font-mono text-[11px]">COLOR</span>
                        <div className="flex items-center gap-1.5">
                          {product.colors.map((c, idx) => (
                            <button
                              key={idx}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
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
                    )}

                    {/* Sizes */}
                    {product.sizes?.length > 0 && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 dark:text-white/40 font-mono text-[11px]">SIZE</span>
                        <div className="flex items-center gap-1">
                          {product.sizes.map((s) => (
                            <button
                              key={s}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
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
                    )}
                  </>
                )}
              </div>

              {/* Card Action Link (Centered, No Limited Run) */}
              <div className="flex items-center justify-center pt-2 mt-1 sm:mt-0">
                <span className="text-[10px] sm:text-xs font-mono font-bold text-orange-500 uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-1 transition-all">
                  <span>View Piece</span>
                  <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </Link>
  );
}
