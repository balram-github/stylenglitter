import Autoplay from "embla-carousel-autoplay";
import { getDiscounts } from "@/services/discount/discount.service";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import Link from "next/link";
import { getDiscountRedirectUrl } from "@/utils/get-discount-redirect-url";

export const DiscountCarousel = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["discount-list"],
    queryFn: () => getDiscounts(),
    staleTime: 1000 * 60 * 60 * 24, // 24hr
  });

  if (!isLoading && data && data.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-primary text-white h-10">
      <div className="h-full flex items-center justify-center">
        {isLoading ? (
          <div className="h-full flex items-center">Getting Discounts...</div>
        ) : (
          <Carousel
            plugins={[
              // @ts-expect-error - Embla carousel types mismatch between packages
              Autoplay({
                delay: 3000,
                stopOnInteraction: false,
              }),
            ]}
          >
            <CarouselContent>
              {data?.map((discount, index) => {
                return (
                  <CarouselItem key={index}>
                    <Link href={getDiscountRedirectUrl(discount)}>
                      <p className="text-center">🎉 {discount.name}</p>
                    </Link>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>
        )}
      </div>
    </div>
  );
};
