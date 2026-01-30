import { create } from "zustand";

export const useProductStore = create((set) => ({
  all_products : [],
  add_product : (product) => (
    set((state) => {
      const new_products = [...state.all_products , product]
      return {all_products : new_products}
    })
  )
}))