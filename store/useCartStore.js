import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  cart: [],
  isOpen: false,
  promoCode: '',
  discountPercentage: 0,
  
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),

  addToCart: (product, size = 'M', color = 'Default') => {
    set((state) => {
      const existingIndex = state.cart.findIndex(
        (item) => item.id === product.id && item.selectedSize === size && item.selectedColor === color
      );

      let updatedCart;
      if (existingIndex > -1) {
        updatedCart = state.cart.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedCart = [
          ...state.cart,
          {
            ...product,
            selectedSize: size,
            selectedColor: color,
            quantity: 1,
            cartItemId: `${product.id}-${size}-${color}`,
          },
        ];
      }

      return { cart: updatedCart, isOpen: true };
    });
  },

  removeFromCart: (cartItemId) => {
    set((state) => ({
      cart: state.cart.filter((item) => item.cartItemId !== cartItemId),
    }));
  },

  updateQuantity: (cartItemId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(cartItemId);
      return;
    }
    set((state) => ({
      cart: state.cart.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity } : item
      ),
    }));
  },

  applyPromoCode: (code) => {
    const trimmed = code.trim().toUpperCase();
    if (trimmed === 'ENGULF20') {
      set({ promoCode: 'ENGULF20', discountPercentage: 20 });
      return { success: true, message: '20% Discount applied!' };
    } else if (trimmed === 'VIP50') {
      set({ promoCode: 'VIP50', discountPercentage: 50 });
      return { success: true, message: '50% VIP Discount applied!' };
    } else {
      return { success: false, message: 'Invalid promo code. Try ENGULF20' };
    }
  },

  removePromoCode: () => set({ promoCode: '', discountPercentage: 0 }),

  clearCart: () => set({ cart: [], promoCode: '', discountPercentage: 0 }),

  getSubtotal: () => {
    const { cart } = get();
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  },

  getDiscountAmount: () => {
    const subtotal = get().getSubtotal();
    const { discountPercentage } = get();
    return (subtotal * discountPercentage) / 100;
  },

  getShippingCost: () => {
    const subtotal = get().getSubtotal();
    if (subtotal === 0) return 0;
    return subtotal >= 2000 ? 0 : 100;
  },

  getTotal: () => {
    const subtotal = get().getSubtotal();
    const discount = get().getDiscountAmount();
    const shipping = get().getShippingCost();
    return Math.max(0, subtotal - discount + shipping);
  },

  getTotalItemsCount: () => {
    const { cart } = get();
    return cart.reduce((count, item) => count + item.quantity, 0);
  },
}));
