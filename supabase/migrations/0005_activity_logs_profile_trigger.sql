-- Advance — Fase 1: histórico de atividades e provisionamento de perfil.

-- ---------- activity_logs ----------
create table public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users (id) on delete set null,
  actor_name text,                 -- denormalizado p/ estabilidade de exibição
  entity_type text not null,       -- 'client','mold','quote','service','receivable','payable','supplier'
  entity_id uuid,
  action text not null,            -- 'created','updated','sent','approved','rejected','duplicated','completed','paid', …
  summary text,                    -- texto pt-BR legível ao usuário
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
comment on table public.activity_logs is 'Histórico de eventos de negócio, legível ao usuário.';

-- ---------- provisionamento de perfil ao criar usuário no Auth ----------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    new.email
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
