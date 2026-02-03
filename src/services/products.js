import { userEndpoints } from "../api/userEndpoints"
import { apiInstance } from "../api/apiInstance";

export const handleGetAllProducts = async ({
  page,
  per_page,
  search,
  category_id,
  visibility,
  signal
} = {}) => {
  const response = await apiInstance.get(userEndpoints.get_products, {
    params: {
      page,
      per_page,
      search,
      category_id,
      visibility,
    },
    signal
  });

  return response.data;
};


export const handleAddProduct =  async({body , signal}) => {
  const response = await apiInstance.post(userEndpoints.add_product , body , {
    headers : {
      "Content-Type" :"multipart/form-data"
    },
    signal
  })
  return response?.data;
}

export const handleDeleteProduct = async({id , signal}) => {
  const response = await apiInstance.delete(`${userEndpoints.get_products}/${id}` , {
    signal
  })
  return response?.data;
}

export const handleProductStatus = async({signal}) => {
  const response = await apiInstance.post(`${userEndpoints.active_status}` , {
    signal
  })
  return response?.data;
}

export const handleUpdateProduct = async({id,signal}) => {
  const response = await apiInstance.post(`${userEndpoints.get_products}/${id}` , {
    signal
  })
  return response?.data;
}

export const handleProductDetails = async({id,signal}) => {
  const response = await apiInstance.get(`${userEndpoints.get_products}/${id}` , {
    signal
  })
  return response?.data;
}