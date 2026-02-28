import { useQuery } from "@tanstack/react-query";
import { handleGetCustomerDetails } from "../../services/customers";

export default function useGetCustomerDetails({ id }) {
  return useQuery({
    queryKey: ["customer", id],
    queryFn: ({ signal }) => handleGetCustomerDetails({ id, signal }),
    enabled: !!id,
    keepPreviousData: false,
  });
}
