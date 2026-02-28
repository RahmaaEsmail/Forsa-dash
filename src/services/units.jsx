import { apiInstance } from "../api/apiInstance"
import { userEndpoints } from "../api/userEndpoints"

export const handleGetAllUnits = async ({ signal, per_page = 4, is_active , sort_order,page, search } = {}) => {
  const response = await apiInstance.get(userEndpoints?.units, {
    params: {
      per_page , page,
      search,
      is_active,
      sort_order
    },
  },
    { signal }
  );
  return response?.data;
}


export const handleGetUnitDetails = async ({ signal, id }) => {
  const response = await apiInstance.get(`${userEndpoints.units}/${id}`,
    { signal }
  )
  return response.data;
}

export const handleAddUnit = async({signal , body}) => {
  const response  = await apiInstance.post(userEndpoints.units , body ,{
    signal
  });
  return response.data;
}


export const handleEditUnit = async({signal , body , id}) => {
  const response  = await apiInstance.post(`${userEndpoints.units}/${id}` , body ,{
    signal
  });
  return response.data;
}



export const handleDeleteUnit = async({signal , id}) => {
  const response  = await apiInstance.delete(`${userEndpoints.units}/${id}` ,{
    signal
  });
  return response.data;
}


export const handleToggleUnit = async({signal , id}) => {
  const response  = await apiInstance.post(`${userEndpoints.units}/${id}/toggle-active` ,{
    signal
  });
  return response.data;
}

