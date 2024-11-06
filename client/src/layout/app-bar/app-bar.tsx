import { MobileDrawer } from "@/components/mobile-drawer/mobile-drawer";
import { UserDropDown } from "@/components/user-drop-down/user-drop-down";
import { Cart } from "@/modules/cart/components/cart/cart";
import Link from "next/link";
import React from "react";

export const AppBar = () => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white">
      <div className="container mx-auto relative border-b-2 py-4 px-2 text-center ">
        <div className="absolute left-0 top-[50%] translate-y-[-50%] md:hidden">
          <MobileDrawer />
        </div>
        <Link href="/" className="text-2xl md:text-3xl">
          Style Glitter
        </Link>
        <div className="flex items-center gap-1 absolute right-1 top-[50%] translate-y-[-50%]">
          {/* <Button variant="ghost" size="icon">
            <Search size={20} />
          </Button> */}
          <div className="hidden md:block">
            <UserDropDown />
          </div>
          <Cart />
        </div>
      </div>
    </div>
  );
};
