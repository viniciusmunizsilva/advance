-- Advance — Fase 1: extensões, enums e funções auxiliares.

-- Busca textual (usada na busca global de fases posteriores).
create extension if not exists pg_trgm with schema extensions;
create extension if not exists unaccent with schema extensions;

-- ---------- Enums (valores em inglês; rótulos PT-BR ficam na UI) ----------
create type public.quote_status as enum (
  'draft', 'sent', 'approved', 'rejected', 'expired', 'cancelled'
);

create type public.service_type as enum (
  'construction', 'maintenance', 'alteration', 'machining', 'other'
);

create type public.service_status as enum (
  'waiting', 'analysis', 'in_progress', 'waiting_client',
  'completed', 'delivered', 'cancelled'
);

create type public.finance_status as enum (
  'open', 'paid', 'overdue', 'cancelled'
);

create type public.mold_type as enum (
  'single_cavity', 'multi_cavity'
);

create type public.user_role as enum (
  'admin', 'member'
);

-- ---------- updated_at automático ----------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

comment on function public.set_updated_at() is
  'Trigger BEFORE UPDATE: mantém updated_at sincronizado.';
