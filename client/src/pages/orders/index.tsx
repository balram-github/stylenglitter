import { Skeleton } from "@/components/ui/skeleton";
import { useProtectedRoute } from "@/hooks/use-protected-route";
import { OrderList } from "@/modules/order/components/order-list/order-list";
import { getOrders } from "@/services/order/order.service";
import { useInfiniteQuery } from "@tanstack/react-query";
import Head from "next/head";
import React from "react";

const NB_ITEMS_PER_PAGE = 10;

const OrdersPage = () => {
  const { isLoading: isProtectedRouteLoading } = useProtectedRoute();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
    useInfiniteQuery({
      queryKey: ["orders"],
      initialPageParam: 1,
      queryFn: async ({ pageParam = 1 }) => {
        const result = await getOrders({
          page: pageParam,
          limit: NB_ITEMS_PER_PAGE,
        });
        return { ...result, pageParam };
      },
      getNextPageParam: (lastPage) =>
        lastPage.hasNext ? lastPage.pageParam + 1 : undefined,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    });

  const isLoading = isProtectedRouteLoading || isFetching;

  const orders = data?.pages.flatMap((page) => page.orders) ?? [];

  return (
    <>
      <Head>
        <title>Orders</title>
      </Head>
      <main className="container mx-auto py-8 px-4">
        <h2 className="text-2xl md:text-4xl font-semibold mb-6 md:mb-10">
          Orders
        </h2>
        <div className="flex flex-col gap-4">
          {isLoading &&
            Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-28 w-full" />
            ))}
          {!isLoading && orders.length === 0 && (
            <p className="text-center text-sm text-gray-500">No orders found</p>
          )}
          {!isLoading && orders.length > 0 && (
            <OrderList
              data={orders}
              loading={isFetchingNextPage}
              hasNext={!!hasNextPage}
              loadData={fetchNextPage}
            />
          )}
        </div>
      </main>
    </>
  );
};

export default OrdersPage;
