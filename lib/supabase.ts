import { createClient } from "@supabase/supabase-js";

// Public Supabase client — safe to use in the browser.
// This uses the "publishable" key, which can only do what
// your database's security rules allow.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);