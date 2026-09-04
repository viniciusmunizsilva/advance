-- Advance — Fase 1: índices para FKs, filtros e busca.

-- clients
create index idx_clients_created_at on public.clients (created_at desc);
create index idx_clients_trgm on public.clients using gin (
  (coalesce(legal_name,'') || ' ' || coalesce(trade_name,'') || ' ' ||
   coalesce(document,'') || ' ' || coalesce(city,'')) extensions.gin_trgm_ops);

-- molds
create index idx_molds_client_id on public.molds (client_id);
create index idx_molds_trgm on public.molds using gin (
  (coalesce(code,'') || ' ' || coalesce(name,'') || ' ' ||
   coalesce(description,'')) extensions.gin_trgm_ops);

-- quotes
create index idx_quotes_client_id on public.quotes (client_id);
create index idx_quotes_mold_id on public.quotes (mold_id);
create index idx_quotes_status on public.quotes (status);
create index idx_quotes_created_at on public.quotes (created_at desc);
create index idx_quotes_created_by on public.quotes (created_by);
create index idx_quotes_number_trgm on public.quotes using gin (number extensions.gin_trgm_ops);

-- quote_items
create index idx_quote_items_quote_id on public.quote_items (quote_id, sort_order);

-- services
create index idx_services_client_id on public.services (client_id);
create index idx_services_mold_id on public.services (mold_id);
create index idx_services_quote_id on public.services (quote_id);
create index idx_services_status on public.services (status);

-- accounts_receivable
create index idx_ar_client_id on public.accounts_receivable (client_id);
create index idx_ar_quote_id on public.accounts_receivable (quote_id);
create index idx_ar_status on public.accounts_receivable (status);
create index idx_ar_due_date on public.accounts_receivable (due_date);

-- accounts_payable
create index idx_ap_supplier_id on public.accounts_payable (supplier_id);
create index idx_ap_status on public.accounts_payable (status);
create index idx_ap_due_date on public.accounts_payable (due_date);

-- activity_logs
create index idx_activity_entity on public.activity_logs (entity_type, entity_id);
create index idx_activity_created_at on public.activity_logs (created_at desc);
create index idx_activity_actor on public.activity_logs (actor_id);
