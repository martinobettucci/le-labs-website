-- The supabase/postgres image pre-creates the `auth` and `storage` schemas and
-- their objects (owned by supabase_admin). GoTrue and storage-api then connect
-- as supabase_auth_admin / supabase_storage_admin and re-run their own
-- migrations (CREATE OR REPLACE FUNCTION ..., ALTER TABLE ...), which requires
-- ownership — otherwise they fail with "must be owner of function uid".
-- Reassign each schema's objects to its service role so the services can manage
-- them. Idempotent and safe to run on a fresh database.
DO $$
DECLARE
  r record;
BEGIN
  IF EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth') THEN
    EXECUTE 'ALTER SCHEMA auth OWNER TO supabase_auth_admin';
    FOR r IN
      SELECT p.oid::regprocedure AS sig
      FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
      WHERE n.nspname = 'auth'
    LOOP
      EXECUTE format('ALTER FUNCTION %s OWNER TO supabase_auth_admin', r.sig);
    END LOOP;
    FOR r IN SELECT tablename FROM pg_tables WHERE schemaname = 'auth' LOOP
      EXECUTE format('ALTER TABLE auth.%I OWNER TO supabase_auth_admin', r.tablename);
    END LOOP;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'storage') THEN
    EXECUTE 'ALTER SCHEMA storage OWNER TO supabase_storage_admin';
    FOR r IN
      SELECT p.oid::regprocedure AS sig
      FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
      WHERE n.nspname = 'storage'
    LOOP
      EXECUTE format('ALTER FUNCTION %s OWNER TO supabase_storage_admin', r.sig);
    END LOOP;
    FOR r IN SELECT tablename FROM pg_tables WHERE schemaname = 'storage' LOOP
      EXECUTE format('ALTER TABLE storage.%I OWNER TO supabase_storage_admin', r.tablename);
    END LOOP;
  END IF;
END $$;
