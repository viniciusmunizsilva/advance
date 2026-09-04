-- Advance — Fase 1: hardening de funções (advisors de segurança).

-- Fixa search_path (evita sequestro por search_path mutável).
alter function public.set_updated_at()            set search_path = pg_catalog, public;
alter function public.assign_quote_number()       set search_path = pg_catalog, public;
alter function public.ensure_mold_matches_client() set search_path = pg_catalog, public;
alter function public.calc_quote_item_total()     set search_path = pg_catalog, public;
alter function public.calc_quote_total()          set search_path = pg_catalog, public;
alter function public.recalc_quote_totals(uuid)   set search_path = pg_catalog, public;
alter function public.trg_quote_items_recalc()    set search_path = pg_catalog, public;

-- handle_new_user é acionada por trigger; não deve ser chamável via RPC.
-- (Triggers não checam EXECUTE, então revogar não quebra o provisionamento.)
revoke execute on function public.handle_new_user() from public, anon, authenticated;
