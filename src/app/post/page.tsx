import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PostTripForm } from "@/components/post-trip-form";

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
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight">Post a trip</h1>
      <p className="mt-1 text-muted-foreground">
        List your spare luggage space. Senders will contact you directly.
      </p>
      <div className="mt-8">
        <PostTripForm defaultName={defaultName} />
      </div>
    </div>
  );
}
