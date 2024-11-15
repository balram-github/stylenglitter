import React from "react";
import { OrderStatusBadgeProps } from "./order-status-badge.props";
import { OrderStatus } from "@/services/order/order.types";
import { cn } from "@/lib/utils";

export const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PAYMENT_PENDING:
        return "bg-yellow-500/20 text-yellow-600";
      case OrderStatus.PAYMENT_FAILED:
        return "bg-red-500/20 text-red-600";
      case OrderStatus.PLACED:
        return "bg-blue-500/20 text-blue-600";
      case OrderStatus.SHIPPED:
        return "bg-purple-500/20 text-purple-600";
      case OrderStatus.DELIVERED:
        return "bg-green-500/20 text-green-600";
      case OrderStatus.CANCELLED:
        return "bg-red-500/20 text-red-600";
      default:
        return "bg-gray-500/20 text-gray-600";
    }
  };

  const formatStatus = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(" ");
  };

  return (
    <div
      className={cn(
        "px-3 py-1 rounded-full text-xs sm:text-sm font-medium w-fit uppercase",
        getStatusColor(status as OrderStatus)
      )}
    >
      {formatStatus(status)}
    </div>
  );
};
