// src/app/quiz/answer/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { applyQuizResult } from "@/lib/gamification";
import { scheduleCard } from "@/lib/srs";

type Body = {
  lessonId: string;
  questionId: string;
  chosenOptionIds?: (string | number)[];
};

export async function POST(req: Request) {
  try {
    // 1) Auth
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2) Parse + valideer body
    const { lessonId, questionId, chosenOptionIds }: Body = await req.json();
    if (!lessonId || !questionId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // 3) Haal gebruiker op
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

// 4) Haal correcte opties op (alleen id)
const correct = await prisma.quizOption.findMany({
  where: { questionId, isCorrect: true },
  select: { id: true },
});

// 5) Normaliseer gekozen ids en vergelijk efficiënt
type IdLike = string | number | bigint;
type QuizOptionIdOnly = { id: IdLike };

const chosen: string[] = Array.isArray(chosenOptionIds)
  ? chosenOptionIds.map((v: IdLike) => String(v))
  : [];

const chosenSet: Set<string> = new Set(chosen);

// ✨ geef types aan de destructuring en callback-params
const correctIds: string[] = (correct as QuizOptionIdOnly[]).map(
  ({ id }: QuizOptionIdOnly) => String(id)
);

const isCorrect: boolean =
  chosenSet.size > 0 &&
  chosenSet.size === correctIds.length &&
  correctIds.every((cid: string) => chosenSet.has(cid));


    // 6) Gamification en SRS
    const result = await applyQuizResult({
      userId: user.id,
      lessonId,
      questionId,
      isCorrect,
    });

    const srsUpdate = await scheduleCard(user.id, questionId, isCorrect);

    // 7) Response
    return NextResponse.json({
      isCorrect,
      ...result,
      srsUpdate,
    });
  } catch (err) {
    console.error("[quiz/answer] error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
