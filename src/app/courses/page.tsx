
 import { prisma } from "@/lib/prisma";
 
 type CourseCard = {
   id: string;
   slug: string;
   title: string;
   summary: string | null;
   color: string | null;
 };
 
 export default async function CoursesPage() {
   const courses: CourseCard[] = await prisma.course.findMany({
     where: { isPublished: true },
     orderBy: { order: "asc" },
     select: { id: true, slug: true, title: true, summary: true, color: true },
   });
 
   return (
     <div className="space-y-4">
       <h1 className="text-3xl font-bold text-green-600">Cursussen</h1>
 
       <div className="grid md:grid-cols-2 gap-4">
         {courses.map((c: CourseCard) => (
           <Link
             key={c.id}
-            href={`/courses/${c.slug}`}
+            href={`/courses/${c.slug}`}
             className="border rounded-2xl p-4 hover:shadow"
           >
             <h2 className="text-xl font-bold" style={{ color: c.color ?? undefined }}>
               {c.title}
             </h2>
             {c.summary && <p className="text-gray-700">{c.summary}</p>}
           </Link>
         ))}
       </div>
     </div>
   );
 }
