import { queryOptions } from '@tanstack/react-query'
import React from 'react'
import { QUERY_KEYS } from '../../constants'
import { handleGetAllSupplier } from '../../services/suppliers'

export default function getAllSupplierOptions() {
  return queryOptions({
    queryKey:[QUERY_KEYS.suppliers_key],
    queryFn : ({signal}) =>  handleGetAllSupplier({signal}),
    staleTime : 1000 * 60 * 5
  })
}
