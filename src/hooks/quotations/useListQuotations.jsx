import { useQuery } from "@tanstack/react-query"
import { handleGetAllQuotations } from "../../services/quotations"

export const useListQuotations = (params) => {
    return useQuery({
        queryKey: ["quotations", params],
        queryFn: () => handleGetAllQuotations(params),
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false
    })
}