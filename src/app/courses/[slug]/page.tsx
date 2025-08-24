// src/app/courses/[slug]/page.tsx
export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
type LessonCard = {
  id: string;
  slug: string;
  title: string;
  hasQuiz: boolean;
};

type ModuleCard = {
  id: string;
  title: string;
  lessons: LessonCard[];
};

type CourseDetail = {
  id: string;
  slug: string;
  title: string;
  color: string | null;
  summary: string;
  modules: ModuleCard[];
};

export default async function CourseDetail({
  params,
}: {
  params: { slug: string };
}) {
  const course: CourseDetail | null = await prisma.course.findUnique({
    where: { slug: params.slug },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: { lessons: { orderBy: { order: "asc" } } },
      },
    },
  });

  if (!course) return <div>Niet gevonden</div>;

    const badgeMap: Record<string, string[]> = {
    "ankylosauridae-101": [
      "ANKYLO_NOVICE",
      "CLUB_TAIL_MASTER",
      "ANKYLO_COMPLETIONIST",
    ],
  };

  const badges = badgeMap[params.slug]
    ? await prisma.badge.findMany({
        where: { code: { in: badgeMap[params.slug] } },
        select: { id: true, title: true, description: true, icon: true },
      })
    : [];

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1
          className="text-4xl font-bold"
          style={{ color: course.color ?? undefined }}
        >
          {course.title}
        </h1>
        <p className="text-gray-700">{course.summary}</p>
      </header>

      {badges.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <h2 className="mb-2 font-semibold">Verdien badges</h2>
          <ul className="flex flex-wrap gap-4">
            {badges.map((b) => (
              <li key={b.id} className="flex items-center gap-2">
                <span className="text-2xl">{b.icon}</span>
                <span className="text-sm font-medium">{b.title}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {course.modules.map((m: ModuleCard) => (
        <div key={m.id} className="space-y-2">
          <h2 className="text-xl font-bold">{m.title}</h2>
          <ul className="space-y-2">
            {m.lessons.map((l: LessonCard) => (
              <li key={l.id}>
                <Link
                  className="block rounded-md border border-gray-200 p-3 hover:bg-gray-50"
                  href={`/lesson/${l.slug}`}
                >
                  <span className="font-medium">{l.title}</span>
                  {l.hasQuiz && (
                    <span className="ml-2 text-sm text-gray-500">Quiz</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
