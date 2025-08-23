import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { lessonId: string; questionId: string } }) {
  const q = await prisma.quizQuestion.findFirst({
    where: { lessonId: params.lessonId, id: { gt: params.questionId } },
    include: { options: true },
    orderBy: { id: "asc" }
  });
  return NextResponse.json({ question: q });
}
