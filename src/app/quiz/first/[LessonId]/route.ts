import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { lessonId: string } }) {
  const [q, total] = await Promise.all([
    prisma.quizQuestion.findFirst({
      where: { lessonId: params.lessonId },
      include: { options: true },
      orderBy: { id: "asc" }
    }),
    prisma.quizQuestion.count({ where: { lessonId: params.lessonId } })
  ]);

  return NextResponse.json({ question: q, total });
}