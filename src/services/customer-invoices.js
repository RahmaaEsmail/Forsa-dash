import { apiInstance } from "../api/apiInstance"
import { userEndpoints } from "../api/userEndpoints"

export const handleGetAllCustomerInvoices = async(params = {}) =>{ 
  const response = await apiInstance.get(userEndpoints.get_customer_invoices , {params});
  return response.data;
}

export const handleCreateCustomerInvoice = async({ quotationId, body }) => {
  const response = await apiInstance.post(`/quotations/${quotationId}/customer-invoices`, body);
  return response.data;
}

export const handleGetCustomerInvoiceDetails = async ({ id, signal }) => {
  const response = await apiInstance.get(`${userEndpoints.get_customer_invoices}/${id}`, { signal });
  return response.data;
}

export const handleUpdateCustomerInvoice = async ({ id, body, signal }) => {
  const response = await apiInstance.post(`${userEndpoints.get_customer_invoices}/${id}`, body, { signal });
  return response.data;
}

export const handleDeleteCustomerInvoice = async ({ id, signal }) => {
  const response = await apiInstance.delete(`${userEndpoints.get_customer_invoices}/${id}`, { signal });
  return response.data;
}

export const handleApproveCustomerInvoice = async ({ id, signal }) => {
  const response = await apiInstance.post(`${userEndpoints.get_customer_invoices}/${id}/approve`, {}, { signal });
  return response.data;
}

export const handleMarkPaidCustomerInvoice = async ({ id, body, signal }) => {
  const response = await apiInstance.post(`${userEndpoints.get_customer_invoices}/${id}/mark-paid`, body, {
    signal,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
}

export const handleCancelCustomerInvoice = async ({ id, body = {}, signal }) => {
  const response = await apiInstance.post(`${userEndpoints.get_customer_invoices}/${id}/cancel`, body, { signal });
  return response.data;
}

