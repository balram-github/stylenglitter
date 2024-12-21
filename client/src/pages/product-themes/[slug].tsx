import React, { useState } from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import { ProductList } from "@/components/product-list/product-list";
import {
  Product,
  ProductAvailability,
  ProductFilters,
  ProductSortBy,
} from "@/services/products/products.types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { ProductTheme } from "@/services/product-themes/product-themes.types";
import {
  getProductsOfProductTheme,
  getProductThemeBySlug,
  getProductThemes,
} from "@/services/product-themes/product-themes.service";
import { ProductThemesSeo } from "@/seo/product-themes.seo";
import { ProductFilterSheet } from "@/components/product-filter-sheet/product-filter-sheet";
import { SortBySelector } from "@/components/sort-by-selector/sort-by-selector";

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
  const [sortBy, setSortBy] = useState<ProductSortBy>(
    ProductSortBy.DATE_ADDED_DESC
  );

  const [filters, setFilters] = useState<ProductFilters>({
    availability: ProductAvailability.ALL,
    minPrice: undefined,
    maxPrice: undefined,
  });

  const params = useParams();
  const slug = params?.slug as string;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["product-theme-products", slug, sortBy, filters],
      initialPageParam: 1,
      initialData: {
        pages: [initialData],
        pageParams: [1],
      },
      queryFn: async ({ pageParam = 1 }) => {
        const result = await getProductsOfProductTheme(slug, {
          page: pageParam,
          limit: NB_ITEMS_PER_PAGE,
          sortBy,
          availability: filters.availability,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
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
      <ProductThemesSeo productTheme={productTheme} />
      <main>
        <div className="py-6 md:py-10">
          <div className="container mx-auto px-4 pb-8">
            <h1 className="text-2xl font-bold pb-6 px-4 text-center md:text-4xl">
              {productTheme.name}
            </h1>
            <div className="flex items-center justify-between px-4 mb-4">
              <ProductFilterSheet
                filters={filters}
                onApply={(filters) => setFilters(filters)}
              />
              <SortBySelector sortBy={sortBy} onChange={setSortBy} />
            </div>
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
    const [productTheme, productsData] = await Promise.all([
      getProductThemeBySlug(slug).catch(() => null),
      getProductsOfProductTheme(slug, {
        page: 1,
        limit: NB_ITEMS_PER_PAGE,
        sortBy: ProductSortBy.DATE_ADDED_DESC,
      }).catch(() => ({ products: [], hasNext: false })),
    ]);

    // If we couldn't get the product theme at all, return 404
    if (!productTheme) {
      return { notFound: true };
    }

    return {
      props: {
        initialData: {
          products: productsData.products,
          hasNext: productsData.hasNext,
          pageParam: 1,
        },
        productTheme,
      },
      revalidate: 60 * 60,
    };
  } catch (error) {
    console.error("Error fetching product theme page data:", error);
    return { notFound: true }; // Keep 404 if we can't get the product theme
  }
};
