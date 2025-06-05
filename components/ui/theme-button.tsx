"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function ThemeButton({
  isSidebarOpen,
  isMobile,
  rounded,
  align,
  side,
}: {
  isSidebarOpen?: boolean;
  isMobile?: boolean;
  rounded?: string;
  align: "start" | "end" | "center";
  side?: "top" | "right" | "bottom" | "left";
}) {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"default"}
          className={cn(rounded, "flex items-center gap-2 justify-center")}
          size={isMobile || isSidebarOpen ? "default" : "icon"}
        >
          {isMobile ? (
            <>
              <div>
                <span
                  className={cn(isMobile || isSidebarOpen ? "" : "sr-only")}
                >
                  Cambiar tema
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Sun className="size-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute size-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </div>
            </>
          ) : (
            <div className="flex items-center gap-1">
              <Sun className="size-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute size-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className={cn(isSidebarOpen ? "" : "sr-only")}>
                Cambiar tema
              </span>
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side={side} align={align}>
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Claro
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Oscuro
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          Sistema
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
