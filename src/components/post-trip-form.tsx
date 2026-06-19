"use client";

import { useActionState } from "react";
import { createTrip, type PostState } from "@/app/post/actions";
import { DIRECTIONS } from "@/lib/trips";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initial: PostState = {};

const fieldClass =
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function PostTripForm({ defaultName }: { defaultName: string }) {
  const [state, formAction, pending] = useActionState(createTrip, initial);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={formAction} className="space-y-6">
      <section className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="carrierName">Your name</Label>
            <Input
              id="carrierName"
              name="carrierName"
              defaultValue={defaultName}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="direction">Direction</Label>
            <select
              id="direction"
              name="direction"
              defaultValue="YGN_TO_BKK"
              className={fieldClass}
              required
            >
              {DIRECTIONS.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="travelDate">Travel date</Label>
            <Input
              id="travelDate"
              name="travelDate"
              type="date"
              min={today}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="availableKg">Available kg (1–50)</Label>
            <Input
              id="availableKg"
              name="availableKg"
              type="number"
              min={1}
              max={50}
              step="0.5"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pricePerKg">Price / kg (optional)</Label>
            <Input
              id="pricePerKg"
              name="pricePerKg"
              type="number"
              min={0}
              step="any"
              placeholder="e.g. 5000"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="itemRestrictions">Item restrictions (optional)</Label>
          <Input
            id="itemRestrictions"
            name="itemRestrictions"
            placeholder="No liquids, documents only…"
          />
        </div>
      </section>

      <section className="space-y-4 rounded-lg border bg-muted/30 p-4">
        <p className="text-sm font-medium">
          Contact — Telegram required, the rest optional
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="telegram">Telegram *</Label>
            <Input
              id="telegram"
              name="telegram"
              placeholder="@username"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp</Label>
            <Input id="whatsapp" name="whatsapp" placeholder="+66…" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="viber">Viber</Label>
            <Input id="viber" name="viber" placeholder="+95…" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="facebook">Facebook</Label>
            <Input
              id="facebook"
              name="facebook"
              placeholder="facebook.com/yourprofile"
            />
          </div>
        </div>
      </section>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes (optional)</Label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="Anything senders should know…"
        />
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
        {pending ? "Posting…" : "Post trip"}
      </Button>
    </form>
  );
}
