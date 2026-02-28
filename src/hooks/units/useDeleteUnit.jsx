import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner';
import { QUERY_KEYS } from '../../constants';
import { useUnitStore } from '../../store/zustand/unitsStore';
import { handleDeleteUnit } from '../../services/units';

export default function useDeleteUnit() {
  const queryClient = useQueryClient();
  const { filters } = useUnitStore();
  const { search, page, sort_order } = filters;
  return useMutation({
    mutationKey: ["deleteUnit"],
    mutationFn: ({ signal, id }) => handleDeleteUnit({ signal, id }),
    onSuccess: (data) => {
      if (data?.success) {
        toast.success(data?.meta?.message);
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.units_key, { page, search, sort_order }],
          exact: true,
        })
      }
    },
    onError: (error) => {
      console.log("error", error)
      if (!error?.response?.data?.success) {
        toast.error(error?.response?.data?.error?.message);
      }
    }
  })

}
