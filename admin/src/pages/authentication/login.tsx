import React from "react";
import Head from "next/head";

import LoginForm from "@/modules/authentication/components/login";

const Login = () => {
  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <div className="container flex h-screen w-screen flex-col items-center justify-center mx-auto">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
          <LoginForm />
        </div>
      </div>
    </>
  );
};

export default Login;
