"use client";

import { useSession } from "@clerk/nextjs";
import { createClient } from "@supabase/supabase-js";
import { useMemo } from "react";

/**
 * A Supabase client hooked up to the current Clerk user.
 * Every request it makes automatically carries the player's login token,
 * so Supabase knows WHO is asking — and can enforce the security rules
 * we set on the players table.
 */
export function useSupabase() {
  const { session } = useSession();

  return useMemo(
    () =>
      createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        {
          async accessToken() {
            // Use the "supabase" JWT template we created in Clerk
            return (await session?.getToken({ template: "supabase" })) ?? null;
          },
        }
      ),
    [session]
  );
}