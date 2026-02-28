import { create } from "zustand";

// Create Zustand store for filters
export const useSupplierStore = create((set) => ({
  filters: {
    search: "",
    page: 1,
    per_page: 4,
    sort_order: "asc",
  },

  setFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters },
  })),
}));
