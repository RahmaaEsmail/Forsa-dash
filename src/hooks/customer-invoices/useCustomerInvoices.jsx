import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { handleGetAllCustomerInvoices } from '../../services/customer-invoices'

export default function useCustomerInvoices(params) {
  return useQuery({
    queryKey: ['customer-invoices'],
    queryFn: () => handleGetAllCustomerInvoices(params),
    staleTime: 5 * 60 * 1000
  })
}
