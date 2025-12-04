import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios"; // ← your JWT + refresh token Axios instance

const fetchData = async (url: string) => {
  const res = await api.get(url); 
  return res.data;
};

export function useFetchData(url: string) {
  return useQuery({
    queryKey: [url],
    queryFn: () => fetchData(url),
    retry: 2,
  });
}
