import { apiInstance } from "../api/apiInstance";
import { userEndpoints } from "../api/userEndpoints";

export async function handleGetAllSettings({signal}) {
  try{
    const response = await apiInstance.get(userEndpoints.list_settings , {signal});
    return response.data;
  }catch (error){
    console.error("Error fetching settings:", error);
    throw error;
  }
}

export const handleUpdateSettings = async({signal , body}) => {
  const isFormData = body instanceof FormData;
  const response = await apiInstance.post(userEndpoints.list_settings  , body , {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    signal,
  });
  return response.data;
}