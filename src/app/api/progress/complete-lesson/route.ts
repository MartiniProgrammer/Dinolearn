import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { lessonId } = await req.json();
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User" }, { status: 400 });

  await prisma.userLesson.upsert({
    where: { userId_lessonId: { userId: user.id, lessonId } },
    update: { status: "COMPLETED", lastSeenAt: new Date() },
    create: { userId: user.id, lessonId, status: "COMPLETED", lastSeenAt: new Date() }
  });
  return NextResponse.json({ ok: true });
}
