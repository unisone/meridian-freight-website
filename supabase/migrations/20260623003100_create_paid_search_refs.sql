-- Website-owned WhatsApp ref -> attribution mapping (Gate B, spec §6.5).
-- Persists the opaque ref + paid attribution at WhatsApp-click time so a
-- pure-WhatsApp lead (no form submit) is still reconnectable to its click IDs.
-- Deliberately NOT wa_attribution (the chatbot's table has an attached
-- conversion-upload pipeline; writing here avoids firing OCI/CAPI during the
-- $0/day Gate-B hold). Chatbot resolution of these refs is a follow-up task.
create table if not exists public.paid_search_refs (
  id uuid primary key default gen_random_uuid(),
  ref_code text not null unique,
  lead_id text,
  attribution_id text,
  route_key text not null,
  country text,
  segment text,
  cargo_class text,
  landing_route text,
  gclid text, gbraid text, wbraid text, fbclid text, msclkid text,
  utm_source text, utm_medium text, utm_campaign text, utm_term text, utm_content text,
  utm_matchtype text, utm_network text, utm_device text,
  first_touch jsonb,
  latest_touch jsonb,
  source_account_id text,
  router_tag text,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.paid_search_refs enable row level security;
-- Service-role only (no anon/public access); service role bypasses RLS, so no policy is needed.
comment on table public.paid_search_refs is 'Website-originated WhatsApp ref -> paid attribution (Gate B). Service-role writes only.';
