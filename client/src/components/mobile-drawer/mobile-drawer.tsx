import React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";
import { LogOut, Menu, Package, UserIcon } from "lucide-react";
import Link from "next/link";
import { useUser } from "@/hooks/use-user";

export const MobileDrawer = () => {
  const { isLoggedIn } = useUser();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <div className="flex flex-col py-4">
          {isLoggedIn ? (
            <>
              <SheetClose asChild>
                <Link
                  href="/profile"
                  className="flex items-center gap-2 font-bold text-sm uppercase border-b-2 py-4"
                >
                  <Package size={20} />
                  Orders
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link
                  href="/authentication/logout"
                  className="flex items-center gap-2 font-bold text-sm uppercase border-b-2 py-4"
                >
                  <LogOut size={20} />
                  Logout
                </Link>
              </SheetClose>
            </>
          ) : (
            <SheetClose asChild>
              <Link
                href="/authentication/login"
                className="flex items-center gap-2 font-bold text-sm uppercase border-b-2 py-4"
              >
                <UserIcon size={20} />
                Login / Register
              </Link>
            </SheetClose>
          )}
          <SheetClose asChild>
            <Link href="/contact" className="font-bold text-sm uppercase py-4">
              Contact Us
            </Link>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
};
