import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner';
import { QUERY_KEYS } from '../../constants';
import { useUnitStore } from '../../store/zustand/unitsStore';
import { handleAddUnit } from '../../services/units';

export default function useCreateUnit() {
  const queryClient = useQueryClient();
  const { filters } = useUnitStore();
  const { search, page, sort_order } = filters;


  return useMutation({
    mutationKey: ["createUnit"],
    mutationFn: ({ signal, body }) => handleAddUnit({ signal, body }),
    onSuccess: (data) => {
      if (data?.success) {
        toast.success(data?.meta?.message);
        queryClient.invalidateQueries({
          queryKey: [...QUERY_KEYS.units_key, { search, sort_order, page, per_page: 4 }],
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
