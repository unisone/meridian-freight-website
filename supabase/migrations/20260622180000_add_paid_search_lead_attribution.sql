-- LATAM paid-search lead attribution (Gate B). Additive + idempotent.
-- Spec: docs/superpowers/specs/2026-06-22-latam-paid-search-destinations-design.md §6.6
--
-- Scoped to the SHARED leads table (also used by mf-chatbot-ui). To avoid column
-- sprawl + duplicating the chatbot's wa_attribution/utm_clicks system, only the
-- queryable/dedupe/correlation fields are real columns; the full contract
-- (extended UTMs, route context, touches, equipment) rides in paid_search_metadata.
-- No paid_search_refs table: wa_attribution.ref_code already owns ref→attribution.

alter table public.leads add column if not exists lead_id text;
alter table public.leads add column if not exists idempotency_key text;
alter table public.leads add column if not exists source_platform text;
alter table public.leads add column if not exists country text;
alter table public.leads add column if not exists segment text;
alter table public.leads add column if not exists cargo_class text;
alter table public.leads add column if not exists gclid text;
alter table public.leads add column if not exists gbraid text;
alter table public.leads add column if not exists wbraid text;
alter table public.leads add column if not exists paid_search_metadata jsonb default '{}'::jsonb;

-- Dedupe: idempotency_key === lead_id. Partial unique leaves existing null rows untouched.
create unique index if not exists leads_idempotency_key_uidx
  on public.leads (idempotency_key)
  where idempotency_key is not null;
