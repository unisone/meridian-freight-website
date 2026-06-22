-- LATAM paid-search lead attribution (Gate B). Additive + idempotent.
-- Spec: docs/superpowers/specs/2026-06-22-latam-paid-search-destinations-design.md §6.6
-- All `add column if not exists` so it is forward/backward compatible; the
-- action tolerates a partially-applied migration via a pre-insert dedupe check.

alter table public.leads add column if not exists lead_id text;
alter table public.leads add column if not exists idempotency_key text;
alter table public.leads add column if not exists attribution_id text;
alter table public.leads add column if not exists whatsapp_ref text;

alter table public.leads add column if not exists gclid text;
alter table public.leads add column if not exists gbraid text;
alter table public.leads add column if not exists wbraid text;
alter table public.leads add column if not exists fbclid text;
alter table public.leads add column if not exists msclkid text;
alter table public.leads add column if not exists utm_matchtype text;
alter table public.leads add column if not exists utm_network text;
alter table public.leads add column if not exists utm_device text;

alter table public.leads add column if not exists country text;
alter table public.leads add column if not exists segment text;
alter table public.leads add column if not exists cargo_class text;
alter table public.leads add column if not exists landing_route text;
alter table public.leads add column if not exists request_type text;
alter table public.leads add column if not exists router_tag text;

alter table public.leads add column if not exists source_platform text;
alter table public.leads add column if not exists source_account_id text;
alter table public.leads add column if not exists google_ads_tag text;

alter table public.leads add column if not exists first_touch jsonb;
alter table public.leads add column if not exists latest_touch jsonb;
alter table public.leads add column if not exists schema_version text;
alter table public.leads add column if not exists consent_version text;
alter table public.leads add column if not exists paid_search_metadata jsonb default '{}'::jsonb;

-- Dedupe: idempotency_key === lead_id. Partial unique so existing null rows are unaffected.
create unique index if not exists leads_idempotency_key_uidx
  on public.leads (idempotency_key)
  where idempotency_key is not null;

-- Opaque whatsapp_ref correlation store (avoids a lead row per CTA click; spec §6.5).
create table if not exists public.paid_search_refs (
  whatsapp_ref text primary key,
  attribution_id text,
  route_key text not null,
  lead_id text not null,
  payload jsonb,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);

create index if not exists paid_search_refs_attr_route_idx
  on public.paid_search_refs (attribution_id, route_key);
