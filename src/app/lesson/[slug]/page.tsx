import { prisma } from "@/lib/prisma";

export default async function LessonPage({ params }: { params: { slug: string } }) {
  const lesson = await prisma.lesson.findUnique({ where: { slug: params.slug } });
  if (!lesson) return <div>Niet gevonden</div>;

  // simpele render van content.body (array van strings)
  const content = Array.isArray((lesson.content as any)?.body) ? (lesson.content as any).body : [];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-green-600">{lesson.title}</h1>
      <div className="space-y-3">
        {content.map((p: string, i: number) => <p key={i} className="text-lg">{p}</p>)}
      </div>
      {lesson.hasQuiz && (
        <a href={`/quiz/${lesson.id}`} className="inline-block bg-green-500 text-white rounded-2xl px-4 py-2">
          Start quiz
        </a>
      )}
    </div>
  );
}
