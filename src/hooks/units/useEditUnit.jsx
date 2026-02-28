import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner';
import { QUERY_KEYS } from '../../constants';
import { useUnitStore } from '../../store/zustand/unitsStore';
import { handleEditUnit } from '../../services/units';
import { useNavigate } from 'react-router-dom';

export default function useEditUnit() {
  const queryClient = useQueryClient();
  const { filters } = useUnitStore();
  const { search, page, sort_order } = filters;
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ["editUnit"],
    mutationFn: ({ signal, id, body }) => handleEditUnit({ signal, id, body }),
    onSuccess: (data) => {
      if (data?.success) {
        toast.success(data?.meta?.message);
        navigate("/units")
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
