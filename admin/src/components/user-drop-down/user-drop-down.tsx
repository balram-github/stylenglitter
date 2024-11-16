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

export const UserDropDown = () => {
  const { user, isLoggedIn, isLoading } = useUser();

  if (!isLoggedIn) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={isLoading}>
        <UserIcon size={20} className="cursor-pointer" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-50 bg-white">
        <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href="/authentication/logout">
          <DropdownMenuItem className="block">Logout</DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
