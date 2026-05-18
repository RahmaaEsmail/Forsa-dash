import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { handleGetCustomerInvoiceDetails } from '../../services/customer-invoices'

export default function useCustomerInvoiceDetails(id) {
  return useQuery({
    queryKey: ['customer-invoice-details', id],
    queryFn: ({ signal }) => handleGetCustomerInvoiceDetails({ id, signal }),
    enabled: !!id,
    staleTime: 5 * 60 * 1000
  })
}
