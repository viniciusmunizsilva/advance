-- Advance — Fase 5: RPCs transacionais de orçamento (atomicidade + cálculo no banco).

-- Cria orçamento + itens em uma transação. Retorna o id.
create or replace function public.create_quote(p jsonb, items jsonb)
returns uuid
language plpgsql
security invoker
set search_path = pg_catalog, public
as $$
declare
  v_id uuid;
begin
  insert into public.quotes (
    client_id, mold_id, service_type, description, discount,
    deadline, validity_date, payment_terms, notes, status, created_by
  ) values (
    (p->>'client_id')::uuid,
    nullif(p->>'mold_id','')::uuid,
    nullif(p->>'service_type','')::public.service_type,
    nullif(p->>'description',''),
    coalesce((p->>'discount')::numeric, 0),
    nullif(p->>'deadline',''),
    nullif(p->>'validity_date','')::date,
    nullif(p->>'payment_terms',''),
    nullif(p->>'notes',''),
    coalesce(nullif(p->>'status','')::public.quote_status, 'draft'),
    auth.uid()
  ) returning id into v_id;

  insert into public.quote_items (quote_id, description, quantity, unit_price, sort_order)
  select v_id, x.description, x.quantity, x.unit_price, x.sort_order
  from jsonb_to_recordset(coalesce(items, '[]'::jsonb))
    as x(description text, quantity numeric, unit_price numeric, sort_order integer);

  return v_id;
end;
$$;

-- Atualiza orçamento e substitui seus itens, atomicamente.
create or replace function public.update_quote(p_id uuid, p jsonb, items jsonb)
returns uuid
language plpgsql
security invoker
set search_path = pg_catalog, public
as $$
begin
  update public.quotes set
    client_id     = (p->>'client_id')::uuid,
    mold_id       = nullif(p->>'mold_id','')::uuid,
    service_type  = nullif(p->>'service_type','')::public.service_type,
    description   = nullif(p->>'description',''),
    discount      = coalesce((p->>'discount')::numeric, 0),
    deadline      = nullif(p->>'deadline',''),
    validity_date = nullif(p->>'validity_date','')::date,
    payment_terms = nullif(p->>'payment_terms',''),
    notes         = nullif(p->>'notes','')
  where id = p_id;

  if not found then
    raise exception 'Orçamento não encontrado.' using errcode = 'no_data_found';
  end if;

  delete from public.quote_items where quote_id = p_id;

  insert into public.quote_items (quote_id, description, quantity, unit_price, sort_order)
  select p_id, x.description, x.quantity, x.unit_price, x.sort_order
  from jsonb_to_recordset(coalesce(items, '[]'::jsonb))
    as x(description text, quantity numeric, unit_price numeric, sort_order integer);

  return p_id;
end;
$$;

-- Duplica um orçamento (novo número, status draft) copiando itens.
create or replace function public.duplicate_quote(p_source uuid)
returns uuid
language plpgsql
security invoker
set search_path = pg_catalog, public
as $$
declare
  v_id uuid;
begin
  insert into public.quotes (
    client_id, mold_id, service_type, description, discount,
    deadline, validity_date, payment_terms, notes, status, created_by
  )
  select client_id, mold_id, service_type, description, discount,
         deadline, validity_date, payment_terms, notes, 'draft', auth.uid()
  from public.quotes where id = p_source
  returning id into v_id;

  if v_id is null then
    raise exception 'Orçamento de origem não encontrado.' using errcode = 'no_data_found';
  end if;

  insert into public.quote_items (quote_id, description, quantity, unit_price, sort_order)
  select v_id, description, quantity, unit_price, sort_order
  from public.quote_items where quote_id = p_source;

  return v_id;
end;
$$;
