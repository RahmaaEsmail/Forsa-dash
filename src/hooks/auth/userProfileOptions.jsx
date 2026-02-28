import { queryOptions } from '@tanstack/react-query'
import { QUERY_KEYS } from '../../constants'
import { handleGetCurrentUser } from '../../services/auth'

export default function userProfileOptions() {
  return queryOptions({
    queryKey: QUERY_KEYS?.user_profile_key,
    queryFn: ({signal}) =>handleGetCurrentUser({signal}),
    staleTime : 1000 * 60 * 5,
    retry: 2,
  })
}
