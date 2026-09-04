-- Advance — página pública do orçamento (link compartilhável, sem login).

-- Token público por orçamento (não adivinhável).
alter table public.quotes
  add column if not exists share_token uuid not null default gen_random_uuid();
create unique index if not exists idx_quotes_share_token on public.quotes (share_token);

-- Retorna os dados do orçamento por token, ignorando RLS de forma controlada.
-- SECURITY DEFINER: roda como owner; só devolve o registro do token informado.
create or replace function public.get_public_quote(p_token uuid)
returns jsonb
language sql
security definer
set search_path = pg_catalog, public
as $$
  select jsonb_build_object(
    'number', q.number,
    'status', q.status,
    'created_at', q.created_at,
    'validity_date', q.validity_date,
    'responsible', q.responsible,
    'service_type', q.service_type,
    'description', q.description,
    'deadline', q.deadline,
    'payment_terms', q.payment_terms,
    'freight', q.freight,
    'notes', q.notes,
    'subtotal', q.subtotal,
    'discount', q.discount,
    'total', q.total,
    'client', case when c.id is null then null else jsonb_build_object(
      'legal_name', c.legal_name, 'trade_name', c.trade_name, 'document', c.document,
      'contact_name', c.contact_name, 'phone', c.phone, 'email', c.email, 'city', c.city
    ) end,
    'mold', case when m.id is null then null else jsonb_build_object(
      'code', m.code, 'description', m.description, 'cavities', m.cavities, 'type', m.type
    ) end,
    'items', coalesce((
      select jsonb_agg(jsonb_build_object(
        'description', qi.description, 'quantity', qi.quantity,
        'unit_price', qi.unit_price, 'total', qi.total) order by qi.sort_order)
      from public.quote_items qi where qi.quote_id = q.id
    ), '[]'::jsonb),
    'company', (
      select jsonb_build_object(
        'legal_name', cs.legal_name, 'document', cs.document, 'address', cs.address,
        'phone', cs.phone, 'email', cs.email, 'website', cs.website, 'logo_url', cs.logo_url)
      from public.company_settings cs where cs.id = 1
    )
  )
  from public.quotes q
  left join public.clients c on c.id = q.client_id
  left join public.molds m on m.id = q.mold_id
  where q.share_token = p_token;
$$;

-- Aprovação pelo cliente via link público (token-gated).
create or replace function public.approve_public_quote(p_token uuid)
returns boolean
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_id uuid;
  v_num text;
begin
  select id, number into v_id, v_num from public.quotes
   where share_token = p_token and status in ('sent','expired');
  if v_id is null then
    return false;
  end if;

  update public.quotes set status = 'approved' where id = v_id;

  insert into public.activity_logs (actor_id, actor_name, entity_type, entity_id, action, summary)
  values (null, 'Cliente (link público)', 'quote', v_id, 'status_approved',
          'Orçamento #' || v_num || ' aprovado pelo cliente');
  return true;
end;
$$;

grant execute on function public.get_public_quote(uuid) to anon, authenticated;
grant execute on function public.approve_public_quote(uuid) to anon, authenticated;
