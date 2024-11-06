import { useQuery } from "@tanstack/react-query";
import { getUserStatus } from "@/services/auth/auth.service";
import { isClient } from "@/lib/utils";
import { useEffect } from "react";
import { saveGuestCartItemsToDB } from "@/services/cart/cart.service";

export const useUser = () => {
  const isUserLoggedIn = document.cookie.includes("userLoggedIn");

  const { data, isLoading, error } = useQuery({
    queryKey: ["user"],
    queryFn: getUserStatus,
    retry: false,
    enabled: isClient() && isUserLoggedIn,
  });

  useEffect(() => {
    if (data?.data) {
      saveGuestCartItemsToDB();
    }
  }, [data]);

  return {
    user: data?.data,
    isLoggedIn: isUserLoggedIn,
    isLoading,
    error,
  };
};
