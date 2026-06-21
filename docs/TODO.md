# KiloCarrier — Backlog

## Trip status + carrier track record (trust / clarity)

> **Status:** ✅ trip status (ACTIVE/FULL/COMPLETED) shipped — owner can mark full/completed/reopen
> from My trips & trip detail; browse + landing show only ACTIVE. Carrier track-record signals =
> Phase 1 below (✅). Verified "successful carries" = Phase 2 (⏳).

**Idea:** let a carrier mark a trip's space as **full** (or update remaining kg), and track how many trips a carrier has **successfully carried**, so future senders can see a carrier's history ("X successful carries") for trust.

**Why:** increases clarity and trust — senders prefer carriers with a proven track record; "full" trips stop wasting senders' time.

**Sketch (not final):**
- Add trip **status**: `ACTIVE` → `FULL` / `COMPLETED` (owner-updatable from My trips / trip detail).
  - or keep it numeric: let owner reduce `availableKg` to 0 = full.
- Browse: hide or badge `FULL`/`COMPLETED` trips (filter `status = ACTIVE`).
- **Carrier stats**: count `COMPLETED` trips per `userId`; surface on listings/cards and trip detail (e.g. "12 successful carries").
  - needs a per-user notion (a `profiles` table or aggregate over `trips.userId`).
- Ownership rules: only the trip owner can change status (enforce in server action, like edit/delete).
- Optional later: sender-side confirmation / simple rating to make "successful" trustworthy rather than self-reported.

**Open questions:**
- Self-reported "completed" vs. confirmed by sender? Self-report is easy but gameable.
- Show stats on a public carrier profile page, or inline only?

---

## Trust signals — chosen plan

### ✅ Phase 1 (done) — factual, ungameable signals
On the trip detail page, show the carrier's **trip history from the `trips` table** (no schema change, nothing self-reported):
- `{N} trips listed` (count of this carrier's listings)
- `{M} past trips` (listings whose `travelDate` has passed) — shown only when > 0
- Honesty caption: "Trip history on KiloCarrier — verify details directly with the carrier."

Deliberately **not** claiming "successful deliveries" we can't prove.

### ⏳ Phase 2 (backlog) — real proof via sender confirmation
Make "successful carries" trustworthy by capturing the other side of the deal:
1. Sender taps "I'm sending with this carrier" on a trip → enters their own contact → `booking` (status `PENDING`).
2. Carrier marks "delivered".
3. System sends a **unique confirm link to the sender's contact** (a channel the carrier doesn't control) → sender clicks → `booking.status = CONFIRMED`.
4. Only `CONFIRMED` bookings increment the public "successful carries" count.

Anti-abuse: verify carrier identity (Telegram/phone OTP) so fake accounts are costly; one confirmation per booking; label "confirmed by senders" vs self-reported. Ratings, if added, only on `CONFIRMED` bookings.
