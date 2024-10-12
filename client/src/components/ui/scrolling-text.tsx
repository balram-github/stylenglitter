import { cn } from "@/lib/utils";
import React from "react";

interface ScrollingTextProps {
  children: React.ReactNode;
  className?: string;
}

export const ScrollingText = ({ children, className }: ScrollingTextProps) => {
  return (
    <div className={cn("overflow-hidden", className)}>
      <div className="whitespace-nowrap animate-scroll">{children}</div>
    </div>
  );
};
