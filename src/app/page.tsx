import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  MessageCircle,
  Banknote,
  Plane,
  ShieldCheck,
  Send,
  Phone,
  Link2,
  Plus,
} from "lucide-react";
import { getLanding } from "@/lib/queries";
import { TripCard, type TripCardData } from "@/components/trip-card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const CHANNELS = [
  { icon: Send, label: "Telegram" },
  { icon: MessageCircle, label: "WhatsApp" },
  { icon: Phone, label: "Viber" },
  { icon: Link2, label: "Facebook" },
];

const BENEFITS = [
  {
    icon: MessageCircle,
    title: "Direct contact",
    body: "Message carriers on Telegram, WhatsApp or Viber. No middleman, no waiting on support.",
  },
  {
    icon: Banknote,
    title: "Zero platform fees",
    body: "You pay the carrier directly and agree your own price. KiloCarrier never takes a cut.",
  },
  {
    icon: Plane,
    title: "Same-day delivery",
    body: "Your parcel flies the day your carrier does — far faster than traditional courier.",
  },
  {
    icon: ShieldCheck,
    title: "Trusted routes",
    body: "Focused on Yangon ⇄ Bangkok, with a verified Telegram contact on every listing.",
  },
];

const FAQS = [
  {
    q: "Is KiloCarrier safe to use?",
    a: "KiloCarrier is a listing platform — we connect you with carriers, but you arrange everything directly. Check the carrier's contact, agree clearly on items, and meet at the airport.",
  },
  {
    q: "How do I pay the carrier?",
    a: "Directly with the carrier — cash or transfer, whatever you agree. We charge no platform fees and never touch your money.",
  },
  {
    q: "What can I send?",
    a: "Legal items within the carrier's stated restrictions and weight. No prohibited or dangerous goods — the carrier has the final say.",
  },
  {
    q: "How do I contact a carrier?",
    a: "Open any trip and tap their Telegram, WhatsApp, Viber or Facebook link. Telegram is required on every listing.",
  },
];

