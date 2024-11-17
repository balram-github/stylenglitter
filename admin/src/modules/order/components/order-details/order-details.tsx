import React, { useState } from "react";
import { OrderDetailsProps } from "./order-details.types";
import { OrderStatusDialog } from "../order-status-dialog/order-status-dialog";
import { OrderStatusBadge } from "../order-status-badge/order-status-badge";
import { OrderStatus, TypeOfPayment } from "@/services/order/order.types";
import { updateOrderStatus } from "@/services/order/order.service";
import { toast } from "@/hooks/use-toast";

export const OrderDetails = ({ data, refetch }: OrderDetailsProps) => {
  const [isUpdateStatusDialogOpen, setIsUpdateStatusDialogOpen] =
    useState(false);

  const handleUpdateStatus = async (
    newStatus: OrderStatus,
    trackingNumber?: string
  ) => {
    try {
      await updateOrderStatus(data.id, newStatus, trackingNumber);
      setIsUpdateStatusDialogOpen(false);
      refetch();
      toast({
        title: "Order status updated!",
        description: "The order status has been updated successfully",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to update order status!",
        description: "Please try again later",
      });
    }
  };

  return (
    <>
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
          <OrderStatusBadge
            status={data.status}
            onClick={() => setIsUpdateStatusDialogOpen(true)}
          />
        </div>

        {/* Tracking Information */}
        {data.trackingNo && (
          <div className="border-t pt-4">
            <h3 className="font-bold mb-2">Tracking Information</h3>
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-600">
                Tracking Number:{" "}
                <span className="font-medium">{data.trackingNo || "-"}</span>
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
      <OrderStatusDialog
        open={isUpdateStatusDialogOpen}
        onOpenChange={setIsUpdateStatusDialogOpen}
        currentStatus={data.status}
        currentTrackingNumber={data.trackingNo}
        onSubmit={handleUpdateStatus}
      />
    </>
  );
};
