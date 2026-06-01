import { apiInstance } from "../api/apiInstance"
import { userEndpoints } from "../api/userEndpoints"

export const handleGetAllPurchaseRequest = async ({signal , params}) => {
  const response = await apiInstance.get(`${userEndpoints.get_purchase_request}`, {params , signal});
  return response.data;
}

export const handleGetPurchaseRequestDetails = async ({signal , id}) => {
  const response = await apiInstance.get(`${userEndpoints.get_purchase_request}/${id}` , {
    signal
  });
  return response.data;
}

export const handleDeletePurchaseRequest = async ({signal , id}) => {
  const response = await apiInstance.delete(`${userEndpoints.get_purchase_request}/${id}` , {
    signal
  });
  return response.data;
}

export const handleChangePurchaseRequestStatus = async ({signal , id , status , body}) => {
  const response = await apiInstance.post(`${userEndpoints.get_purchase_request}/${id}/${status}`, body , {
    signal
  });
  return response.data;
}

export const handleAddPurchaseRequest = async ({ body, signal }) => {
  const response = await apiInstance.post(userEndpoints.get_purchase_request, body, {
    signal
  });
  return response.data;
}

export const handleUpdatePurchaseRequest = async ({ id, body, signal }) => {
  const response = await apiInstance.post(`${userEndpoints.get_purchase_request}/${id}`, body, {
    signal
  });
  return response.data;
}

export const handleCreateRFQ = async ({ id, body, signal }) => {
  const response = await apiInstance.post(`${userEndpoints.get_purchase_request}/${id}/create-rfq`, body, {
    signal
  });
  return response.data;
}

export const handleGetAllPaymentTerms = async ({ signal, params }) => {
  const response = await apiInstance.get(`${userEndpoints.payment_terms}`, {
    signal,
    params
  });
  return response.data;
}
