alter table public.leads
  add column if not exists calculator_v3_metadata jsonb not null default '{}'::jsonb;

comment on column public.leads.calculator_v3_metadata is
  'Structured calculator V3 quote context: route, line items, policy versions, compliance prep, import-cost metadata, and non-PII contact preference flags.';
