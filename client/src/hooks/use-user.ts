import { useQuery } from "@tanstack/react-query";
import { getUserStatus } from "@/services/auth/auth.service";
import { isClient } from "@/lib/utils";

export const useUser = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["user"],
    queryFn: getUserStatus,
    retry: false,
    enabled: isClient() && document.cookie.includes("userLoggedIn"),
  });

  return {
    user: data?.data,
    isLoggedIn: Boolean(data?.data),
    isLoading,
    error,
  };
};
