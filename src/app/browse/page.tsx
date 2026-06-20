import Link from "next/link";
import { getBrowse } from "@/lib/queries";
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

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const { trips: dtos, stats: s } = await getBrowse(sp);

  const trips: TripCardData[] = dtos.map((t) => ({
    ...t,
    travelDate: new Date(t.travelDate),
  }));

  const stats = [
    { label: "Active trips", value: s.total, tint: "bg-card" },
    { label: "To Bangkok", value: s.toBkk, tint: "bg-sky/40" },
    { label: "To Yangon", value: s.toYgn, tint: "bg-peach/40" },
    { label: "Departing soon", value: s.soon, tint: "bg-lime/40" },
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
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={cn("rounded-3xl p-5 shadow-sm", stat.tint)}
          >
            <p className="text-sm font-medium text-muted-foreground">
              {stat.label}
            </p>
            <p className="mt-1 text-3xl font-bold tracking-tight">{stat.value}</p>
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
