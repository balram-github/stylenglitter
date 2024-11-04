import React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";
import { Menu, UserIcon } from "lucide-react";
import Link from "next/link";

export const MobileDrawer = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <div className="flex flex-col py-4">
          <SheetClose asChild>
            <Link
              href="/authentication/login"
              className="flex items-center gap-2 font-bold text-sm uppercase border-b-2 py-4"
            >
              <UserIcon size={20} />
              Login / Register
            </Link>
          </SheetClose>
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
