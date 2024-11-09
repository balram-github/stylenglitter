import React, { Suspense } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Head from "next/head";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load components
const LoginForm = dynamic(
  () => import("@/modules/authentication/components/login"),
  {
    loading: () => <AuthFormSkeleton />,
  }
);

const RegisterForm = dynamic(
  () => import("@/modules/authentication/components/register"),
  {
    loading: () => <AuthFormSkeleton />,
  }
);

// Skeleton component for loading state
const AuthFormSkeleton = () => {
  return (
    <div className="space-y-4 w-full">
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="space-y-4 mt-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="h-10 w-full mt-4" />
    </div>
  );
};

const Authentication = () => {
  const router = useRouter();
  const path = router.query.path?.[0] || "login";

  const isLoginPath = path === "login";
  const isRegisterPath = path === "register";

  // Redirect to login if invalid path
  if (!isLoginPath && !isRegisterPath) {
    router.replace("/authentication/login");
    return null;
  }

  const pageTitle = isLoginPath ? "Login" : "Register";

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content={`${pageTitle} to access your account`}
        />
      </Head>
      <div className="container flex h-screen w-screen flex-col items-center justify-center mx-auto">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
          <Suspense fallback={<AuthFormSkeleton />}>
            {isLoginPath && <LoginForm />}
            {isRegisterPath && <RegisterForm />}
          </Suspense>
        </div>
      </div>
    </>
  );
};

export default Authentication;
