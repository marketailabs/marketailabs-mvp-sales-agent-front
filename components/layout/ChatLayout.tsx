"use client";

import { ChatType } from "@/types/chatTypes";
import { ChatInfo } from "./ChatInfo";
import { ChatWithIA } from "./ChatWithIA";
import { MainContainer } from "./MainContainer";
import { useGlobalContext } from "@/provider/GlobalContext";
import { ChatSkeleton } from "../skeletons/ChatSkeleton";
import { useMemo } from "react";

export const ChatLayout = ({ chat, id }: { chat: ChatType; id: string }) => {
  const { chats = [], isPendingChats } = useGlobalContext();

  // Tomar el chat actualizado directamente desde el contexto
  const currentChat = useMemo(() => {
    if (chats.length === 0) return null; // aún no hay chats
    return chats.find((c) => c.id === chat.id) || chat;
  }, [chats, chat]);

  // Si aún no tenemos el chat actualizado, mostrar skeleton
  if (!currentChat || isPendingChats) {
    return (
      <MainContainer className="pt-16 md:pt-24 px-4">
        <ChatSkeleton />
      </MainContainer>
    );
  }

  return (
    <MainContainer className="pt-16 md:pt-24 px-4">
      <ChatInfo chat={chat} currentChat={currentChat} />
      <ChatWithIA chat={chat} chatId={id} />
    </MainContainer>
  );
};
