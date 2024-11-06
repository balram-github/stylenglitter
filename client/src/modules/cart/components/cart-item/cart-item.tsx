import React from "react";
import { CartItemProps } from "./cart-item.types";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { MAX_PRODUCT_QUANTITY_ALLOWED } from "@/constants";

export const CartItem = ({ data, onRemove, onUpdateQty }: CartItemProps) => {
  if (!data.product) return null;

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
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(data)}
          >
            <Trash2 size={16} />
          </Button>
        </div>
        <div className="flex justify-between mt-auto items-center">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onUpdateQty(data, data.qty - 1)}
            >
              <Minus size={16} />
            </Button>
            <span>{data.qty}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onUpdateQty(data, data.qty + 1)}
              disabled={data.qty >= MAX_PRODUCT_QUANTITY_ALLOWED}
            >
              <Plus size={16} />
            </Button>
          </div>
          <p className="text-sm text-gray-500">
            Rs. {Number(data.product.amount.price) * data.qty}
          </p>
        </div>
      </div>
    </div>
  );
};
