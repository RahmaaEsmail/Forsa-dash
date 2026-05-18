import { useQuery } from "@tanstack/react-query";
import { handleGetAllDeliveryTypes } from "../../services/deliveryTypes";

export const useListDeliveryTypes = (params) => {
    return useQuery({
        queryKey: ["delivery-types", params],
        queryFn: ({ signal }) => handleGetAllDeliveryTypes({ ...params, signal }),
        staleTime: 1000 * 60 * 60, // Delivery types rarely change
    })
}
