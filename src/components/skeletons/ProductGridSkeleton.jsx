import React from 'react';
import ProductCardSkeleton from './ProductCardSkeleton';

export function ProductGridSkeleton({ count = 8, className = '' }) {
  return (
    <div
      className={
        className ||
        'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8'
      }
    >
      {Array.from({ length: count }).map((_, idx) => (
        <ProductCardSkeleton key={idx} />
      ))}
    </div>
  );
}

export default ProductGridSkeleton;
