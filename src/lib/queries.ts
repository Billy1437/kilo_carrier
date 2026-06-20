import { unstable_cache } from "next/cache";
import { Prisma, type Direction } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const TRIPS_TAG = "trips";

export type TripDTO = {
  id: string;
  direction: Direction;
  travelDate: string; // ISO
  availableKg: string;
  pricePerKg: string | null;
  carrierName: string;
  telegram: string;
};

export type TripFilters = {
  direction?: string;
  date?: string;
  minKg?: string;
  maxPrice?: string;
  sort?: string;
};

function buildWhere(f: TripFilters): Prisma.TripWhereInput {
  const where: Prisma.TripWhereInput = { expiresAt: { gt: new Date() } };
  if (f.direction === "YGN_TO_BKK" || f.direction === "BKK_TO_YGN") {
    where.direction = f.direction as Direction;
  }
  if (f.date) where.travelDate = { gte: new Date(f.date) };
  const minKg = Number(f.minKg);
  if (f.minKg && !Number.isNaN(minKg)) where.availableKg = { gte: minKg };
  const maxPrice = Number(f.maxPrice);
  if (f.maxPrice && !Number.isNaN(maxPrice)) where.pricePerKg = { lte: maxPrice };
  return where;
}

function buildOrderBy(sort?: string): Prisma.TripOrderByWithRelationInput {
  if (sort === "soonest") return { travelDate: "asc" };
  if (sort === "cheapest") return { pricePerKg: { sort: "asc", nulls: "last" } };
  return { createdAt: "desc" };
}

function toDTO(t: {
  id: string;
  direction: Direction;
  travelDate: Date;
  availableKg: Prisma.Decimal;
  pricePerKg: Prisma.Decimal | null;
  carrierName: string;
  telegram: string;
}): TripDTO {
  return {
    id: t.id,
    direction: t.direction,
    travelDate: t.travelDate.toISOString(),
    availableKg: t.availableKg.toString(),
    pricePerKg: t.pricePerKg ? t.pricePerKg.toString() : null,
    carrierName: t.carrierName,
    telegram: t.telegram,
  };
}

/** Browse listing + stats, cached and tagged so mutations can bust it. */
export const getBrowse = unstable_cache(
  async (f: TripFilters) => {
    const activeWhere: Prisma.TripWhereInput = { expiresAt: { gt: new Date() } };
    const soonDate = new Date();
    soonDate.setDate(soonDate.getDate() + 3);

    const [rows, grouped, soon] = await Promise.all([
      prisma.trip.findMany({
        where: buildWhere(f),
        orderBy: buildOrderBy(f.sort),
        take: 60,
      }),
      prisma.trip.groupBy({
        by: ["direction"],
        where: activeWhere,
        _count: { _all: true },
      }),
      prisma.trip.count({
        where: { ...activeWhere, travelDate: { lte: soonDate } },
      }),
    ]);

    const toBkk =
      grouped.find((g) => g.direction === "YGN_TO_BKK")?._count._all ?? 0;
    const toYgn =
      grouped.find((g) => g.direction === "BKK_TO_YGN")?._count._all ?? 0;

    return {
      trips: rows.map(toDTO),
      stats: { total: toBkk + toYgn, toBkk, toYgn, soon },
    };
  },
  ["browse"],
  { tags: [TRIPS_TAG], revalidate: 60 },
);

/** Landing: recent trips + aggregate stats, cached + tagged. */
export const getLanding = unstable_cache(
  async () => {
    const activeWhere: Prisma.TripWhereInput = { expiresAt: { gt: new Date() } };
    const [recent, agg, grouped] = await Promise.all([
      prisma.trip.findMany({
        where: activeWhere,
        orderBy: { createdAt: "desc" },
        take: 3,
      }),
      prisma.trip.aggregate({
        where: activeWhere,
        _count: { _all: true },
        _sum: { availableKg: true },
      }),
      prisma.trip.groupBy({
        by: ["direction"],
        where: activeWhere,
        _count: { _all: true },
      }),
    ]);

    return {
      trips: recent.map(toDTO),
      totalTrips: agg._count._all,
      totalKg: agg._sum.availableKg ? Math.round(Number(agg._sum.availableKg)) : 0,
      toBkk: grouped.find((g) => g.direction === "YGN_TO_BKK")?._count._all ?? 0,
      toYgn: grouped.find((g) => g.direction === "BKK_TO_YGN")?._count._all ?? 0,
    };
  },
  ["landing"],
  { tags: [TRIPS_TAG], revalidate: 60 },
);
