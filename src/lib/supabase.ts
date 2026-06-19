import { createClient } from '@supabase/supabase-js';

// Well-known Supabase self-hosted DEMO anon key (public, dev only). Used as a
// fallback so the sovereign local stack works out of the box.
const DEMO_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE';

// URL resolution:
//  - if VITE_SUPABASE_URL is set (e.g. a managed Supabase), use it as-is;
//  - otherwise default to the same origin. The app (Vite in dev, nginx in prod)
//    reverse-proxies /auth/v1, /rest/v1 and /storage/v1 to the sovereign API
//    gateway, so supabase-js (which builds those paths off the origin) works
//    same-origin with no CORS.
const supabaseUrl =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) || window.location.origin;

const supabaseAnonKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) || DEMO_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
