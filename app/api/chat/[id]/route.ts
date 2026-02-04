import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.error();

  const { id } = params;
  const { title } = await req.json();

  // Asegurar que el chat existe y pertenece al user
  const chat = await prisma.chat.findUnique({
    where: { id },
    select: { userId: true },
  });
  if (!chat || chat.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updated = await prisma.chat.update({
    where: { id },
    data: { title },
  });

  return NextResponse.json({ title: updated.title });
}
