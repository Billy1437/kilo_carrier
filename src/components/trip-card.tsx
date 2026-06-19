import Link from "next/link";
import { Plane, Calendar, Luggage, Send } from "lucide-react";
import type { Direction } from "@prisma/client";
import { directionShort, formatDate } from "@/lib/trips";
import { buttonVariants } from "@/components/ui/button";

export type TripCardData = {
  id: string;
  direction: Direction;
  travelDate: Date;
  availableKg: string;
  pricePerKg: string | null;
  carrierName: string;
  telegram: string;
};

export function TripCard({ trip }: { trip: TripCardData }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition hover:shadow-md sm:flex-row">
      {/* Route banner (no vehicle photo) */}
      <div className="flex shrink-0 flex-col justify-center gap-1 bg-gradient-to-br from-primary to-indigo-700 p-5 text-primary-foreground sm:w-48">
        <Plane className="size-5 opacity-80" />
        <span className="text-lg font-bold leading-tight">
          {directionShort(trip.direction)}
        </span>
        <span className="text-xs text-primary-foreground/80">Air cargo space</span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-semibold">{trip.carrierName}</h3>
            <p className="text-sm text-muted-foreground">Carrier</p>
          </div>
          <div className="text-right">
            {trip.pricePerKg ? (
              <>
                <p className="text-xs text-muted-foreground">per kg</p>
                <p className="text-xl font-bold">{trip.pricePerKg}</p>
              </>
            ) : (
              <span className="rounded-full bg-amber px-2 py-0.5 text-xs font-medium text-amber-foreground">
                Price on contact
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="size-4" /> {formatDate(trip.travelDate)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Luggage className="size-4" /> {trip.availableKg} kg available
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Send className="size-4" /> @{trip.telegram.replace(/^@/, "")}
          </span>
        </div>

        <div className="mt-auto flex justify-end pt-2">
          <Link href={`/trips/${trip.id}`} className={buttonVariants()}>
            View &amp; contact
          </Link>
        </div>
      </div>
    </article>
  );
}
