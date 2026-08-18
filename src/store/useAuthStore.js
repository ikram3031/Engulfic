import { create } from 'zustand';
import { useAppStore } from '../core/store/useAppStore';
import { setStoredMemberTokens, clearStoredMemberTokens } from '../lib/api';

// A bridge store to maintain compatibility with legacy components while using the new core/store state.
export const useAuthStore = create((set) => ({
  isLoggedIn: !!useAppStore.getState().user,
  user: useAppStore.getState().user,
  orders: [],

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
