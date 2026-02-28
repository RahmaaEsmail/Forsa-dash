import { create } from "zustand";

export const useUnitStore = create((set) => ({
   filters: {
    search: "",
    page: 1,
    per_page: 4,
    sort_order: "asc",
    is_active : false
  },

   setFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters },
  })),
}))