// src/app/courses/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";

type CourseCard = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  color: string | null;
};

export default async function CoursesPage({
  searchParams
}: {
  searchParams?: { q?: string };
}) {
  const query = searchParams?.q ?? "";

  const courses: CourseCard[] = await prisma.course.findMany({
    where: {
      isPublished: true,
      ...(query
        ? {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { summary: { contains: query, mode: "insensitive" } }
            ]
          }
        : {})
    },
    orderBy: { order: "asc" },
    select: { id: true, slug: true, title: true, summary: true, color: true }
  });

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-green-600">Cursussen</h1>
      <form className="flex gap-2" action="/courses">
        <input
          type="text"
          name="q"
          placeholder="Zoek cursussen"
          defaultValue={query}
          className="flex-grow border rounded p-2"
        />
        <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">
          Zoeken
        </button>
      </form>
      {courses.length === 0 ? (
        <p className="text-gray-700">Geen cursussen gevonden.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {courses.map((c: CourseCard) => (
            <Link
              key={c.id}
              href={`/courses/${c.slug}`}
              className="border rounded-2xl p-4 hover:shadow"
            >
              <h2 className="text-xl font-bold" style={{ color: c.color ?? undefined }}>
                {c.title}
              </h2>
              {c.summary && <p className="text-gray-700">{c.summary}</p>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
