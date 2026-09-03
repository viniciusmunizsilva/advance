# Advance — Sistema de Gestão

Sistema interno de gestão da **Advance Tecnologia** (ferramentaria — moldes de
injeção plástica). Uso exclusivo da Advance (single-tenant). Fluxo central:

**Cliente → Molde → Orçamento → Aprovação → Serviço → Recebimento**

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** + Design System da Advance (tokens CSS)
- **Supabase** — PostgreSQL, Auth, Storage
- Deploy alvo: **Vercel**

## Setup local

```bash
pnpm install
cp .env.example .env.local   # preencha com as credenciais do Supabase
pnpm dev                     # http://localhost:3000
```

### Variáveis de ambiente

| Variável | Obrigatória | Descrição |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | sim | URL pública do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | sim | Publishable/anon key (segura no browser) |
| `SUPABASE_SERVICE_ROLE_KEY` | não | Somente server-side, tarefas administrativas |

> Nunca commite `.env.local` nem a `service_role` key. Apenas a anon/publishable
> key é exposta ao browser.

## Estrutura

```
src/
  app/
    (app)/            rotas autenticadas (envoltas no app shell)
      dashboard/ orcamentos/ clientes/ moldes/ servicos/
      a-receber/ a-pagar/ fornecedores/ configuracoes/
    login/            autenticação (rota pública)
    layout.tsx        root layout (pt-BR)
    globals.css       fontes + tokens + camada de componentes do DS
  components/
    shell/            Sidebar, Topbar, AppShell
    ui/               PageHeader, EmptyState, ComingSoon, …
  lib/
    supabase/         clients (browser, server) + proxy de sessão
    format.ts         BRL, datas de negócio, iniciais
    nav.ts            estrutura da navegação
  styles/
    tokens.css        Design System — cores, tipografia, espaçamento, radius
    ds.css            camada de componentes construída sobre os tokens
  proxy.ts            proteção de rotas + refresh de sessão (Next 16)
design-reference/     protótipo HTML/CSS/JS do handoff (referência, não é build)
```

## Design System

Tokens em `src/styles/tokens.css` são a **fonte da verdade** visual
(portados do *Advance Brand Design System*). Não usar hexadecimais soltos —
referenciar as variáveis CSS. Fontes: IBM Plex Sans/Mono (UI/números) e
Playfair Display (apenas no PDF do orçamento). Idioma: **pt-BR**; moeda **BRL**;
timezone **America/Sao_Paulo**.

## Roadmap de implementação

- **F0** Base — scaffold, DS, Supabase client, app shell ✅
- **F1** Banco — migrations, tabelas, RLS, numeração, activity log
- **F2** Auth — login, logout, recuperação, proteção de rotas
- **F3** Clientes · **F4** Moldes
- **F5** Orçamentos (core) — lista, criar, editar, detalhe, duplicar, status
- **F6** Serviços (Kanban) · **F7** Financeiro · **F8** Dashboard
- **F9** PDF do orçamento · **F10** Refino (responsivo, a11y, performance, testes)
