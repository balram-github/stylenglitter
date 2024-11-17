import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { CategoryProductListProps } from "./category-product-list.types";
import { ProductCard } from "@/components/product-card/product-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const CategoryProductList = ({ data }: CategoryProductListProps) => {
  return (
    <div className="w-full px-2">
      <h2 className="font-bold text-3xl md:text-4xl capitalize pb-6 md:pb-8 border-b-2 text-center">
        {data.name}
      </h2>
      <Carousel
        opts={{
          align: "start",
          dragFree: true,
        }}
        className="my-4 md:my-8 w-full"
      >
        <CarouselContent>
          {data.products.map((product) => {
            return (
              <CarouselItem
                className="basis-[150px] md:basis-[300px]"
                key={product.id}
              >
                <ProductCard data={product} />
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="hidden md:inline-flex" />
        <CarouselNext className="hidden md:inline-flex" />
      </Carousel>
      <div className="my-6 text-center">
        <Link href={`/categories/${data.slug}`}>
          <Button className="uppercase rounded-full bg-primary text-white w-full md:w-64">
            View All
          </Button>
        </Link>
      </div>
    </div>
  );
};
