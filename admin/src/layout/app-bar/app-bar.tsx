import { MobileDrawer } from "@/components/mobile-drawer/mobile-drawer";
import { UserDropDown } from "@/components/user-drop-down/user-drop-down";
import { useUser } from "@/hooks/use-user";
import Link from "next/link";
import React from "react";

export const AppBar = () => {
  const { isLoggedIn } = useUser();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white">
      <div className="container mx-auto relative border-b-2 py-4 px-2 flex items-center gap-4">
        <div className="md:hidden">
          <MobileDrawer />
        </div>
        {isLoggedIn && (
          <div className="flex-1 md:flex md:items-center md:gap-2 hidden">
            <Link href="/orders">Orders</Link>
          </div>
        )}
        <div className="hidden md:block">
          <UserDropDown />
        </div>
      </div>
    </div>
  );
};
