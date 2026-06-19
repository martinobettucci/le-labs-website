#!/usr/bin/env sh
# Apply migrations (always) + example seed (dev only) to the sovereign Postgres.
set -eu

export PGPASSWORD="$POSTGRES_PASSWORD"
PSQL="psql -v ON_ERROR_STOP=1 -h $POSTGRES_HOST -p $POSTGRES_PORT -U postgres -d $POSTGRES_DB"

echo "[bootstrap] waiting for database to accept connections..."
until $PSQL -c 'select 1' >/dev/null 2>&1; do sleep 2; done

echo "[bootstrap] waiting for the storage schema (storage-api migrations)..."
until [ "$($PSQL -tAc "select to_regclass('storage.objects') is not null")" = "t" ]; do sleep 2; done

echo "[bootstrap] applying migrations..."
for f in $(ls /migrations/*.sql 2>/dev/null | sort); do
  echo "  -> $f"
  $PSQL -f "$f"
done

if [ "${SEED_EXAMPLES:-false}" = "true" ]; then
  echo "[bootstrap] seeding example data (dev)..."
  for f in $(ls /seed/*.sql 2>/dev/null | sort); do
    echo "  -> $f"
    $PSQL -f "$f"
  done
else
  echo "[bootstrap] SEED_EXAMPLES != true -> skipping example seed."
fi

echo "[bootstrap] done."
