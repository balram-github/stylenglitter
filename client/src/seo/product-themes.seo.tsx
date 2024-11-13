import Head from "next/head";
import { ProductTheme } from "@/services/product-themes/product-themes.types";

interface ProductThemesSeoProps {
  productTheme: ProductTheme;
}

export const ProductThemesSeo = ({ productTheme }: ProductThemesSeoProps) => {
  return (
    <Head>
      <title>{productTheme.name}</title>

      {/* Basic SEO */}
      <meta
        name="description"
        content={`Explore our collection of ${productTheme.name} products`}
      />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link
        rel="canonical"
        href={`${process.env.NEXT_PUBLIC_APP_URL}/categories/${productTheme.slug}`}
      />

      {/* Open Graph */}
      <meta property="og:title" content={productTheme.name} />
      <meta property="og:type" content="website" />
      <meta
        property="og:description"
        content={`Explore our collection of ${productTheme.name} products`}
      />
      <meta
        property="og:url"
        content={`${process.env.NEXT_PUBLIC_APP_URL}/categories/${productTheme.slug}`}
      />
      {productTheme.coverImgUrl && (
        <>
          <meta property="og:image" content={productTheme.coverImgUrl} />
          <meta
            property="og:image:alt"
            content={`${productTheme.name} productTheme`}
          />
        </>
      )}
      <meta property="og:site_name" content="Style Glitter" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={productTheme.name} />
      <meta
        name="twitter:description"
        content={`Explore our collection of ${productTheme.name} products`}
      />
      {productTheme.coverImgUrl && (
        <>
          <meta name="twitter:image" content={productTheme.coverImgUrl} />
          <meta
            name="twitter:image:alt"
            content={`${productTheme.name} productTheme`}
          />
        </>
      )}

      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta
        name="keywords"
        content={`${productTheme.name}, products, shopping, ${productTheme.name} collection`}
      />
    </Head>
  );
};
