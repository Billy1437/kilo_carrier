// Applies prisma/rls.sql via Prisma Client (uses DATABASE_URL pooler, which is
// reachable where `prisma db execute` / directUrl may not be). Idempotent.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { PrismaClient } from "@prisma/client";

const here = dirname(fileURLToPath(import.meta.url));
const sql = readFileSync(join(here, "rls.sql"), "utf8");
const statements = sql
  .split(";")
  .map((s) => s.replace(/--.*$/gm, "").trim())
  .filter(Boolean);

const prisma = new PrismaClient();
try {
  for (const stmt of statements) {
    await prisma.$executeRawUnsafe(stmt);
    console.log("✓", stmt);
  }
  console.log("RLS applied to public.trips");
} finally {
  await prisma.$disconnect();
}
