import { GetServerSideProps } from "next";
import { serialize } from "cookie";

// This component won't actually render since we're redirecting in getServerSideProps
const Logout = () => {
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
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  } catch (error) {
    console.error("Logout failed:", error);
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
};

export default Logout;
