import Link from "next/link";
import { redirect } from "next/navigation";
import { Pencil, Trash2, Plane } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { deleteTrip } from "@/app/post/actions";
import { directionLabel, formatDate } from "@/lib/trips";
import { StatusBadge, StatusControls } from "@/components/trip-status";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "My trips — KiloCarrier" };

export default async function MyTripsPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId) redirect("/login?next=/my-trips");

  const trips = await prisma.trip.findMany({
    where: { userId },
    orderBy: { travelDate: "asc" },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            My trips
          </h1>
          <p className="mt-1.5 text-muted-foreground">
            Manage the listings you&apos;ve posted.
          </p>
        </div>
        <Link
          href="/post"
          className={cn(buttonVariants(), "rounded-full px-6 shadow-sm")}
        >
          Post a trip
        </Link>
      </div>

      <div className="mt-8 space-y-4">
        {trips.length === 0 ? (
          <div className="rounded-3xl bg-card p-12 text-center shadow-sm">
            <p className="font-semibold">You haven&apos;t posted any trips yet.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Got spare luggage space?{" "}
              <Link href="/post" className="font-medium text-foreground underline">
                Post a trip
              </Link>
              .
            </p>
          </div>
        ) : (
          trips.map((t) => {
            const expired = t.expiresAt.getTime() < Date.now();
            return (
              <div
                key={t.id}
                className="flex flex-wrap items-center gap-4 rounded-3xl bg-card p-5 shadow-sm"
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-sky text-sky-foreground">
                  <Plane className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold tracking-tight">
                      {directionLabel(t.direction)}
                    </h3>
                    <StatusBadge status={t.status} />
                    {expired && (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                        Expired
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(t.travelDate)} · {t.availableKg.toString()} kg
                    {t.pricePerKg ? ` · ฿${t.pricePerKg.toString()}/kg` : ""}
                  </p>
                  <div className="mt-3">
                    <StatusControls id={t.id} status={t.status} />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/trips/${t.id}/edit`}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "rounded-full",
                    )}
                  >
                    <Pencil className="size-4" /> Edit
                  </Link>
                  <form action={deleteTrip.bind(null, t.id)}>
                    <Button
                      type="submit"
                      variant="destructive"
                      size="sm"
                      className="rounded-full"
                    >
                      <Trash2 className="size-4" /> Delete
                    </Button>
                  </form>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
