import { useQuery } from '@tanstack/react-query'
import { handleGetCustomerPaymentDetails } from '../../services/customer-payments'

export default function useListCustomerPaymentDetails({id}) {
  return useQuery({
    queryKey : ["customer-payments-details"],
    queryFn : ({signal}) => handleGetCustomerPaymentDetails({signal , id}),
    staleTime : 5 * 60 * 1000,
  })
}


