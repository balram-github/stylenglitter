import React from "react";
import { CategorySliderProps } from "./category-slider.types";
import Image from "next/image";

export const CategorySlider = ({ categories }: CategorySliderProps) => {
  return (
    <div className="w-full overflow-x-scroll flex justify-center items-center gap-4 px-4 pb-4 md:gap-8">
      {categories.map((category) => (
        <div key={category.id}>
          <div className="relative text-center">
            <div className="w-20 h-20 md:w-36 md:h-36 rounded-full overflow-hidden">
              <Image
                sizes="240px"
                width={240}
                height={240}
                src={category.coverImgUrl}
                alt={category.slug}
                className="bg-center"
              />
            </div>
            <p className="text-sm md:text-base mt-2">{category.name}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
