import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '@/lib/api';
import { useFilterStore } from '@/store/useFilterStore';
import ProductCard from './ProductCard';
import { ProductGridSkeleton } from '@/components/skeletons';
import { PackageX } from 'lucide-react';

export default function ProductGrid({ onShowToast, onTotalResultsChange }) {
  const { category, searchQuery, sortBy, inStockOnly } = useFilterStore();

  const { data: products = [], isLoading, isError, error } = useQuery({
    queryKey: ['products', { category, searchQuery, sortBy, inStockOnly }],
    queryFn: () => fetchProducts({ category, searchQuery, sortBy, inStockOnly }),
  });

  // Notify parent of total results
  if (onTotalResultsChange && !isLoading && products) {
    onTotalResultsChange(products.length);
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ProductGridSkeleton count={8} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="text-red-500 font-mono text-sm">Error loading garments: {error?.message}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="inline-flex p-4 rounded-full bg-slate-200 dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 text-slate-500 mb-4">
          <PackageX className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wider">No Garments Match Filter</h3>
        <p className="text-slate-500 dark:text-zinc-400 text-xs mt-2 max-w-sm mx-auto">
          Try resetting your category or search query to explore other runway collections.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onShowToast={onShowToast}
          />
        ))}
      </div>
    </div>
  );
}
