import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { Product } from "@/services/products/products.types";
import Image from "next/image";
import React from "react";

interface ProductImageCarouselProps {
  product: Product;
}

export const ProductImageCarousel = ({
  product,
}: ProductImageCarouselProps) => {
  return (
    <Carousel
      opts={{
        align: "start",
        dragFree: false,
      }}
    >
      <CarouselContent>
        {product.images.map((image, index) => {
          return (
            <CarouselItem key={image.id}>
              <Image
                src={image.url}
                alt={`${product.name} - ${index}`}
                width={500}
                height={500}
                priority
              />
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious className="inline-flex absolute left-0 top-1/2 -translate-y-1/2" />
      <CarouselNext className="inline-flex absolute right-0 top-1/2 -translate-y-1/2" />
    </Carousel>
  );
};
