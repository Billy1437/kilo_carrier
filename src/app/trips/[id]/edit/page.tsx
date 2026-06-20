import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { TripForm, type TripFormValues } from "@/components/trip-form";

export const metadata = { title: "Edit trip — KiloCarrier" };

export default async function EditTripPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId) redirect(`/login?next=/trips/${id}/edit`);

  const trip = await prisma.trip.findUnique({ where: { id } }).catch(() => null);
  if (!trip) notFound();
  if (trip.userId !== userId) redirect(`/trips/${id}`);

  const values: TripFormValues = {
    carrierName: trip.carrierName,
    direction: trip.direction,
    travelDate: trip.travelDate.toISOString().slice(0, 10),
    availableKg: trip.availableKg.toString(),
    pricePerKg: trip.pricePerKg ? trip.pricePerKg.toString() : "",
    itemRestrictions: trip.itemRestrictions ?? "",
    telegram: trip.telegram,
    facebook: trip.facebook ?? "",
    viber: trip.viber ?? "",
    whatsapp: trip.whatsapp ?? "",
    notes: trip.notes ?? "",
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <Link
        href={`/trips/${id}`}
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Back to trip
      </Link>
      <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
        Edit trip
      </h1>
      <p className="mt-1.5 text-muted-foreground">Update your listing details.</p>
      <div className="mt-8">
        <TripForm
          mode="edit"
          tripId={id}
          defaultName={trip.carrierName}
          values={values}
        />
      </div>
    </div>
  );
}
