// Bulletproof LocalStorage wrapper that never throws, handles private browsing, quota limits, and corrupted JSON
export const safeStorage = {
  getItem: (key, fallback = null) => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return fallback;
      const item = window.localStorage.getItem(key);
      return item !== null ? item : fallback;
    } catch (e) {
      return fallback;
    }
  },

  getJSON: (key, fallback = null) => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return fallback;
      const item = window.localStorage.getItem(key);
      if (!item || item === 'undefined' || item === 'null' || item === '[object Object]') {
        return fallback;
      }
      return JSON.parse(item);
    } catch (e) {
      try {
        window.localStorage.removeItem(key);
      } catch (_) {}
      return fallback;
    }
  },

  setItem: (key, value) => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return false;
      if (value === undefined) {
        window.localStorage.removeItem(key);
        return true;
      }
      const strVal = typeof value === 'string' ? value : JSON.stringify(value);
      window.localStorage.setItem(key, strVal);
      return true;
    } catch (e) {
      return false;
    }
  },

  removeItem: (key) => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return false;
      window.localStorage.removeItem(key);
      return true;
    } catch (e) {
      return false;
    }
  }
};

export default safeStorage;
