import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Plane,
  Calendar,
  Luggage,
  Coins,
  PackageX,
  Send,
  MessageCircle,
  Phone,
  ExternalLink,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import {
  directionLabel,
  formatDate,
  telegramLink,
  whatsappLink,
  viberLink,
  facebookLink,
} from "@/lib/trips";
import { buttonVariants } from "@/components/ui/button";
import { CopyLinkButton } from "@/components/copy-link-button";

export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const trip = await prisma.trip.findUnique({ where: { id } }).catch(() => null);
  if (!trip) notFound();

  const expired = trip.expiresAt.getTime() < Date.now();

  const contacts = [
    {
      label: "Telegram",
      href: telegramLink(trip.telegram),
      icon: Send,
      external: true,
    },
    {
      label: "WhatsApp",
      href: whatsappLink(trip.whatsapp),
      icon: MessageCircle,
      external: true,
    },
    { label: "Viber", href: viberLink(trip.viber), icon: Phone, external: true },
    {
      label: "Facebook",
      href: facebookLink(trip.facebook),
      icon: ExternalLink,
      external: true,
    },
  ].filter((c) => c.href);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link
        href="/"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Back to browse
      </Link>

      <div className="mt-4 overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="border-b bg-accent/40 p-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground shadow-sm">
            <Plane className="size-3.5 text-primary" /> Air cargo space
          </span>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
            {directionLabel(trip.direction)}
          </h1>
        </div>

        <div className="space-y-6 p-6">
          {expired && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              This trip has expired — the travel date has passed.
            </p>
          )}

          <div>
            <p className="text-sm text-muted-foreground">Carrier</p>
            <p className="text-lg font-semibold">{trip.carrierName}</p>
          </div>

          <dl className="grid gap-4 sm:grid-cols-2">
            <Detail icon={Calendar} label="Travel date">
              {formatDate(trip.travelDate)}
            </Detail>
            <Detail icon={Luggage} label="Available space">
              {trip.availableKg.toString()} kg
            </Detail>
            <Detail icon={Coins} label="Price per kg">
              {trip.pricePerKg ? trip.pricePerKg.toString() : "On contact"}
            </Detail>
            {trip.itemRestrictions && (
              <Detail icon={PackageX} label="Restrictions">
                {trip.itemRestrictions}
              </Detail>
            )}
          </dl>

          {trip.notes && (
            <div>
              <p className="text-sm text-muted-foreground">Notes</p>
              <p className="whitespace-pre-line">{trip.notes}</p>
            </div>
          )}

          <div className="border-t pt-6">
            <p className="mb-3 font-semibold">Contact the carrier</p>
            <div className="flex flex-wrap gap-3">
              {contacts.map((c) => (
                <a
                  key={c.label}
                  href={c.href!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants()}
                >
                  <c.icon className="size-4" />
                  {c.label}
                </a>
              ))}
              <CopyLinkButton path={`/trips/${trip.id}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Detail({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 size-5 text-muted-foreground" />
      <div>
        <dt className="text-sm text-muted-foreground">{label}</dt>
        <dd className="font-medium">{children}</dd>
      </div>
    </div>
  );
}
