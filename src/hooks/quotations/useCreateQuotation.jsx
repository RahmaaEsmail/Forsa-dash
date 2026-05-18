import { useMutation, useQueryClient } from "@tanstack/react-query"
import { handleCreateQuotation } from "../../services/quotations"
import { toast } from "sonner"

export const useCreateQuotation = () => {
    const queryClient = useQueryClient()
    
    return useMutation({
        mutationFn: (body) => handleCreateQuotation(body),
        onSuccess: (data) => {
            toast.success(data?.message || "Quotation created successfully")
            queryClient.invalidateQueries({ queryKey: ["quotations"] })
        },
        onError: (error) => {
            toast.error(error?.response?.data?.error?.message || "Failed to create quotation")
        }
    })
}
