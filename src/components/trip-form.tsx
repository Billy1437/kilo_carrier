"use client";

import { useActionState, useState } from "react";
import { Plane, Send, MessageCircle, Phone, Link2 } from "lucide-react";
import type { Direction } from "@prisma/client";
import { createTrip, updateTrip, type PostState } from "@/app/post/actions";
import { DIRECTIONS } from "@/lib/trips";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const initial: PostState = {};

export type TripFormValues = {
  carrierName: string;
  direction: Direction;
  travelDate: string;
  availableKg: string;
  pricePerKg: string;
  itemRestrictions: string;
  telegram: string;
  facebook: string;
  viber: string;
  whatsapp: string;
  notes: string;
};

const inputClass = "h-11 rounded-xl";

export function TripForm({
  mode,
  tripId,
  defaultName,
  values,
}: {
  mode: "create" | "edit";
  tripId?: string;
  defaultName: string;
  values?: TripFormValues;
}) {
  const action =
    mode === "edit" && tripId ? updateTrip.bind(null, tripId) : createTrip;
  const [state, formAction, pending] = useActionState(action, initial);
  const [direction, setDirection] = useState<Direction>(
    values?.direction ?? "YGN_TO_BKK",
  );
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="direction" value={direction} />

      <section className="space-y-5 rounded-3xl bg-card p-6 shadow-sm">
        <h2 className="text-lg font-bold tracking-tight">Trip details</h2>

        <div className="space-y-2">
          <Label>Direction</Label>
          <div className="grid grid-cols-2 gap-3">
            {DIRECTIONS.map((d) => {
              const active = direction === d.value;
              return (
                <button
                  type="button"
                  key={d.value}
                  onClick={() => setDirection(d.value)}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition",
                    active
                      ? "border-transparent bg-sky text-sky-foreground"
                      : "border-border bg-background hover:border-foreground/20",
                  )}
                >
                  <Plane
                    className={cn(
                      "size-5 shrink-0",
                      d.value === "YGN_TO_BKK" ? "rotate-45" : "-rotate-[135deg]",
                    )}
                  />
                  <span className="text-sm font-semibold">{d.short}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="carrierName">Your name</Label>
          <Input
            id="carrierName"
            name="carrierName"
            defaultValue={values?.carrierName ?? defaultName}
            className={inputClass}
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="travelDate">Travel date</Label>
            <Input
              id="travelDate"
              name="travelDate"
              type="date"
              min={today}
              defaultValue={values?.travelDate}
              className={inputClass}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="availableKg">Available kg</Label>
            <Input
              id="availableKg"
              name="availableKg"
              type="number"
              min={1}
              max={50}
              step="0.5"
              defaultValue={values?.availableKg}
              className={inputClass}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pricePerKg">Price / kg (Baht)</Label>
            <Input
              id="pricePerKg"
              name="pricePerKg"
              type="number"
              min={0}
              step="any"
              placeholder="optional, ฿"
              defaultValue={values?.pricePerKg}
              className={inputClass}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="itemRestrictions">Item restrictions</Label>
          <Input
            id="itemRestrictions"
            name="itemRestrictions"
            placeholder="No liquids, documents only…"
            defaultValue={values?.itemRestrictions}
            className={inputClass}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            placeholder="Anything senders should know…"
            defaultValue={values?.notes}
            className="w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </section>

      <section className="space-y-5 rounded-3xl bg-card p-6 shadow-sm">
        <div>
          <h2 className="text-lg font-bold tracking-tight">
            How senders reach you
          </h2>
          <p className="text-sm text-muted-foreground">
            Telegram is required. Add others if you like.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <ContactField
            id="telegram"
            label="Telegram"
            icon={Send}
            placeholder="@username"
            defaultValue={values?.telegram}
            required
          />
          <ContactField
            id="whatsapp"
            label="WhatsApp"
            icon={MessageCircle}
            placeholder="+66…"
            defaultValue={values?.whatsapp}
          />
          <ContactField
            id="viber"
            label="Viber"
            icon={Phone}
            placeholder="+95…"
            defaultValue={values?.viber}
          />
          <ContactField
            id="facebook"
            label="Facebook"
            icon={Link2}
            placeholder="facebook.com/you"
            defaultValue={values?.facebook}
          />
        </div>
      </section>

      {state.error && (
        <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
          {state.error}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={pending}
        className="w-full rounded-full"
      >
        {pending
          ? "Saving…"
          : mode === "edit"
            ? "Save changes"
            : "Post trip"}
      </Button>
    </form>
  );
}

function ContactField({
  id,
  label,
  icon: Icon,
  placeholder,
  defaultValue,
  required,
}: {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="flex items-center gap-1.5">
        <Icon className="size-3.5 text-muted-foreground" />
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>
      <Input
        id={id}
        name={id}
        placeholder={placeholder}
        defaultValue={defaultValue}
        required={required}
        className="h-11 rounded-xl"
      />
    </div>
  );
}
