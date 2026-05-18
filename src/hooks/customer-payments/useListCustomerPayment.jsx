import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { handleGetAllCustomerPayments } from '../../services/customer-payments'

export default function useListCustomerPayment() {
  return useQuery({
    queryKey : ["customer-payments"],
    queryFn : ({signal}) => handleGetAllCustomerPayments({signal}),
    staleTime : 5 * 60 * 1000,
  })
}


