"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signInSchema, signUpSchema } from "@/lib/auth-schema";

export type AuthState = { error?: string; message?: string };

function safeNext(next: FormDataEntryValue | null): string {
  const v = typeof next === "string" ? next : "/";
  // only allow internal paths
  return v.startsWith("/") && !v.startsWith("//") ? v : "/";
}

// Coerce missing/file form values to "" so validation produces a friendly
// field message instead of a raw "expected string, received null" Zod error.
function str(v: FormDataEntryValue | null): string {
  return typeof v === "string" ? v : "";
}

/**
 * Single entry point for the auth form. Branches on the `mode` field so the
 * form never swaps which action `useActionState` is bound to (that desync was
 * causing signUp to run against the sign-in form and read a null
 * confirmPassword).
 */
export async function authenticate(
  prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  return formData.get("mode") === "signup"
    ? signUp(prev, formData)
    : signIn(prev, formData);
}

export async function signIn(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = signInSchema.safeParse({
    email: str(formData.get("email")),
    password: str(formData.get("password")),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid details" };
  }
  const next = safeNext(formData.get("next"));

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { error: error.message };

  redirect(next);
}

export async function signUp(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = signUpSchema.safeParse({
    email: str(formData.get("email")),
    password: str(formData.get("password")),
    confirmPassword: str(formData.get("confirmPassword")),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid details" };
  }
  const { email, password } = parsed.data;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return { error: error.message };

  // If email confirmation is on, there is no active session yet.
  if (!data.session) {
    return { message: "Check your email to confirm your account, then log in." };
  }
  redirect("/");
}
