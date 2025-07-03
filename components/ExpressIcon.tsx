import { Bot, Zap } from "lucide-react";

const ExpressIcon = () => {
  return (
    <div className="relative flex items-center justify-center">
      <Zap
        className="absolute top-0 -right-1 size-2 stroke-white fill-white dark:stroke-black dark:fill-black"
        stroke="black"
        fill="black"
      />
      <Bot className="size-5" />
    </div>
  );
};

export default ExpressIcon;
