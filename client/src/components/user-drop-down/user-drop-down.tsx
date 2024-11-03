import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useUser } from "@/hooks/use-user";
import { UserIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const UserDropDown = () => {
  const { user, isLoggedIn, isLoading } = useUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={isLoading}>
        <UserIcon
          size={20}
          className={cn("cursor-pointer", isLoading && "cursor-not-allowed")}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-50 bg-white">
        <DropdownMenuLabel>
          {isLoggedIn ? user?.name : "Guest"}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isLoggedIn ? (
          <>
            <Link href="/orders">
              <DropdownMenuItem className="block">Orders</DropdownMenuItem>
            </Link>
            <Link href="/authentication/logout">
              <DropdownMenuItem className="block">Logout</DropdownMenuItem>
            </Link>
          </>
        ) : (
          <>
            <Link href="/authentication/login">
              <DropdownMenuItem className="block">Login</DropdownMenuItem>
            </Link>
            <Link href="/authentication/register">
              <DropdownMenuItem className="block">Register</DropdownMenuItem>
            </Link>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
