-- Advance — Pedidos (a partir de orçamento aprovado) + arquivamento.

-- Arquivamento (não-destrutivo) em orçamentos.
alter table public.quotes add column if not exists archived boolean not null default false;
create index if not exists idx_quotes_archived on public.quotes (archived);

-- ---------- orders (pedidos) ----------
create type public.order_status as enum ('open', 'completed', 'cancelled');

create sequence public.order_number_seq as bigint start with 1 increment by 1;

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  number text not null unique,
  quote_id uuid references public.quotes (id) on delete set null,
  client_id uuid not null references public.clients (id) on delete restrict,
  mold_id uuid references public.molds (id) on delete set null,
  total numeric(12,2) not null default 0,
  status public.order_status not null default 'open',
  archived boolean not null default false,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.orders is 'Pedidos — originados de orçamentos aprovados; alimentam o financeiro.';

create or replace function public.assign_order_number()
returns trigger language plpgsql
set search_path = pg_catalog, public
as $$
begin
  if new.number is null or length(trim(new.number)) = 0 then
    new.number := lpad(nextval('public.order_number_seq')::text, 4, '0');
  end if;
  return new;
end;
$$;

create trigger trg_orders_assign_number before insert on public.orders
  for each row execute function public.assign_order_number();
create trigger trg_orders_updated_at before update on public.orders
  for each row execute function public.set_updated_at();

create index idx_orders_client_id on public.orders (client_id);
create index idx_orders_quote_id on public.orders (quote_id);
create index idx_orders_status on public.orders (status);
create index idx_orders_archived on public.orders (archived);
create index idx_orders_created_at on public.orders (created_at desc);

-- Liga contas a receber ao pedido de origem (para excluir do financeiro ao arquivar).
alter table public.accounts_receivable
  add column if not exists order_id uuid references public.orders (id) on delete set null;
create index if not exists idx_ar_order_id on public.accounts_receivable (order_id);

-- RLS
alter table public.orders enable row level security;
create policy "auth_all" on public.orders
  for all to authenticated using (true) with check (true);
