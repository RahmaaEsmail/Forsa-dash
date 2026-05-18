import { apiInstance } from "../api/apiInstance"
import { userEndpoints } from "../api/userEndpoints"

export const handleGetAllCustomerPayments = async ({signal}) => {
  const response = await apiInstance.get(userEndpoints.list_customer_payment , {signal});
  return response.data
}


export const handleGetCustomerPaymentDetails = async ({signal , id}) => {
  const response = await apiInstance.get(`${userEndpoints.list_customer_payment}/${id}` , {signal});
  return response.data
}

export const handleCreateCustomerPayment = async ({signal , body}) => {
  const response = await apiInstance.post(`${userEndpoints.list_customer_payment}` ,body, {signal});
  return response.data
}

export const handleUpdateCustomerPayment = async ({signal , body , id}) => {
  const response = await apiInstance.post(`${userEndpoints.list_customer_payment}/${id}` ,body, {signal});
  return response.data
}

export const handledeleteCustomerPayment = async ({signal , body , id}) => {
  const response = await apiInstance.delete(`${userEndpoints.list_customer_payment}/${id}`, {signal});
  return response.data
}

export const handleConfirmCustomerPayment = async ({signal  , id}) => {
  const response = await apiInstance.post(`${userEndpoints.list_customer_payment}/${id}/confirm`, {signal});
  return response.data
}

export const handleFailCustomerPayment = async ({signal  , id}) => {
  const response = await apiInstance.post(`${userEndpoints.list_customer_payment}/${id}/fail`, {signal});
  return response.data
}

export const handleRefundCustomerPayment = async ({signal  , id}) => {
  const response = await apiInstance.post(`${userEndpoints.list_customer_payment}/${id}/refund`, {signal});
  return response.data
}