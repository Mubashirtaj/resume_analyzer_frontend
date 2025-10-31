import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchData = async (url: string) => {
  const res = await axios.get(url);
  return res.data;
};

export function useFetchData(url: string) {
  return useQuery({
    queryKey: [url],
    queryFn: () => fetchData(url),
    retry: 2,
  });
}
