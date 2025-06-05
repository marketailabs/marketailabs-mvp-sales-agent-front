"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { AppWindowMac, Bot, Brain } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ThemeButton } from "../ui/theme-button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { cn } from "@/lib/utils";
import { useMediaQueryCustom } from "@/hook/mediaQueryHook";
import { LogoComponent } from "../LogoComponent";
import Link from "next/link";

export const Sidebar = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
        "flex flex-col items-center md:items-start justify-between px-4 transition-all duration-200 ease-in-out bg-secondary",
        isSidebarOpen ? "w-56" : "w-full md:w-17"
      )}
    >
      <div className="w-full h-16">
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

      <Sheet open={isSheetOpen} onOpenChange={closeSheet}>
        <SheetContent className="w-[260px] ">
          <SheetHeader className="my-2">
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>

          <nav className="flex-1 px-4 gap-2 flex flex-col">
            <Button asChild>
              <Link href="/">
                <span>Prospector</span>
                <Brain className="size-4" />
              </Link>
            </Button>

            <Button asChild>
              <Link href="/asistenteia">
                <span>Prospector Assistant</span>
                <Bot className="size-4" />
              </Link>
            </Button>

            <div className="flex-1 flex flex-col justify-end items-end py-4 gap-2">
              {/* <Button className="w-max">
                <span>Recargar Creditos</span>
                <Wallet className="size-4" />
              </Button> */}

              <ThemeButton
                isMobile={isMobile}
                align="end"
                side="left"
                rounded={"rounded-md"}
              />
            </div>
          </nav>
        </SheetContent>
      </Sheet>

      <nav className="hidden md:flex flex-1 h-full flex-col justify-end items-start my-4 gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                asChild
                className="rounded-full"
                size={isSidebarOpen ? "default" : "icon"}
              >
                <Link href="/">
                  <Brain className="size-5" />
                  <span className={cn(isSidebarOpen ? "" : "sr-only")}>
                    Prospector
                  </span>
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Prospector</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                asChild
                className="rounded-full"
                size={isSidebarOpen ? "default" : "icon"}
              >
                <Link href="/asistenteia">
                  <Bot className="size-5" />
                  <span className={cn(isSidebarOpen ? "" : "sr-only")}>
                    Prospector Assistant
                  </span>
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Prospector Assistant</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="rounded-full"
                size={isSidebarOpen ? "default" : "icon"}
              >
                <Wallet className="size-5" />
                <span className={cn(isSidebarOpen ? "" : "sr-only")}>
                  Recargar Creditos
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Recargar Creditos</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider> */}

        <ThemeButton
          rounded={"rounded-full"}
          align="end"
          side="right"
          isSidebarOpen={isSidebarOpen}
        />
      </nav>
    </header>
  );
};
