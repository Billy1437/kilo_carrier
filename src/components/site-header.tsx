import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/actions";
import { MainNav } from "@/components/main-nav";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export async function SiteHeader() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const email = data?.claims?.email as string | undefined;
  const user = email ? { email } : null;
  const name = email?.split("@")[0];

  return (
    <header className="sticky top-0 z-40 bg-cream/80 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-2xl bg-white shadow-sm">
              <Image
                src="/logo_design.png"
                alt="KiloCarrier logo"
                width={40}
                height={40}
                priority
                className="size-full scale-[1.9] object-contain"
              />
            </span>
            <span className="text-lg font-bold tracking-tight">KiloCarrier</span>
          </Link>

          <MainNav authed={!!user} />
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
            <Link
              href="/login"
              className={cn(buttonVariants(), "rounded-full px-6 shadow-sm")}
            >
              Log in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
