import { handleGetAllCustomers } from "../../services/customers";

export default function getCustomerOptions(query = {}) {
  const { page, per_page, search } = query;
  return {
    queryKey: ["customers", { page, per_page, search }],
    queryFn: ({ signal }) => handleGetAllCustomers({ page, per_page, search, signal }),
    keepPreviousData: true,
  };
}
