import { useMutation, useQuery } from '@tanstack/react-query'
import { handleLogin } from '../../services/auth'

function useLogin() {
  const query = useMutation({
    mutationKey : ["login"],
    mutationFn : handleLogin,
  })
  return query;
}

export default useLogin