import { queryOptions } from "@tanstack/react-query";
import { handleGetUnitDetails } from "../../services/units";

export default function unitsDetailsOptions({ id = "" } = {}) {
  return queryOptions({
    queryKey: ["unitsDetails", String(id)],
    queryFn: ({ signal }) =>
     handleGetUnitDetails({signal , id}),
    staleTime: 1000 * 60 * 10,
  });
}
