import Link from "next/link";
import { Boxes, Plus, Compass } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/actions";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export async function SiteHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const name = user?.email?.split("@")[0];

  return (
    <header className="sticky top-0 z-40 bg-[oklch(0.93_0.022_262)]/80 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid size-10 place-items-center rounded-2xl bg-primary text-primary-foreground">
              <Boxes className="size-5" />
            </span>
            <span className="text-lg font-bold tracking-tight">KiloCarrier</span>
          </Link>

          <nav className="hidden items-center gap-1 rounded-full bg-card/70 p-1 shadow-sm sm:flex">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-sky px-4 py-2 text-sm font-semibold text-sky-foreground"
            >
              <Compass className="size-4" /> Browse
            </Link>
            <Link
              href="/post"
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
            >
              <Plus className="size-4" /> Post a trip
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <form action={signOut} className="flex items-center gap-3">
              <span className="hidden text-sm font-semibold sm:inline">
                Hi, {name} 👋
              </span>
              <span className="grid size-10 place-items-center rounded-full bg-lime text-sm font-bold text-lime-foreground">
                {name?.[0]?.toUpperCase() ?? "U"}
              </span>
              <Button
                type="submit"
                size="sm"
                variant="outline"
                className="rounded-full border-0 bg-card shadow-sm"
              >
                Sign out
              </Button>
            </form>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden text-sm font-semibold text-muted-foreground hover:text-foreground sm:inline"
              >
                Log in
              </Link>
              <Link
                href="/post"
                className={cn(buttonVariants(), "rounded-full px-5 shadow-sm")}
              >
                Post a trip
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
