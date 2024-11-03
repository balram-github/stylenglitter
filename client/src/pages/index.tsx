import { Banners } from "@/modules/home/components/banners/banners";
import { CategoriesList } from "@/modules/home/components/categories-list/categories-list";
import { CategoryProductList } from "@/modules/home/components/category-product-list/category-product-list";
import { ProductThemesSlider } from "@/modules/home/components/product-themes-slider/product-themes-slider";
import { REVALIDATE_HOME_PAGE } from "@/modules/home/constants/constants";
import { getCategories } from "@/services/categories/categories.service";
import { Category } from "@/services/categories/categories.types";
import { getProductThemes } from "@/services/product-themes/product-themes.service";
import { ProductTheme } from "@/services/product-themes/product-themes.types";
import type { InferGetStaticPropsType, GetStaticProps } from "next";
import Head from "next/head";

export const getStaticProps = (async () => {
  const [categories, productThemes] = await Promise.all([
    getCategories(),
    getProductThemes(),
  ]);

  return {
    props: { categories, productThemes },
    revalidate: REVALIDATE_HOME_PAGE,
  };
}) satisfies GetStaticProps<{
  categories: Category[];
  productThemes: ProductTheme[];
}>;

export default function Home({
  categories,
  productThemes,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Head>
        <title>Style N Glitter</title>
      </Head>
      <main>
        <div className="py-6 md:py-10">
          <ProductThemesSlider productThemes={productThemes} />
          <Banners />
          <div className="container px-4 mx-auto">
            <CategoriesList categories={categories} />

            {categories.map((category) => {
              return (
                <div className="py-6 md:py-8" key={category.id}>
                  <CategoryProductList data={category} />
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
}
