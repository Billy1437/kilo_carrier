# KiloCarrier MVP — Design Spec

**Date:** 2026-06-19
**Status:** Approved

## Summary

KiloCarrier is a peer-to-peer cargo-courier marketplace for the **Yangon (YGN) ↔ Bangkok (BKK)**
corridor. Carriers post trips with spare luggage capacity; senders browse and contact carriers
directly. Listing/discovery layer only — no in-app payments or messaging.

This MVP scope (revised from the original briefing) adds **user authentication** and narrows the
page set to the core loop: **auth → post → browse → view/share**.

## Goals

- Carriers can sign up / log in and **post a trip**.
- Anyone can **browse and view** trips without logging in.
- Each trip exposes **contact deep links** (Telegram required; Facebook / Viber / WhatsApp optional)
  and a **copy-link** share button.

Non-goals (MVP): in-app payments, in-app messaging, routes other than YGN↔BKK, separate Home/About
pages, trip editing UI (owner can re-post), profiles beyond the account name.

## Stack

- Next.js (App Router, TypeScript) — installed via `create-next-app@latest` → **Next 16 + React 19**
- Tailwind CSS **v4** (CSS `@theme`) + shadcn/ui (base-ui registry)
- Supabase: Postgres + Auth (email/password + Google OAuth), via `@supabase/ssr`
- React Hook Form + Zod
- Deploy: Vercel

## Architecture

- **Reads** → Server Components using `lib/supabase/server.ts` (`createServerClient` + `next/headers`).
- **Writes** → Server Actions (`'use server'`).
- **Auth UI** → browser client `lib/supabase/client.ts` (Google OAuth redirect, sign-out).
- `middleware.ts` refreshes the session on every request (no logic between `createServerClient`
  and `auth.getUser()`).
- **Security via RLS** on the `trips` table.

## Data model — `trips`

| column | type | constraints |
|--------|------|-------------|
| id | uuid PK | `gen_random_uuid()` |
| user_id | uuid | FK → `auth.users`, not null |
| direction | text | check `('YGN_TO_BKK','BKK_TO_YGN')` |
| travel_date | date | not null |
| available_kg | numeric | check between 1 and 50, not null |
| price_per_kg | numeric | nullable |
| item_restrictions | text | nullable |
| carrier_name | text | not null |
| telegram | text | **not null (required contact)** |
| facebook | text | nullable |
| viber | text | nullable |
| whatsapp | text | nullable |
| notes | text | nullable |
| created_at | timestamptz | default `now()` |
| expires_at | timestamptz | = travel_date at end-of-day; browse filters `expires_at > now()` |

### RLS policies
- `SELECT` → public (`using (true)`)
- `INSERT` → `auth.uid() = user_id`
- `UPDATE` / `DELETE` → `auth.uid() = user_id`

## Routes

| Route | Purpose | Auth |
|-------|---------|------|
| `/` | Browse — CarHub-style filter sidebar + trip cards | public |
| `/trips/[id]` | Trip detail + contact deep links + copy-link | public |
| `/post` | Post-a-trip form (RHF + Zod, server action) | login required |
| `/login` | Email/password + Google OAuth, signup toggle | public |
| `/auth/callback` | OAuth code exchange | — |

## Browse filters (CarHub layout, adapted to cargo)

Direction · travel date (on/after) · minimum available kg · price-per-kg range · sort
(newest / soonest departure / cheapest). All car-specific filters dropped.

## Contact & share

- Telegram (required) → `https://t.me/<id>`
- WhatsApp → `https://wa.me/<digits>` (optional)
- Viber → `viber://chat?number=<digits>` (optional)
- Facebook → full profile URL (optional)
- Copy link → public `/trips/[id]` URL

## Tooling deliverables

- **`.mcp.json`** — Supabase MCP server (stdio via npx); user fills `--project-ref` + `SUPABASE_ACCESS_TOKEN`.
- **`.claude/skills/Billy1437/SKILL.md`** — KiloCarrier conventions/knowledge.
- **`.claude/agents/Billy1437.md`** — KiloCarrier feature builder that self-reviews (bugs, RLS, a11y).

## Build phases

0. Scaffold (Next, shadcn, brand tokens, config files, spec) — *no Supabase keys needed*.
1. **User creates Supabase project + Google OAuth**, pastes URL/anon key/ref/PAT. *(blocking pause)*
2. `trips` migration + RLS (via Supabase MCP).
3. Supabase clients + middleware.
4. Auth (`/login`, `/auth/callback`).
5. Features (`/post`, `/`, `/trips/[id]`).
6. Verify: `npm run build` + manual smoke test.

## Risks / open items

- Google OAuth requires a Google Cloud OAuth client + redirect URL configured in Supabase — extra
  setup walked through in Phase 1.
- Tailwind v4 + Next 16 are newer than the original "Next 14" briefing; confirmed compatible with
  shadcn and `@supabase/ssr`.
