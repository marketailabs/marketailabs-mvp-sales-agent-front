import { Skeleton } from "@/components/ui/skeleton";

function Loading() {
  return (
    <div className="flex-1 relative font-sans mt-4 md:mt-0 md:ml-17">
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
