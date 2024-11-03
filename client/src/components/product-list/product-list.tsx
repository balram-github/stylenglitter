import React, { useEffect, useRef, useCallback } from "react";
import { ProductListProps } from "./product-list.types";
import { ProductCard } from "../product-card/product-card";

export const ProductList = ({ data, loading, loadData, hasNext }: ProductListProps) => {
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
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-8 gap-x-6 p-4">
      {data.map((product) => (
        <ProductCard key={product.id} data={product} />
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
