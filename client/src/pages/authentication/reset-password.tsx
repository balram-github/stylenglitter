import ResetPasswordForm from "@/modules/authentication/components/reset-password";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import React from "react";

const ResetPasswordPage = ({
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <Head>
        <title>Reset Password</title>
        <meta name="description" content={`Reset password for your account`} />
      </Head>
      <div className="container flex h-screen w-screen flex-col items-center justify-center mx-auto">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
          <ResetPasswordForm token={token} />
        </div>
      </div>
    </>
  );
};

export default ResetPasswordPage;

interface PageProps {
  token: string;
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  ctx
) => {
  const token = ctx.query.token as string;

  if (!token) {
    return {
      redirect: {
        destination: "/authentication/login",
        permanent: false,
      },
      props: {},
    };
  }

  return { props: { token } };
};
