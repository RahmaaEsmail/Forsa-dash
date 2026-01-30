import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useCurrencyFlags = () => {
  async function handleGetAllCurrencyWithFlags() {
   const response = await  axios.get("https://restcountries.com/v3.1/all?fields=name,idd,currencies,flags")
    return response;
  }

  return useQuery({
    queryKey : ["currencies"],
    queryFn : handleGetAllCurrencyWithFlags,
    staleTime : 10 * 60 * 1000,
  })
}