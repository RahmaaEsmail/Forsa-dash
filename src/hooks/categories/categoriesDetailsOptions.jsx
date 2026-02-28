import { queryOptions } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../constants";
import { handleGetAllCategories, handleGetCategoryDetails } from "../../services/categories";

export default function categoriesDetailsOptions({ id = "" } = {}) {
  return queryOptions({
    queryKey: ["categoriesDetails", String(id)],
    queryFn: ({ signal }) =>
     handleGetCategoryDetails({signal , id}),
    staleTime: 1000 * 60 * 10,
  });
}
