import { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";
import { LoginResponse } from "@/services/auth/auth.types";
import { request, isRequestError } from "@/lib/request";

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
    } = await request.post<LoginResponse>("/auth/admin/login", req.body);
    // Set access token cookie
    res.setHeader("Set-Cookie", [
      serialize("accessToken", data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        domain: process.env.NODE_ENV === "production" ? ".d7bw6xdmmxtj1.amplifyapp.com" : undefined,
        maxAge: 15 * 60, // 15 minutes
      }),
      serialize("userLoggedIn", "true", {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        domain: process.env.NODE_ENV === "production" ? ".d7bw6xdmmxtj1.amplifyapp.com" : undefined
      }),
    ]);

    return res.status(200).json({ success: true });
  } catch (error) {
    if (isRequestError(error) && error.response) {
      return res.status(error.response.status).json(error.response.data);
    }

    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
