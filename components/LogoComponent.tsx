import { cn } from "@/lib/utils";

const LogoComponent = ({ className }: { className?: string }) => {
  return (
    <p className={cn("flex flex-col px-4", className)}>
      <span className="text-2xl ">MarketAI Labs.</span>
      <span className="font-light text-sm">Por José Salvador</span>
    </p>
  );
};

export default LogoComponent;
