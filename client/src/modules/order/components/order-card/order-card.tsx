import { OrderCardProps } from "./order-card.types";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { OrderStatusBadge } from "../order-status-badge/order-status-badge";

export const OrderCard = ({ data }: OrderCardProps) => {
  return (
    <Link href={`/orders/${data.orderNo}`}>
      <Card className="w-full hover:bg-accent transition-colors cursor-pointer">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
            <div className="space-y-2">
              <h3 className="text-base sm:text-lg font-bold">
                Order #{data.orderNo}
              </h3>
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
            <OrderStatusBadge status={data.status} />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
