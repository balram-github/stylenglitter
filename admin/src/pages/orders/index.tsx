import OrdersTable from "@/modules/order/components/orders-table/orders-table";
import Head from "next/head";
import React from "react";

const OrderListPage = () => {
  return (
    <>
      <Head>
        <title>Orders</title>
      </Head>
      <main>
        <div className="py-6 md:py-10 container mx-auto">
          <OrdersTable />
        </div>
      </main>
    </>
  );
};

export default OrderListPage;
