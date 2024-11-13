import { NextApiRequest, NextApiResponse } from "next";
import { LoginResponse } from "@/services/auth/auth.types";
import { serialize } from "cookie";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new Error("No refresh token found");
    }
    const {
      data: { data },
    } = await axios.get<LoginResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );

    // Set access token cookie
    res.setHeader("Set-Cookie", [
      serialize("accessToken", data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        domain: process.env.NODE_ENV === "production" ? ".stylenglitter.com" : undefined,
        maxAge: 15 * 60, // 15 minutes
      }),
      serialize("refreshToken", data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        domain: process.env.NODE_ENV === "production" ? ".stylenglitter.com" : undefined,
        maxAge: 7 * 24 * 60 * 60, // 7 days
      }),
      serialize("userLoggedIn", "true", {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        domain: process.env.NODE_ENV === "production" ? ".stylenglitter.com" : undefined
      }),
    ]);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Refresh token error:", error);

    // Redirect to logout page
    res.redirect(307, "/authentication/logout");
  }
}
