import { Skeleton } from "@/components/ui/skeleton";

function Loading() {
  return (
    <div className="flex min-h-screen min-w-screen flex-col md:flex-row relative">
      {/* Sidebar Skeleton */}
      <div className="mb-12 flex items-center px-4 md:px-2 bg-secondary h-16 w-full md:w-17 md:h-screen">
        <div className="flex md:flex-col justify-between items-center w-full h-full md:py-4">
          <Skeleton className="h-12 w-44 md:w-full" />
          <Skeleton className="h-12 w-14 md:hidden" />
          <div className="hidden md:flex w-full flex-col gap-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="max-w-4xl flex flex-col flex-1 px-8 mx-auto w-full mt-14 lg:mt-18">
        <div className="flex flex-col gap-4">
          <div className="justify-end w-full hidden lg:flex py-4 absolute top-1 right-5">
            <Skeleton className="h-8 w-48" />
          </div>

          <div className="flex flex-col gap-4 mb-8">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 md:h-12 w-full" />
            <Skeleton className="h-20 md:h-12 w-full" />
          </div>

          <div className="flex flex-col gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-16" />
              </div>
              <Skeleton className="h-44 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-12 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Loading;
