# Supabase — Advance

Projeto: `ivynbvrathgwdtaxplne` (single-tenant, uso interno da Advance).

## Migrations (`migrations/`)

Aplicadas na ordem numérica. Refletem exatamente o estado do banco remoto.

| # | Arquivo | Conteúdo |
|---|---|---|
| 0001 | extensions_enums_helpers | `pg_trgm`/`unaccent`; enums (status, tipos); `set_updated_at()` |
| 0002 | core_tables | profiles, clients, molds, suppliers, company_settings |
| 0003 | quotes_items | quotes, quote_items, numeração sequencial, cálculo de totais, integridade molde↔cliente |
| 0004 | services_finance | services, accounts_receivable, accounts_payable, views de atraso |
| 0005 | activity_logs_profile_trigger | activity_logs; provisionamento de perfil no signup |
| 0006 | indexes | índices de FK, filtros e busca (GIN trigram) |
| 0007 | rls_policies | RLS em todas as tabelas; `security_invoker` nas views |
| 0008 | seed_company_settings | linha única com dados da Advance (editável em Configurações) |
| 0009 | harden_functions | `search_path` fixo; revoga RPC de `handle_new_user` |

## Modelo de dados

```
clients ──< molds ──< quotes ──< quote_items
   │          │         │
   │          │         └──< services (quote_id opcional)
   │          └──< services
   └──< accounts_receivable (quote_id opcional)

suppliers ──< accounts_payable
```

## Convenções

- **Enums em inglês** no banco; rótulos PT-BR na UI (`src/lib/domain.ts`).
- **Dinheiro**: `numeric(12,2)`; totais recalculados por trigger no banco.
- **Datas de negócio** (`due_date`, `validity_date`): `date` puro (sem timezone).
- **Numeração** de orçamento: sequência `quote_number_seq`, formato `0001`.
- **Atraso**: derivado nas views `v_accounts_*` (`effective_status`), sem cron.

## Tipos

`src/lib/supabase/database.types.ts` é gerado a partir do schema. Regerar após
alterações estruturais e revisar com `get_advisors` (security + performance).
