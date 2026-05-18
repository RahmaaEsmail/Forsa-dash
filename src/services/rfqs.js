import { apiInstance } from "../api/apiInstance"
import { userEndpoints } from "../api/userEndpoints"

export const handleGetRFQs = async ({ signal, params }) => {
  const response = await apiInstance.get(userEndpoints.rfqs, {
    signal,
    params
  });
  return response.data;
}

export const handleGetRFQDetails = async ({ signal, id }) => {
  const response = await apiInstance.get(`${userEndpoints.rfqs}/${id}`, {
    signal
  });
  return response.data;
}

export const handleCreateRFQ = async ({ signal, prId, body }) => {
  const response = await apiInstance.post(`${userEndpoints.get_purchase_request}/${prId}/create-rfq`, body, {
    signal
  });
  return response.data;
}

export const handleUpdateRFQ = async ({ signal, id, body }) => {
  const response = await apiInstance.post(`${userEndpoints.rfqs}/${id}`, body, {
    signal
  });
  return response.data;
}

export const handleDeleteRFQ = async ({ signal, id }) => {
  const response = await apiInstance.delete(`${userEndpoints.rfqs}/${id}`, {
    signal
  });
  return response.data;
}

export const handleChangeRFQStatus = async ({ signal, id, status, body }) => {
  const response = await apiInstance.post(`${userEndpoints.rfqs}/${id}/${status}`, body, {
    signal
  });
  return response.data;
}
