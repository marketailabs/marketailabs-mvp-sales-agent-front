"use client";

import { Skeleton } from "@/components/ui/skeleton";

export const ChatSkeleton = () => {
  return (
    <section className="container mx-auto px-4 max-w-6xl w-full space-y-8 animate-pulse">
      {/* Skeleton del título */}
      <Skeleton className="h-6 w-1/3" />

      {/* Skeleton del mensaje del usuario */}
      <div className="space-y-2">
        <Skeleton className="h-5 w-1/4" />
        <Skeleton className="h-16 w-full" />
      </div>

      {/* Skeleton del resumen */}
      <div className="space-y-4">
        <Skeleton className="h-5 w-1/3" />

        {/* Nivel emocional, actitud y sesgo verbal */}
        <div className="flex flex-wrap gap-4">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>

        {/* Interpretación */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-12 w-full" />
        </div>

        {/* Recomendación */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-12 w-full" />
        </div>

        {/* Material sugerido */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-12 w-full" />
          <ul className="space-y-1">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/4" />
          </ul>
        </div>
      </div>
    </section>
  );
};
