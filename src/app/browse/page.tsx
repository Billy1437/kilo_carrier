import Link from "next/link";
import { unstable_cache } from "next/cache";
import { Prisma, type Direction } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { BrowseControls } from "@/components/browse-filters";
import { TripCard, type TripCardData } from "@/components/trip-card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

type SearchParams = {
  direction?: string;
  date?: string;
  minKg?: string;
  maxPrice?: string;
  sort?: string;
};

function buildOrderBy(sort?: string): Prisma.TripOrderByWithRelationInput {
  if (sort === "soonest") return { travelDate: "asc" };
  if (sort === "cheapest") return { pricePerKg: { sort: "asc", nulls: "last" } };
  return { createdAt: "desc" };
}

// Filter-independent header stats. Cached so changing filters does NOT re-query
// these — only the listing query runs per filter change. Refreshes every 30s.
const getBrowseStats = unstable_cache(
  async () => {
    const activeWhere: Prisma.TripWhereInput = { expiresAt: { gt: new Date() } };
    const soonDate = new Date();
    soonDate.setDate(soonDate.getDate() + 3);
    const [grouped, soon] = await Promise.all([
      prisma.trip.groupBy({
        by: ["direction"],
        where: activeWhere,
        _count: { _all: true },
      }),
      prisma.trip.count({
        where: { ...activeWhere, travelDate: { lte: soonDate } },
      }),
    ]);
    const toBkk = grouped.find((g) => g.direction === "YGN_TO_BKK")?._count._all ?? 0;
    const toYgn = grouped.find((g) => g.direction === "BKK_TO_YGN")?._count._all ?? 0;
    return { toBkk, toYgn, soon };
  },
  ["browse-stats"],
  { revalidate: 30 },
);

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;

  const where: Prisma.TripWhereInput = { expiresAt: { gt: new Date() } };
  if (sp.direction === "YGN_TO_BKK" || sp.direction === "BKK_TO_YGN") {
    where.direction = sp.direction as Direction;
  }
  if (sp.date) where.travelDate = { gte: new Date(sp.date) };
  const minKg = Number(sp.minKg);
  if (sp.minKg && !Number.isNaN(minKg)) where.availableKg = { gte: minKg };
  const maxPrice = Number(sp.maxPrice);
  if (sp.maxPrice && !Number.isNaN(maxPrice)) {
    where.pricePerKg = { lte: maxPrice };
  }

  // Per-filter change: only the listing query runs; stats come from cache.
  const [rows, { toBkk, toYgn, soon }] = await Promise.all([
    prisma.trip.findMany({
      where,
      orderBy: buildOrderBy(sp.sort),
      take: 60,
    }),
    getBrowseStats(),
  ]);

  const trips: TripCardData[] = rows.map((t) => ({
    id: t.id,
    direction: t.direction,
    travelDate: t.travelDate,
    availableKg: t.availableKg.toString(),
    pricePerKg: t.pricePerKg ? t.pricePerKg.toString() : null,
    carrierName: t.carrierName,
    telegram: t.telegram,
  }));

  const total = toBkk + toYgn;
  const stats = [
    { label: "Active trips", value: total, tint: "bg-card" },
    { label: "To Bangkok", value: toBkk, tint: "bg-sky/40" },
    { label: "To Yangon", value: toYgn, tint: "bg-peach/40" },
    { label: "Departing soon", value: soon, tint: "bg-lime/40" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Browse trips
          </h1>
          <p className="mt-1.5 text-muted-foreground">
            Cargo space between Yangon and Bangkok. Travel light, send smart.
          </p>
        </div>
        <Link
          href="/post"
          className={cn(buttonVariants({ size: "lg" }), "rounded-full px-6 shadow-sm")}
        >
          Post a trip
        </Link>
      </div>

      <div className="mb-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className={cn("rounded-3xl p-5 shadow-sm", s.tint)}
          >
            <p className="text-sm font-medium text-muted-foreground">{s.label}</p>
            <p className="mt-1 text-3xl font-bold tracking-tight">{s.value}</p>
          </div>
        ))}
      </div>

      <BrowseControls total={trips.length} />

      <div className="mt-6">
        {trips.length === 0 ? (
          <div className="rounded-2xl border border-dashed bg-card p-16 text-center">
            <p className="font-display text-lg font-semibold">
              No trips match your filters yet.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try clearing filters, or be the first to{" "}
              <Link
                href="/post"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                post a trip
              </Link>
              .
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
