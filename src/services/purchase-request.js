import { apiInstance } from "../api/apiInstance"
import { userEndpoints } from "../api/userEndpoints"

export const handleGetAllPurchaseRequest = async ({signal}) => {
  const response = await apiInstance.get(`${userEndpoints.get_purchase_request}` , {
    signal
  });
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
