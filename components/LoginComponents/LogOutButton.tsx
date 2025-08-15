import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

/**
 * Botón de logout que utiliza el hook signOut de NextAuth configurado en auth.ts
 * @returns Componente de logout
 */

export function LogOutButton() {
  return (
    <button
      className="flex items-center w-full cursor-pointer px-2 py-1.5"
      onClick={() => signOut()}
    >
      <LogOut className="size-4 mr-2" />
      Cerrar sesión
    </button>
  );
}
