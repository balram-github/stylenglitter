import React from "react";
import { ProductCardProps } from "./product-card.types";
import Link from "next/link";
import Image from "next/image";

export const ProductCard = ({ data }: ProductCardProps) => {
  const images =
    data.images.length > 0
      ? data.images
      : [
          {
            url: "https://d1lyfvoa64c11i.cloudfront.net/images/products/pendants/IMG_2213.JPG",
          },
        ];
  return (
    <Link href={`/products/${data.slug}`}>
      {images.length > 0 && (
        <div className="relative overflow-hidden">
          <Image
            src={images[0].url}
            alt={data.slug}
            width={300}
            height={300}
            className="hover:scale-125 transition-all duration-300 text-center"
          />
        </div>
      )}
      <div className="mt-2 capitalize text-sm md:text-xl ">{data.name}</div>
      <div className="mt-1 text-xs md:text-lg text-rose-300">
        Rs. {parseFloat(data.amount.price).toFixed(2)}
      </div>
    </Link>
  );
};
