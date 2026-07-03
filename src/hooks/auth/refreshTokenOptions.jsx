import { queryOptions } from '@tanstack/react-query'
import { handleRefreshToken } from '../../services/auth'
import { QUERY_KEYS } from '../../constants'

export default function refreshTokenOptions() {
  return queryOptions({
    queryKey: QUERY_KEYS?.refresh_token_key,
    queryFn: handleRefreshToken,
    staleTime: 1000 * 60 * 4, // 4 minutes
    refetchInterval: 1000 * 60 * 5, // 5 minutes
    refetchIntervalInBackground: true,
  })
}
