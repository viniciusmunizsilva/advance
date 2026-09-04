-- Advance — Fase 1: tabelas centrais.

-- ---------- profiles (espelho de auth.users) ----------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text,
  email text,
  role public.user_role not null default 'member',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.profiles is 'Perfis de usuário; 1:1 com auth.users.';

-- ---------- clients ----------
create table public.clients (
  id uuid primary key default gen_random_uuid(),
  legal_name text not null,
  trade_name text,
  document text,            -- CNPJ/CPF
  phone text,
  email text,
  address text,
  city text,
  contact_name text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.clients is 'Clientes (indústrias) atendidos pela Advance.';

-- ---------- molds ----------
create table public.molds (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete restrict,
  code text not null unique,
  name text,
  description text,
  cavities integer check (cavities is null or cavities > 0),
  type public.mold_type,
  application text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.molds is 'Moldes (ativos operacionais); pertencem a um cliente.';

-- ---------- suppliers ----------
create table public.suppliers (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  document text,
  contact_name text,
  phone text,
  email text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.suppliers is 'Fornecedores da Advance.';

-- ---------- company_settings (singleton) ----------
create table public.company_settings (
  id integer primary key default 1 check (id = 1),
  legal_name text not null,
  document text,
  address text,
  phone text,
  email text,
  website text,
  logo_url text,
  quote_default_validity_days integer not null default 15,
  quote_default_payment_terms text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.company_settings is 'Dados da Advance (linha única, id=1).';

-- ---------- updated_at triggers ----------
create trigger trg_profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger trg_clients_updated_at before update on public.clients
  for each row execute function public.set_updated_at();
create trigger trg_molds_updated_at before update on public.molds
  for each row execute function public.set_updated_at();
create trigger trg_suppliers_updated_at before update on public.suppliers
  for each row execute function public.set_updated_at();
create trigger trg_company_settings_updated_at before update on public.company_settings
  for each row execute function public.set_updated_at();
