import { signIn } from "next-auth/react";
import { Button } from "../ui/button";
import Image from "next/image";

/**
 * Formulario de login con Google que utiliza el hook signIn de NextAuth configurado en auth.ts
 * @returns Componente de login con Google
 */

export function GoogleLogin() {
  return (
    <Button
      className="w-full"
      size="lg"
      onClick={() => {
        signIn("google", {
          redirectTo: "/",
        });
      }}
    >
      <Image
        src="google-icon.svg"
        className="size-8"
        alt="Google"
        width={32}
        height={32}
      />
      Iniciar sesión con Google
    </Button>
  );
}