export default async function LandingPage() {
  const { trips: dtos, totalTrips, totalKg, toBkk, toYgn } = await getLanding();

  const trips: TripCardData[] = dtos.map((t) => ({
    ...t,
    travelDate: new Date(t.travelDate),
  }));

  const maxDir = Math.max(toBkk, toYgn, 1);

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8 lg:pt-16">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-olive">
          Yangon ⇄ Bangkok · peer-to-peer cargo
        </p>
        <h1 className="mt-5 font-display text-6xl font-light leading-[0.92] tracking-tight sm:text-7xl lg:text-[8.5rem]">
          Send it lighter.
        </h1>
        <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-md text-lg text-muted-foreground">
            Find a traveller with spare luggage space and send your parcel across
            the border the same day — cheaper than courier, with zero platform fees.
          </p>
          <div className="flex shrink-0 gap-3">
            <Link
              href="/browse"
              className={cn(buttonVariants({ size: "lg" }), "rounded-full px-7 shadow-sm")}
            >
              Browse trips <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/post"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "rounded-full bg-card px-7",
              )}
            >
              Post a trip
            </Link>
          </div>
        </div>

        {/* Dashboard mockup on olive panel */}
        <div className="relative mt-14">
          <div className="absolute inset-x-0 bottom-0 top-16 rounded-[2.5rem] bg-olive" />
          <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
            <div className="bg-gradient-to-b from-sky/60 to-card p-7 sm:p-10">
              <div className="flex items-center justify-between">
                <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  Trips › Overview
                </p>
                <span className="rounded-full bg-card px-3 py-1.5 text-xs font-semibold shadow-sm">
                  All routes ({totalTrips}) ▾
                </span>
              </div>

              <div className="mt-8 flex items-baseline gap-4">
                <span className="font-display text-5xl font-light tracking-tight sm:text-6xl">
                  {totalKg}
                  <span className="text-2xl"> kg</span>
                </span>
                <span className="text-lg text-muted-foreground">
                  of spare space available now
                </span>
              </div>

              {/* route bars */}
              <div className="mt-10 space-y-5">
                {[
                  { label: "Yangon → Bangkok", v: toBkk, tint: "bg-sky" },
                  { label: "Bangkok → Yangon", v: toYgn, tint: "bg-peach" },
                ].map((r) => (
                  <div key={r.label}>
                    <div className="mb-1.5 flex justify-between text-sm">
                      <span className="font-medium">{r.label}</span>
                      <span className="text-muted-foreground">{r.v} trips</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn("h-full rounded-full", r.tint)}
                        style={{ width: `${Math.max(8, (r.v / maxDir) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Channel strip */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-muted-foreground">Reach carriers on</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-5">
          {CHANNELS.map((c) => (
            <span
              key={c.label}
              className="flex items-center gap-2 text-foreground/40 transition hover:text-foreground"
            >
              <c.icon className="size-5" />
              <span className="text-lg font-semibold">{c.label}</span>
            </span>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-olive">Benefits</p>
        <h2 className="mt-5 max-w-2xl font-display text-4xl font-light tracking-tight sm:text-5xl">
          We&apos;ve cracked cross-border cargo.
        </h2>
        <p className="mt-4 max-w-lg text-muted-foreground">
          The cheapest, fastest way to move a parcel between Myanmar and Thailand —
          powered by people already making the trip.
        </p>

        <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((b) => (
            <div key={b.title} className="border-t border-foreground/15 pt-5">
              <b.icon className="size-5" />
              <h3 className="mt-4 font-display text-xl">{b.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {b.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Scenic CTA panel */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-sky via-[oklch(0.82_0.06_200)] to-olive px-8 py-20 text-center sm:py-28">
          <h2 className="mx-auto max-w-3xl font-display text-4xl font-light leading-tight tracking-tight text-white sm:text-6xl">
            Two cities, one carry-on away.
          </h2>
          <Link
            href="/browse"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-semibold text-foreground shadow-lg transition hover:opacity-90"
          >
            Browse every trip <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* Latest trips */}
      {trips.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-4xl font-light tracking-tight sm:text-5xl">
              Latest trips
            </h2>
            <Link
              href="/browse"
              className="inline-flex items-center gap-1 font-semibold hover:underline"
            >
              Browse all <ArrowUpRight className="size-4" />
            </Link>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {trips.map((t) => (
              <TripCard key={t.id} trip={t} />
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="font-display text-4xl font-light tracking-tight sm:text-5xl">
          Questions, answered.
        </h2>
        <div className="mt-8 divide-y divide-border">
          {FAQS.map((f, i) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center gap-4">
                <span className="font-mono text-sm text-olive">0{i + 1}</span>
                <span className="flex-1 font-display text-lg">{f.q}</span>
                <Plus className="size-5 shrink-0 text-muted-foreground transition group-open:rotate-45" />
              </summary>
              <p className="mt-3 pl-9 text-sm leading-relaxed text-muted-foreground">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA band */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-8 rounded-[2rem] bg-olive px-8 py-12 text-olive-foreground sm:px-12">
          <div className="max-w-xl">
            <h2 className="font-display text-3xl font-light tracking-tight sm:text-4xl">
              Flying YGN ⇄ BKK? Turn spare kilos into cash.
            </h2>
            <p className="mt-3 text-olive-foreground/75">
              Post your trip in under a minute. Keep 100% of what you charge.
            </p>
          </div>
          <Link
            href="/post"
            className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-semibold text-foreground shadow-sm transition hover:opacity-90"
          >
            Post a trip <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-t pt-8 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} KiloCarrier · Travel light. Send smart.</p>
          <nav className="flex gap-5">
            <Link href="/browse" className="hover:text-foreground">Browse</Link>
            <Link href="/post" className="hover:text-foreground">Post a trip</Link>
            <Link href="/login" className="hover:text-foreground">Log in</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
