import { Button } from "@/components/ui/button";
import { Menu, Search, ShoppingCart } from "lucide-react";
import React from "react";

export const AppBar = () => {
  return (
    <div className="mx-auto container py-4 px-2 text-center border-b-2 relative">
      <div className="absolute left-0 top-[50%] translate-y-[-50%]">
        <Button className="md:hidden" variant="ghost" size="icon">
          <Menu size={20} />
        </Button>
      </div>
      <p className="text-2xl md:text-3xl">Style & Glitter</p>
      <div className="flex items-center gap-1 absolute right-0 top-[50%] translate-y-[-50%]">
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
