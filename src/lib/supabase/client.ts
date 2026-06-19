import { createBrowserClient } from "@supabase/ssr";

/** Browser Supabase client — used for OAuth redirect and sign-out in client components. */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
