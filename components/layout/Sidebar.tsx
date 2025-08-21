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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
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
import { ChatButton } from "../ChatButton";

export const Sidebar = () => {
  const { isSidebarOpen, setIsSidebarOpen, isPendingChats, chats } =
    useGlobalContext();
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
        "fixed top-0 left-0 right-0 z-50 md:static flex flex-col items-center md:justify-start px-3.5 transition-all duration-300 ease-in-out bg-secondary overflow-clip",
        isSidebarOpen ? "w-full md:max-w-72 pr-3" : "w-full md:max-w-17 pr-4.5"
      )}
    >
      <div className="md:sticky md:top-0 md:h-screen w-full flex flex-col">
        {/* Top (logo + botón menu) */}
        <div className="w-full h-16 md:h-20 flex items-center justify-between md:justify-start">
          <LogoComponent className="md:hidden w-[250px]" />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className="rounded-full"
                  size="icon"
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
                  "sheetScrollHeight w-full mt-2 transition-opacity duration-300"
                )}
              >
                {isPendingChats ? (
                  <h4 className="px-3 mb-4 text-sm leading-none font-medium text-muted-foreground animate-pulse">
                    Cargando Chats
                  </h4>
                ) : (
                  chats &&
                  chats.length > 0 && (
                    <div>
                      <h4 className="px-3 mb-4 text-sm font-medium text-muted-foreground">
                        Chats
                      </h4>
                      {chats &&
                        chats.map((chat) => (
                          <ChatButton key={chat.id} chat={chat} />
                        ))}
                    </div>
                  )
                )}
              </ScrollArea>

              <div className="border-t border-white/10 pt-2 h-12 flex items-center mb-2">
                <AuthModal />
              </div>
            </nav>
          </SheetContent>
        </Sheet>

        {/* Desktop */}
        <nav className="hidden md:flex h-full flex-col items-start gap-2 my-4 w-full">
          <SidebarItems isSidebarOpen={isSidebarOpen} />

          <ScrollArea
            className={cn(
              "w-full mt-2 transition-opacity duration-300 scrollHeight",
              isSidebarOpen
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            )}
          >
            {isPendingChats ? (
              <h4 className="px-3 mb-4 text-sm leading-none font-medium text-muted-foreground animate-pulse">
                Cargando Chats
              </h4>
            ) : (
              chats &&
              chats.length > 0 && (
                <>
                  <h4 className="px-3 mb-4 text-sm font-medium text-muted-foreground">
                    Chats
                  </h4>
                  {chats?.map((chat) => (
                    <ChatButton key={chat.id} chat={chat} />
                  ))}
                </>
              )
            )}
            <ScrollBar orientation="vertical" />
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
      </div>
    </header>
  );
};
