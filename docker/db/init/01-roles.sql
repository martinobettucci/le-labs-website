-- Set passwords for whichever Supabase service roles exist in this image, so
-- Auth / REST / Storage can authenticate. Using a filtered \gexec keeps this
-- robust across image variants (e.g. supabase_functions_admin may be absent).
\set pgpass `echo "$POSTGRES_PASSWORD"`

SELECT format('ALTER ROLE %I WITH PASSWORD %L', rolname, :'pgpass')
FROM pg_roles
WHERE rolname IN (
  'authenticator',
  'pgbouncer',
  'supabase_auth_admin',
  'supabase_storage_admin',
  'supabase_functions_admin',
  'supabase_admin'
)
\gexec
