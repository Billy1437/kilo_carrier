import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TripForm } from "@/components/trip-form";

export const metadata = { title: "Post a trip — KiloCarrier" };

export default async function PostPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/post");

  const defaultName =
    (user.user_metadata?.full_name as string | undefined) ??
    user.email?.split("@")[0] ??
    "";

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Post a trip
      </h1>
      <p className="mt-1.5 text-muted-foreground">
        List your spare luggage space. Senders contact you directly.
      </p>
      <div className="mt-8">
        <TripForm mode="create" defaultName={defaultName} />
      </div>
    </div>
  );
}
