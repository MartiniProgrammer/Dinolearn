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
                        prompt: "Which of the following groups are part of Ornithischia (\"bird-hipped\" dinosaurs)?",
                        type: "MULTI",
                        options: {
                          create: [
                            { text: "Armored lizards", isCorrect: true },
                            { text: "Swift hunters", isCorrect: false },
                            { text: "Heavy tails", isCorrect: false },
                            { text: "Ancient flyers", isCorrect: false }
                          ]
                        }
                      },
                      {
                        prompt: "When did ankylosaurus mainly live?",
                        type: "SINGLE",
                        options: {
                          create: [
                            { text: "Triassic", isCorrect: false },
                            { text: "Early Jurassic", isCorrect: false },
                            { text: "Late Cretaceous", isCorrect: true },
                            { text: "Paleogene", isCorrect: false }
                          ]
                        }
                      },
                      {
                        prompt: "Which feature best distinguishes Ankylosauridae from other dinosaur groups?",
                        type: "SINGLE",
                        options: {
                          create: [
                            { text: "Hollow bones for flight", isCorrect: false },
                            { text: "Osteoderms (bony armor)", isCorrect: true },
                            { text: "Sickle-shaped claws", isCorrect: false },
                            { text: "Large sail on back", isCorrect: false }
                          ]
                        }
                      },
                      {
                        prompt: "What is the evolutionary relationship of Ankylosauridae?",
                        type: "SINGLE",
                        options: {
                          create: [
                            { text: "Ornithischia → Thyreophora → Ankylosauria", isCorrect: true },
                            { text: "Theropoda → Maniraptora → Ankylosauria", isCorrect: false },
                            { text: "Ornithischia → Ceratopsia → Ankylosauria", isCorrect: false },
                            { text: "Ornithischia → Hadrosauridae → Ankylosauria", isCorrect: false }
                          ]
                        }
                      },
                      {
                        prompt: "Which of these groups are also Thyreophorans, like Ankylosauria?",
                        type: "SINGLE",
                        options: {
                          create: [
                            { text: "Stegosaurs", isCorrect: true },
                            { text: "Ceratopsians", isCorrect: false },
                            { text: "Therizinosaurs", isCorrect: false },
                            { text: "Sauropods", isCorrect: false }
                          ]
                        }
                      },
                      {
                        prompt: "Why are Ankylosauridae often called \"living tanks\"?",
                        type: "SINGLE",
                        options: {
                          create: [
                            { text: "They were carnivorous predators", isCorrect: false },
                            { text: "They had heavy bony armor and low, wide bodies", isCorrect: true },
                            { text: "They could run very fast", isCorrect: false },
                            { text: "They had hollow bones", isCorrect: false }
                          ]
                        }
                      },
                      {
                        prompt: "Which two continents have yielded the majority of Ankylosaurid fossils?",
                        type: "MULTI",
                        options: {
                          create: [
                            { text: "North America", isCorrect: true },
                            { text: "Africa", isCorrect: false },
                            { text: "Asia", isCorrect: true },
                            { text: "Antarctica", isCorrect: false }
                          ]
                        }
                      },
                      {
                        prompt: "Which evolutionary trend is true for Ankylosauridae during the Cretaceous?",
                        type: "SINGLE",
                        options: {
                          create: [
                            { text: "Loss of armor plates", isCorrect: false },
                            { text: "Development of tail clubs", isCorrect: true },
                            { text: "Becoming bipedal", isCorrect: false },
                            { text: "Reduction in body size", isCorrect: false }
                          ]
                        }
                      },
                      {
                        prompt: "Which statement about Ankylosauridae evolution is correct?",
                        type: "SINGLE",
                        options: {
                          create: [
                            { text: "They were early Triassic reptiles", isCorrect: false },
                            { text: "They diverged from Stegosaurs but developed heavier armor", isCorrect: true },
                            { text: "They are closely related to Pterosaurs", isCorrect: false },
                            { text: "They lived mainly in aquatic habitats", isCorrect: false }
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
                        prompt: "What are osteoderms?",
                        type: "SINGLE",
                        options: {
                          create: [
                            { text: "External scales", isCorrect: false },
                            { text: "Bony plates in the skin", isCorrect: true },
                            { text: "Modified teeth", isCorrect: false },
                            { text: "Hollow bones", isCorrect: false }
                          ]
                        }
                      },
                      {
                        prompt: "Which part of the Ankylosaurid body carried the tail club?",
                        type: "SINGLE",
                        options: {
                          create: [
                            { text: "Neck", isCorrect: false },
                            { text: "Tail", isCorrect: true },
                            { text: "Back", isCorrect: false },
                            { text: "Forelimbs", isCorrect: false }
                          ]
                        }
                      },
                      {
                        prompt: "What function did the tail club likely serve?",
                        type: "SINGLE",
                        options: {
                          create: [
                            { text: "Display", isCorrect: false },
                            { text: "Defense", isCorrect: true },
                            { text: "Thermoregulation", isCorrect: false },
                            { text: "Egg protection", isCorrect: false }
                          ]
                        }
                      },
                      {
                        prompt: "What evidence shows that Ankylosaur armor varied by species?",
                        type: "SINGLE",
                        options: {
                          create: [
                            { text: "Different sizes of osteoderms", isCorrect: true },
                            { text: "Tail feathers", isCorrect: false },
                            { text: "Lack of skull bones", isCorrect: false },
                            { text: "Wing shape", isCorrect: false }
                          ]
                        }
                      },
                      {
                        prompt: "Which bones stiffened the tail to support a club?",
                        type: "SINGLE",
                        options: {
                          create: [
                            { text: "Cervical ribs", isCorrect: false },
                            { text: "Caudal vertebrae", isCorrect: true },
                            { text: "Forelimbs", isCorrect: false },
                            { text: "Gastralia", isCorrect: false }
                          ]
                        }
                      },
                      {
                        prompt: "Why might the armor of Ankylosauridae be considered 'modular'?",
                        type: "SINGLE",
                        options: {
                          create: [
                            { text: "Armor plates could vary in arrangement", isCorrect: true },
                            { text: "They shed plates annually", isCorrect: false },
                            { text: "Armor was not bony", isCorrect: false },
                            { text: "Armor only covered the legs", isCorrect: false }
                          ]
                        }
                      },
                      {
                        prompt: "Which part of the skull was heavily armored in Ankylosaurs?",
                        type: "SINGLE",
                        options: {
                          create: [
                            { text: "Snout and eyes", isCorrect: true },
                            { text: "Jaw", isCorrect: false },
                            { text: "Braincase", isCorrect: false },
                            { text: "Teeth", isCorrect: false }
                          ]
                        }
                      },
                      {
                        prompt: "What evidence suggests Ankylosaurs were herbivores?",
                        type: "SINGLE",
                        options: {
                          create: [
                            { text: "Blunt, leaf-shaped teeth", isCorrect: true },
                            { text: "Large carnivorous claws", isCorrect: false },
                            { text: "Gastroliths", isCorrect: false },
                            { text: "Lack of teeth", isCorrect: false }
                          ]
                        }
                      },
                      {
                        prompt: "Why were Ankylosaurs' bodies low and wide?",
                        type: "SINGLE",
                        options: {
                          create: [
                            { text: "To swim easily", isCorrect: false },
                            { text: "To stabilize their armored weight", isCorrect: true },
                            { text: "To jump higher", isCorrect: false },
                            { text: "To climb trees", isCorrect: false }
                          ]
                        }
                      },
                      {
                        prompt: "What modern animal shows similar armor adaptation to Ankylosaurs?",
                        type: "SINGLE",
                        options: {
                          create: [
                            { text: "Pangolins", isCorrect: true },
                            { text: "Bats", isCorrect: false },
                            { text: "Frogs", isCorrect: false },
                            { text: "Dolphins", isCorrect: false }
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
                        prompt: "What was the primary diet of Ankylosauridae?",
                        type: "SINGLE",
                        options: {
                          create: [
                            { text: "Small mammals", isCorrect: false },
                            { text: "Low-lying plants", isCorrect: true },
                            { text: "Fish", isCorrect: false },
                            { text: "Insects", isCorrect: false }
                          ]
                        }
                      },
                      {
                        prompt: "Which predator group posed the biggest threat to Ankylosaurs?",
                        type: "SINGLE",
                        options: {
                          create: [
                            { text: "Ceratopsians", isCorrect: false },
                            { text: "Tyrannosaurids", isCorrect: true },
                            { text: "Pterosaurs", isCorrect: false },
                            { text: "Sauropods", isCorrect: false }
                          ]
                        }
                      },
                      {
                        prompt: "Why did Ankylosaurs likely stay close to the ground?",
                        type: "SINGLE",
                        options: {
                          create: [
                            { text: "Their body structure made them low browsers", isCorrect: true },
                            { text: "They could not lift their heads", isCorrect: false },
                            { text: "They were aquatic", isCorrect: false },
                            { text: "To avoid predators completely", isCorrect: false }
                          ]
                        }
                      },
                      {
                        prompt: "What defense strategies did Ankylosaurs use?",
                        type: "MULTI",
                        options: {
                          create: [
                            { text: "Camouflage", isCorrect: true },
                            { text: "Speed", isCorrect: false },
                            { text: "Tail clubs", isCorrect: true },
                            { text: "Venom", isCorrect: false }
                          ]
                        }
                      },
                      {
                        prompt: "Which environment did Ankylosaurs prefer?",
                        type: "SINGLE",
                        options: {
                          create: [
                            { text: "Open habitats like floodplains", isCorrect: true },
                            { text: "Deep ocean", isCorrect: false },
                            { text: "Mountain peaks", isCorrect: false },
                            { text: "Arctic tundra", isCorrect: false }
                          ]
                        }
                      },
                      {
                        prompt: "What does their heavy build suggest about their speed?",
                        type: "SINGLE",
                        options: {
                          create: [
                            { text: "They were slow movers", isCorrect: true },
                            { text: "They could sprint", isCorrect: false },
                            { text: "They were aquatic swimmers", isCorrect: false },
                            { text: "They glided", isCorrect: false }
                          ]
                        }
                      },
                      {
                        prompt: "Why might Ankylosaurs live in groups?",
                        type: "MULTI",
                        options: {
                          create: [
                            { text: "To help hunt prey", isCorrect: false },
                            { text: "To protect against predators", isCorrect: true },
                            { text: "To build nests together", isCorrect: true },
                            { text: "To swim in schools", isCorrect: false }
                          ]
                        }
                      },
                      {
                        prompt: "Which sense may have been especially important for Ankylosaurs?",
                        type: "SINGLE",
                        options: {
                          create: [
                            { text: "Smell", isCorrect: true },
                            { text: "Echolocation", isCorrect: false },
                            { text: "UV vision", isCorrect: false },
                            { text: "Heat pits", isCorrect: false }
                          ]
                        }
                      },
                      {
                        prompt: "Which of these behaviors is likely but unproven in Ankylosaurs?",                        
                        type: "SINGLE",
                        options: {
                          create: [
                            { text: "Tail-swinging combat", isCorrect: true },
                            { text: "Flight", isCorrect: false },
                            { text: "Nest parasitism", isCorrect: false },
                            { text: "Hibernation", isCorrect: false }
                          ]
                        }
                      },
                      {
                        prompt: "What does their body shape suggest about their feeding range?",
                        type: "SINGLE",
                        options: {
                          create: [
                            { text: "Low vegetation browsing", isCorrect: true },
                            { text: "Canopy leaves", isCorrect: false },
                            { text: "Hunting prey", isCorrect: false },
                            { text: "Digging burrows", isCorrect: false }
                          ]
                        }
                      }
                    ]
                  }
                },
                {
                  slug: "key-genera",
                  title: "Important species",
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
                        prompt: "Which genus is the most famous Ankylosaurid from North America?",
                        type: "SINGLE",
                        options: {
                          create: [
                            { text: "Pinacosaurus", isCorrect: false },
                            { text: "Euoplecephalus", isCorrect: true },
                            { text: "Ankylosaurus", isCorrect: false },
                            { text: "Stegouros", isCorrect: false }
                          ]
                        }
                      },
                      {
                        prompt: "Which genus is best known from Asia with many juvenile skeletons?",
                        type: "SINGLE",
                        options: {
                          create: [
                            { text: "Pinacosaurus", isCorrect: true },
                            { text: "Ankylosaurus", isCorrect: false },
                            { text: "Euoplocephalus", isCorrect: false },
                            { text: "Triceratops", isCorrect: false }
                          ]
                        }
                      },
                      {
                        prompt: "Which genus had complex nasal passages and is well studied?",
                        type: "SINGLE",
                        options: {
                          create: [
                            { text: "Ankylosaurus", isCorrect: false },
                            { text: "Euoplocephalus", isCorrect: true },
                            { text: "Pinacosaurus", isCorrect: false },
                            { text: "Pachycephalosaurus", isCorrect: false }
                          ]
                        }
                      },
                      {
                        prompt: "What is a diagnostic feature of Ankylosaurus?",
                        type: "SINGLE",
                        options: {
                          create: [
                            { text: "Large tail club", isCorrect: true },
                            { text: "Horned frill", isCorrect: false },
                            { text: "Tall neural spines", isCorrect: false },
                            { text: "Long neck", isCorrect: false }
                          ]
                        }
                      },
                      {
                        prompt: "Which genera are Ankylosaurids?",
                        type: "MULTI",
                        options: {
                          create: [
                            { text: "Ankylosaurus", isCorrect: true },
                            { text: "Stegosaurus", isCorrect: false },
                            { text: "Pinacosaurus", isCorrect: true },
                            { text: "Euoplocephalus", isCorrect: true }
                          ]
                        }
                      },
                      {
                        prompt: "Where were Pinacosaurus fossils mostly found?",
                        type: "SINGLE",
                        options: {
                          create: [
                            { text: "Canada", isCorrect: false },
                            { text: "Mongolia", isCorrect: true },
                            { text: "Argentina", isCorrect: false },
                            { text: "Europe", isCorrect: false }
                          ]
                        }
                      },
                      {
                        prompt: "Which feature makes Euoplocephalus unique among Ankylosaurs?",
                        type: "SINGLE",
                        options: {
                          create: [
                            { text: "Complex nasal sinuses", isCorrect: true },
                            { text: "Wing bones", isCorrect: false },
                            { text: "Aquatic adaptations", isCorrect: false },
                            { text: "Gigantic size", isCorrect: false }
                          ]
                        }
                      },
                      {
                        prompt: "Which Ankylosaurid is often shown with one of the largest clubs?",
                        type: "SINGLE",
                        options: {
                          create: [
                            { text: "Ankylosaurus", isCorrect: true },
                            { text: "Pinacosaurus", isCorrect: false },
                            { text: "Stegosaurus", isCorrect: false },
                            { text: "Ceratops", isCorrect: false }
                          ]
                        }
                      },
                      {
                        prompt: "Which two genera are iconic Late Cretaceous Ankylosaurids of North America?",
                        type: "MULTI",
                        options: {
                          create: [
                            { text: "Ankylosaurus", isCorrect: true },
                            { text: "Euoplocephalus", isCorrect: true },
                            { text: "Pinacosaurus", isCorrect: false },
                            { text: "Triceratops", isCorrect: false }
                          ]
                        }
                      },
                      {
                        prompt: "Which feature unites all Ankylosaurid genera?",
                        type: "SINGLE",
                        options: {
                          create: [
                            { text: "Osteoderm armor", isCorrect: true },
                            { text: "Sail on back", isCorrect: false },
                            { text: "Crest on skull", isCorrect: false },
                            { text: "Flight ability", isCorrect: false }
                          ]
                        }
                      }
                    ]
                  }
                },
                {
                  slug: "fossils-discovery",
                  title: "Fossils and their discovery",
                  durationMinutes: 8,
                  order: 5,
                  hasQuiz: true,
                  content: {
                    type: "md",
                    body: [
                      "Grote vondsten in Dinosaur Provincial Park (Canada) en Mongolië (Gobi).",
                      "Osteodermen fossiliseren goed; staartknotsen zijn diagnostisch.",
                      "Onderzoek: CT-scans, histologie van platen, biomechanica van staartslagen."
                    ]
                  },
                  questions: {
                    create: [
                      {
                        prompt: "Where were many Ankylosaur fossils discovered in North America?",
                        type: "SINGLE",
                        options: {
                          create: [
                            { text: "Dinosaur Provincial Park (Canada)", isCorrect: true },
                            { text: "Gobi Desert", isCorrect: false },
                            { text: "Patagonia", isCorrect: false },
                            { text: "South Africa", isCorrect: false }
                          ]
                        }
                      },
                      {
                        prompt: "Which region in Asia is famous for Ankylosaur fossils?",
                        type: "SINGLE",
                        options: {
                          create: [
                            { text: "Siberia", isCorrect: false },
                            { text: "Mongolia (Gobi Desert)", isCorrect: true },
                            { text: "Japan", isCorrect: false },
                            { text: "India", isCorrect: false }
                          ]
                        }
                      },
                      {
                        prompt: "What part of the Ankylosaur body fossilizes especially well?",
                        type: "SINGLE",
                        options: {
                          create: [
                            { text: "Osteoderms (armor plates)", isCorrect: true },
                            { text: "Cartilage", isCorrect: false },
                            { text: "Muscles", isCorrect: false },
                            { text: "Feathers", isCorrect: false }
                          ]
                        }
                      },
                      {
                        prompt: "Why do tail clubs fossilize relatively well?",
                        type: "SINGLE",
                        options: {
                          create: [
                            { text: "They are made of cartilage", isCorrect: false },
                            { text: "They are large and bony", isCorrect: true },
                            { text: "They are preserved in amber", isCorrect: false },
                            { text: "They float", isCorrect: false }
                          ]
                        }
                      },
                      {
                        prompt: "What tools do scientists use to study Ankylosaur armor internally?",
                        type: "MULTI",
                        options: {
                          create: [
                            { text: "CT scans", isCorrect: true },
                            { text: "X-rays", isCorrect: true },
                            { text: "Ultrasound", isCorrect: false },
                            { text: "None", isCorrect: false }
                          ]
                        }
                      },
                      {
                        prompt: "What does histology of osteoderms reveal?",
                        type: "SINGLE",
                        options: {
                          create: [
                            { text: "Growth patterns", isCorrect: true },
                            { text: "Diet", isCorrect: false },
                            { text: "Migration routes", isCorrect: false },
                            { text: "DNA sequences", isCorrect: false }
                          ]
                        }
                      },
                      {
                        prompt: "Which type of environment preserved many Ankylosaurs?",
                        type: "SINGLE",
                        options: {
                          create: [
                            { text: "Desert dunes", isCorrect: true },
                            { text: "Coral reefs", isCorrect: false },
                            { text: "Ice sheets", isCorrect: false },
                            { text: "Lava fields", isCorrect: false }
                          ]
                        }
                      },
                      {
                        prompt: "Which fossil evidence suggests Ankylosaurs had keratin on armor?",
                        type: "SINGLE",
                        options: {
                          create: [
                            { text: "Impressions on osteoderms", isCorrect: true },
                            { text: "DNA fragments", isCorrect: false },
                            { text: "Eggs", isCorrect: false },
                            { text: "Skin pigment", isCorrect: false }
                          ]
                        }
                      },
                      {
                        prompt: "What makes Ankylosaur fossils challenging to study?",
                        type: "SINGLE",
                        options: {
                          create: [
                            { text: "Plates are fused and heavy", isCorrect: true },
                            { text: "They dissolve quickly", isCorrect: false },
                            { text: "They are tiny", isCorrect: false },
                            { text: "They are radioactive", isCorrect: false }
                          ]
                        }
                      },
                      {
                        prompt: "Why are juvenile Ankylosaurs important to discovery?",
                        type: "SINGLE",
                        options: {
                          create: [
                            { text: "They show growth changes in armor", isCorrect: true },
                            { text: "They are easier to find", isCorrect: false },
                            { text: "They were aquatic", isCorrect: false },
                            { text: "They are more complete", isCorrect: false }
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
                        prompt: "Which three features best describe Ankylosauridae?",
                        type: "SINGLE",
                        options: {
                          create: [
                            { text: "Armor, tail club, herbivory", isCorrect: true },
                            { text: "Wings, claws, feathers", isCorrect: false },
                            { text: "Aquatic lifestyle", isCorrect: false },
                            { text: "Hollow bones", isCorrect: false }
                          ]
                        }
                      },
                      {
                        prompt: "What was their primary diet?",
                        type: "SINGLE",
                        options: {
                          create: [
                            { text: "Carnivory", isCorrect: false },
                            { text: "Low plants", isCorrect: true },
                            { text: "Insects", isCorrect: false },
                            { text: "Plankton", isCorrect: false }
                          ]
                        }
                      },
                      {
                        prompt: "Which predator likely forced Ankylosaurs to evolve heavy defense?",
                        type: "SINGLE",
                        options: {
                          create: [
                            { text: "Tyrannosaurids", isCorrect: true },
                            { text: "Ceratopsians", isCorrect: false },
                            { text: "Pterosaurs", isCorrect: false },
                            { text: "Sauropods", isCorrect: false }
                          ]
                        }
                      },
                      {
                        prompt: "What modern animal is most similar in armor adaptation?",
                        type: "MULTI",
                        options: {
                          create: [
                            { text: "Pangolin", isCorrect: true },
                            { text: "Crocodile", isCorrect: true },
                            { text: "Elephant", isCorrect: false },
                            { text: "Bat", isCorrect: false }
                          ]
                        }
                      },
                      {
                        prompt: "Which continents yielded the most Ankylosaur fossils?",
                        type: "MULTI",
                        options: {
                          create: [
                            { text: "Asia", isCorrect: true },
                            { text: "Europe", isCorrect: false },
                            { text: "North America", isCorrect: true },
                            { text: "Australia", isCorrect: false }
                          ]
                        }
                      },
                      {
                        prompt: "What structure stiffened the tail for club use?",
                        type: "SINGLE",
                        options: {
                          create: [
                            { text: "Caudal vertebrae", isCorrect: true },
                            { text: "Wing bones", isCorrect: false },
                            { text: "Skull plates", isCorrect: false },
                            { text: "Teeth", isCorrect: false }
                          ]
                        }
                      },
                      {
                        prompt: "Which genera are Ankylosauridae?",
                        type: "MULTI",
                        options: {
                          create: [
                            { text: "Ankylosaurus", isCorrect: true },
                            { text: "Euoplocephalus", isCorrect: true },
                            { text: "Pinacosaurus", isCorrect: true },
                            { text: "Velociraptor", isCorrect: false }
                          ]
                        }
                      },
                      {
                        prompt: "What is the role of CT scanning fossils?",
                        type: "MULTI",
                        options: {
                          create: [
                            { text: "Reveals internal bone structure", isCorrect: true },
                            { text: "Finds hidden cavities", isCorrect: true },
                            { text: "Measures color", isCorrect: false },
                            { text: "Detects DNA", isCorrect: false }
                          ]
                        }
                      },
                      {
                        prompt: "Which evolutionary group do Ankylosaurs belong to?",
                        type: "SINGLE",
                        options: {
                          create: [
                            { text: "Ornithischia", isCorrect: true },
                            { text: "Theropoda", isCorrect: false },
                            { text: "Sauropoda", isCorrect: false },
                            { text: "Pterosauria", isCorrect: false }
                          ]
                        }
                      },
                      {
                        prompt: "What is their nickname due to their body plan?",
                        type: "SINGLE",
                        options: {
                          create: [
                            { text: "Living tanks", isCorrect: true },
                            { text: "Flying lizards", isCorrect: false },
                            { text: "Sea dragons", isCorrect: false },
                            { text: "Forest giants", isCorrect: false }
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
