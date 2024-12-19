import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

interface PaymentSuccessDialogProps {
  open: boolean;
  orderNo: string;
  onTimeout: () => void;
}

export function PaymentSuccessDialog({
  open,
  orderNo,
  onTimeout,
}: PaymentSuccessDialogProps) {
  const [timeLeft, setTimeLeft] = useState(5);

  useEffect(() => {
    if (!open) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [open, onTimeout]);

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-col items-center gap-2">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
          <DialogTitle className="text-2xl text-center">
            Payment Successful!
          </DialogTitle>
        </DialogHeader>
        <div className="text-center space-y-4 py-4">
          <p>Thank you for shopping with us!</p>
          <p className="font-medium">Order Number: {orderNo}</p>
          <p>You will receive an email shortly with your order details.</p>
          <p className="text-sm text-muted-foreground">
            Redirecting to home page in {timeLeft} seconds...
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
