import { apiInstance } from "../api/apiInstance"
import { userEndpoints } from "../api/userEndpoints"

export const handleGetAllDeliveryTypes = async(params = {}) => {
  const response = await apiInstance.get(userEndpoints.deliver_types , {params});
  return response.data;
}

export const handleCreateDeliveryType = async(body) => {
  const response = await apiInstance.post(userEndpoints.deliver_types , body);
  return response.data;
}

export const handleUpdateDeliveryType = async({id, body}) => {
  const response = await apiInstance.post(`${userEndpoints.deliver_types}/${id}` , body);
  return response.data;
}

export const handleDeleteDeliveryType = async(id) => {
  const response = await apiInstance.delete(`${userEndpoints.deliver_types}/${id}`);
  return response.data;
}
