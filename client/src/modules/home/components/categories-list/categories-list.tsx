import React from "react";
import { CategoriesListProps } from "./categories-list.types";
import Image from "next/image";
import Link from "next/link";

export const CategoriesList = ({ categories }: CategoriesListProps) => {
  return (
    <div className="py-6 md:py-10">
      <h2 className="font-bold text-center text-2xl md:text-4xl">Categories</h2>
      <div className="flex flex-wrap items-center justify-center gap-8 py-4 md:py-12 w-full">
        {categories.map((category) => (
          <Link
            href={`/categories/${category.slug}`}
            key={category.id}
            className="hover:text-primary transition-all duration-150"
          >
            <div className="relative overflow-hidden">
              <Image
                src={category.coverImgUrl}
                alt={category.slug}
                width={300}
                height={300}
                className="hover:scale-125 transition-all duration-300"
              />
            </div>
            <div className="mt-2 md:mt-4 capitalize text-center">
              {category.name}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
