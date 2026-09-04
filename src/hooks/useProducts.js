import { useQuery } from '@tanstack/react-query';
import { fetchProducts, fetchProductDetails, fetchCategories, fetchCombos, fetchSizeChartByCategory } from '@/lib/api';

/**
 * Hook to fetch paginated & filtered products list with TanStack Query.
 */
export function useProducts(params = {}, options = {}) {
  const {
    category,
    searchQuery,
    sortBy,
    inStockOnly,
    limit = 100,
    skip = 0,
  } = params;

  return useQuery({
    queryKey: ['products', { category, searchQuery, sortBy, inStockOnly, limit, skip }],
    queryFn: () => fetchProducts({ category, searchQuery, sortBy, inStockOnly, limit, skip }),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    placeholderData: (previousData) => previousData, // smooth transitions during pagination
    ...options,
  });
}

/**
 * Hook to fetch a single product details by slug or ID with TanStack Query.
 */
export function useProductDetails(slugOrId, options = {}) {
  return useQuery({
    queryKey: ['product', slugOrId],
    queryFn: () => fetchProductDetails(slugOrId),
    enabled: Boolean(slugOrId),
    staleTime: 1000 * 60 * 5,
    ...options,
  });
}

/**
 * Hook to fetch categories with TanStack Query.
 */
export function useCategories(options = {}) {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 15,
    ...options,
  });
}

/**
 * Hook to fetch new arrival products for carousels / sections.
 */
export function useNewArrivals(limit = 12, options = {}) {
  return useQuery({
    queryKey: ['new-arrivals', { limit }],
    queryFn: () => fetchProducts({ sortBy: 'newest', limit }),
    staleTime: 1000 * 60 * 5,
    ...options,
  });
}

/**
 * Hook to fetch best selling products.
 */
export function useBestSellingProducts({ category, limit = 4 } = {}, options = {}) {
  return useQuery({
    queryKey: ['best-selling-products', { category, limit }],
    queryFn: () => fetchProducts({
      category: category && category !== 'All' ? category : undefined,
      sortBy: 'rating',
      limit,
    }),
    staleTime: 1000 * 60 * 5,
    ...options,
  });
}

// Hook to fetch category size chart configuration with TanStack Query
export const useSizeChartByCategory = (categoryDidOrSlug, options = {}) => {
  return useQuery({
    queryKey: ['size-chart', categoryDidOrSlug],
    queryFn: () => fetchSizeChartByCategory(categoryDidOrSlug),
    enabled: Boolean(categoryDidOrSlug),
    staleTime: 1000 * 60 * 15,
    ...options,
  });
};
