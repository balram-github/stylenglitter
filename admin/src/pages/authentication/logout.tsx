import { GetServerSideProps } from "next";
import { serialize } from "cookie";
import { useEffect } from "react";
import { queryClient } from "@/lib/query";
import { useRouter } from "next/router";

// This component won't actually render since we're redirecting in getServerSideProps
const Logout = ({ success }: { success: boolean }) => {
  const router = useRouter();

  useEffect(() => {
    if (success) {
      queryClient.resetQueries({ queryKey: ["user"] });
    }
    router.replace("/authentication/login");
  }, [router, success]);

  return null;
};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    res.setHeader("Set-Cookie", [
      serialize("accessToken", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        domain: process.env.NODE_ENV === "production" ? ".stylenglitter.com" : undefined,
        maxAge: 0
      }),
      serialize("userLoggedIn", "", {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        domain: process.env.NODE_ENV === "production" ? ".stylenglitter.com" : undefined,
        maxAge: 0
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
