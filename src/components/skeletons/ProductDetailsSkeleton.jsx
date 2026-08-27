import React from 'react';

export function ProductDetailsSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse space-y-12">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2 mb-6">
        <div className="h-3 w-16 bg-slate-300 dark:bg-white/10 rounded" />
        <div className="h-3 w-3 bg-slate-300 dark:bg-white/10 rounded-full" />
        <div className="h-3 w-24 bg-slate-300 dark:bg-white/10 rounded" />
        <div className="h-3 w-3 bg-slate-300 dark:bg-white/10 rounded-full" />
        <div className="h-3 w-32 bg-slate-300 dark:bg-white/10 rounded" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Image Gallery Skeleton (lg: 7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Hero Image */}
          <div className="relative aspect-[3/4] w-full rounded-2xl sm:rounded-3xl bg-slate-200 dark:bg-white/10 overflow-hidden border border-slate-200 dark:border-white/10">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent" />
          </div>

          {/* Thumbnail Strip */}
          <div className="flex items-center gap-3 overflow-x-auto py-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-16 sm:w-20 aspect-square rounded-xl bg-slate-200 dark:bg-white/10 border border-slate-200 dark:border-white/10 shrink-0"
              />
            ))}
          </div>
        </div>

        {/* Right Column: Details & Actions Skeleton (lg: 5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Category & Status Pill */}
          <div className="flex items-center justify-between">
            <div className="h-4 w-28 bg-slate-300 dark:bg-white/15 rounded-full" />
            <div className="h-4 w-20 bg-slate-300 dark:bg-white/15 rounded-full" />
          </div>

          {/* Title Lines */}
          <div className="space-y-2">
            <div className="h-7 sm:h-9 bg-slate-300 dark:bg-white/20 rounded-xl w-4/5" />
            <div className="h-7 sm:h-9 bg-slate-300 dark:bg-white/20 rounded-xl w-3/5" />
          </div>

          {/* Price Bar */}
          <div className="flex items-baseline gap-3 py-2 border-y border-slate-200 dark:border-white/10">
            <div className="h-8 w-32 bg-slate-300 dark:bg-white/20 rounded-lg" />
            <div className="h-5 w-20 bg-slate-200 dark:bg-white/10 rounded" />
          </div>

          {/* Description Paragraphs */}
          <div className="space-y-2 py-2">
            <div className="h-3.5 bg-slate-200 dark:bg-white/10 rounded w-full" />
            <div className="h-3.5 bg-slate-200 dark:bg-white/10 rounded w-5/6" />
            <div className="h-3.5 bg-slate-200 dark:bg-white/10 rounded w-4/6" />
          </div>

          {/* Size Selector Skeleton */}
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center">
              <div className="h-4 w-24 bg-slate-300 dark:bg-white/15 rounded" />
              <div className="h-4 w-20 bg-slate-200 dark:bg-white/10 rounded" />
            </div>
            <div className="flex flex-wrap gap-2.5">
              {['S', 'M', 'L', 'XL', 'XXL'].map((s) => (
                <div
                  key={s}
                  className="w-12 h-11 rounded-xl bg-slate-200 dark:bg-white/10 border border-slate-300 dark:border-white/10"
                />
              ))}
            </div>
          </div>

          {/* Action Buttons: Add to Cart & Buy Now */}
          <div className="space-y-3 pt-4">
            <div className="h-12 w-full bg-orange-500/40 rounded-2xl" />
            <div className="h-12 w-full bg-slate-300 dark:bg-white/15 rounded-2xl" />
          </div>

          {/* Feature Badges Skeleton */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-200 dark:border-white/10">
            <div className="h-10 bg-slate-200 dark:bg-white/10 rounded-xl" />
            <div className="h-10 bg-slate-200 dark:bg-white/10 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailsSkeleton;
