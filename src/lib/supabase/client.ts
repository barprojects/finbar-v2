import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Singleton for client-side usage
let browserClient: ReturnType<typeof createClient> | null = null;

export const supabase = (() => {
  if (typeof window === "undefined") {
    // Server-side: create new client each time (will be replaced with server client)
    return createClient();
  }
  // Client-side: use singleton
  if (!browserClient) {
    browserClient = createClient();
  }
  return browserClient;
})();
