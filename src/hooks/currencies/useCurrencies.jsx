import { useQuery } from '@tanstack/react-query'
import { handleGetAllCurrencies } from '../../services/currencies'

export default function useCurrencies({ params } = {}) {
  return useQuery({
    queryKey: ['currencies', params],
    queryFn: ({ signal }) => handleGetAllCurrencies({ signal, params }),
    staleTime: 5 * 60 * 1000,
  })
}
