// src/app/courses/[slug]/page.tsx
import { prisma } from "@/lib/prisma";

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
        include: {
          lessons: { orderBy: { order: "asc" } },
        },
      },
    },
  });

  if (!course) return <div>Niet gevonden</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold" style={{ color: course.color ?? undefined }}>
        {course.title}
      </h1>

      {course.modules.map((m: ModuleCard) => (
        <div key={m.id} className="space-y-2">
          <h2 className="text-xl font-bold">{m.title}</h2>
          <ul className="space-y-1">
            {m.lessons.map((l: LessonCard) => (
              <li key={l.id}>
                <a
                  className="text-green-600 underline"
                  href={`/lesson/${l.slug}`}
                >
                  {l.title}
                </a>
                {l.hasQuiz && (
                  <span className="text-sm text-gray-500"> · quiz</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
