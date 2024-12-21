import React, { useState } from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import {
  getCategories,
  getCategoryBySlug,
  getProductsOfCategory,
} from "@/services/categories/categories.service";
import { ProductList } from "@/components/product-list/product-list";
import {
  Product,
  ProductAvailability,
  ProductFilters,
  ProductSortBy,
} from "@/services/products/products.types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Category } from "@/services/categories/categories.types";
import { CategoriesSeo } from "@/seo/categories.seo";
import { SortBySelector } from "@/components/sort-by-selector/sort-by-selector";
import { ProductFilterSheet } from "@/components/product-filter-sheet/product-filter-sheet";

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
      queryKey: ["category-products", slug, sortBy, filters],
      initialPageParam: 1,
      initialData: {
        pages: [initialData],
        pageParams: [1],
      },
      queryFn: async ({ pageParam = 1 }) => {
        const result = await getProductsOfCategory(slug, {
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
      <CategoriesSeo category={category} />
      <main>
        <div className="py-6 md:py-10">
          <div className="container mx-auto px-4 pb-8">
            <h1 className="text-2xl font-bold pb-6 px-4 text-center md:text-4xl">
              {category.name}
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
    const [category, productsData] = await Promise.all([
      getCategoryBySlug(slug).catch(() => null),
      getProductsOfCategory(slug, {
        page: 1,
        limit: NB_ITEMS_PER_PAGE,
        sortBy: ProductSortBy.DATE_ADDED_DESC,
      }).catch(() => ({ products: [], hasNext: false })),
    ]);

    // If we couldn't get the category at all, return 404
    if (!category) {
      return { notFound: true };
    }

    return {
      props: {
        initialData: {
          products: productsData.products,
          hasNext: productsData.hasNext,
          pageParam: 1,
        },
        category,
      },
      revalidate: 60 * 60,
    };
  } catch (error) {
    console.error("Error fetching category page data:", error);
    return { notFound: true }; // Keep 404 if we can't get the category
  }
};
