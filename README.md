# DinoLearn

Next.js app for dinosaur courses. To see sample courses locally:

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Provide a PostgreSQL `DATABASE_URL` in `.env`.
3. Create database tables:
   ```bash
   npx prisma db push
   ```
4. Seed demo data:
   ```bash
   npx ts-node prisma/seed.ts
   ```
5. Start development server and open `/courses`:
   ```bash
   npm run dev
   ```

This seeds a demo course ("C1 — Inleiding tot Dinosaurussen") so that the courses page shows content immediately.