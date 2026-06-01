import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { handleGetAllStats } from '../../services/home-stats'

export default function useListHome() {
  return useQuery({
    queryFn : ({signal}) => handleGetAllStats({signal}),
    queryKey : ['home-stats'],
    staleTime : 1000 * 5 * 60
  })
}
