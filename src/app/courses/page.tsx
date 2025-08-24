// src/app/courses/page.tsx
export const dynamic = "force-dynamic";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

type CourseCard = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  color: string | null;
};

export default async function CoursesPage({
  searchParams
}: {
  searchParams?: { q?: string };
}) {
  const query = searchParams?.q?.trim();

  const where: {
    isPublished: boolean;
    OR?: { title?: { contains: string; mode: "insensitive" }; summary?: { contains: string; mode: "insensitive" } }[];
  } = { isPublished: true };

  if (query) {
    where.OR = [
      { title: { contains: query, mode: "insensitive" } },
      { summary: { contains: query, mode: "insensitive" } }
    ];
  }

  let courses: CourseCard[] = [];
  try {
    courses = await prisma.course.findMany({
      where,
      orderBy: { order: "asc" },
      select: {
        id: true,
        slug: true,
        title: true,
        summary: true,
        color: true,
      },
    });
  } catch (err) {
    console.error("Failed to load courses", err);
    return (
      <div className="space-y-6">
        <h1 className="text-4xl font-bold">Cursussen</h1>
        <p className="text-red-600">Er ging iets mis bij het laden van de cursussen.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">Cursussen</h1>
      <form className="flex gap-2" action="/courses">
        <input
          type="text"
          name="q"
          placeholder="Zoek cursussen"
          defaultValue={query}
          className="flex-grow rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
         <button
          type="submit"
          className="rounded-md bg-green-600 px-4 py-2 font-medium text-white transition hover:bg-green-700"
        >
          Zoeken
        </button>
      </form>
      {courses.length === 0 ? (
        <p className="text-gray-700">Geen cursussen gevonden.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {courses.map((c: CourseCard) => (
            <Link
              key={c.id}
              href={`/courses/${c.slug}`}
              className="group block rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <h2
                className="text-2xl font-semibold group-hover:underline"
                style={{ color: c.color ?? undefined }}
              >
                {c.title}
              </h2>
              {c.summary && (
                <p className="mt-2 text-gray-600">{c.summary}</p>
              )}
              <span className="mt-4 inline-block text-sm font-medium text-green-700 group-hover:underline">
                Start cursus →
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
