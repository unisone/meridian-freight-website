-- Fix: on_conflict=idempotency_key cannot infer a PARTIAL unique index, so
-- PostgREST upserts failed with 42P10 ("no unique or exclusion constraint
-- matching the ON CONFLICT specification") and NO paid-search lead persisted.
-- A plain unique index already permits unlimited NULLs (NULLs are distinct),
-- so the partial predicate was both unnecessary and the cause of the failure.
drop index if exists public.leads_idempotency_key_uidx;
create unique index if not exists leads_idempotency_key_uidx
  on public.leads (idempotency_key);
