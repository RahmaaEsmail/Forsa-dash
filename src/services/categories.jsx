import { apiInstance } from "../api/apiInstance"
import { userEndpoints } from "../api/userEndpoints"

export const handleGetAllCategories = async ({ signal,parent_id, page, per_page, search, sort_order }) => {
  const response = await apiInstance.get(`${userEndpoints.categories}`, {
    params: {
      page,
      per_page,
      search,
      sort_order,
      parent_id
    },
  },
    { signal }
  )
  return response.data;
}

export const handleGetCategoryDetails = async ({ signal, id }) => {
  const response = await apiInstance.get(`${userEndpoints.categories}/${id}`,
    { signal }
  )
  return response.data;
}


export const handleAddCategory = async ({ signal, body }) => {
  const response = await apiInstance.post(`${userEndpoints.categories}`, body, { signal });
  return response.data
}

export const handleEditCategory = async ({ signal, id, body }) => {
  const response = await apiInstance.post(`${userEndpoints.categories}/${id}`,body, { signal });
  return response.data
}


export const handleDeleteCategory = async ({ signal, id }) => {
  const response = await apiInstance.delete(`${userEndpoints.categories}/${id}`, { signal });
  return response.data
}


export const handleToggleCategory = async ({ signal, id }) => {
  const response = await apiInstance.post(`${userEndpoints.categories}/${id}/toggle-active`, { signal });
  return response.data
}