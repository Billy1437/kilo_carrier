import Link from "next/link";
import { Package } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/actions";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export async function SiteHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-40 border-b bg-primary text-primary-foreground">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
          <Package className="size-5" />
          <span className="text-lg">KiloCarrier</span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/"
            className="rounded-md px-2 py-1 text-sm font-medium hover:bg-white/10"
          >
            Browse
          </Link>
          <Link
            href="/post"
            className="rounded-md px-2 py-1 text-sm font-medium hover:bg-white/10"
          >
            Post a trip
          </Link>

          {user ? (
            <form action={signOut} className="flex items-center gap-2">
              <span className="hidden text-sm text-primary-foreground/80 sm:inline">
                {user.email}
              </span>
              <Button
                type="submit"
                size="sm"
                variant="secondary"
                className="bg-white text-primary hover:bg-white/90"
              >
                Sign out
              </Button>
            </form>
          ) : (
            <Link
              href="/login"
              className={cn(
                buttonVariants({ size: "sm", variant: "secondary" }),
                "bg-white text-primary hover:bg-white/90",
              )}
            >
              Log in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
