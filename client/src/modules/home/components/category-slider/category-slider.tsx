import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CategorySliderProps } from "./category-slider.types";

export const CategorySlider = ({ categories }: CategorySliderProps) => {
  return (
    <div className="w-full overflow-x-scroll flex items-center gap-4 px-4">
      {categories.map((category) => (
        <div key={category.id}>
          <div className="relative">
            <Avatar>
              <AvatarImage
                sizes="120px"
                width={120}
                height={120}
                fetchPriority="high"
                className="w-16 h-16"
                src={category.coverImgUrl}
              />
              <AvatarFallback className="uppercase">
                {category.name.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <p className="text-sm md:text-md text-center mt-2">
              {category.name}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
