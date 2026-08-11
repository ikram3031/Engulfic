import { create } from 'zustand';
import { useAppStore } from '../core/store/useAppStore';
import { setStoredMemberTokens, clearStoredMemberTokens } from '../core/lib/api';

// A bridge store to maintain compatibility with legacy components while using the new core/store state.
export const useAuthStore = create((set) => ({
  isLoggedIn: !!useAppStore.getState().user,
  user: useAppStore.getState().user,
  orders: [
    {
      id: 'ENG-89421',
      date: '2026-07-22',
      status: 'Delivered',
      statusColor: 'emerald',
      total: 340.00,
      items: [
        { id: '1', name: 'OVERSIZED HEAVYWEIGHT HOODIE', color: 'Midnight Black', size: 'L', price: 180.00, quantity: 1, image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80' },
        { id: '2', name: 'ARCHIVAL UTILITY CARGO PANTS', color: 'Olive Green', size: 'M', price: 160.00, quantity: 1, image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=600&q=80' }
      ],
      shippingAddress: 'House 42, Road 11, Block D, Banani, Dhaka, Bangladesh',
      paymentMethod: 'Credit Card (**** 4242)',
      trackingNumber: 'TRK-902184912'
    }
  ],

  // Logs in the member, sets tokens, and updates the global user session
  login: (userData, tokens) => {
    if (tokens) {
      setStoredMemberTokens(tokens.accessToken, tokens.refreshToken);
    }
    useAppStore.getState().setUser(userData);
  },

  // Logs out the member, clears local tokens, and resets the user session
  logout: () => {
    clearStoredMemberTokens();
    useAppStore.getState().setUser(null);
  },

  // Updates the member profile state
  updateProfile: (updatedData) => {
    const currentUser = useAppStore.getState().user;
    useAppStore.getState().setUser({
      ...currentUser,
      ...updatedData
    });
  }
}));

// Subscribe to useAppStore changes to automatically update useAuthStore state dynamically
useAppStore.subscribe((state) => {
  useAuthStore.setState({
    user: state.user,
    isLoggedIn: !!state.user
  });
});
