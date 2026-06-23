"use client";

import { Suspense, useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff, Plane, ArrowRight } from "lucide-react";
import { authenticate, type AuthState } from "./actions";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initial: AuthState = {};

type Mode = "signin" | "signup";

function LoginInner() {
  const params = useSearchParams();
  const next = params.get("next") ?? "/";
  const urlError = params.get("error");
  const [mode, setMode] = useState<Mode>("signin");

  return (
    <div className="mx-auto flex min-h-[calc(100vh-72px)] max-w-5xl items-center px-4 py-10 sm:px-6">
      <div className="grid w-full overflow-hidden rounded-[2rem] border border-foreground/10 bg-card shadow-[0_30px_80px_-40px_oklch(0.47_0.07_128/0.5)] md:grid-cols-[1.05fr_1fr]">
        <BrandPanel mode={mode} />
        <div className="flex flex-col justify-center p-7 sm:p-10">
          {/* key={mode} remounts the form on toggle, resetting useActionState
              so a stale error/fields from the other mode never carry over. */}
          <AuthForm
            key={mode}
            mode={mode}
            next={next}
            urlError={urlError}
            onToggleMode={() =>
              setMode((m) => (m === "signin" ? "signup" : "signin"))
            }
          />
        </div>
      </div>
    </div>
  );
}

/** Scenic boarding-pass panel — brand, flight route, value props. */
function BrandPanel({ mode }: { mode: Mode }) {
  return (
    <div className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-sky via-[oklch(0.8_0.06_205)] to-olive p-7 text-white sm:p-10">
      {/* atmospheric glows */}
      <div className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full bg-white/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-10 size-64 rounded-full bg-lime/30 blur-3xl" />

      <div className="relative flex items-center gap-2">
        <span className="grid size-9 place-items-center overflow-hidden rounded-xl bg-white/90 shadow-sm">
          <Image
            src="/logo_design.png"
            alt="KiloCarrier logo"
            width={36}
            height={36}
            priority
            className="size-full scale-[1.9] object-contain"
          />
        </span>
        <span className="text-base font-bold tracking-tight">KiloCarrier</span>
      </div>

      <div className="relative my-8 hidden md:block">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.25em] text-white/70">
          {mode === "signin" ? "Welcome aboard" : "Boarding now"}
        </p>
        <h1 className="mt-3 font-display text-4xl font-light leading-[1.05] tracking-tight lg:text-5xl">
          {mode === "signin" ? (
            <>
              Travel light.
              <br />
              Send smart.
            </>
          ) : (
            <>
              Turn spare
              <br />
              kilos into cash.
            </>
          )}
        </h1>

        {/* flight route motif */}
        <div className="mt-9 flex items-center gap-3">
          <RouteEndpoint code="YGN" label="Yangon" />
          <div className="relative h-px flex-1">
            <div className="h-px w-full bg-[repeating-linear-gradient(to_right,white_0_6px,transparent_6px_12px)] opacity-70" />
            <Plane className="absolute -top-2 left-1/2 size-4 -translate-x-1/2 -rotate-12 fill-white text-white" />
          </div>
          <RouteEndpoint code="BKK" label="Bangkok" align="end" />
        </div>
      </div>

      <ul className="relative hidden gap-2 text-sm text-white/85 md:grid">
        {["Zero platform fees", "Same-day delivery", "Contact carriers directly"].map(
          (item) => (
            <li key={item} className="flex items-center gap-2">
              <span className="grid size-4 place-items-center rounded-full bg-white/20">
                <ArrowRight className="size-2.5" />
              </span>
              {item}
            </li>
          ),
        )}
      </ul>

      {/* mobile-only condensed tagline */}
      <p className="relative mt-4 font-display text-xl font-light md:hidden">
        {mode === "signin" ? "Welcome back." : "Join KiloCarrier."}
      </p>
    </div>
  );
}

