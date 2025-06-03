import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import Link from "next/link";
import React from "react";

const NotFound = () => {
  return (
    <div className="flex min-h-screen min-w-screen flex-col items-center justify-center">
      <div
        className="flex flex-col items-center gap-2 p-16 rounded-lg shadow-[0px_4px_8px_1px_rgba(0,0,0,0.15)] 
      dark:shadow-[0px_8px_10px_2px_rgba(0,0,0,0.25)] bg-background"
      >
        <div className="flex justify-center items-center w-36 h-36 rounded-full bg-red-600/20">
          <Info className="size-24 text-red-600/70" />
        </div>
        <h1 className="text-4xl font-bold mt-4">404</h1>
        <p className="text-lg mt-2">Página no encontrada</p>

        <Button className="mt-4 w-full" asChild>
          <Link href="/">Volver al inicio</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
