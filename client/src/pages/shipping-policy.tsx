import {
  COD_ORDER_DELIVERY_CHARGE,
  PREPAID_ORDER_DELIVERY_CHARGE,
} from "@/constants";
import { ShippingPolicySeo } from "@/seo/shipping-policy.seo";
import Head from "next/head";
import React from "react";

const ShippingPolicy = () => {
  return (
    <>
      <Head>
        <ShippingPolicySeo />
      </Head>
      <main className="container px-4 mx-auto">
        <div className="py-6 md:py-10">
          <h1 className="text-3xl md:text-5xl font-bold mb-8 md:mb-12">
            Shipping Policy
          </h1>
        </div>
        <div className="text-gray-700">
          <p className="text-base md:text-lg mb-4 md:mb-8 leading-8">
            By placing an order with us, you agree to the terms outlined below.
          </p>
          <p className="text-base md:text-lg mb-4 md:mb-8 leading-8 font-bold">
            1. Dispatch Time:
          </p>
          <p className="text-base md:text-lg mb-4 md:mb-8 leading-8">
            We aim to dispatch all orders within 24 hours of receiving your
            payment confirmation. Orders placed on weekends or public holidays
            will be processed on the next business day.
          </p>
          <p className="text-base md:text-lg mb-4 md:mb-8 leading-8 font-bold">
            2. Estimated Delivery Times:
          </p>
          <ol className="list-decimal list-inside text-base md:text-lg mb-4 md:mb-8 leading-8">
            <li>
              In Cities - Tier 1, 2 & 3:
              <ul className="list-disc list-inside text-base md:text-lg mb-4 md:mb-8 leading-8">
                <li>
                  Orders within cities can typically be expected to be delivered
                  within 4-6 business days from the date of dispatch.
                </li>
              </ul>
            </li>
            <li>
              Non-City Areas:
              <ul className="list-disc list-inside text-base md:text-lg mb-4 md:mb-8 leading-8">
                <li>
                  For delivery locations outside major cities, please allow 5-8
                  business days from the date of dispatch for your order to
                  reach you.
                </li>
              </ul>
            </li>
          </ol>
          <p className="text-base md:text-lg mb-4 md:mb-8 leading-8 font-bold">
            3. Tracking Your Order:
          </p>
          <p className="text-base md:text-lg mb-4 md:mb-8 leading-8">
            Once your order is dispatched, you will receive an email containing
            a tracking number and a link to track the status of your shipment.
            You can use this information to monitor the progress of your
            delivery.
          </p>
          <p className="text-base md:text-lg mb-4 md:mb-8 leading-8 font-bold">
            4. Shipping Partners:
          </p>
          <p className="text-base md:text-lg mb-4 md:mb-8 leading-8">
            We have partnered with reputable courier services to ensure reliable
            and secure delivery of your orders. While we strive to deliver on
            time, unforeseen circumstances may cause delays. We appreciate your
            understanding in such cases.
          </p>
          <p className="text-base md:text-lg mb-4 md:mb-8 leading-8 font-bold">
            5. Shipping Charges:
          </p>
          <ul className="list-disc list-inside text-base md:text-lg mb-4 md:mb-8 leading-8">
            <li>
              Prepaid order: <strong>Rs {PREPAID_ORDER_DELIVERY_CHARGE}</strong>
            </li>
            <li>
              COD (Cash on Delivery) mode: Customer to pay{" "}
              <strong>Rs {COD_ORDER_DELIVERY_CHARGE}</strong> online upfront to
              place a COD order
            </li>
          </ul>
          <p className="text-base md:text-lg mb-4 md:mb-8 leading-8 font-bold">
            6. Delivery Attempts:
          </p>
          <p className="text-base md:text-lg mb-4 md:mb-8 leading-8">
            Our courier partners will make multiple attempts to deliver your
            order. If you are unavailable during the delivery attempts, the
            courier company may leave a notification, and you may need to
            arrange an alternative delivery time.
          </p>
          <p className="text-base md:text-lg mb-4 md:mb-8 leading-8 font-bold">
            7. Address Accuracy:
          </p>
          <p className="text-base md:text-lg mb-4 md:mb-8 leading-8">
            Please ensure that your shipping address is accurate and complete.
            Style Glitter is not responsible for delays or non-delivery due to
            inaccurate or incomplete address details provided by the customer.
          </p>
          <p className="text-base md:text-lg mb-4 md:mb-8 leading-8 font-bold">
            8. International Shipping:
          </p>
          <p className="text-base md:text-lg mb-4 md:mb-8 leading-8">
            We offer shipping within India only
          </p>
          <p className="text-base md:text-lg mb-4 md:mb-8 leading-8 font-bold">
            9. Delivery Delays:
          </p>
          <p className="text-base md:text-lg mb-4 md:mb-8 leading-8">
            While we strive to meet our estimated delivery times, factors such
            as unforeseen circumstances, weather conditions, or public holidays
            may cause delays. Style Glitter will not be held liable for such
            delays.
          </p>
          <p className="text-base md:text-lg mb-4 md:mb-8 leading-8 font-bold">
            10. Order Status Inquiries:
          </p>
          <p className="text-base md:text-lg mb-4 md:mb-8 leading-8">
            For any inquiries related to your order status, tracking
            information, or delivery concerns, please contact our customer
            support at{" "}
            <a href="mailto:styleglitter001@gmail.com" className="underline">
              styleglitter001@gmail.com
            </a>
          </p>
          <p className="text-base md:text-lg mb-4 md:mb-8 leading-8 font-bold">
            11. Changes to Shipping Policy:
          </p>
          <p className="text-base md:text-lg mb-4 md:mb-8 leading-8">
            Style Glitter reserves the right to update or modify this Shipping
            Policy at any time. Changes will be effective upon posting to the
            website.
          </p>
        </div>
      </main>
    </>
  );
};

export default ShippingPolicy;
