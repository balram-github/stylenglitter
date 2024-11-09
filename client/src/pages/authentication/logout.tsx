import { GetServerSideProps } from "next";
import { serialize } from "cookie";
import { useEffect } from "react";
import { queryClient } from "@/lib/query";
import { useRouter } from "next/router";
import { enableTracking } from "@/services/tracking/tracking.service";
import mixpanel from "mixpanel-browser";

// This component won't actually render since we're redirecting in getServerSideProps
const Logout = ({ success }: { success: boolean }) => {
  const router = useRouter();

  useEffect(() => {
    if (success) {
      queryClient.resetQueries({ queryKey: ["user"] });
      if (enableTracking) {
        mixpanel.reset();
      }
    }
    router.replace("/");
  }, [router, success]);

  return null;
};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    // Call the logout API endpoint
    res.setHeader("Set-Cookie", [
      serialize("accessToken", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 0, // Expire immediately
      }),
      serialize("refreshToken", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 0, // Expire immediately
      }),
      serialize("userLoggedIn", "", {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 0, // Expire immediately
      }),
    ]);

    return {
      props: {
        success: true,
      },
    };
  } catch (error) {
    console.error("Logout failed:", error);
    return {
      props: {
        success: false,
      },
    };
  }
};

export default Logout;
