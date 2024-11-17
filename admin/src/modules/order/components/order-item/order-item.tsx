import React from "react";
import Image from "next/image";
import { OrderItemProps } from "./order-item.types";

export const OrderItem = ({ data }: OrderItemProps) => {
  if (!data.product) return <div>Deleted Product</div>;

  return (
    <div className="flex gap-4">
      <div className="relative">
        <Image
          src={data.product.images[0].url}
          alt={data.product.name}
          width={100}
          height={100}
        />
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-center">
          <p className="font-bold">{data.product.name}</p>
        </div>
        <div className="flex justify-between mt-auto items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm">Qty {data.qty}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
