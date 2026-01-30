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