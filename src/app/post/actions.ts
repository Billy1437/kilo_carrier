"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { tripSchema } from "@/lib/trip-schema";
import { expiryFromTravelDate } from "@/lib/trips";

export type PostState = { error?: string };

export async function createTrip(
  _prev: PostState,
  formData: FormData,
): Promise<PostState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/post");

  // Empty strings -> undefined so optional fields validate cleanly.
  const raw = Object.fromEntries(
    Array.from(formData.entries()).map(([k, v]) => [
      k,
      typeof v === "string" && v.trim() === "" ? undefined : v,
    ]),
  );

  const parsed = tripSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid form data" };
  }
  const d = parsed.data;
  const travelDate = new Date(d.travelDate);

  const trip = await prisma.trip.create({
    data: {
      userId: user.id,
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

  revalidatePath("/");
  redirect(`/trips/${trip.id}`);
}
