import { queryOptions } from '@tanstack/react-query'
import { QUERY_KEYS } from '../../constants'
import { handleGetCurrentUser } from '../../services/auth'

export default function userProfileOptions() {
  return queryOptions({
    queryKey: QUERY_KEYS?.user_profile_key,
    queryFn: ({signal}) => handleGetCurrentUser({signal}),
    staleTime: 1000 * 60 * 4, // 4 minutes
    refetchInterval: 1000 * 60 * 5, // 5 minutes
    refetchIntervalInBackground: true,
    retry: 0, // Do NOT retry on 401 — the apiInstance interceptor already handles it;
               // retrying would just fire multiple logout redirects.
  })
}