function RouteEndpoint({
  code,
  label,
  align = "start",
}: {
  code: string;
  label: string;
  align?: "start" | "end";
}) {
  return (
    <div className={align === "end" ? "text-right" : "text-left"}>
      <p className="font-display text-xl leading-none">{code}</p>
      <p className="mt-1 text-[0.7rem] uppercase tracking-wider text-white/70">
        {label}
      </p>
    </div>
  );
}

function AuthForm({
  mode,
  next,
  urlError,
  onToggleMode,
}: {
  mode: Mode;
  next: string;
  urlError: string | null;
  onToggleMode: () => void;
}) {
  const [showPwd, setShowPwd] = useState(false);
  const [state, formAction, pending] = useActionState(authenticate, initial);

  async function handleGoogle() {
    const supabase = createClient();
    const origin = process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
  }

  return (
    <div className="animate-in fade-in-0 slide-in-from-bottom-2 duration-500">
      <h2 className="font-display text-3xl font-light tracking-tight">
        {mode === "signin" ? "Log in" : "Create account"}
      </h2>
      <p className="mt-1.5 text-sm text-muted-foreground">
        {mode === "signin"
          ? "Welcome back to KiloCarrier."
          : "Post trips and carry cargo between Yangon & Bangkok."}
      </p>

      <Button
        type="button"
        variant="outline"
        className="mt-6 h-11 w-full rounded-full border-foreground/15 shadow-sm"
        onClick={handleGoogle}
      >
        <GoogleIcon />
        Continue with Google
      </Button>

      <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        or use email
        <span className="h-px flex-1 bg-border" />
      </div>

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="next" value={next} />
        <input type="hidden" name="mode" value={mode} />

        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
            className="h-11 rounded-xl px-3.5"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPwd ? "text" : "password"}
              autoComplete={
                mode === "signin" ? "current-password" : "new-password"
              }
              placeholder="••••••••"
              minLength={6}
              required
              className="h-11 rounded-xl px-3.5 pr-11"
            />
            <PwdToggle showPwd={showPwd} onClick={() => setShowPwd((v) => !v)} />
          </div>
        </div>

        {mode === "signup" && (
          <div className="space-y-1.5 animate-in fade-in-0 slide-in-from-top-1 duration-300">
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showPwd ? "text" : "password"}
                autoComplete="new-password"
                placeholder="••••••••"
                minLength={6}
                required
                className="h-11 rounded-xl px-3.5 pr-11"
              />
              <PwdToggle
                showPwd={showPwd}
                onClick={() => setShowPwd((v) => !v)}
              />
            </div>
          </div>
        )}

        {(state.error || urlError) && (
          <p className="rounded-xl bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive animate-in fade-in-0 zoom-in-95 duration-200">
            {state.error ?? urlError}
          </p>
        )}
        {state.message && (
          <p className="rounded-xl bg-lime/15 px-3.5 py-2.5 text-sm text-olive animate-in fade-in-0 zoom-in-95 duration-200">
            {state.message}
          </p>
        )}

        <Button
          type="submit"
          className="h-11 w-full rounded-full shadow-sm"
          disabled={pending}
        >
          {pending ? (
            "Please wait…"
          ) : (
            <>
              {mode === "signin" ? "Log in" : "Create account"}
              <ArrowRight className="transition-transform group-hover/button:translate-x-0.5" />
            </>
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {mode === "signin" ? "New to KiloCarrier?" : "Already have an account?"}{" "}
        <button
          type="button"
          className="font-semibold text-foreground underline-offset-4 hover:underline"
          onClick={onToggleMode}
        >
          {mode === "signin" ? "Create an account" : "Log in"}
        </button>
      </p>
    </div>
  );
}

function PwdToggle({
  showPwd,
  onClick,
}: {
  showPwd: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={showPwd ? "Hide password" : "Show password"}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
    >
      {showPwd ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z"
      />
    </svg>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex min-h-[calc(100vh-72px)] max-w-5xl items-center px-4 sm:px-6">
          <div className="h-[520px] w-full animate-pulse rounded-[2rem] bg-card shadow-sm" />
        </div>
      }
    >
      <LoginInner />
    </Suspense>
  );
}
