import { apiInstance } from "../api/apiInstance";
import { userEndpoints } from "../api/userEndpoints";

export const handleGetAllStats = async({signal})=>{
  const response = await apiInstance.get(userEndpoints.home , {signal});
  return response.data;
}