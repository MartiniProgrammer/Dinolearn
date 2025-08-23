import { prisma } from "./prisma";

const LEVEL_STEP = 100;

export async function awardXP(userId: string, amount: number, _type?: string, _meta?: unknown) {
  const profile = await prisma.profile.update({
    where: { userId },
    data: { xp: { increment: amount } }
  });
  const newLevel = Math.floor(profile.xp / LEVEL_STEP) + 1;
  if (newLevel > profile.level) {
    await prisma.profile.update({ where: { userId }, data: { level: newLevel } });
  }
  return newLevel;
}

export async function updateStreak(userId: string) {
  const p = await prisma.profile.findUnique({ where: { userId } });
  const today = new Date().toDateString();
  const last = p?.lastStudyAt ? new Date(p.lastStudyAt).toDateString() : null;

  if (last === today) return p?.streakCount ?? 0;
  let streak = 1;
  if (p?.lastStudyAt) {
    const diff = Date.now() - new Date(p.lastStudyAt).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    streak = days === 1 ? (p.streakCount ?? 0) + 1 : 1;
  }
  const longest = Math.max(p?.longestStreak ?? 0, streak);
  await prisma.profile.update({
    where: { userId },
    data: { streakCount: streak, longestStreak: longest, lastStudyAt: new Date() }
  });
  await awardXP(userId, 5, "STREAK_BONUS");
  return streak;
}

export async function applyQuizResult(opts: { userId: string; lessonId: string; questionId: string; isCorrect: boolean; }) {
  const p = await prisma.profile.findUnique({ where: { userId: opts.userId } });
  if (!p) throw new Error("Profile not found");

  const xp = opts.isCorrect ? 10 : 3;
  const heartsDelta = opts.isCorrect ? 0 : -1;

  await prisma.attempt.create({
    data: {
      userId: opts.userId,
      lessonId: opts.lessonId,
      questionId: opts.questionId,
      isCorrect: opts.isCorrect,
      xpEarned: xp
    }
  });

  await prisma.profile.update({
    where: { userId: opts.userId },
    data: {
      xp: { increment: xp },
      hearts: { increment: heartsDelta }
    }
  });

  const attempts = await prisma.attempt.findMany({
    where: { userId: opts.userId, lessonId: opts.lessonId }
  });
  const lesson = await prisma.lesson.findUnique({ where: { id: opts.lessonId }, include: { questions: true } });
  const allAnswered = lesson && attempts.length >= (lesson.questions?.length ?? 0) && (lesson.questions?.length ?? 0) > 0;

  if (allAnswered) {
    await prisma.userLesson.upsert({
      where: { userId_lessonId: { userId: opts.userId, lessonId: opts.lessonId } },
      update: { status: "COMPLETED", lastSeenAt: new Date() },
      create: { userId: opts.userId, lessonId: opts.lessonId, status: "COMPLETED", lastSeenAt: new Date() }
    });
    await updateStreak(opts.userId);
    await checkAnkyloBadges(opts.userId);
  }

  return { xpAdded: xp, hearts: (p.hearts + heartsDelta), completed: allAnswered };
}

export async function checkDailyGoal(userId: string) {
  const p = await prisma.profile.findUnique({ where: { userId } });
  if (!p) return false;
  // Simplified MVP: when xp mod 20 crosses dailyGoal, grant small bonus
  if ((p.xp % p.dailyGoal) === 0 && p.xp !== 0) {
    await prisma.profile.update({ where: { userId }, data: { xp: { increment: 5 } } });
    return true;
  }
  return false;
}

export async function grantBadge(userId: string, code: string) {
  const badge = await prisma.badge.findUnique({ where: { code } });
  if (!badge) return;
  await prisma.userBadge.upsert({
    where: { userId_badgeId: { userId, badgeId: badge.id } },
    update: {},
    create: { userId, badgeId: badge.id }
  });
}

async function checkAnkyloBadges(userId: string) {
  const course = await prisma.course.findUnique({
    where: { slug: "ankylosauridae-101" },
    include: { modules: { include: { lessons: { include: { questions: true }, orderBy: { order: "asc" } } } } }
  });
  if (!course) return;
  const lessons = course.modules.flatMap((m: any) => m.lessons).sort((a: any, b: any) => a.order - b.order);
  const attempts = await prisma.attempt.findMany({
    where: { userId, lessonId: { in: lessons.map((l: any) => l.id) } }
  });

  const calc = (subset: any[]) => {
    let total = 0, correct = 0, complete = true;
    for (const lesson of subset) {
      const lAttempts = attempts.filter(a => a.lessonId === lesson.id);
      if (lAttempts.length < lesson.questions.length) complete = false;
      total += lesson.questions.length;
      correct += lAttempts.filter(a => a.isCorrect).length;
    }
    return { complete, score: total ? correct / total : 0 };
  };

  const first3 = calc(lessons.slice(0, 3));
  if (first3.complete && first3.score >= 0.6) await grantBadge(userId, "ANKYLO_NOVICE");

  const last3 = calc(lessons.slice(3));
  if (last3.complete && last3.score >= 0.8) await grantBadge(userId, "CLUB_TAIL_MASTER");

  const all = calc(lessons);
  if (all.complete && all.score >= 0.75) await grantBadge(userId, "ANKYLO_COMPLETIONIST");
}