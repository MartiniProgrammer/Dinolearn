// src/app/courses/[slug]/page.tsx
export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
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
  const session = await getServerSession(authOptions);
  let course: CourseDetail | null = null;
  try {
    course = await prisma.course.findUnique({
      where: { slug: params.slug },
      include: {
        modules: {
          orderBy: { order: "asc" },
          include: { lessons: { orderBy: { order: "asc" } } },
        },
      },
    });
  } catch (err) {
    console.error("Failed to load course", err);
    return <div>Er ging iets mis bij het laden van de cursus.</div>;
  }

  if (!course) return <div>Niet gevonden</div>;

    const badgeMap: Record<string, string[]> = {
    "ankylosauridae-101": [
      "ANKYLO_NOVICE",
      "CLUB_TAIL_MASTER",
      "ANKYLO_COMPLETIONIST",
    ],
  };

    const imageMap: Record<string, string> = {
    "ankylosauridae-101": "/images/ankylosaur.svg",
  };

  let badges = [] as { id: string; title: string; description: string; icon: string }[];
  if (badgeMap[params.slug]) {
    try {
      badges = await prisma.badge.findMany({
        where: { code: { in: badgeMap[params.slug] } },
        select: { id: true, title: true, description: true, icon: true },
      });
    } catch (err) {
      console.error("Failed to load badges", err);
    }
  }

    let progress = 0;
  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });
    if (user) {
      const lessonIds = course.modules.flatMap((m) => m.lessons.map((l) => l.id));
      if (lessonIds.length > 0) {
        const completed = await prisma.userLesson.count({
          where: { userId: user.id, lessonId: { in: lessonIds }, status: "COMPLETED" },
        });
        progress = Math.round((completed / lessonIds.length) * 100);
      }
    }
  }

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

      {imageMap[course.slug] && (
        <Image
          src={imageMap[course.slug]}
          alt="Course illustration"
          width={800}
          height={300}
          className="w-full rounded-md object-cover"
        />
      )}

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

      <div className="mt-8">
        <div className="h-4 w-full rounded bg-gray-200">
          <div
            className="h-4 rounded bg-green-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-1 text-sm text-gray-700">{progress}% voltooid</p>
      </div>
    </div>
  );
}
