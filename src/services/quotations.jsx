import { apiInstance } from "../api/apiInstance"
import { userEndpoints } from "../api/userEndpoints"

export const handleGetAllQuotations = async(params = {}) => {
  const response = await apiInstance.get(userEndpoints.quotations_list , {params});
  return response.data;
}

export const handleCreateQuotation = async(body) => {
  const response = await apiInstance.post(userEndpoints.quotations_list , body);
  return response.data;
}

export const handleGetQuotationDetails = async ({ id, signal }) => {
  const response = await apiInstance.get(`${userEndpoints.quotations_list}/${id}`, { signal });
  return response.data;
}

export const handleUpdateQuotation = async ({ id, body }) => {
  const response = await apiInstance.post(`${userEndpoints.quotations_list}/${id}`, body);
  return response.data;
}

export const handleUpdateQuotationStatus = async ({ id, status, body = {} }) => {
  // Map our simplified status names to the specific endpoints provided
  let endpoint = `${userEndpoints.quotations_list}/${id}/`;
  
  switch (status) {
    case 'client-approve':
      endpoint += 'client-approve';
      break;
    case 'manager-approve':
      endpoint += 'manager-approve';
      break;
    case 'proforma':
      endpoint += 'proforma';
      break;
    case 'payment-received':
      endpoint += 'payment-received';
      break;
    case 'deliver':
      endpoint += 'deliver';
      break;
    case 'cancel':
      endpoint += 'cancel';
      break;
    default:
      throw new Error(`Unsupported status update: ${status}`);
  }

  const response = await apiInstance.post(endpoint, body);
  return response.data;
}

export const handleDeleteQuotation = async (id) => {
  const response = await apiInstance.delete(`${userEndpoints.quotations_list}/${id}`);
  return response.data;
}

export const handleUpdateQuotationPrices = async ({ id, body }) => {
  const response = await apiInstance.patch(`${userEndpoints.quotations_list}/${id}/prices`, body);
  return response.data;
}

// export const handleCreate = async(params) => {
//   const response = await apiInstance.get(userEndpoints.quotations_list , {params});
//   return response.data;
// }