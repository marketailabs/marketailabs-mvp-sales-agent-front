"use client";

import ExpressIcon from "@/components/ExpressIcon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Brain, HandCoins } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useGlobalContext } from "@/provider/GlobalContext";

const SidebarLinks = [
  {
    label: "Profiler Express",
    href: "/",
    icon: <ExpressIcon />,
  },
  {
    label: "Profiler",
    href: "/profiler",
    icon: <Brain className="size-5" />,
  },
];

export const SheetItems = () => {
  const { setOpenPaymentModal, openPaymentModal } = useGlobalContext();
  const pathname = usePathname();

  return (
    <>
      {SidebarLinks.map((link, index) => (
        <Button
          variant={pathname === link.href ? "default" : "ghost"}
          asChild
          key={index}
          className="w-full justify-start px-3 transition-all duration-300"
        >
          <Link href={link.href}>
            {link.icon}
            <span>{link.label}</span>
          </Link>
        </Button>
      ))}

      <Button
        variant={openPaymentModal ? "default" : "ghost"}
        onClick={() => setOpenPaymentModal(true)}
        className="w-full justify-start px-3 transition-all duration-300"
      >
        <HandCoins className="size-4" />
        <span className="ml-2">Actualizar plan</span>
      </Button>
    </>
  );
};

export const SidebarItems = ({ isSidebarOpen }: { isSidebarOpen: boolean }) => {
  const { setOpenPaymentModal, openPaymentModal } = useGlobalContext();
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-full gap-2">
      {SidebarLinks.map((link, index) => (
        <TooltipProvider key={index}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={pathname === link.href ? "default" : "ghost"}
                asChild
                className={cn(
                  "w-full justify-start px-2 transition-all duration-300",
                  isSidebarOpen ? "px-3" : "px-2"
                )}
                size={isSidebarOpen ? "default" : "icon"}
              >
                <Link href={link.href}>
                  {link.icon}
                  <span
                    className={cn(
                      isSidebarOpen ? "opacity-100" : "opacity-0 sr-only",
                      "transition-opacity duration-600"
                    )}
                  >
                    {link.label}
                  </span>
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{link.label}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={openPaymentModal ? "default" : "ghost"}
              onClick={() => setOpenPaymentModal(true)}
              className={cn(
                "w-full justify-start px-2 transition-all duration-300",
                isSidebarOpen ? "px-3" : "px-2"
              )}
              size={isSidebarOpen ? "default" : "icon"}
            >
              <HandCoins className="size-4" />
              <span
                className={cn(
                  isSidebarOpen ? "opacity-100" : "opacity-0 sr-only",
                  "transition-opacity duration-600"
                )}
              >
                Actualizar plan
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Actualizar plan</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
