"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DIRECTIONS } from "@/lib/trips";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const fieldClass =
  "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function BrowseFilters() {
  const router = useRouter();
  const params = useSearchParams();

  const update = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      if (value) next.set(key, value);
      else next.delete(key);
      router.push(`/?${next.toString()}`, { scroll: false });
    },
    [params, router],
  );

  const get = (k: string) => params.get(k) ?? "";

  return (
    <aside className="space-y-6 rounded-xl border bg-card p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Filter</h2>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs text-primary"
          onClick={() => router.push("/", { scroll: false })}
        >
          Clear all
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="f-direction">Direction</Label>
        <select
          id="f-direction"
          className={fieldClass}
          value={get("direction")}
          onChange={(e) => update("direction", e.target.value)}
        >
          <option value="">Any direction</option>
          {DIRECTIONS.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="f-date">Departing on/after</Label>
        <Input
          id="f-date"
          type="date"
          value={get("date")}
          onChange={(e) => update("date", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="f-minKg">Minimum kg</Label>
        <Input
          id="f-minKg"
          type="number"
          min={1}
          max={50}
          placeholder="e.g. 5"
          value={get("minKg")}
          onChange={(e) => update("minKg", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="f-maxPrice">Max price / kg</Label>
        <Input
          id="f-maxPrice"
          type="number"
          min={0}
          placeholder="any"
          value={get("maxPrice")}
          onChange={(e) => update("maxPrice", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="f-sort">Sort by</Label>
        <select
          id="f-sort"
          className={fieldClass}
          value={get("sort")}
          onChange={(e) => update("sort", e.target.value)}
        >
          <option value="newest">Newest</option>
          <option value="soonest">Soonest departure</option>
          <option value="cheapest">Cheapest</option>
        </select>
      </div>
    </aside>
  );
}
