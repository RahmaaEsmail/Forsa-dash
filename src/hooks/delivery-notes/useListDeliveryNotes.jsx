import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { handleGetAllDeliveryNotes } from '../../services/deliveryNotes'

export default function useListDeliveryNotes(params) {
  return useQuery({
    queryKey : ["delivery-notes", params],
    queryFn : () => handleGetAllDeliveryNotes(params),
    staleTime : 60 * 5 * 1000,
  })
}
