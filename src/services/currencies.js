import { apiInstance } from "../api/apiInstance"
import { userEndpoints } from "../api/userEndpoints"

export const handleGetAllCurrencies = async ({ signal, params }) => {
  const response = await apiInstance.get(userEndpoints.currencies, {
    signal,
    params
  });
  return response.data;
}
