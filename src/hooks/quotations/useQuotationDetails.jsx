import { useQuery } from "@tanstack/react-query";
import { handleGetQuotationDetails } from "../../services/quotations";

export const useQuotationDetails = (id) => {
    return useQuery({
        queryKey: ["quotation", id],
        queryFn: ({ signal }) => handleGetQuotationDetails({ id, signal }),
        staleTime: 5 * 60 * 1000,
    });
}
