import { Button } from "./ui/button";
import { Loader2, RefreshCcw, SendHorizonal } from "lucide-react";

import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "./ui/tooltip";

const SendInputButton = ({
  resetForm,
  children,
  isSubmitting,
}: {
  resetForm: () => void;
  children: React.ReactNode;
  isSubmitting: boolean;
}) => {
  return (
    <div className="relative">
      {children}

      <div className="absolute top-[42px] right-1.5 flex gap-1">
        {/* Reset button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={"default"}
                size={"icon"}
                className="rounded-full flex items-center justify-center"
                onClick={resetForm}
                type="button"
              >
                <RefreshCcw className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Reiniciar</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Send button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={"default"}
                size={"icon"}
                className="rounded-full flex items-center justify-center"
                type="submit"
                disabled={isSubmitting}
                aria-disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <SendHorizonal className="size-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Enviar</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default SendInputButton;
