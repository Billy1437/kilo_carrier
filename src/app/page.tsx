import Link from "next/link";
import { Prisma, type Direction } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { BrowseFilters } from "@/components/browse-filters";
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

  const rows = await prisma.trip.findMany({
    where,
    orderBy: buildOrderBy(sp.sort),
    take: 60,
  });

  const trips: TripCardData[] = rows.map((t) => ({
    id: t.id,
    direction: t.direction,
    travelDate: t.travelDate,
    availableKg: t.availableKg.toString(),
    pricePerKg: t.pricePerKg ? t.pricePerKg.toString() : null,
    carrierName: t.carrierName,
    telegram: t.telegram,
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 rounded-2xl bg-gradient-to-br from-primary to-indigo-700 p-8 text-primary-foreground">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Travel light. Send smart.
        </h1>
        <p className="mt-2 max-w-xl text-primary-foreground/90">
          Find a traveller carrying cargo between Yangon and Bangkok — or post
          your own spare luggage space.
        </p>
        <Link
          href="/post"
          className={cn(
            buttonVariants({ variant: "secondary" }),
            "mt-5 bg-white text-primary hover:bg-white/90",
          )}
        >
          Post a trip
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-[260px_1fr]">
        <BrowseFilters />

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {trips.length} {trips.length === 1 ? "trip" : "trips"} available
          </p>

          {trips.length === 0 ? (
            <div className="rounded-xl border border-dashed bg-card p-12 text-center">
              <p className="font-medium">No trips match your filters yet.</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try clearing filters, or be the first to{" "}
                <Link
                  href="/post"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  post a trip
                </Link>
                .
              </p>
            </div>
          ) : (
            trips.map((trip) => <TripCard key={trip.id} trip={trip} />)
          )}
        </div>
      </div>
    </div>
  );
}
