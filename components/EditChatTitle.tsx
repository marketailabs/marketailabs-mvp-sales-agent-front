"use client";

import { useGlobalContext } from "@/provider/GlobalContext";
import { Pencil } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export const EditChatTitle = ({
  chatId,
  initialTitle,
}: {
  chatId: string;
  initialTitle: string;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [isPending, startTransition] = useTransition();
  const { handleSaveTitle } = useGlobalContext();

  const handleStartEditing = () => {
    setIsEditing(true);
  };

  const handleStopEditing = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (title === initialTitle) {
      return;
    }

    startTransition(async () => {
      handleStopEditing();
      try {
        await handleSaveTitle({ chatId, title });
      } catch (error) {
        console.error(error);
        toast.error("Error al cambiar el título del chat");
      }
    });
  };

  return (
    <div className="text-3xl font-medium mb-4 w-full">
      {isEditing ? (
        <input
          className="w-full outline-none"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSave();
            }
          }}
          disabled={isPending}
        />
      ) : (
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={handleStartEditing}
        >
          <h1>{title}</h1>
          <Pencil className="size-6" />
        </div>
      )}
    </div>
  );
};
