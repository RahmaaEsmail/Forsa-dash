import { apiInstance } from "../api/apiInstance"
import { userEndpoints } from "../api/userEndpoints"

export const handleGetAllGRNS = async({params}) => {
  const response = await apiInstance.get(userEndpoints.grns ,{params});
  return response.data;
}

export const handleCreateGRNS = async({body}) => {
  const isFormData = body instanceof FormData;
  const response = await apiInstance.post(userEndpoints.grns , body, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
  });
  return response.data;
}

export const handleUpdateGRNS = async({body , id}) => {
  const isFormData = body instanceof FormData;
  const response = await apiInstance.post(`${userEndpoints.grns}/${id}` , body, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
  });
  return response.data;
}

export const handleGetGRNDetails = async({id}) => {
  const response = await apiInstance.get(`${userEndpoints.grns}/${id}`);
  return response.data;
}

export const handleApproveGRN = async({id}) => {
  const response = await apiInstance.post(`${userEndpoints.grns}/${id}/approve`);
  return response.data;
}

export const handleRejectGRN = async({id, reason}) => {
  const response = await apiInstance.post(`${userEndpoints.grns}/${id}/reject`, { reason });
  return response.data;
}

export const handleDeleteGRNS = async({id}) => {
  const response = await apiInstance.delete(`${userEndpoints.grns}/${id}`);
  return response.data;
}


