---
marp: true
paginate: true
transition: fade
theme: default
---

<!-- _class: lead -->

# KiloCarrier

## Tech stack and AI workflow

**Travel light. Send smart.**

[kilocarrier.com](https://kilocarrier.com/)

---

# A modern full-stack marketplace

- **Next.js 16 + React 19 + TypeScript** — App Router, Server Components, and Server Actions
- **Tailwind CSS v4 + shadcn/ui** — responsive interface and reusable components
- **Prisma 6 + Supabase Postgres** — typed database access and hosted data
- **Supabase Auth** — email/password and Google sign-in
- **Zod + React Hook Form** — client and server validation
- **Vercel** — production hosting in the Singapore region

---

# One subagent builds and checks features

## `Billy1437` feature builder

- Implements non-trivial KiloCarrier changes
- Reads the project Skill before editing
- Follows the Prisma, Supabase Auth, and ownership rules
- Self-reviews correctness, security, and accessibility
- Runs the build or the narrowest relevant check

**File:** `.claude/agents/Billy1437.md`

---

# One Skill keeps every change consistent

## `Billy1437` project conventions

- Defines the stack, routes, data model, and business rules
- Requires Telegram while keeping other contacts optional
- Keeps browsing public and posting authenticated
- Enforces trip ownership in Server Actions
- Preserves the KiloCarrier brand and YGN ⇄ BKK scope

**File:** `.claude/skills/Billy1437/SKILL.md`

---

# The workflow moves from intent to proof

1. **Plan** — use Superpowers to clarify the change
2. **Build** — delegate focused work to the `Billy1437` subagent
3. **Guide** — load the `Billy1437` Skill for project rules
4. **Inspect** — use Supabase MCP and browser tools where needed
5. **Verify** — run lint/build and test the live result
6. **Commit** — keep changes small and traceable

---

# Triggers decide when each tool activates

## Skill trigger

Activates whenever KiloCarrier pages, data, authentication, contacts, styling, or security rules are created, edited, or reviewed.

## Subagent trigger

Activates for a non-trivial implementation task that needs both development and a correctness, security, and accessibility review.

---

# Exact phrases fire the workflow

## Skill

```text
Use the Billy1437 skill to review this KiloCarrier change.
```

## Subagent

```text
Use the Billy1437 subagent to implement and self-review this feature.
```

## Verification

```bash
npm run lint
npm run build
```
