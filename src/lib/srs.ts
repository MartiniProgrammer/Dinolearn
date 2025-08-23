// src/lib/srs.ts
export async function scheduleCard(
  userId: string,
  questionId: string,
  isCorrect: boolean
) {
  // TODO: implement spaced repetition logic
  return { nextReview: new Date(), isCorrect };
}
// src/lib/srs.ts
import { prisma } from "@/lib/prisma";

/**
 * Haalt alle cards op die vandaag gereviewd moeten worden
 */
export async function getTodayReviewQueue(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // voorbeeld query, pas aan aan je schema
  const dueCards = await prisma.srsCard.findMany({
    where: {
      userId,
      nextReview: {
        gte: today,
        lt: tomorrow,
      },
    },
    orderBy: { nextReview: "asc" },
  });

  return dueCards;
}
