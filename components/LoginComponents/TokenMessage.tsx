"use client";

import { AlertTriangle, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

export const TokenMessage = ({
  token,
}: {
  token: { success: boolean; error: string | undefined };
}) => {
  const [tokenMessage, setTokenMessage] = useState(token.success);

  useEffect(() => {
    setTokenMessage(token.success);
  }, [token]);

  return (
    <>
      {tokenMessage ? (
        <span className="flex justify-center items-center gap-2 text-green-600 dark:text-green-400">
          <ShieldCheck className="h-5 w-5" />
          <span className="text-sm">
            Tu token es válido. Puedes restablecer tu contraseña.
          </span>
        </span>
      ) : (
        <span className="flex flex-col justify-center items-center gap-2 text-yellow-400 dark:text-yellow-400">
          <AlertTriangle className="h-5 w-5" />
          <span className="text-sm">
            Tu token es inválido. Por favor, solicita uno nuevo.
          </span>

          <span className="text-xs text-muted-foreground text-center">
            Si contunias con el proceso de restablecimiento de contraseña, no
            sucederá nada.
          </span>
        </span>
      )}
    </>
  );
};
