import type { TripStatus } from "@prisma/client";
import { setTripStatus } from "@/app/post/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STYLES: Record<TripStatus, { label: string; cls: string }> = {
  ACTIVE: { label: "Active", cls: "bg-lime text-lime-foreground" },
  FULL: { label: "Full", cls: "bg-peach text-peach-foreground" },
  COMPLETED: { label: "Completed", cls: "bg-muted text-muted-foreground" },
};

export function StatusBadge({
  status,
  className,
}: {
  status: TripStatus;
  className?: string;
}) {
  const s = STYLES[status] ?? STYLES.ACTIVE;
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-1 text-xs font-semibold",
        s.cls,
        className,
      )}
    >
      {s.label}
    </span>
  );
}

function StatusButton({
  id,
  to,
  children,
}: {
  id: string;
  to: TripStatus;
  children: React.ReactNode;
}) {
  return (
    <form action={setTripStatus.bind(null, id, to)}>
      <Button type="submit" variant="outline" size="sm" className="rounded-full">
        {children}
      </Button>
    </form>
  );
}

/** Owner-only controls to change a trip's status. */
export function StatusControls({
  id,
  status,
}: {
  id: string;
  status: TripStatus;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {status !== "ACTIVE" && (
        <StatusButton id={id} to="ACTIVE">
          Reopen
        </StatusButton>
      )}
      {status === "ACTIVE" && (
        <StatusButton id={id} to="FULL">
          Mark full
        </StatusButton>
      )}
      {status !== "COMPLETED" && (
        <StatusButton id={id} to="COMPLETED">
          Mark completed
        </StatusButton>
      )}
    </div>
  );
}
