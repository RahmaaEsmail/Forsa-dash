import { queryOptions, useMutation } from '@tanstack/react-query'
import React from 'react'
import {  handleRefreshToken } from '../../services/auth'
import { QUERY_KEYS } from '../../constants'

export default function refreshTokenOptions() {
  return queryOptions({
    queryKey: QUERY_KEYS?.refresh_token_key,
    queryFn :handleRefreshToken,
    staleTime: 1000 * 60 * 5,
  })
}
