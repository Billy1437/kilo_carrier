"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Calendar, Luggage, Coins, X } from "lucide-react";
import { DIRECTIONS } from "@/lib/trips";

const DIRECTION_TABS = [
  { value: "", label: "All trips" },
  ...DIRECTIONS.map((d) => ({ value: d.value, label: d.short })),
];

export function BrowseControls({ total }: { total: number }) {
  const router = useRouter();
  const params = useSearchParams();

  const setParam = useCallback(
    (patch: Record<string, string>) => {
      const next = new URLSearchParams(params.toString());
      for (const [k, v] of Object.entries(patch)) {
        if (v) next.set(k, v);
        else next.delete(k);
      }
      router.push(`/?${next.toString()}`, { scroll: false });
    },
    [params, router],
  );

  const get = (k: string) => params.get(k) ?? "";
  const activeDir = get("direction");
  const hasFilters = ["direction", "date", "minKg", "maxPrice"].some((k) =>
    params.get(k),
  );

  return (
    <div className="space-y-4">
      {/* Pill filter bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-3xl bg-card p-3 shadow-sm">
        <Pill icon={Calendar} label="Departing">
          <input
            type="date"
            value={get("date")}
            onChange={(e) => setParam({ date: e.target.value })}
            className="bg-transparent text-sm outline-none"
          />
        </Pill>

        <Pill icon={Luggage} label="Min kg">
          <input
            type="number"
            min={1}
            max={50}
            placeholder="any"
            value={get("minKg")}
            onChange={(e) => setParam({ minKg: e.target.value })}
            className="w-16 bg-transparent text-sm outline-none"
          />
        </Pill>

        <Pill icon={Coins} label="Max / kg">
          <input
            type="number"
            min={0}
            placeholder="any"
            value={get("maxPrice")}
            onChange={(e) => setParam({ maxPrice: e.target.value })}
            className="w-20 bg-transparent text-sm outline-none"
          />
        </Pill>

        {hasFilters && (
          <button
            onClick={() => router.push("/", { scroll: false })}
            className="ml-auto inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" /> Clear
          </button>
        )}
      </div>

      {/* Direction tabs + sort */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {DIRECTION_TABS.map((t) => {
            const active = activeDir === t.value;
            return (
              <button
                key={t.label}
                onClick={() => setParam({ direction: t.value })}
                className={
                  active
                    ? "rounded-full bg-sky px-4 py-2 text-sm font-semibold text-sky-foreground shadow-sm"
                    : "rounded-full bg-card px-4 py-2 text-sm font-medium text-muted-foreground shadow-sm transition hover:text-foreground"
                }
              >
                {t.label}
                {t.value === "" && (
                  <span className="ml-1 text-xs opacity-70">({total})</span>
                )}
              </button>
            );
          })}
        </div>

        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          Sort by
          <select
            value={get("sort")}
            onChange={(e) => setParam({ sort: e.target.value })}
            className="rounded-full border bg-card px-3 py-1.5 text-sm font-medium text-foreground outline-none"
          >
            <option value="newest">Newest</option>
            <option value="soonest">Soonest</option>
            <option value="cheapest">Cheapest</option>
          </select>
        </label>
      </div>
    </div>
  );
}

function Pill({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2">
      <Icon className="size-4 text-foreground/60" />
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}
