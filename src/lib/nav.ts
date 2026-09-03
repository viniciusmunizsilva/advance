import type { LucideIcon } from "lucide-react";
import {
  LayoutGrid,
  FileText,
  Users,
  Box,
  Wrench,
  ArrowDownToLine,
  ArrowUpFromLine,
  Building2,
  Settings,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  /** chave de contagem opcional exibida como badge (ex.: orçamentos abertos) */
  countKey?: string;
};

export type NavGroup = {
  /** label overline; null = sem cabeçalho de grupo */
  label: string | null;
  items: NavItem[];
};

/**
 * Estrutura de navegação da sidebar — espelha o handoff:
 * Visão geral · Comercial · Operação · Financeiro · Configurações.
 */
export const NAV: NavGroup[] = [
  {
    label: null,
    items: [{ href: "/dashboard", label: "Visão geral", icon: LayoutGrid }],
  },
  {
    label: "Comercial",
    items: [
      { href: "/orcamentos", label: "Orçamentos", icon: FileText, countKey: "orcamentosAbertos" },
      { href: "/clientes", label: "Clientes", icon: Users },
      { href: "/moldes", label: "Moldes", icon: Box },
    ],
  },
  {
    label: "Operação",
    items: [{ href: "/servicos", label: "Serviços", icon: Wrench }],
  },
  {
    label: "Financeiro",
    items: [
      { href: "/a-receber", label: "A receber", icon: ArrowDownToLine },
      { href: "/a-pagar", label: "A pagar", icon: ArrowUpFromLine },
      { href: "/fornecedores", label: "Fornecedores", icon: Building2 },
    ],
  },
  {
    label: null,
    items: [{ href: "/configuracoes", label: "Configurações", icon: Settings }],
  },
];
