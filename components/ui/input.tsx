import * as React from "react";

import { cn } from "@/lib/utils";

function Input({
  className,
  type,
  rounded = false,
  ...props
}: React.ComponentProps<"input"> & { rounded?: boolean }) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        "w-full h-12 shadow-[0px_4px_8px_1px_rgba(0,0,0,0.15)] dark:shadow-[0px_8px_10px_2px_rgba(0,0,0,0.25)] bg-background",
        rounded ? "rounded-full" : "rounded-md",
        className
      )}
      {...props}
    />
  );
}

export { Input };
