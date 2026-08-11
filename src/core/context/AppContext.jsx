import React, { createContext, useContext, useEffect } from "react";
import { useAppStore } from "../store/useAppStore";

// Create AppContext
const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const fetchCategories = useAppStore((state) => state.fetchCategories);
  const categories = useAppStore((state) => state.categories);

  useEffect(() => {
    // Bootstrap initial application metadata (Categories) at boot
    const state = useAppStore.getState();
    if (!state.categories || state.categories.length === 0) {
      fetchCategories({ skip: 0, limit: 100 });
    }
  }, [fetchCategories]);

  return (
    <AppContext.Provider value={{ categories }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
