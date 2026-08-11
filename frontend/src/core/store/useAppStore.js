import { create } from "zustand";
import { fetchProducts as apiFetchProducts, fetchCombos as apiFetchCombos, fetchCategories as apiFetchCategories, fetchProductDetails as apiFetchProductDetails, fetchCouponByCode as apiFetchCouponByCode } from "../lib/api";

// The main Zustand store for the application state
export const useAppStore = create((set, get) => ({
  // ---------------------------------------------------------
  // PRODUCTS STATE
  // ---------------------------------------------------------
  
  // State for all general products
  products: [],
  isProductsLoading: false,
  productsError: null,

  // Fetch products from the API and update state
  fetchProducts: async (opts = {}) => {
    set({ isProductsLoading: true, productsError: null });
    try {
      const mapped = await apiFetchProducts(opts);
      set({ products: mapped, isProductsLoading: false });
      return mapped;
    } catch (err) {
      set({ isProductsLoading: false, productsError: "Something went wrong fetching products" });
      return [];
    }
  },

  // Fetch a specific product's details
  fetchProductDetails: async (slugOrId) => {
    // Note: We don't maintain a global loading state for single product detail
    // as this is usually handled locally by the component.
    return await apiFetchProductDetails(slugOrId);
  },

  // ---------------------------------------------------------
  // COMBOS / BUNDLES STATE
  // ---------------------------------------------------------
  
  // State specifically for combo products
  combos: [],
  isCombosLoading: false,

  // Fetch combos from the API and update state
  fetchCombos: async (opts = {}) => {
    set({ isCombosLoading: true });
    try {
      const combosList = await apiFetchCombos(opts);
      set({ combos: combosList, isCombosLoading: false });
      return combosList;
    } catch (err) {
      set({ isCombosLoading: false });
      return [];
    }
  },

  // ---------------------------------------------------------
  // CATEGORIES STATE
  // ---------------------------------------------------------
  
  // State for categories
  categories: [],
  isCategoriesLoading: false,

  // Fetch categories, update state, and cache to localStorage
  fetchCategories: async (opts = {}) => {
    set({ isCategoriesLoading: true });
    try {
      const cats = await apiFetchCategories(opts);
      set({ categories: cats, isCategoriesLoading: false });
      // Cache the categories inside localStorage for instant load on refresh
      // This is used by productHelpers.js to resolve category IDs to names
      localStorage.setItem("luxury_categories", JSON.stringify(cats));
      return cats;
    } catch (err) {
      set({ isCategoriesLoading: false });
      return [];
    }
  },

  // ---------------------------------------------------------
  // CART STATE
  // ---------------------------------------------------------
  
  // Load cart from localStorage or default to empty array
  cart: JSON.parse(localStorage.getItem("luxury_cart") || "[]"),
  
  // Syncs the cart state to localStorage after any modification
  _syncCart: (newCart) => {
    localStorage.setItem("luxury_cart", JSON.stringify(newCart));
    set({ cart: newCart });
  },

  // Example action to add item to cart (placeholder logic, can be expanded)
  addToCart: (item) => {
    const { cart, _syncCart } = get();
    // In a real app, we would check if it exists and increment quantity. 
    // Here we just append as a basic implementation.
    _syncCart([...cart, item]);
  },

  // Example action to clear the cart
  clearCart: () => {
    get()._syncCart([]);
  },

  // ---------------------------------------------------------
  // WISHLIST / FAVORITES STATE
  // ---------------------------------------------------------
  
  // Load wishlist from localStorage or default to empty array
  wishlist: JSON.parse(localStorage.getItem("luxury_wishlist") || "[]"),

  // Syncs the wishlist state to localStorage
  _syncWishlist: (newWishlist) => {
    localStorage.setItem("luxury_wishlist", JSON.stringify(newWishlist));
    set({ wishlist: newWishlist });
  },

  // Toggle item in wishlist
  toggleFavorite: (product) => {
    const { wishlist, _syncWishlist } = get();
    const exists = wishlist.find((p) => p.id === product.id);
    if (exists) {
      _syncWishlist(wishlist.filter((p) => p.id !== product.id));
    } else {
      _syncWishlist([...wishlist, product]);
    }
  },

  // ---------------------------------------------------------
  // USER / AUTH STATE
  // ---------------------------------------------------------
  
  // Load user from localStorage or default to null
  user: JSON.parse(localStorage.getItem("luxury_user") || "null"),

  // Update user state and sync to localStorage
  setUser: (userData) => {
    if (userData) {
      localStorage.setItem("luxury_user", JSON.stringify(userData));
    } else {
      localStorage.removeItem("luxury_user");
    }
    set({ user: userData });
  },

  // ---------------------------------------------------------
  // COUPONS / PROMO STATE
  // ---------------------------------------------------------
  
  // Helper to validate and apply a promo code
  applyPromoCode: async (code) => {
    try {
      const couponData = await apiFetchCouponByCode(code);
      // Further logic (checking minimum purchase, validity date) 
      // should be handled in the component or checkout flow.
      return couponData;
    } catch (err) {
      throw err;
    }
  }

}));
