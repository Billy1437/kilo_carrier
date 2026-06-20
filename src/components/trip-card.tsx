import Link from "next/link";
import { Plane, ArrowUpRight } from "lucide-react";
import type { Direction } from "@prisma/client";
import { directionLabel, formatDate } from "@/lib/trips";
import { cn } from "@/lib/utils";

export type TripCardData = {
  id: string;
  direction: Direction;
  travelDate: Date;
  availableKg: string;
  pricePerKg: string | null;
  carrierName: string;
  telegram: string;
};

const ACCENT: Record<Direction, { chip: string; rotate: string }> = {
  YGN_TO_BKK: { chip: "bg-sky text-sky-foreground", rotate: "rotate-45" },
  BKK_TO_YGN: { chip: "bg-peach text-peach-foreground", rotate: "-rotate-[135deg]" },
};

function daysUntil(date: Date): number {
  const ms = new Date(date).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0);
  return Math.round(ms / 86_400_000);
}

export function TripCard({ trip }: { trip: TripCardData }) {
  const accent = ACCENT[trip.direction];
  const days = daysUntil(trip.travelDate);
  const soon = days >= 0 && days <= 3;
  const badge =
    days === 0 ? "Today" : days === 1 ? "Tomorrow" : soon ? `In ${days}d` : null;
  const kg = Number(trip.availableKg);
  const pct = Math.min(100, Math.max(6, (kg / 50) * 100));

  return (
    <Link
      href={`/trips/${trip.id}`}
      className="group flex flex-col gap-4 rounded-3xl bg-card p-5 shadow-[0_4px_20px_rgba(40,50,80,0.06)] transition hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(40,50,80,0.12)]"
    >
      <div className="flex items-start justify-between">
        <span
          className={cn(
            "grid size-12 place-items-center rounded-2xl",
            accent.chip,
          )}
        >
          <Plane className={cn("size-5", accent.rotate)} />
        </span>
        {badge ? (
          <span className="rounded-full bg-lime px-2.5 py-1 text-xs font-bold text-lime-foreground">
            {badge}
          </span>
        ) : (
          <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
            In {days}d
          </span>
        )}
      </div>

      <div>
        <h3 className="text-lg font-bold tracking-tight">
          {directionLabel(trip.direction)}
        </h3>
        <p className="text-sm text-muted-foreground">{formatDate(trip.travelDate)}</p>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Available space</span>
          <span className="font-semibold">{trip.availableKg} / 50 kg</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-lime"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="mt-1 flex items-end justify-between border-t pt-4">
        <div>
          <p className="text-xs text-muted-foreground">Price</p>
          {trip.pricePerKg ? (
            <p className="text-xl font-bold tracking-tight">
              ฿{trip.pricePerKg}
              <span className="text-sm font-medium text-muted-foreground">
                {" "}
                / kg
              </span>
            </p>
          ) : (
            <p className="text-base font-bold">On contact</p>
          )}
        </div>
        <span className="grid size-11 place-items-center rounded-full bg-primary text-primary-foreground transition group-hover:scale-105">
          <ArrowUpRight className="size-5" />
        </span>
      </div>

      <div className="flex items-center gap-2.5">
        <span className="grid size-7 place-items-center rounded-full bg-accent text-[11px] font-bold text-accent-foreground">
          {trip.carrierName[0]?.toUpperCase()}
        </span>
        <span className="text-sm font-medium">{trip.carrierName}</span>
        <span className="text-xs text-muted-foreground">
          @{trip.telegram.replace(/^@/, "")}
        </span>
      </div>
    </Link>
  );
}
