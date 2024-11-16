import { useProtectedRoute } from "@/hooks/use-protected-route";
import Head from "next/head";
import React from "react";

const HomePage = () => {
  const { isLoading } = useProtectedRoute();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <main>
        <div className="py-6 md:py-10 container mx-auto">Home page</div>
      </main>
    </>
  );
};

export default HomePage;
