"use client";

import { cn } from "@/lib/utils";
import { Bot, Zap } from "lucide-react";
import { usePathname } from "next/navigation";

const ExpressIcon = () => {
  const pathname = usePathname();

  return (
    <div className="relative flex items-center justify-center">
      <Zap
        className={cn(
          "absolute top-0 -right-1 size-2 transition-all duration-300",
          pathname === "/"
            ? "stroke-white fill-white dark:stroke-black dark:fill-black"
            : "stroke-dark-foreground dark:stroke-white fill-dark-foreground dark:fill-white"
        )}
        stroke="black"
        fill="black"
      />
      <Bot className="size-5" />
    </div>
  );
};

export default ExpressIcon;
