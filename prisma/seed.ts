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
  const [b1, b2, b3, b4, b5, b6] = await Promise.all([
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
    }),
    prisma.badge.upsert({
      where: { code: "ANKYLO_NOVICE" },
      update: {},
      create: {
        code: "ANKYLO_NOVICE",
        title: "Ankylo Novice",
        description: "≥60% score in les 1–3",
        icon: "🦕"
      }
    }),
    prisma.badge.upsert({
      where: { code: "CLUB_TAIL_MASTER" },
      update: {},
      create: {
        code: "CLUB_TAIL_MASTER",
        title: "Club Tail Master",
        description: "≥80% in les 4–6",
        icon: "🔨"
      }
    }),
    prisma.badge.upsert({
      where: { code: "ANKYLO_COMPLETIONIST" },
      update: {},
      create: {
        code: "ANKYLO_COMPLETIONIST",
        title: "Ankylo Completionist",
        description: "Alle lessen afgerond, totaal ≥75%",
        icon: "🏆"
      }
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

  // Ankylosauridae course
  const ankyCourse = await prisma.course.upsert({
    where: { slug: "ankylosauridae-101" },
    update: {},
    create: {
      slug: "ankylosauridae-101",
      title: "Ankylosauridae 101: Tanks van het Krijt",
      summary: "Leer alles over pantserdinosauriërs met knotsstaarten.",
      level: "BEGINNER",
      color: "#7a9e7e",
      isPublished: true,
      order: 2,
      modules: {
        create: [
          {
            title: "Ankylosauridae 101",
            order: 1,
            lessons: {
              create: [
                {
                  slug: "overview-evolution",
                  title: "Overzicht & Evolutie",
                  durationMinutes: 8,
                  order: 1,
                  hasQuiz: true,
                  content: {
                    type: "md",
                    body: [
                      "Ankylosauridae zijn gepantserde ornithischiërs uit het Late Krijt (~100–66 Ma).",
                      "Ze onderscheiden zich door **osteodermen** (benige platen) en vaak een **knotsstaart**.",
                      "**Verspreiding:** Noord-Amerika, Azië.",
                      "**Verwantschap:** Ornithischia → Thyreophora → Ankylosauria → Ankylosauridae.",
                      "**Kernpunten**",
                      "- Pantser als verdediging",
                      "- Lage, brede lichamen; herbivoor",
                      "- Evolutie van stijve staart met ossificaties tot knots"
                    ]
                  },
                  questions: {
                    create: [
                      {
                        prompt: "Tot welke grote groep behoren Ankylosauridae?",
                        type: "SINGLE",
                        options: {
                          create: [
                            { text: "Theropoda (vleeseters)", isCorrect: false },
                            { text: "Sauropoda (reuzen met lange nek)", isCorrect: false },
                            { text: "Ornithischia (vogelbekken)", isCorrect: true },
                            { text: "Pterosauria (vliegende reptielen)", isCorrect: false }
                          ]
                        }
                      },
                      {
                        prompt: "Wat is een kenmerk van Ankylosauridae?",
                        type: "SINGLE",
                        options: {
                          create: [
                            { text: "Lange nek en pilarenpoten", isCorrect: false },
                            { text: "Knotsstaart en osteodermen", isCorrect: true },
                            { text: "Vleugels en vlieghuid", isCorrect: false },
                            { text: "Sikkelklauw op de voet", isCorrect: false }
                          ]
                        }
                      }
                    ]
                  }
                },
                {
                  slug: "anatomy-armor",
                  title: "Anatomie & Pantser",
                  durationMinutes: 8,
                  order: 2,
                  hasQuiz: true,
                  content: {
                    type: "md",
                    body: [
                      "Het pantser bestond uit **osteodermen** in huidlagen, variërend van keien tot hoornplaten.",
                      "De **staartknots** ontstond door benige vergroeiingen + stijve staartwervels.",
                      "**Kauwen:** bladvormige tanden, hyoid/tongapparaat suggereert lage, vezelige planten."
                    ]
                  },
                  questions: {
                    create: [
                      {
                        prompt: "Waaruit bestaat het pantser?",
                        type: "SINGLE",
                        options: {
                          create: [
                            { text: "Vergrote schubben zonder bot", isCorrect: false },
                            { text: "Benige osteodermen", isCorrect: true },
                            { text: "Keratinelagen zonder bot", isCorrect: false },
                            { text: "Externe ribben", isCorrect: false }
                          ]
                        }
                      },
                      {
                        prompt: "Welke functie had de staartknots waarschijnlijk vooral?",
                        type: "SINGLE",
                        options: {
                          create: [
                            { text: "Thermoregulatie", isCorrect: false },
                            { text: "Voortplanting", isCorrect: false },
                            { text: "Aanval & verdediging (klap)", isCorrect: true },
                            { text: "Zwemmen", isCorrect: false }
                          ]
                        }
                      }
                    ]
                  }
                },
                {
                  slug: "ecology-behavior",
                  title: "Ecologie & Gedrag",
                  durationMinutes: 8,
                  order: 3,
                  hasQuiz: true,
                  content: {
                    type: "md",
                    body: [
                      "**Dieet:** lage, vezelige vegetatie (varens, cycadeeën).",
                      "**Predatoren:** Tyrannosauridae → verdediging door pantser/knots.",
                      "**Gedrag:** waarschijnlijk langzaam, laag zwaartepunt, mogelijk in open habitats.",
                      "**Hypothesen:** knots als afschrikking en gerichte klappen op poten van predatoren."
                    ]
                  },
                  questions: {
                    create: [
                      {
                        prompt: "Wat aten ankylosauriden vooral?",
                        type: "SINGLE",
                        options: {
                          create: [
                            { text: "Vlees", isCorrect: false },
                            { text: "Vruchten hoog in bomen", isCorrect: false },
                            { text: "Laag groeiende planten", isCorrect: true },
                            { text: "Ongewervelden", isCorrect: false }
                          ]
                        }
                      },
                      {
                        prompt: "Tegen wie bood het pantser vooral bescherming?",
                        type: "SINGLE",
                        options: {
                          create: [
                            { text: "Sauropoden", isCorrect: false },
                            { text: "Tyrannosauriden", isCorrect: true },
                            { text: "Pterosauriërs", isCorrect: false },
                            { text: "Placodonten", isCorrect: false }
                          ]
                        }
                      }
                    ]
                  }
                },
                {
                  slug: "key-genera",
                  title: "Belangrijke Geslachten",
                  durationMinutes: 8,
                  order: 4,
                  hasQuiz: true,
                  content: {
                    type: "md",
                    body: [
                      "- **Ankylosaurus** (Noord-Amerika, Laat-Krijt) – groot, zware knots",
                      "- **Euoplocephalus** (Noord-Amerika) – goed bestudeerd, neusbijholten",
                      "- **Pinacosaurus** (Azië) – veel juveniele skeletten bekend",
                      "**Variatie:** schedelornamenten, plaatpatronen, neus & luchtwegencomplex."
                    ]
                  },
                  questions: {
                    create: [
                      {
                        prompt: "Welk geslacht is beroemd om een zeer zware staartknots in het Laat-Krijt van Noord-Amerika?",
                        type: "SINGLE",
                        options: {
                          create: [
                            { text: "Pinacosaurus", isCorrect: false },
                            { text: "Ankylosaurus", isCorrect: true },
                            { text: "Euoplocephalus", isCorrect: false },
                            { text: "Stegouros", isCorrect: false }
                          ]
                        }
                      }
                    ]
                  }
                },
                {
                  slug: "fossils-discovery",
                  title: "Fossielen & Ontdekking",
                  durationMinutes: 8,
                  order: 5,
                  hasQuiz: true,
                  content: {
                    type: "md",
                    body: [
                      "Grote vondsten in **Dinosaur Provincial Park** (Canada) en Mongolië (Gobi).",
                      "Osteodermen fossiliseren goed; staartknotsen zijn diagnostisch.",
                      "**Onderzoek:** CT-scans, histologie van platen, biomechanica van staartslagen."
                    ]
                  },
                  questions: {
                    create: [
                      {
                        prompt: "Waarom worden osteodermen relatief vaak gevonden?",
                        type: "SINGLE",
                        options: {
                          create: [
                            { text: "Ze zijn van zacht weefsel", isCorrect: false },
                            { text: "Ze zijn benig en fossiliseren goed", isCorrect: true },
                            { text: "Ze drijven en spoelen aan", isCorrect: false },
                            { text: "Ze lossen op", isCorrect: false }
                          ]
                        }
                      }
                    ]
                  }
                },
                {
                  slug: "master-quiz",
                  title: "Masterquiz & Badge",
                  durationMinutes: 8,
                  order: 6,
                  hasQuiz: true,
                  content: {
                    type: "md",
                    body: [
                      "Beantwoord alle vragen om de badge **Club Tail Master** te verdienen (≥80%)."
                    ]
                  },
                  questions: {
                    create: [
                      {
                        prompt: "Welke combinatie beschrijft Ankylosauridae het best?",
                        type: "SINGLE",
                        options: {
                          create: [
                            { text: "Vleugels, holle botten, piscivoor", isCorrect: false },
                            { text: "Pantser, knotsstaart, laag plantaardig dieet", isCorrect: true },
                            { text: "Sikkelklauw, veren, warmbloedig", isCorrect: false },
                            { text: "Zwemvliezen, tandplaten, marien", isCorrect: false }
                          ]
                        }
                      }
                    ]
                  }
                }
              ]
            }
          }
        ]
      }
    }
  });

  console.log("Seed done for user:", user.email, "course:", course.title, "and", ankyCourse.title);
}

main().finally(async () => { await prisma.$disconnect(); });
