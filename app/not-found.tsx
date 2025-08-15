import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import Link from "next/link";

const NotFound = () => {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center px-4 py-12 text-center bg-background">
      <div className="max-w-md w-full flex flex-col items-center gap-6 p-8 rounded-2xl shadow-md dark:shadow-lg bg-card border border-border">
        <div className="flex items-center justify-center w-24 h-24 rounded-full bg-destructive/10">
          <Info className="w-16 h-16 text-destructive" />
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight text-foreground">
          404
        </h1>
        <p className="text-lg text-muted-foreground">
          Lo sentimos, no pudimos encontrar esta página.
        </p>
        <Button asChild className="mt-4">
          <Link href="/">Volver al inicio</Link>
        </Button>
      </div>
    </main>
  );
};

export default NotFound;
