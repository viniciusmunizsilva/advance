-- Advance — Fase 1: Row Level Security (single-tenant, uso interno da Advance).

-- Habilita RLS em todas as tabelas do schema public.
alter table public.profiles            enable row level security;
alter table public.clients             enable row level security;
alter table public.molds               enable row level security;
alter table public.suppliers           enable row level security;
alter table public.company_settings    enable row level security;
alter table public.quotes              enable row level security;
alter table public.quote_items         enable row level security;
alter table public.services            enable row level security;
alter table public.accounts_receivable enable row level security;
alter table public.accounts_payable    enable row level security;
alter table public.activity_logs       enable row level security;

-- ---------- tabelas de negócio: usuário autenticado tem acesso total ----------
create policy "auth_all" on public.clients
  for all to authenticated using (true) with check (true);
create policy "auth_all" on public.molds
  for all to authenticated using (true) with check (true);
create policy "auth_all" on public.suppliers
  for all to authenticated using (true) with check (true);
create policy "auth_all" on public.quotes
  for all to authenticated using (true) with check (true);
create policy "auth_all" on public.quote_items
  for all to authenticated using (true) with check (true);
create policy "auth_all" on public.services
  for all to authenticated using (true) with check (true);
create policy "auth_all" on public.accounts_receivable
  for all to authenticated using (true) with check (true);
create policy "auth_all" on public.accounts_payable
  for all to authenticated using (true) with check (true);

-- ---------- profiles: leitura por todos autenticados; edição do próprio ----------
create policy "profiles_select" on public.profiles
  for select to authenticated using (true);
create policy "profiles_update_own" on public.profiles
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

-- ---------- company_settings: leitura e edição por autenticados ----------
create policy "company_select" on public.company_settings
  for select to authenticated using (true);
create policy "company_update" on public.company_settings
  for update to authenticated using (true) with check (true);

-- ---------- activity_logs: histórico imutável (insert + select apenas) ----------
create policy "activity_select" on public.activity_logs
  for select to authenticated using (true);
create policy "activity_insert" on public.activity_logs
  for insert to authenticated with check (true);

-- ---------- views respeitam a RLS das tabelas de origem ----------
alter view public.v_accounts_receivable set (security_invoker = on);
alter view public.v_accounts_payable    set (security_invoker = on);
