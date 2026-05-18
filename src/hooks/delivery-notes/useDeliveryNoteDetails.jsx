import { useQuery } from "@tanstack/react-query";
import { handleGetDeliveryNoteDetails } from "../../services/deliveryNotes";

export default function useDeliveryNoteDetails(id) {
  return useQuery({
    queryKey: ["delivery-note", id],
    queryFn: () => handleGetDeliveryNoteDetails({ id }),
    enabled: !!id,
  });
}
