"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSession } from "next-auth/react";
import { useGlobalContext } from "@/provider/GlobalContext";
import {
  HandCoins,
  Mail,
  UserCircle,
  BadgeCheck,
  Camera,
  PenLine,
  Palette,
} from "lucide-react";
import Image from "next/image";
import { ThemeButton } from "../ui/theme-button";
import { Avatar } from "../ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";

export const ProfileDialog = () => {
  const { data: session } = useSession();
  const { sanityUser, openProfileModal, setOpenProfileModal } =
    useGlobalContext();

  console.log(session?.user?.image);

  if (!session) return null;

  return (
    <Dialog open={openProfileModal} onOpenChange={setOpenProfileModal}>
      <DialogContent className="p-6 sm:p-8 rounded-2xl shadow-xl bg-background lg:ml-8 flex flex-col">
        <DialogHeader className="text-center mb-6">
          <DialogTitle className="text-2xl font-bold tracking-tight">
            Perfil
          </DialogTitle>

          <div className="flex flex-col items-center gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0 relative">
              {session.user?.image === null ? (
                <Avatar className="size-16 flex flex-col items-center justify-center bg-black/20">
                  <AvatarFallback className="text-2xl">
                    {session.user?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <Image
                  src={session.user?.image || "/avatar.png"}
                  alt={session.user?.name || "User avatar"}
                  width={64}
                  height={64}
                  className="rounded-full object-cover border"
                />
              )}
            </div>

            {/* Información del usuario */}
            <div className="flex flex-col gap-3 text-sm w-full items-center">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <UserCircle className="size-5 text-muted-foreground" />
                {session.user?.name || "Sin nombre"}
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="size-4" />
                {session.user?.email}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-2 bg-muted p-4 rounded-lg">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Palette className="size-4" />
            Tema: <ThemeButton />
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <BadgeCheck className="size-4" />
            Plan:
            <span className="text-foreground font-medium">
              {sanityUser.plan?.name}
            </span>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <HandCoins className="size-4" />
            Créditos:{" "}
            <span className="text-foreground font-medium">
              {sanityUser?.credits ?? 0}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
