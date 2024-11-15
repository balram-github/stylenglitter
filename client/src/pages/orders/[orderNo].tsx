import { useProtectedRoute } from "@/hooks/use-protected-route";
import { getOrder } from "@/services/order/order.service";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React from "react";
import Head from "next/head";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderItem } from "@/modules/order/components/order-item/order-item";
import { OrderDetails } from "@/modules/order/components/order-details/order-details";

const OrderDetailsPage = () => {
  const { isLoading: isProtectedRouteLoading } = useProtectedRoute();

  const router = useRouter();

  const orderNo = router.query.orderNo as string;

  const { data, isFetching } = useQuery({
    queryKey: ["order", orderNo],
    queryFn: () => getOrder(orderNo),
    enabled: !!orderNo,
    refetchOnWindowFocus: false,
    staleTime: 0,
  });

  const isLoading = isProtectedRouteLoading || isFetching;

  if (!data && !isLoading)
    return <div className="text-center text-2xl py-8">Order not found</div>;

  return (
    <>
      <Head>
        <title>Order Details</title>
      </Head>
      <main className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:grid md:grid-cols-2 gap-12">
          {/* First row on mobile / Left column on desktop - Order details */}
          <div className="space-y-4 order-2 md:order-1">
            <h2 className="text-2xl font-semibold tracking-tight">
              Ordered Products
            </h2>
            <div className="grid grid-cols-1 gap-8">
              {isLoading &&
                Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="h-52 w-full" />
                ))}
              {!isLoading &&
                data?.orderItems.map((item) => (
                  <OrderItem key={item.id} data={item} />
                ))}
            </div>
          </div>

          {/* Second row on mobile / Right column on desktop - Payment details */}
          <div className="space-y-4 order-1 md:order-2">
            <h2 className="text-2xl font-semibold tracking-tight">
              Order Details
            </h2>
            <div className="w-full">
              {isLoading && <Skeleton className="h-12 md:h-4/5 w-full" />}
              {!isLoading && data && <OrderDetails data={data} />}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default OrderDetailsPage;
