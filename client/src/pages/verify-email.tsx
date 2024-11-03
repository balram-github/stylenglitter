import React, { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { verifyEmail } from "@/services/auth/auth.service";
import { useRouter } from "next/router";
import Head from "next/head";
import { isRequestError } from "@/lib/request";

interface VerifyEmailProps {
  success: boolean;
  error?: string;
}

export const getServerSideProps: GetServerSideProps<VerifyEmailProps> = async (
  context
) => {
  const { token } = context.query;

  if (!token || typeof token !== "string") {
    return {
      props: {
        success: false,
        error: "Invalid verification token",
      },
    };
  }

  try {
    const isVerified = await verifyEmail(token);
    return {
      props: {
        success: isVerified,
      },
    };
  } catch (error) {
    return {
      props: {
        success: false,
        error: isRequestError(error)
          ? (error.response?.data as { error: string })?.error ||
            "Failed to verify email"
          : "Failed to verify email",
      },
    };
  }
};

export default function VerifyEmail({ success, error }: VerifyEmailProps) {
  const [countdown, setCountdown] = useState(5);
  const router = useRouter();

  useEffect(() => {
    if (success) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            router.push("/");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [success, router]);

  return (
    <>
      <Head>
        <title>Verifying Email</title>
      </Head>
      <main>
        <div className="py-6 md:py-10">
          {error ? (
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center p-8 rounded-lg bg-red-50">
                <h1 className="text-2xl text-red-600 font-semibold mb-2">
                  Verification Failed
                </h1>
                <p className="text-red-500">{error}</p>
              </div>
            </div>
          ) : (
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center p-8 rounded-lg bg-green-50">
                <h1 className="text-2xl text-green-600 font-semibold mb-2">
                  Email Verified Successfully!
                </h1>
                <p className="text-green-500">
                  Redirecting to home page in {countdown} seconds...
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
