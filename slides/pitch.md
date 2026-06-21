---
marp: true
paginate: true
transition: fade
# PechaKucha: 6 slides, 20s auto-advance. Do not change the count.
auto-advance: 20
---

<!-- slide 1 -->
# Who's my person?

**Cross-border senders & travellers** on the Yangon ⇄ Bangkok route.

- Myanmar diaspora in Bangkok sending things home
- Families & small sellers moving documents and parcels
- Travellers already flying with **spare luggage space**

<!-- 20s -->

---

<!-- slide 2 -->
# Their problem

- Courier between Myanmar & Thailand is **slow and expensive**
- People already make the trip every day with **empty kilos**
- No simple, trusted way to **match a parcel to a traveller**
- Deals happen in scattered chats — hard to find, hard to trust

---

<!-- slide 3 -->
# What I built

**KiloCarrier** — a peer-to-peer cargo marketplace (YGN ⇄ BKK).

- **Browse** trips: filter by direction, date, kg, price (฿)
- **Post** a trip: carriers list spare space, set price & contacts
- **Contact directly**: Telegram / WhatsApp / Viber / Facebook
- **Trust & clarity**: trip status (active/full/completed) + carrier trip history
- Next.js + Prisma + Supabase, deployed on Vercel

---

<!-- slide 4 -->
# How I built it
- **MCP:** Supabase MCP — inspect tables, run SQL, verify schema/data live
- **Skill:** `Billy1437` — KiloCarrier conventions (stack, data model, ownership/RLS rules, brand) Claude reuses
- **Agent:** `Billy1437` — feature builder that scaffolds *and* self-reviews (bugs, security, a11y)

Project-first, committed in small steps, verified each change with build + live preview.

---

<!-- slide 5 -->
# Why it matters

- **Cheaper & faster** than courier — same-day, traveller-carried
- **Zero platform fees** — sender pays the carrier directly
- **Trust** without payments: verified contacts + carrier track record
- Turns wasted luggage space into income for travellers
- Performance-first: Singapore region + cached queries = snappy

---

<!-- slide 6 -->
# Done checklist
- [x] repo public
- [x] MCP + skill + agent used
- [x] report.md in team repo
