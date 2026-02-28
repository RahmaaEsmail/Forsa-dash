import { queryOptions } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../constants";
import { handleGetAllCategories } from "../../services/categories";

export default function subCategoriesOptions({  parent_id = null } = {}) {
  return queryOptions({
    queryKey: [...QUERY_KEYS.categories_key, "subcategory", {  parent_id }],
    queryFn: ({ signal }) =>
      handleGetAllCategories({
        signal,
        parent_id
      }),
  });
}
