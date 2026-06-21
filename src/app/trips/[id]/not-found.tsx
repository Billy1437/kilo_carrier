import Link from "next/link";
import { PackageX } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function TripNotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <span className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <PackageX className="size-7" />
      </span>
      <h1 className="mt-6 font-display text-3xl font-light tracking-tight sm:text-4xl">
        This trip is no longer available
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        The carrier may have removed it or it has already departed. Browse the
        latest trips to find another carrier.
      </p>
      <Link href="/browse" className={buttonVariants({ className: "mt-8" })}>
        Browse trips
      </Link>
    </div>
  );
}
