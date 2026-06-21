"use server";

import { redirect } from "next/navigation";
import { revalidatePath, revalidateTag } from "next/cache";
import type { TripStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { tripSchema } from "@/lib/trip-schema";
import { expiryFromTravelDate } from "@/lib/trips";
import { TRIPS_TAG } from "@/lib/queries";

export type PostState = { error?: string };

async function requireUserId(): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/post");
  return user.id;
}

function parseForm(formData: FormData) {
  // Empty strings -> undefined so optional fields validate cleanly.
  const raw = Object.fromEntries(
    Array.from(formData.entries()).map(([k, v]) => [
      k,
      typeof v === "string" && v.trim() === "" ? undefined : v,
    ]),
  );
  return tripSchema.safeParse(raw);
}

const MAX_ACTIVE_TRIPS = 10;

export async function createTrip(
  _prev: PostState,
  formData: FormData,
): Promise<PostState> {
  const userId = await requireUserId();

  // Anti-spam: cap how many live trips one account can hold.
  const activeCount = await prisma.trip.count({
    where: { userId, status: "ACTIVE", expiresAt: { gt: new Date() } },
  });
  if (activeCount >= MAX_ACTIVE_TRIPS) {
    return {
      error: `You already have ${MAX_ACTIVE_TRIPS} active trips. Mark some as full or completed before posting more.`,
    };
  }

  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid form data" };
  }
  const d = parsed.data;
  const travelDate = new Date(d.travelDate);

  const trip = await prisma.trip.create({
    data: {
      userId,
      carrierName: d.carrierName,
      direction: d.direction,
      travelDate,
      availableKg: d.availableKg,
      pricePerKg: d.pricePerKg,
      itemRestrictions: d.itemRestrictions,
      telegram: d.telegram,
      facebook: d.facebook,
      viber: d.viber,
      whatsapp: d.whatsapp,
      notes: d.notes,
      expiresAt: expiryFromTravelDate(travelDate),
    },
  });

  revalidateTag(TRIPS_TAG, "max");
  revalidatePath("/browse");
  redirect(`/trips/${trip.id}`);
}

export async function updateTrip(
  id: string,
  _prev: PostState,
  formData: FormData,
): Promise<PostState> {
  const userId = await requireUserId();

  const existing = await prisma.trip.findUnique({ where: { id } });
  if (!existing || existing.userId !== userId) {
    return { error: "You can only edit your own trips." };
  }

  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid form data" };
  }
  const d = parsed.data;
  const travelDate = new Date(d.travelDate);

  await prisma.trip.update({
    where: { id },
    data: {
      carrierName: d.carrierName,
      direction: d.direction,
      travelDate,
      availableKg: d.availableKg,
      pricePerKg: d.pricePerKg ?? null,
      itemRestrictions: d.itemRestrictions ?? null,
      telegram: d.telegram,
      facebook: d.facebook ?? null,
      viber: d.viber ?? null,
      whatsapp: d.whatsapp ?? null,
      notes: d.notes ?? null,
      expiresAt: expiryFromTravelDate(travelDate),
    },
  });

  revalidateTag(TRIPS_TAG, "max");
  revalidatePath("/browse");
  revalidatePath(`/trips/${id}`);
  redirect(`/trips/${id}`);
}

export async function deleteTrip(id: string) {
  const userId = await requireUserId();

  const existing = await prisma.trip.findUnique({ where: { id } });
  if (!existing || existing.userId !== userId) {
    redirect(`/trips/${id}`);
  }

  await prisma.trip.delete({ where: { id } });
  revalidateTag(TRIPS_TAG, "max");
  revalidatePath("/browse");
  redirect("/my-trips");
}

export async function setTripStatus(id: string, status: TripStatus) {
  const userId = await requireUserId();

  const existing = await prisma.trip.findUnique({ where: { id } });
  if (!existing || existing.userId !== userId) {
    redirect(`/trips/${id}`);
  }

  await prisma.trip.update({ where: { id }, data: { status } });
  revalidateTag(TRIPS_TAG, "max");
  revalidatePath("/browse");
  revalidatePath("/my-trips");
  revalidatePath(`/trips/${id}`);
}
