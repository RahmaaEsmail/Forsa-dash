import { apiInstance } from "../api/apiInstance";
import { userEndpoints } from "../api/userEndpoints";

export const handleGetAllCustomers = async ({
  page,
  per_page,
  search,
  signal
} = {}) => {
  const response = await apiInstance.get(userEndpoints.customers, {
    params: {
      page,
      per_page,
      search,
    },
    signal
  });
  return response.data;
};

export const handleGetCustomerDetails = async ({ id, signal }) => {
  const response = await apiInstance.get(`${userEndpoints.customers}/${id}`, {
    signal
  });
  return response?.data;
};

export const handleAddCustomer = async ({ body, signal }) => {
  const response = await apiInstance.post(userEndpoints.customers, body, {
    signal
  });
  return response?.data;
};

export const handleUpdateCustomer = async ({ id, body, signal }) => {
  const response = await apiInstance.post(`${userEndpoints.customers}/${id}`, body, {
    signal
  });
  return response?.data;
};

export const handleDeleteCustomer = async ({ id, signal }) => {
  const response = await apiInstance.delete(`${userEndpoints.customers}/${id}`, {
    signal
  });
  return response?.data;
};

export const handleChangeCustomerStatus = async ({ id, signal }) => {
  const response = await apiInstance.put(`${userEndpoints.customers}/${id}/toggle-active`, {}, {
    signal
  });
  return response?.data;
};
