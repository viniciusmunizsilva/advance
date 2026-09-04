-- Advance — Fase 1: serviços e financeiro.

-- ---------- services ----------
create table public.services (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete restrict,
  mold_id uuid references public.molds (id) on delete restrict,
  quote_id uuid references public.quotes (id) on delete set null,
  type public.service_type not null default 'other',
  title text not null,
  description text,
  responsible text,
  start_date date,
  expected_delivery_date date,
  status public.service_status not null default 'waiting',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.services is 'Serviços operacionais (podem originar-se de um orçamento aprovado).';

create trigger trg_services_mold_client before insert or update on public.services
  for each row execute function public.ensure_mold_matches_client();
create trigger trg_services_updated_at before update on public.services
  for each row execute function public.set_updated_at();

-- ---------- accounts_receivable ----------
create table public.accounts_receivable (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete restrict,
  quote_id uuid references public.quotes (id) on delete set null,
  description text not null,
  amount numeric(12,2) not null check (amount >= 0),
  due_date date not null,
  paid_date date,
  status public.finance_status not null default 'open',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.accounts_receivable is 'Contas a receber de clientes.';

create trigger trg_ar_updated_at before update on public.accounts_receivable
  for each row execute function public.set_updated_at();

-- ---------- accounts_payable ----------
create table public.accounts_payable (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid references public.suppliers (id) on delete restrict,
  description text not null,
  amount numeric(12,2) not null check (amount >= 0),
  due_date date not null,
  paid_date date,
  status public.finance_status not null default 'open',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.accounts_payable is 'Contas a pagar a fornecedores.';

create trigger trg_ap_updated_at before update on public.accounts_payable
  for each row execute function public.set_updated_at();

-- ---------- views com status efetivo (atraso automático) ----------
create view public.v_accounts_receivable as
  select ar.*,
    case
      when ar.status = 'open' and ar.due_date < current_date then 'overdue'::public.finance_status
      else ar.status
    end as effective_status
  from public.accounts_receivable ar;

create view public.v_accounts_payable as
  select ap.*,
    case
      when ap.status = 'open' and ap.due_date < current_date then 'overdue'::public.finance_status
      else ap.status
    end as effective_status
  from public.accounts_payable ap;
