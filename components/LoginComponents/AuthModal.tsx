"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { LogIn } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { FormLogin } from "./FormLogin";
import { FormRegister } from "./FormRegister";
import { GoogleLogin } from "./GoogleLogin";
import { useSession } from "next-auth/react";
import { UserDropdown } from "../UserDropdown";
import { cn } from "@/lib/utils";
import { useGlobalContext } from "@/provider/GlobalContext";

export const AuthModal = () => {
  const { data: session } = useSession();
  const { isSidebarOpen, openLoginModal, setOpenLoginModal } =
    useGlobalContext();

  if (session) {
    return <UserDropdown isSidebarOpen={isSidebarOpen} />;
  }

  return (
    <Dialog open={openLoginModal} onOpenChange={setOpenLoginModal}>
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          className={cn(
            "justify-start px-2 transition-all duration-300",
            isSidebarOpen ? "px-3" : "px-2"
          )}
          size={isSidebarOpen ? "default" : "icon"}
        >
          <LogIn className="size-5" />
          <span
            className={cn(
              isSidebarOpen ? "opacity-100" : "opacity-0 sr-only",
              "transition-opacity duration-600"
            )}
          >
            Iniciar Sesión
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md p-6 sm:p-8 rounded-2xl shadow-xl bg-background">
        <DialogHeader className="text-center mb-4">
          <DialogTitle className="text-2xl font-bold tracking-tight">
            MarketsAI Labs
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Iniciá sesión o registrate para continuar
          </p>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="login">Iniciar sesión</TabsTrigger>
            <TabsTrigger value="register">Registrarse</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="grid gap-4">
            <FormLogin />

            <GoogleLogin />
          </TabsContent>
          <TabsContent value="register" className="grid gap-4">
            <FormRegister />

            <GoogleLogin />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
