import { getOrder } from "@/services/order/order.service";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React from "react";
import Head from "next/head";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderItem } from "@/modules/order/components/order-item/order-item";
import { OrderDetails } from "@/modules/order/components/order-details/order-details";

const OrderDetailsPage = () => {
  const router = useRouter();

  const orderNo = router.query.orderNo as string;
  const email = router.query.email as string;
  const phoneNumber = router.query.phoneNumber as string;

  const { data, isFetching } = useQuery({
    queryKey: ["order", orderNo, email, phoneNumber],
    queryFn: () => getOrder(orderNo, { email, phoneNumber }),
    enabled: !!orderNo,
    refetchOnWindowFocus: false,
    staleTime: 0,
  });

  if (!data && !isFetching)
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
              {isFetching &&
                Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="h-52 w-full" />
                ))}
              {!isFetching &&
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
              {isFetching && <Skeleton className="h-12 md:h-4/5 w-full" />}
              {!isFetching && data && <OrderDetails data={data} />}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default OrderDetailsPage;
