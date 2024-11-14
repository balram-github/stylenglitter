import React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";
import { Bus, Contact, LogOut, Menu, Package, UserIcon } from "lucide-react";
import Link from "next/link";
import { useUser } from "@/hooks/use-user";
import { TRACK_ORDER_URL } from "@/constants";
import { cn } from "@/lib/utils";

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
            <SheetClose asChild>
              <Link
                href="/profile"
                className="flex items-center gap-2 font-bold text-sm uppercase border-b-2 py-4"
              >
                <Package size={20} />
                Orders
              </Link>
            </SheetClose>
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
            <Link
              href={TRACK_ORDER_URL}
              target="_blank"
              className="flex items-center gap-2 font-bold text-sm uppercase border-b-2 py-4"
            >
              <Bus size={20} />
              Track Order
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link
              href="/contact-us"
              className={cn(
                "flex items-center gap-2 font-bold text-sm uppercase py-4",
                isLoggedIn && "border-b-2"
              )}
            >
              <Contact size={20} />
              Contact Us
            </Link>
          </SheetClose>
          {isLoggedIn && (
            <SheetClose asChild>
              <Link
                href="/authentication/logout"
                className="flex items-center gap-2 font-bold text-sm uppercase py-4"
              >
                <LogOut size={20} />
                Logout
              </Link>
            </SheetClose>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
