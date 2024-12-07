import React from "react";
import { OrderDetailsProps } from "./order-details.types";
import { OrderStatusBadge } from "../order-status-badge/order-status-badge";
import { TRACK_ORDER_URL } from "@/constants";
import { TypeOfPayment } from "@/services/order/order.types";

export const OrderDetails = ({ data }: OrderDetailsProps) => {
  return (
    <div className="space-y-6 py-4 sm:py-6 bg-white rounded-lg shadow-sm">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">
            Order #<span className="font-bold">{data.orderNo}</span>
          </h2>
          <p className="text-sm text-gray-500">
            Placed on {new Date(data.createdAt).toLocaleString()}
          </p>
        </div>
        <OrderStatusBadge status={data.status} />
      </div>

      {/* Tracking Information */}
      {data.trackingNo && (
        <div className="border-t pt-4">
          <h3 className="font-bold mb-2">Tracking Information</h3>
          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-600">
              Tracking Number:{" "}
              <span className="font-medium">{data.trackingNo}</span>
            </p>
            <a
              href={TRACK_ORDER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
            >
              Track Order →
            </a>
          </div>
        </div>
      )}

      {/* Shipping Address */}
      <div className="border-t pt-4">
        <h3 className="font-bold mb-2">Shipping Address</h3>
        <div className="text-sm text-gray-600">
          <p className="mb-1">{data.shippingAddress.name}</p>
          <p className="mb-1">{data.shippingAddress.addressLine}</p>
          <p className="mb-1">
            {data.shippingAddress.city}, {data.shippingAddress.state}{" "}
            {data.shippingAddress.pinCode}
          </p>
          <p className="mb-1">{data.shippingAddress.country}</p>
          <p className="mb-1">Phone: {data.shippingAddress.phoneNumber}</p>
          {data.shippingAddress.email && (
            <p className="mb-1">Email: {data.shippingAddress.email}</p>
          )}
        </div>
      </div>

      {/* Payment Details */}
      <div className="border-t pt-4">
        <h3 className="font-bold mb-2">Payment Details</h3>
        <div className="text-sm text-gray-600">
          <p className="mb-2">
            Payment Method:{" "}
            <span className="font-bold uppercase">{data.paymentMethod}</span>
          </p>
          <p className="mb-2">
            Amount Paid:{" "}
            <span className="font-bold">Rs. {data.payment.amount}</span>
          </p>
          {data.paymentMethod === TypeOfPayment.COD && (
            <p className="mb-2">
              Amount to pay on delivery:{" "}
              <span className="font-bold">
                Rs. {data.payment.pendingAmount}
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
