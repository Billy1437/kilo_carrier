"use client";

import { Suspense, useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { authenticate, type AuthState } from "./actions";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const initial: AuthState = {};

type Mode = "signin" | "signup";

function LoginInner() {
  const params = useSearchParams();
  const next = params.get("next") ?? "/";
  const urlError = params.get("error");
  const [mode, setMode] = useState<Mode>("signin");

  async function handleGoogle() {
    const supabase = createClient();
    const origin =
      process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center px-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">
            {mode === "signin" ? "Log in" : "Create account"}
          </CardTitle>
          <CardDescription>
            {mode === "signin"
              ? "Welcome back to KiloCarrier."
              : "Post trips and carry cargo between Yangon & Bangkok."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogle}
          >
            <GoogleIcon />
            Continue with Google
          </Button>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            or
            <span className="h-px flex-1 bg-border" />
          </div>

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
        </CardContent>
      </Card>
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

  return (
    <>
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="next" value={next} />
        <input type="hidden" name="mode" value={mode} />
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPwd ? "text" : "password"}
              autoComplete={
                mode === "signin" ? "current-password" : "new-password"
              }
              minLength={6}
              required
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPwd((v) => !v)}
              aria-label={showPwd ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPwd ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
        </div>

        {mode === "signup" && (
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showPwd ? "text" : "password"}
                autoComplete="new-password"
                minLength={6}
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                aria-label={showPwd ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPwd ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
          </div>
        )}

        {(state.error || urlError) && (
          <p className="text-sm text-destructive">
            {state.error ?? urlError}
          </p>
        )}
        {state.message && (
          <p className="text-sm text-emerald-600">{state.message}</p>
        )}

        <Button type="submit" className="w-full" disabled={pending}>
          {pending
            ? "Please wait…"
            : mode === "signin"
              ? "Log in"
              : "Sign up"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        {mode === "signin" ? "No account?" : "Already have an account?"}{" "}
        <button
          type="button"
          className="font-medium text-primary underline-offset-4 hover:underline"
          onClick={onToggleMode}
        >
          {mode === "signin" ? "Sign up" : "Log in"}
        </button>
      </p>
    </>
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
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center px-4">
          <div className="h-[480px] w-full animate-pulse rounded-3xl bg-card shadow-sm" />
        </div>
      }
    >
      <LoginInner />
    </Suspense>
  );
}
