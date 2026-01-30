import { useMutation } from '@tanstack/react-query'
import React from 'react'
import { handleAddProduct } from '../../services/products'

function useAddProduct() {
  return useMutation({
    mutationKey : ["addProduct"],
    mutationFn : ({body,signal}) => handleAddProduct({body,signal}) 
  })
}

export default useAddProduct