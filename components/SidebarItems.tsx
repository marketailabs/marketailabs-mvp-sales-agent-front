"use client";

import ExpressIcon from "@/components/ExpressIcon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const SidebarLinks = [
  {
    label: "Profiler",
    href: "/",
    icon: <Brain className="size-5" />,
  },
  {
    label: "Profiler Express",
    href: "/asistente-exp",
    icon: <ExpressIcon />,
  },
];

export const SheetItems = () => {
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
    </>
  );
};

export const SidebarItems = ({ isSidebarOpen }: { isSidebarOpen: boolean }) => {
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
    </div>
  );
};
