-- Advance — Fase 1: orçamentos, itens, numeração e totais.

-- ---------- sequência de numeração (segura em concorrência) ----------
create sequence public.quote_number_seq as bigint start with 1 increment by 1;

create or replace function public.assign_quote_number()
returns trigger
language plpgsql
as $$
begin
  if new.number is null or length(trim(new.number)) = 0 then
    new.number := lpad(nextval('public.quote_number_seq')::text, 4, '0');
  end if;
  return new;
end;
$$;
comment on function public.assign_quote_number() is
  'Gera número sequencial zero-padded (0001, 0002, …) no INSERT.';

-- ---------- quotes ----------
create table public.quotes (
  id uuid primary key default gen_random_uuid(),
  number text not null unique,
  client_id uuid not null references public.clients (id) on delete restrict,
  mold_id uuid references public.molds (id) on delete restrict,
  service_type public.service_type,
  description text,
  subtotal numeric(12,2) not null default 0,
  discount numeric(12,2) not null default 0 check (discount >= 0),
  total numeric(12,2) not null default 0,
  deadline text,                 -- prazo (ex.: "12 dias úteis")
  validity_date date,            -- validade da proposta
  payment_terms text,
  notes text,
  status public.quote_status not null default 'draft',
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.quotes is 'Orçamentos (propostas comerciais).';

-- ---------- quote_items ----------
create table public.quote_items (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references public.quotes (id) on delete cascade,
  description text not null,
  quantity numeric(12,3) not null default 1 check (quantity > 0),
  unit_price numeric(12,2) not null default 0 check (unit_price >= 0),
  total numeric(12,2) not null default 0,
  sort_order integer not null default 0
);
comment on table public.quote_items is 'Itens de um orçamento.';

-- ---------- integridade: molde pertence ao cliente do orçamento ----------
create or replace function public.ensure_mold_matches_client()
returns trigger
language plpgsql
as $$
declare
  v_mold_client uuid;
begin
  if new.mold_id is not null then
    select client_id into v_mold_client from public.molds where id = new.mold_id;
    if v_mold_client is distinct from new.client_id then
      raise exception 'O molde selecionado não pertence ao cliente informado.'
        using errcode = 'check_violation';
    end if;
  end if;
  return new;
end;
$$;

-- ---------- total do item = quantidade × valor unitário ----------
create or replace function public.calc_quote_item_total()
returns trigger
language plpgsql
as $$
begin
  new.total := round(new.quantity * new.unit_price, 2);
  return new;
end;
$$;

-- ---------- total do orçamento = subtotal − desconto ----------
create or replace function public.calc_quote_total()
returns trigger
language plpgsql
as $$
begin
  new.total := round(new.subtotal - new.discount, 2);
  return new;
end;
$$;

-- ---------- recalcula subtotal do orçamento a partir dos itens ----------
create or replace function public.recalc_quote_totals(p_quote_id uuid)
returns void
language plpgsql
as $$
begin
  update public.quotes
     set subtotal = coalesce(
       (select sum(total) from public.quote_items where quote_id = p_quote_id), 0)
   where id = p_quote_id;   -- o trigger BEFORE UPDATE recalcula o total
end;
$$;

create or replace function public.trg_quote_items_recalc()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'DELETE' then
    perform public.recalc_quote_totals(old.quote_id);
    return old;
  end if;
  perform public.recalc_quote_totals(new.quote_id);
  if tg_op = 'UPDATE' and new.quote_id is distinct from old.quote_id then
    perform public.recalc_quote_totals(old.quote_id);
  end if;
  return new;
end;
$$;

-- ---------- triggers ----------
create trigger trg_quotes_assign_number before insert on public.quotes
  for each row execute function public.assign_quote_number();
create trigger trg_quotes_mold_client before insert or update on public.quotes
  for each row execute function public.ensure_mold_matches_client();
create trigger trg_quotes_calc_total before insert or update on public.quotes
  for each row execute function public.calc_quote_total();
create trigger trg_quotes_updated_at before update on public.quotes
  for each row execute function public.set_updated_at();

create trigger trg_quote_items_calc before insert or update on public.quote_items
  for each row execute function public.calc_quote_item_total();
create trigger trg_quote_items_recalc after insert or update or delete on public.quote_items
  for each row execute function public.trg_quote_items_recalc();
