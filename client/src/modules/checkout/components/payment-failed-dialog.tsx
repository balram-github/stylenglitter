import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { XCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface PaymentFailedDialogProps {
  open: boolean;
  errorMessage: string;
}

export function PaymentFailedDialog({
  open,
  errorMessage,
}: PaymentFailedDialogProps) {
  const [timeLeft, setTimeLeft] = useState(5);

  useEffect(() => {
    if (!open) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = "/";
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [open]);

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-col items-center gap-2">
          <XCircle className="h-16 w-16 text-red-500" />
          <DialogTitle className="text-2xl text-center">
            Payment Failed
          </DialogTitle>
        </DialogHeader>
        <div className="text-center space-y-4 py-4">
          <p>{errorMessage}</p>
          <p className="text-sm text-muted-foreground">
            Redirecting to home page in {timeLeft} seconds...
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
