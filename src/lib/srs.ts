import { prisma } from "@/lib/prisma";

/**
 * Simple Leitner box intervals in days. Index corresponds to the box number.
 * Box 1 = review tomorrow, Box 2 = in 3 days, etc.
 */
const BOX_INTERVALS = [0, 1, 3, 7, 14, 30];

/**
 * Schedule a quiz card for spaced repetition.
 * Creates or updates an {@link SRSCard} using Leitner boxes to determine the
 * next review moment.
 */
export async function scheduleCard(
  userId: string,
  questionId: string,
  isCorrect: boolean,
) {
 // Fetch existing card if present
  const existing = await prisma.srsCard.findUnique({
    where: { userId_questionId: { userId, questionId } },
  });

  // Determine the new box based on correctness
  let box = existing ? existing.box : 1;
  if (isCorrect) {
    box = Math.min(box + 1, BOX_INTERVALS.length - 1);
  } else {
    box = 1; // reset on incorrect answer
  }

  // Compute next review date
  const nextReviewAt = new Date();
  const intervalDays = BOX_INTERVALS[box] ?? BOX_INTERVALS[BOX_INTERVALS.length - 1];
  nextReviewAt.setDate(nextReviewAt.getDate() + intervalDays);

  // Upsert the card in the database
  const card = await prisma.srsCard.upsert({
    where: { userId_questionId: { userId, questionId } },
    update: { box, nextReviewAt },
    create: { userId, questionId, box, nextReviewAt },
  });

  return { box: card.box, nextReviewAt, isCorrect };
}


/**
 * Haalt alle cards op die vandaag gereviewd moeten worden
 */
export async function getTodayReviewQueue(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const dueCards = await prisma.srsCard.findMany({
    where: {
      userId,
      nextReview: {
        gte: today,
        lt: tomorrow,
      },
    },
    orderBy: { nextReviewAt: "asc" },
  });

  return dueCards;
}
