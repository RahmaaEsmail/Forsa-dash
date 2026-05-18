import { queryOptions } from '@tanstack/react-query'
import React from 'react'
import { handleGetAllPurchaseRequest } from '../../services/purchase-request'
import { QUERY_KEYS } from '../../constants'

export default function purchaseRequestOptions(params) {
  return (
     queryOptions({
       queryKey: [...QUERY_KEYS.purchase_key, params],
       queryFn : ({signal}) => handleGetAllPurchaseRequest({signal, params}),
       staleTime : 1000 * 60 * 3,
       refetchOnWindowFocus : false,
       retry : 3,
     })
  )
}
