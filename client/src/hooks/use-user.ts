import { useQuery } from "@tanstack/react-query";
import { getUserStatus } from "@/services/auth/auth.service";
import { isClient } from "@/lib/utils";

export const useUser = () => {
  const isUserLoggedIn = isClient()
    ? document.cookie.includes("userLoggedIn")
    : false;

  const { data, isLoading, error } = useQuery({
    queryKey: ["user"],
    queryFn: getUserStatus,
    retry: false,
    enabled: isClient() && isUserLoggedIn,
  });

  return {
    user: data?.data,
    isLoggedIn: isUserLoggedIn,
    isLoading,
    error,
  };
};
