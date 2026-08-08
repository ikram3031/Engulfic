import { create } from 'zustand';

export const useThemeStore = create((set, get) => ({
  theme: 'light', // Default view will be light as requested

  initTheme: () => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('engulfic-theme') || 'light';
      set({ theme: savedTheme });
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  },

  toggleTheme: () => {
    const current = get().theme;
    const next = current === 'light' ? 'dark' : 'light';
    set({ theme: next });
    if (typeof window !== 'undefined') {
      localStorage.setItem('engulfic-theme', next);
      if (next === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  },
}));
