import { cn } from "@/lib/utils";
import React from "react";
import { Loader2 } from "lucide-react";

interface Props {
  className?: string;
}

export const Spinner = ({ className }: Props) => {
  return <Loader2 className={cn("mr-2 h-4 w-4 animate-spin", className)} />;
};
