import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // demo user
  const passwordHash = await bcrypt.hash("demo1234", 10);
  const user = await prisma.user.upsert({
    where: { email: "demo@dinolearn.app" },
    update: {},
    create: {
      email: "demo@dinolearn.app",
      name: "Demo",
      password: passwordHash,
      profile: { create: {} }
    }
  });

  // badges
  const [b1, b2, b3] = await Promise.all([
    prisma.badge.upsert({
      where: { code: "FIRST_LESSON" },
      update: {},
      create: { code: "FIRST_LESSON", title: "Eerste stap!", description: "Je voltooide je eerste les", icon: "🌟" }
    }),
    prisma.badge.upsert({
      where: { code: "STREAK_3" },
      update: {},
      create: { code: "STREAK_3", title: "Vlammetje aan", description: "Streak van 3 dagen", icon: "🔥" }
    }),
    prisma.badge.upsert({
      where: { code: "PBDB_EXPLORER" },
      update: {},
      create: { code: "PBDB_EXPLORER", title: "Data-duiker", description: "Je rondde het PBDB-lab af", icon: "🔎" }
    })
  ]);

  // C1 course + modules/lessons with quiz
  const course = await prisma.course.upsert({
    where: { slug: "c1-inleiding-tot-dinosaurussen" },
    update: {},
    create: {
      slug: "c1-inleiding-tot-dinosaurussen",
      title: "C1 — Inleiding tot Dinosaurussen",
      summary: "Wat is een dinosauriër, geologische tijd, taphonomie, veren & kleuren, data & 3D.",
      level: "BEGINNER",
      color: "#22c55e",
      isPublished: true,
      order: 1,
      modules: {
        create: [
          {
            title: "Wat is een dinosauriër?",
            order: 1,
            lessons: {
              create: [{
                slug: "wat-is-een-dinosaurus",
                title: "Wat is een dinosauriër?",
                durationMinutes: 8,
                order: 1,
                hasQuiz: true,
                content: {
                  type: "md",
                  body: [
                    "Dinosauriërs zijn **archosauriërs** met **opgerichte** houding.",
                    "Drie hoofdclades: **Theropoda**, **Sauropodomorpha**, **Ornithischia**.",
                    "Key takeaways: 1) opgerichte houding, 2) archosauriër, 3) drie basale clades."
                  ]
                },
                questions: {
                  create: [
                    {
                      prompt: "Welk kenmerk past NIET?",
                      type: "SINGLE",
                      explanation: "Dinosauriërs waren niet per definitie ectotherm.",
                      options: {
                        create: [
                          { text: "Oprichte houding", isCorrect: false },
                          { text: "Naar buiten geroteerde ledematen", isCorrect: false },
                          { text: "Ectotherm per definitie", isCorrect: true },
                          { text: "Vogel-afstamming", isCorrect: false }
                        ]
                      }
                    }
                  ]
                }
              }]
            }
          },
          {
            title: "Tijdmachine: Trias → Jura → Krijt",
            order: 2,
            lessons: {
              create: [{
                slug: "trias-jura-krijt",
                title: "Trias → Jura → Krijt",
                durationMinutes: 10,
                order: 1,
                hasQuiz: true,
                content: { type: "md", body: ["Orden de tijdvakken: Trias → Jura → Krijt."] },
                questions: {
                  create: [
                    {
                      prompt: "Zet in volgorde: Trias / Jura / Krijt",
                      type: "SINGLE",
                      options: {
                        create: [
                          { text: "Trias → Jura → Krijt", isCorrect: true },
                          { text: "Krijt → Jura → Trias", isCorrect: false }
                        ]
                      }
                    }
                  ]
                }
              }]
            }
          },
          {
            title: "Taphonomie",
            order: 3,
            lessons: {
              create: [{
                slug: "taphonomie-basis",
                title: "Hoe worden fossielen gevormd?",
                durationMinutes: 9,
                order: 1,
                hasQuiz: true,
                content: { type: "md", body: ["Bewaringsbias, mineralisatie, afdrukken vs. permineralisatie."] },
                questions: {
                  create: [
                    {
                      prompt: "Noem 2 factoren die behoudkans verhogen (open)",
                      type: "OPEN"
                    }
                  ]
                }
              }]
            }
          },
          {
            title: "Veren & kleuren",
            order: 4,
            lessons: {
              create: [{
                slug: "veren-en-kleur",
                title: "Hoe weten we ‘veren & kleuren’?",
                durationMinutes: 8,
                order: 1,
                hasQuiz: true,
                content: { type: "md", body: ["Melanosomen, lagerstätten, beperkingen van interpretatie."] },
                questions: {
                  create: [
                    {
                      prompt: "Wat levert bewijs voor veren?",
                      type: "SINGLE",
                      options: {
                        create: [
                          { text: "Afdrukken & filament-structuren", isCorrect: true },
                          { text: "Alleen kunst", isCorrect: false }
                        ]
                      }
                    }
                  ]
                }
              }]
            }
          },
          {
            title: "Data & 3D (preview)",
            order: 5,
            lessons: {
              create: [{
                slug: "data-en-3d",
                title: "Data & 3D (preview)",
                durationMinutes: 6,
                order: 1,
                hasQuiz: false,
                content: { type: "md", body: ["PBDB-intro + 3D-model demo."] }
              }]
            }
          }
        ]
      }
    }
  });

  console.log("Seed done for user:", user.email, "course:", course.title);
}

main().finally(async () => { await prisma.$disconnect(); });
