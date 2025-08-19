"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { Ellipsis, Pencil, Trash } from "lucide-react";
import { useState, useTransition } from "react";
import { useGlobalContext } from "@/provider/GlobalContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";

export const ChatButton = ({ chat }: { chat: any }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { handleSaveTitle, handleDeleteChat } = useGlobalContext();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(chat.title);
  const [isPending, startTransition] = useTransition();

  const href = `/chat/${chat.id}`;
  const isActive = pathname === href;
  const variant = isActive ? "default" : "ghost";

  const handleDelete = async () => {
    startTransition(async () => {
      try {
        await handleDeleteChat({ chatId: chat.id });
        if (pathname === href) {
          // redirige al inicio si estamos en la misma ruta
          router.push("/");
        }
        toast.success("Chat eliminado");
      } catch (err) {
        console.error(err);
        toast.error("Error al eliminar el chat");
      }
    });
  };

  const handleSave = async () => {
    if (title.trim() === "" || title === chat.title) {
      setIsEditing(false);
      setTitle(chat.title);
      return;
    }

    startTransition(async () => {
      try {
        await handleSaveTitle({ chatId: chat.id, title });
        toast.success("Título actualizado");
      } catch (err) {
        console.error(err);
        toast.error("Error al cambiar el título");
      } finally {
        setIsEditing(false);
      }
    });
  };

  // Determinar color del Ellipsis según la variante y tema
  const ellipsisColor =
    variant === "default"
      ? "text-primary-foreground dark:text-primary-foreground"
      : "text-foreground dark:text-gray-300";

  return (
    <div className="relative w-full group">
      {isEditing ? (
        <input
          className="w-full px-3 py-2 text-sm rounded-md border bg-background focus:outline-none"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") {
              setIsEditing(false);
              setTitle(chat.title);
            }
          }}
          disabled={isPending}
          autoFocus
        />
      ) : (
        <div className="relative w-full">
          <Link
            href={href}
            className={cn(
              buttonVariants({ variant, size: "default" }),
              "w-full flex justify-between items-center truncate"
            )}
          >
            <span className="truncate">{chat.title}</span>
          </Link>

          <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div
                  className={cn("h-full px-2 cursor-pointer", ellipsisColor)}
                >
                  <Ellipsis className="size-4" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => setIsEditing(true)}
                  className="cursor-pointer"
                >
                  <Pencil className="size-4 mr-2" /> Editar
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="cursor-pointer text-red-600 focus:text-red-600"
                >
                  <Trash className="size-4 mr-2" /> Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}
    </div>
  );
};
