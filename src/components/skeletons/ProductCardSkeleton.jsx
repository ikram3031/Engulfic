import React from 'react';

export function ProductCardSkeleton() {
  return (
    <div className="bg-slate-100/90 dark:bg-white/5 backdrop-blur-md rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 flex flex-col justify-between shadow-sm h-full w-full animate-pulse">
      {/* Top Image Skeleton with Shimmer */}
      <div className="relative aspect-[3/4] w-full bg-slate-200 dark:bg-white/10 rounded-t-xl sm:rounded-t-2xl overflow-hidden">
        {/* Shimmer gradient overlay */}
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent" />
        
        {/* Top Badges placeholder */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
          <div className="w-12 sm:w-16 h-4 sm:h-5 bg-slate-300 dark:bg-white/15 rounded-md" />
        </div>
        
        {/* Wishlist Button placeholder */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-300 dark:bg-white/15" />
        </div>
      </div>

      {/* Details Section */}
      <div className="p-2.5 sm:p-4 flex flex-col flex-1 justify-between gap-2 sm:gap-3">
        <div className="space-y-2">
          {/* Category & Rating */}
          <div className="flex items-center justify-between">
            <div className="h-2.5 sm:h-3 bg-slate-300 dark:bg-white/15 rounded w-1/3" />
            <div className="h-2.5 sm:h-3 bg-slate-300 dark:bg-white/15 rounded w-10" />
          </div>

          {/* Product Title */}
          <div className="space-y-1">
            <div className="h-3.5 sm:h-4 bg-slate-300/80 dark:bg-white/20 rounded w-4/5" />
            <div className="h-3.5 sm:h-4 bg-slate-300/80 dark:bg-white/20 rounded w-1/2" />
          </div>
        </div>

        {/* Bottom Bar: Price & Add to Cart */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200/80 dark:border-white/10 mt-auto">
          <div className="space-y-1">
            <div className="h-4 sm:h-5 bg-slate-300 dark:bg-white/20 rounded w-16 sm:w-20" />
          </div>
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-slate-300 dark:bg-white/15 rounded-lg sm:rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default ProductCardSkeleton;
