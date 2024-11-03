import { Button } from "@/components/ui/button";
import { Menu, Search, ShoppingCart } from "lucide-react";
import Link from "next/link";
import React from "react";

export const AppBar = () => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white">
      <div className="container mx-auto relative border-b-2 py-4 px-2 text-center ">
        <div className="absolute left-0 top-[50%] translate-y-[-50%]">
          <Button className="md:hidden" variant="ghost" size="icon">
            <Menu size={20} />
          </Button>
        </div>
        <Link href="/" className="text-2xl md:text-3xl">
          Style & Glitter
        </Link>
        <div className="flex items-center gap-1 absolute right-0 top-[50%] translate-y-[-50%]">
          <Button variant="ghost" size="icon">
            <Search size={20} />
          </Button>
          <Button variant="ghost" size="icon">
            <ShoppingCart size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};
