import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleCreateDeliveryType, handleUpdateDeliveryType, handleDeleteDeliveryType } from "../../services/deliveryTypes";
import { toast } from "sonner";

export const useCreateDeliveryType = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: handleCreateDeliveryType,
        onSuccess: () => {
            queryClient.invalidateQueries(["delivery-types"]);
            toast.success("Delivery type created successfully");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to create delivery type");
        }
    });
};

export const useUpdateDeliveryType = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: handleUpdateDeliveryType,
        onSuccess: () => {
            queryClient.invalidateQueries(["delivery-types"]);
            toast.success("Delivery type updated successfully");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to update delivery type");
        }
    });
};

export const useDeleteDeliveryType = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: handleDeleteDeliveryType,
        onSuccess: () => {
            queryClient.invalidateQueries(["delivery-types"]);
            toast.success("Delivery type deleted successfully");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to delete delivery type");
        }
    });
};
