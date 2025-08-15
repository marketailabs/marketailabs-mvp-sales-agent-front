import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LogOutButton } from "./LoginComponents/LogOutButton";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";
import { HandCoins, HelpCircle, UserRound } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { useGlobalContext } from "@/provider/GlobalContext";

export const UserDropdown = ({ isSidebarOpen }: { isSidebarOpen: boolean }) => {
  const { data: session } = useSession();
  const { sanityUser, setOpenProfileModal, setOpenPaymentModal } =
    useGlobalContext();

  if (!session?.user) {
    return null;
  }

  const { credits } = sanityUser;

  const userImage = session.user.image!;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"ghost"}
          className="px-2 h-14 w-full justify-start"
          size={"lg"}
        >
          {session.user.image ? (
            <Avatar className="size-8 ">
              <AvatarImage src={userImage} />
              <AvatarFallback>{session.user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
          ) : (
            <Avatar className="size-8 ">
              <AvatarFallback>{session.user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
          )}

          <p
            className={cn(
              "flex flex-col text-start transition-opacity duration-300",
              isSidebarOpen ? "opacity-100 " : "md:opacity-0 md:sr-only"
            )}
          >
            <span className="text-sm font-medium">{session.user?.name}</span>
            <span className="text-xs text-muted-foreground">
              {session.user?.email}
            </span>
          </p>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-58 px-1.5">
        <DropdownMenuLabel className="pt-2 pb-1 px-2">
          <p className="text-sm font-medium">{session.user?.name}</p>
          <p className="text-xs text-muted-foreground">
            Creditos restantes: {credits} créditos
          </p>
        </DropdownMenuLabel>
        <Separator className="my-1" />

        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => setOpenPaymentModal(true)}
        >
          <HandCoins className="size-4" />
          <span className="ml-2">Comprar Créditos</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => setOpenProfileModal(true)}
        >
          <UserRound className="size-4" />
          <span className="ml-2">Perfil</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <HelpCircle className="size-4" />
          <span className="ml-2">Ayuda</span>
        </DropdownMenuItem>
        <Separator className="my-1" />
        <DropdownMenuItem className="p-0">
          <LogOutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
