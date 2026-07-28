import { apiInstance } from "../api/apiInstance"
import { userEndpoints } from "../api/userEndpoints"

export const handleGetAllDeliveryNotes = async(params) => {
  const response = await apiInstance.get(userEndpoints.delivery_notes , {params});
  return response.data;
}

export const handleCreateDeliveryNotes = async({body}) => {
  const isFormData = body instanceof FormData;
  const response = await apiInstance.post(userEndpoints.delivery_notes , body, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
  });
  return response.data;
}

export const handleUpdateDeliveryNotes = async({id , body}) => {
  const isFormData = body instanceof FormData;
  const response = await apiInstance.post(`${userEndpoints.delivery_notes}/${id}` , body, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
  });
  return response.data;
}

export const handleUploadDeliveryNoteAttachment = async({id, body}) => {
  const response = await apiInstance.post(`${userEndpoints.delivery_notes}/${id}/attachments` , body, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
}

export const handleDeleteDeliveryNoteAttachment = async({id, documentId}) => {
  const response = await apiInstance.delete(`${userEndpoints.delivery_notes}/${id}/attachments/${documentId}`);
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
