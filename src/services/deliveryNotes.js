import { apiInstance } from "../api/apiInstance"
import { userEndpoints } from "../api/userEndpoints"

export const handleGetAllDeliveryNotes = async(params) => {
  const response = await apiInstance.get(userEndpoints.delivery_notes , {params});
  return response.data;
}

export const handleCreateDeliveryNotes = async({body}) => {
  const response = await apiInstance.post(userEndpoints.delivery_notes , body);
  return response.data;
}

export const handleUpdateDeliveryNotes = async({id , body}) => {
  const response = await apiInstance.post(`${userEndpoints.delivery_notes}/${id}` , body);
  return response.data;
}

export const handleDeleteDeliveryNotes = async({id}) => {
  const response = await apiInstance.delete(`${userEndpoints.delivery_notes}/${id}`);
  return response.data;
}

export const handleChangeDeliveryStatus = async({id , status}) => {
  const response = await apiInstance.post(`${userEndpoints.delivery_notes}/${id}/${status}`);
  return response.data;
}
export const handleGetDeliveryNoteDetails = async({id}) => {
  const response = await apiInstance.get(`${userEndpoints.delivery_notes}/${id}`);
  return response.data;
}
