import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { handleToggleCategory } from '../../services/categories';
import { toast } from 'sonner';
import { QUERY_KEYS } from '../../constants';
import { useCategoriesStore } from '../../store/zustand/categoriesStore';
import { useUnitStore } from '../../store/zustand/unitsStore';
import { handleToggleUnit } from '../../services/units';

export default function useChangeUnitStatus() {
  const queryClient = useQueryClient();
  const { filters } = useUnitStore();
  const { search, page, sort_order } = filters;
  return useMutation({
    mutationKey: ["changeUnitStatus"],
    mutationFn: ({ signal, id }) => handleToggleUnit({ signal, id }),
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
