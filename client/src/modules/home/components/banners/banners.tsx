import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import React from "react";
import { BannersData } from "../../constants/constants";
import Link from "next/link";

export const Banners = () => {
  return (
    <div className="relative w-full md:my-4">
      <Carousel
        plugins={[
          // @ts-expect-error - Embla carousel types mismatch between packages
          Autoplay({
            delay: 3000,
          }),
          // @ts-expect-error - Embla carousel types mismatch between packages
          Fade(),
        ]}
      >
        <CarouselContent>
          {BannersData.map((banner, index) => {
            return (
              <CarouselItem key={index}>
                <Link href={banner.redirectUrl ?? "/"}>
                  <Image
                    priority={index === 0}
                    src={banner.image}
                    alt={banner.title}
                    sizes="100vw"
                    style={{
                      width: "100%",
                    }}
                  />
                </Link>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </div>
  );
};
