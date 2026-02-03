import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { handleGetAllProducts } from '../../services/products'

function useGetProducts({ page, per_page, search, category_id, visibility }) {
  const query = useQuery({
    queryKey : ["products",{page,per_page,search,category_id ,visibility}],
    queryFn : ({signal}) => handleGetAllProducts({ page, per_page, search, category_id, visibility , signal }),
    staleTime: 5 * 60 * 1000,
  })
 return query;
}

export default useGetProducts