import { auth } from "@/auth";
import { MainContainer } from "@/components/layout/MainContainer";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ChatInfo } from "@/components/layout/ChatInfo";
import { ChatWithIA } from "@/components/layout/ChatWithIA";

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

  return (
    <MainContainer className="py-24">
      <ChatInfo chat={chat} />
      <ChatWithIA chat={chat} chatId={id} />
    </MainContainer>
  );
}
