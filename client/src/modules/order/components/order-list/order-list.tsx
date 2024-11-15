import React, { useEffect, useRef, useCallback } from "react";
import { OrderListProps } from "./order-list.types";
import { OrderCard } from "../order-card/order-card";

export const OrderList = ({
  data,
  loading,
  loadData,
  hasNext,
}: OrderListProps) => {
  const observerTarget = useRef(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && !loading && hasNext) {
        loadData();
      }
    },
    [loading, loadData, hasNext]
  );

  useEffect(() => {
    const element = observerTarget.current;
    const option = {
      threshold: 0,
    };

    const observer = new IntersectionObserver(handleObserver, option);
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [handleObserver]);

  return (
    <div className="flex flex-col gap-4">
      {data.map((order) => (
        <OrderCard key={order.id} data={order} />
      ))}

      <div ref={observerTarget} className="w-full h-10">
        {loading && (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        )}
      </div>
    </div>
  );
};
