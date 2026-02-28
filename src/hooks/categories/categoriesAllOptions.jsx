import { queryOptions } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../constants";
import { handleGetAllCategories } from "../../services/categories";

export default function categoriesAllOptions({ search = ""  } = {}) {
  return queryOptions({
    queryKey: [...QUERY_KEYS.categories_key, "all", { search }],
    queryFn: ({ signal }) =>
      handleGetAllCategories({
        signal,
        // خليك واضح: ابعت flag للباك اند انه يرجع الكل
        // أو لو الباك اند بيفهم per_page كبير:
        // page: 1,
        // per_page: 100000, // fallback لو مفيش endpoint "all"
        search,
        sort_order: "asc", // اختياري
      }),
    staleTime: 1000 * 60 * 10,
  });
}
