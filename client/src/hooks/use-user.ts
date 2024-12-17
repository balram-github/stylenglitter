import { useQuery } from "@tanstack/react-query";
import { getUserStatus } from "@/services/auth/auth.service";

export const useUser = () => {
  const isUserLoggedIn = false

  const { data, isLoading, error } = useQuery({
    queryKey: ["user"],
    queryFn: getUserStatus,
    retry: false,
    enabled: false,
  });

  return {
    user: data?.data,
    isLoggedIn: isUserLoggedIn,
    isLoading,
    error,
  };
};
