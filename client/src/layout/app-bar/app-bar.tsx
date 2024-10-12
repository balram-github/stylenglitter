import { Button } from "@/components/ui/button";
import { Menu, Search, ShoppingCart } from "lucide-react";
import React from "react";

export const AppBar = () => {
  return (
    <div className="mx-auto container py-1 md:py-4 px-2 flex justify-between items-center border-b-2">
      <div>
        <Button className="md:hidden" variant="ghost" size="icon">
          <Menu size={20} />
        </Button>
      </div>
      <p className="text-2xl">Style & Glitter</p>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon">
          <Search size={20} />
        </Button>
        <Button variant="ghost" size="icon">
          <ShoppingCart size={20} />
        </Button>
      </div>
    </div>
  );
};
