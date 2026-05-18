import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { handleGetAllPaymentTerms } from '../../services/purchase-request'

export default function useListPaymentTerms({params} = {}) {
  return useQuery({
    queryKey :['payment-terms', params],
    queryFn : ({signal}) => handleGetAllPaymentTerms({signal , params}),
    staleTime : 5 * 60 * 1000,
  })
}
