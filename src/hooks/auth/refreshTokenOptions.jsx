import { queryOptions, useMutation } from '@tanstack/react-query'
import React from 'react'
import { handleRefreshToekn } from '../../services/auth'
import { QUERY_KEYS } from '../../constants'

export default function refreshTokenOptions() {
  return queryOptions({
    queryKey: QUERY_KEYS?.refresh_token_key,
    queryFn :handleRefreshToekn,
    staleTime: 1000 * 60 * 1,
  })
}
