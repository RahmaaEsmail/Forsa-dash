import { queryOptions } from '@tanstack/react-query'
import React from 'react'
import { QUERY_KEYS } from '../../constants'
import { handleGetAllUnits } from '../../services/units'
import { useUnitStore } from '../../store/zustand/unitsStore'

export default function getAllUnitsOptions() {
  const {filters} = useUnitStore();
  const {page  , sort_order , search} = filters;
  return queryOptions({
    queryKey: [QUERY_KEYS.units_key, { page, search, sort_order }],
    queryFn: ({ signal }) => handleGetAllUnits({ signal, page, search, sort_order }),
    staleTime : 1000 * 60 * 5,
     keepPreviousData: true,
  })
}
