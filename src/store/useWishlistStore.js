import { create } from 'zustand';
import { trackAddToWishlist } from '@/lib/metaPixel';

export const useWishlistStore = create((set, get) => ({
  wishlist: [],

  toggleWishlist: (product) => {
    set((state) => {
      const exists = state.wishlist.some((item) => item.id === product.id);
      if (exists) {
        return {
          wishlist: state.wishlist.filter((item) => item.id !== product.id),
        };
      } else {
        trackAddToWishlist(product);
        return { wishlist: [...state.wishlist, product] };
      }
    });
  },


  isInWishlist: (productId) => {
    return get().wishlist.some((item) => item.id === productId);
  },

  clearWishlist: () => set({ wishlist: [] }),
}));
