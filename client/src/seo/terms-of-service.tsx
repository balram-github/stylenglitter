import Head from "next/head";

export const TermsOfServiceSeo = () => {
  return (
    <Head>
      <title>Terms of Service | Style Glitter</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="canonical" href={`${process.env.NEXT_PUBLIC_APP_URL}`} />
      <meta
        name="description"
        content="Discover trendy fashion accessories and glitter products at Style Glitter. Shop our curated collection of stylish items."
      />
      {/* OpenGraph tags */}
      <meta
        property="og:title"
        content="Style Glitter - Fashion Accessories & Glitter Products"
      />
      <meta
        property="og:description"
        content="Discover trendy fashion accessories and glitter products at Style Glitter. Shop our curated collection of stylish items."
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${process.env.NEXT_PUBLIC_APP_URL}`} />
      <meta property="og:locale" content="en_US" />
      <meta
        property="og:image"
        content={`${process.env.NEXT_PUBLIC_APP_URL}/images/logo.jpeg`}
      />
      <meta property="og:site_name" content="Style Glitter" />

      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta
        name="twitter:title"
        content="Style Glitter - Fashion Accessories & Glitter Products"
      />
      <meta
        name="twitter:description"
        content="Discover trendy fashion accessories and glitter products at Style Glitter. Shop our curated collection of stylish items."
      />
      <meta
        name="twitter:image"
        content={`${process.env.NEXT_PUBLIC_APP_URL}/images/logo.jpeg`}
      />
      <meta
        name="keywords"
        content={`trendy fashion accessories, glitter products, stylish items`}
      />
    </Head>
  );
};
