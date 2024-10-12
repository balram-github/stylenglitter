import { Banners } from "@/modules/home/components/banners/banners";
import { CategoriesList } from "@/modules/home/components/categories-list/categories-list";
import { CategorySlider } from "@/modules/home/components/category-slider/category-slider";
import { REVALIDATE_HOME_PAGE } from "@/modules/home/constants/constants";
import { getCategories } from "@/services/categories/categories.service";
import { Category } from "@/services/categories/categories.types";
import type { InferGetStaticPropsType, GetStaticProps } from "next";
import Head from "next/head";

export const getStaticProps = (async () => {
  const categories = await getCategories();

  return { props: { categories }, revalidate: REVALIDATE_HOME_PAGE };
}) satisfies GetStaticProps<{
  categories: Category[];
}>;

export default function Home({
  categories,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Head>
        <title>Style N Glitter</title>
      </Head>
      <main>
        <div className="py-6 md:py-10">
          <CategorySlider categories={categories} />
          <Banners />
          <div className="container sm:px-2 mx-auto">
            <CategoriesList categories={categories} />
          </div>
        </div>
      </main>
    </>
  );
}
