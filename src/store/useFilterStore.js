import { create } from 'zustand';

export const useFilterStore = create((set) => ({
  category: 'All',
  priceRange: [0, 2000],
  sortBy: 'featured', // featured, price-asc, price-desc, rating, new
  searchQuery: '',
  inStockOnly: false,
  selectedGender: 'All', // All, Men, Women, Unisex

  setCategory: (category) => set({ category }),
  setPriceRange: (priceRange) => set({ priceRange }),
  setSortBy: (sortBy) => set({ sortBy }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setInStockOnly: (inStockOnly) => set({ inStockOnly }),
  setSelectedGender: (selectedGender) => set({ selectedGender }),

  resetFilters: () =>
    set({
      category: 'All',
      priceRange: [0, 2000],
      sortBy: 'featured',
      searchQuery: '',
      inStockOnly: false,
      selectedGender: 'All',
    }),
}));
