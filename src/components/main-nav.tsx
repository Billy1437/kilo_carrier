"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Plus, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

export function MainNav({ authed }: { authed: boolean }) {
  const pathname = usePathname();

  const links = [
    { href: "/browse", label: "Browse", icon: Compass },
    { href: "/post", label: "Post a trip", icon: Plus },
    ...(authed
      ? [{ href: "/my-trips", label: "My trips", icon: Briefcase }]
      : []),
  ];

  return (
    <nav className="hidden items-center gap-1 rounded-full bg-card/70 p-1 shadow-sm sm:flex">
      {links.map((l) => {
        const active = pathname === l.href || pathname.startsWith(l.href + "/");
        return (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition",
              active
                ? "bg-sky font-semibold text-sky-foreground"
                : "font-medium text-muted-foreground hover:text-foreground",
            )}
          >
            <l.icon className="size-4" />
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
