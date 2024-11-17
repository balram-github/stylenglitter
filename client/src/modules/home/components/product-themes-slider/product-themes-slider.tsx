import React from "react";
import { ProductThemesSliderProps } from "./product-themes-slider.types";
import Image from "next/image";
import Link from "next/link";

export const ProductThemesSlider = ({
  productThemes,
}: ProductThemesSliderProps) => {
  return (
    <div className="w-full overflow-x-scroll flex justify-center items-center gap-4 px-4 pb-4 md:gap-8">
      {productThemes.map((productTheme) => (
        <Link
          key={productTheme.id}
          href={`/product-themes/${productTheme.slug}`}
          className="hover:text-primary transition-all duration-150"
        >
          <div className="relative flex justify-center items-center flex-col text-center">
            <div className="w-20 h-20 md:w-36 md:h-36 rounded-full overflow-hidden">
              <Image
                sizes="240px"
                width={240}
                height={240}
                src={productTheme.coverImgUrl}
                alt={productTheme.slug}
                className="bg-center"
              />
            </div>
            <p className="text-sm md:text-base mt-2">{productTheme.name}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};
