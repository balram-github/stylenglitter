import React from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import { ProductList } from "@/components/product-list/product-list";
import { Product } from "@/services/products/products.types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Head from "next/head";
import { ProductTheme } from "@/services/product-themes/product-themes.types";
import {
  getProductsOfProductTheme,
  getProductThemeBySlug,
  getProductThemes,
} from "@/services/product-themes/product-themes.service";

interface ProductThemePageProps {
  initialData: {
    products: Product[];
    hasNext: boolean;
    pageParam: number;
  };
  productTheme: ProductTheme;
}

const NB_ITEMS_PER_PAGE = 20;

export default function ProductThemePage({
  initialData,
  productTheme,
}: ProductThemePageProps) {
  const params = useParams();
  const slug = params?.slug as string;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["product-theme-products", slug],
      initialPageParam: 1,
      initialData: {
        pages: [initialData],
        pageParams: [1],
      },
      queryFn: async ({ pageParam = 1 }) => {
        const result = await getProductsOfProductTheme(slug, {
          page: pageParam,
          limit: NB_ITEMS_PER_PAGE,
        });
        return { ...result, pageParam };
      },
      getNextPageParam: (lastPage) =>
        lastPage.hasNext ? lastPage.pageParam + 1 : undefined,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    });

  const products = data?.pages.flatMap((page) => page.products) ?? [];

  return (
    <>
      <Head>
        <title>{productTheme.name}</title>
      </Head>
      <main>
        <div className="py-6 md:py-10">
          <div className="container mx-auto px-4 py-8">
            <ProductList
              data={products}
              loading={isFetchingNextPage}
              hasNext={!!hasNextPage}
              loadData={fetchNextPage}
            />
          </div>
        </div>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const productThemes = await getProductThemes();

  const paths = productThemes.map((productTheme) => ({
    params: { slug: productTheme.slug },
  }));

  return {
    paths,
    fallback: "blocking", // Enable ISR for new product themes
  };
};

export const getStaticProps: GetStaticProps<ProductThemePageProps> = async ({
  params,
}) => {
  try {
    const slug = params?.slug as string;
    const productTheme = await getProductThemeBySlug(slug);

    const { products, hasNext } = await getProductsOfProductTheme(slug, {
      page: 1,
      limit: NB_ITEMS_PER_PAGE,
    });

    if (!products || products.length === 0) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        initialData: {
          products,
          hasNext,
          pageParam: 1,
        },
        productTheme,
      },
      revalidate: 60 * 60,
    };
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }
};
