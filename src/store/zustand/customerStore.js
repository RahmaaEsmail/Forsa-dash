import { create } from 'zustand';

export const useCustomerStore = create((set) => ({
  filters: {
    page: 1,
    per_page: 5,
    search: '',
  },
  setFilters: (newFilters) => 
    set((state) => ({ filters: { ...state.filters, ...newFilters } })),
}));
