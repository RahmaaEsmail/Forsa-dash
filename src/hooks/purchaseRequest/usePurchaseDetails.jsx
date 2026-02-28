import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { handleGetPurchaseRequestDetails } from '../../services/purchase-request';

export default function usePurchaseDetails() {
  return useMutation({
    mutationKey : ["purchase_details"],
    mutationFn : ({signal, id}) => handleGetPurchaseRequestDetails({signal , id}),
  })
}
