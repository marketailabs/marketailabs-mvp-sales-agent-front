import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ChatLayout } from "@/components/layout/ChatLayout";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) return redirect("/");

  const { id } = await params;

  const chat = await prisma.chat.findUnique({
    where: { id },
    select: {
      userId: true,
      userMessage: true,
      apiResponse: true,
      title: true,
      id: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!chat || chat.userId !== session.user.id) return redirect("/");

  return <ChatLayout chat={chat} id={id} />;
}
