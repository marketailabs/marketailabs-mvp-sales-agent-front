"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { AppWindowMac } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { cn } from "@/lib/utils";
import { useMediaQueryCustom } from "@/hook/mediaQueryHook";
import { LogoComponent } from "../LogoComponent";

import { AuthModal } from "../LoginComponents/AuthModal";
import { SheetItems, SidebarItems } from "../SidebarItems";
import { useGlobalContext } from "@/provider/GlobalContext";
import Link from "next/link";

export const Sidebar = () => {
  const { isSidebarOpen, setIsSidebarOpen, chats = [] } = useGlobalContext();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const isMobile = useMediaQueryCustom("(max-width: 768px)");

  useEffect(() => {
    if (!isMobile) {
      setIsSheetOpen(false);
    }
  }, [isMobile]);

  const toggle = () => {
    if (isMobile) {
      setIsSheetOpen(!isSheetOpen);
    } else {
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  const closeSheet = () => {
    if (isMobile) {
      setIsSheetOpen(false);
    } else {
      setIsSidebarOpen(false);
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 z-50 flex flex-col items-center md:items-start justify-between px-3.5 transition-all duration-300 ease-in-out bg-secondary md:h-screen overflow-clip",
        isSidebarOpen ? "w-full md:max-w-64 pr-3" : "w-full md:max-w-17 pr-4.5"
      )}
    >
      {/* Menu */}
      <div className="w-full h-16 md:h-8 mt-0 md:mt-4">
        <div className="h-full w-full flex justify-between md:justify-start items-center">
          <LogoComponent className="md:hidden w-[250px]" />

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={"ghost"}
                  className="rounded-full"
                  size={"icon"}
                  onClick={toggle}
                >
                  <AppWindowMac className="size-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Menu</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Mobile */}
      <Sheet open={isSheetOpen} onOpenChange={closeSheet}>
        <SheetContent className="w-[280px] ">
          <SheetHeader className="my-2">
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>

          <nav className="flex-1 px-4 gap-2 flex flex-col">
            <SheetItems />

            <ScrollArea
              className={cn(
                "h-[calc(90vh-10rem)] w-full mt-2 transition-opacity duration-300"
              )}
            >
              <div>
                <h4 className="px-3 mb-4 text-sm leading-none font-medium text-muted-foreground">
                  Chats
                </h4>
                {chats &&
                  chats.map((chat) => (
                    <Button
                      key={chat.id}
                      variant={"ghost"}
                      className="px-3 w-full justify-start truncate"
                      asChild
                    >
                      <Link href={`/chat/${chat.id}`}>
                        <p>{chat.title}</p>
                      </Link>
                    </Button>
                  ))}
              </div>
            </ScrollArea>

            <div className="border-t border-white/10 pt-2 h-12 flex items-center mb-2">
              <AuthModal />
            </div>
          </nav>
        </SheetContent>
      </Sheet>

      {/* Desktop */}
      <nav className="hidden md:flex flex-1 h-full flex-col justify-end items-start my-4 gap-2 w-full">
        <SidebarItems isSidebarOpen={isSidebarOpen} />

        <ScrollArea
          className={cn(
            "h-[calc(90vh-9rem)] w-full mt-2 transition-opacity duration-300",
            isSidebarOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          )}
        >
          <div>
            <h4 className="px-3 mb-4 text-sm leading-none font-medium text-muted-foreground">
              Chats
            </h4>
            {chats &&
              chats.map((chat) => (
                <Button
                  key={chat.id}
                  variant={"ghost"}
                  className="px-3 w-full justify-start truncate"
                  asChild
                >
                  <Link href={`/chat/${chat.id}`}>
                    <p>{chat.title}</p>
                  </Link>
                </Button>
              ))}
          </div>
        </ScrollArea>

        <div
          className={cn(
            "border-t border-white/10 pt-2 h-12 flex items-center mb-2",
            isSidebarOpen ? "w-full" : "w-max"
          )}
        >
          <AuthModal />
        </div>
      </nav>
    </header>
  );
};
