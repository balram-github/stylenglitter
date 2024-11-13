import React from "react";
import { Category } from "@/services/categories/categories.types";
import Head from "next/head";
interface CategoriesSeoProps {
  category: Category;
}

export const CategoriesSeo = ({ category }: CategoriesSeoProps) => {
  return (
    <Head>
      <title>{category.name}</title>

      {/* Basic SEO */}
      <meta
        name="description"
        content={`Explore our collection of ${category.name} products`}
      />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link
        rel="canonical"
        href={`${process.env.NEXT_PUBLIC_APP_URL}/categories/${category.slug}`}
      />

      {/* Open Graph */}
      <meta property="og:title" content={category.name} />
      <meta property="og:type" content="website" />
      <meta
        property="og:description"
        content={`Explore our collection of ${category.name} products`}
      />
      <meta
        property="og:url"
        content={`${process.env.NEXT_PUBLIC_APP_URL}/categories/${category.slug}`}
      />
      {category.coverImgUrl && (
        <>
          <meta property="og:image" content={category.coverImgUrl} />
          <meta property="og:image:alt" content={`${category.name} category`} />
        </>
      )}
      <meta property="og:site_name" content="Style Glitter" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={category.name} />
      <meta
        name="twitter:description"
        content={`Explore our collection of ${category.name} products`}
      />
      {category.coverImgUrl && (
        <>
          <meta name="twitter:image" content={category.coverImgUrl} />
          <meta
            name="twitter:image:alt"
            content={`${category.name} category`}
          />
        </>
      )}

      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta
        name="keywords"
        content={`${category.name}, products, shopping, ${category.name} collection`}
      />
    </Head>
  );
};
