---
name: Billy1437
description: KiloCarrier project knowledge and conventions. Use whenever building, editing, or reviewing anything in the KiloCarrier app — pages, the trips data model, Supabase access, auth, contact deep links, brand styling, or RLS. Loads the stack, schema, business rules, and code patterns this repo follows.
---

# KiloCarrier — Project Conventions

KiloCarrier is a peer-to-peer cargo courier marketplace. Carriers flying the
**Yangon (YGN) ↔ Bangkok (BKK)** corridor post trips with spare luggage capacity;
senders browse and contact carriers directly (Telegram / Facebook / Viber / WhatsApp).
Listing layer only — no in-app payments or messaging.

Tagline: **"Travel light. Send smart."**

## Stack

- **Next.js (App Router, TypeScript)** — Server Components for reads, Server Actions for writes
- **Tailwind CSS v4** (CSS-based `@theme`, no `tailwind.config.ts`) + **shadcn/ui** (base-ui registry)
- **Database: Prisma 6** → Supabase Postgres (via the connection poolers)
- **Auth: Supabase Auth** (email/password + Google OAuth) via `@supabase/ssr`
- **React Hook Form + Zod** for forms
- Deploy target: Vercel

## Architecture rules

- **DB access = Prisma only.** Import the singleton from `lib/prisma.ts`. Reads in Server
  Components; writes in Server Actions (`'use server'`). Never query the DB from a client component.
- **Auth = Supabase.** Server client `lib/supabase/server.ts` (`next/headers` cookies) reads the
  session; browser client `lib/supabase/client.ts` handles OAuth redirect + sign-out. `middleware.ts`
  refreshes the session every request — never put logic between `createServerClient` and
  `supabase.auth.getUser()`.
- **Security is app-level, not RLS.** Prisma connects through the pooler as the `postgres` role,
  which **bypasses Row Level Security**. So every write/mutate server action MUST:
  1. get the authenticated user via the Supabase server client (reject if none for `/post`),
  2. set `userId` from the session (never trust client-sent ids),
  3. on update/delete, verify the row's `userId === session user id` before mutating.
- Prisma connects via `DATABASE_URL` (transaction pooler, `pgbouncer=true`) in `.env`; migrations/
  `db push` use `DIRECT_URL` (session pooler). Run `npm run db:push` to sync schema.

## Data model — `trips` (Prisma model `Trip`, table `trips`)

| column | type | notes |
|--------|------|-------|
| id | uuid PK | `gen_random_uuid()` |
| user_id | uuid FK → auth.users | owner |
| direction | text | check `('YGN_TO_BKK','BKK_TO_YGN')` |
| travel_date | date | not null |
| available_kg | numeric | check `1..50`, not null |
| price_per_kg | numeric | nullable |
| item_restrictions | text | nullable |
| carrier_name | text | not null, default from account |
| telegram | text | **NOT NULL — required contact** |
| facebook | text | nullable |
| viber | text | nullable |
| whatsapp | text | nullable |
| notes | text | nullable |
| created_at | timestamptz | default `now()` |
| expires_at | timestamptz | = travel_date end-of-day; browse filters `expires_at > now()` |

### Ownership rules (enforced in server actions, since Prisma bypasses RLS)
- Read/list → open to everyone
- Create → must be logged in; `userId` taken from the session
- Update / delete → only when row `userId` matches the session user

## Business rules

- Only the YGN ↔ BKK corridor exists. No other routes.
- Trips auto-expire after the travel date — always filter `expires_at > now()` on browse.
- Browsing and viewing a trip are **public**; **posting requires login**.
- **Telegram is mandatory** on every listing. Facebook, Viber, WhatsApp are optional and
  rendered only when present.
- Available KG range: 1–50.

### Contact deep links
- Telegram → `https://t.me/<id>` (strip leading `@`)
- WhatsApp → `https://wa.me/<digits>`
- Viber → `viber://chat?number=<digits>`
- Facebook → store/render the full profile URL
- Share → "Copy link" button copying the public `/trips/[id]` URL

## Brand & styling

- Primary = **Indigo** (`--primary`), accent = **Amber** (`--amber` / `text-amber`, `bg-amber`).
- Tone: clean, trust-focused — "Southeast Asian Airbnb for cargo".
- Reference layout: CarHub-style browse page — left filter sidebar + listing cards on the right.
- Use shadcn components; theme via the CSS variables in `src/app/globals.css`. No hardcoded hex.

## Routes

| Route | Purpose | Auth |
|-------|---------|------|
| `/` | Browse listings (filter sidebar + trip cards) | public |
| `/trips/[id]` | Trip detail + contact deep links + copy-link | public |
| `/post` | Post-a-trip form (RHF + Zod, server action) | login required |
| `/login` | Email/password + Google, with signup toggle | public |
| `/auth/callback` | OAuth code exchange | — |
