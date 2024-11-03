import { NextApiRequest, NextApiResponse } from "next";
import { LoginResponse } from "@/services/auth/auth.types";
import { request } from "@/lib/request";
import { serialize } from "cookie";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const {
      data: { data },
    } = await request.get<LoginResponse>("/auth/refresh-token");

    // Set access token cookie
    res.setHeader("Set-Cookie", [
      serialize("accessToken", data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 15 * 60, // 15 minutes
      }),
      serialize("refreshToken", data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // 7 days
      }),
    ]);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Refresh token error:", error);

    // Redirect to logout page
    res.redirect(307, "/authentication/logout");
  }
}
