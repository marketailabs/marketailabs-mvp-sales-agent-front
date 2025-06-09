import { cn } from "@/lib/utils";

export const LogoComponent = ({ className }: { className?: string }) => {
  return (
    <p className={cn("flex flex-col px-4", className)}>
      <span className="text-2xl ">MarketAI Labs.</span>
    </p>
  );
};
