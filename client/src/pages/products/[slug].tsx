import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { Product } from "@/services/products/products.types";
import { getProductBySlug } from "@/services/products/products.service";
import Head from "next/head";
import { ProductImageCarousel } from "@/modules/product/components/product-image-carousel/product-image-carousel";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ProductDetails } from "@/modules/product/components/product-details/product-details";

interface ProductPageProps {
  product: Product;
}

const ProductPage = ({
  product,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <Head>
        <title>{product.name} | Style N Glitter</title>
      </Head>
      <main className="p-4 md:p-8 container mx-auto">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href={`/categories/${product.category?.slug}`}>
                {product.category?.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem className="block md:hidden">
              <BreadcrumbLink href={`/categories/${product.category?.slug}`}>
                <BreadcrumbEllipsis />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product.slug}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex flex-col md:flex-row py-4 md:py-8 gap-4 md:gap-8 relative">
          <div className="basis-full md:basis-2/5">
            <ProductImageCarousel product={product} />
          </div>
          <div className="basis-full md:basis-3/5">
            <ProductDetails product={product} />
          </div>
        </div>
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<ProductPageProps> = async ({
  params,
}) => {
  try {
    const slug = params?.slug as string;
    const product = await getProductBySlug(slug);

    return {
      props: {
        product,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }
};

export default ProductPage;
