import { useEffect } from "react";
import { useRouter } from "next/router";
import { useUser } from "./use-user";

export const useProtectedRoute = () => {
  const { isLoggedIn, isLoading, error, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!isLoggedIn || error)) {
      router.replace("/authentication/login");
    }
  }, [isLoading, isLoggedIn, error, router]);

  return { isLoading, canAccess: !isLoading && user };
};
