import React from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import {
  getCategories,
  getCategoryBySlug,
  getProductsOfCategory,
} from "@/services/categories/categories.service";
import { ProductList } from "@/components/product-list/product-list";
import { Product } from "@/services/products/products.types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Head from "next/head";
import { Category } from "@/services/categories/categories.types";
import { CategoriesSeo } from "@/seo/categories.seo";

interface CategoryPageProps {
  initialData: {
    products: Product[];
    hasNext: boolean;
    pageParam: number;
  };
  category: Category;
}

const NB_ITEMS_PER_PAGE = 20;

export default function CategoryPage({
  initialData,
  category,
}: CategoryPageProps) {
  const params = useParams();
  const slug = params?.slug as string;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["category-products", slug],
      initialPageParam: 1,
      initialData: {
        pages: [initialData],
        pageParams: [1],
      },
      queryFn: async ({ pageParam = 1 }) => {
        const result = await getProductsOfCategory(slug, {
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
        <CategoriesSeo category={category} />
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
  const categories = await getCategories({ withProducts: false });

  const paths = categories.map((category) => ({
    params: { slug: category.slug },
  }));

  return {
    paths,
    fallback: "blocking", // Enable ISR for new categories
  };
};

export const getStaticProps: GetStaticProps<CategoryPageProps> = async ({
  params,
}) => {
  try {
    const slug = params?.slug as string;
    const category = await getCategoryBySlug(slug);

    const { products, hasNext } = await getProductsOfCategory(slug, {
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
        category,
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
