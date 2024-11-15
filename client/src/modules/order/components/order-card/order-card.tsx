import { OrderCardProps } from "./order-card.types";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { OrderStatus } from "@/services/order/order.types";
import Link from "next/link";

export const OrderCard = ({ data }: OrderCardProps) => {
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
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <Link href={`/orders/${data.orderNo}`}>
      <Card className="w-full hover:bg-accent transition-colors cursor-pointer">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
            <div className="space-y-2">
              <h3 className="text-base sm:text-lg font-bold">Order #{data.orderNo}</h3>
              <div className="space-y-1">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Placed on:{" "}
                  <span className="text-foreground">
                    {new Date(data.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </p>
              </div>
            </div>
            <div
              className={cn(
                "px-3 py-1 rounded-full text-xs sm:text-sm font-medium w-fit uppercase",
                getStatusColor(data.status as OrderStatus)
              )}
            >
              {formatStatus(data.status)}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
