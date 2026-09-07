import { create } from 'zustand';

// Theme state store with persistent local storage sync and document class toggling
export const useThemeStore = create((set, get) => ({
  theme: 'dark',

  initTheme: () => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('engulfic-theme') || 'dark';
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
    const next = current === 'dark' ? 'light' : 'dark';
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
