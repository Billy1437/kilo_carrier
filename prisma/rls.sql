-- Row-Level Security hardening for public.trips
--
-- WHY: The app reads/writes trips exclusively through Prisma, which connects as
-- the `postgres` role (rolbypassrls = true) and is therefore unaffected by RLS.
-- Supabase is used ONLY for auth, never for direct client-side data access.
--
-- Without RLS, the public `anon` / `authenticated` roles inherit broad table
-- grants (SELECT/INSERT/UPDATE/DELETE/TRUNCATE), so anyone holding the public
-- publishable key (shipped in the client bundle) could read or mutate every
-- trip via the PostgREST API at /rest/v1/trips, bypassing all server actions
-- and owner checks.
--
-- Enabling RLS with NO policies = default-deny for anon/authenticated, while
-- Prisma (postgres, bypassrls) keeps full access. Re-run this after any
-- `prisma db push` that recreates the table. Statements are idempotent.

ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips FORCE ROW LEVEL SECURITY;
