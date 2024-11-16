import React from "react";
import { OrderDetailsProps } from "./order-details.types";

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
            Placed on {new Date(data.createdAt).toLocaleDateString()}
          </p>
        </div>
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
    </div>
  );
};
