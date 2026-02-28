import { apiInstance } from "../api/apiInstance"
import { userEndpoints } from "../api/userEndpoints"

export const handleGetAllSupplier = async ({ signal, per_page, page, search }) => {
  const response = await apiInstance.get(userEndpoints.supplier, {
    params: {
      per_page, 
      page,
      search
    },
  },
    { signal }
  );
  return response?.data;
}


export const handleAddSupplier = async ({ signal, body }) => {
  const response = await apiInstance.post(`${userEndpoints.supplier}`,body,
    { signal }
  );
  return response?.data;
}


export const handleDeleteSupplier = async ({ signal, id }) => {
  const response = await apiInstance.delete(`${userEndpoints.supplier}/${id}`,
    { signal }
  );
  return response?.data;
}