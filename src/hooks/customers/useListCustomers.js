import { useQuery } from "@tanstack/react-query";
import { handleGetAllCustomers } from "../../services/customers";

export const useListCustomers = (params) => {
    return useQuery({
        queryKey: ["customers", params],
        queryFn: ({ signal }) => handleGetAllCustomers({ ...params, signal }),
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false
    })
}
