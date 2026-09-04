import type { Database } from "./supabase/database.types";

export type QuoteStatus = Database["public"]["Enums"]["quote_status"];
export type ServiceStatus = Database["public"]["Enums"]["service_status"];
export type ServiceType = Database["public"]["Enums"]["service_type"];
export type FinanceStatus = Database["public"]["Enums"]["finance_status"];
export type MoldType = Database["public"]["Enums"]["mold_type"];

/** Classe de badge do DS (ver ds.css: .badge.<cls>). */
export type BadgeClass =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "error"
  | "brand";

type LabelMap<T extends string> = Record<T, { label: string; cls: BadgeClass }>;

/** Orçamento — valores em inglês no banco; rótulos PT-BR na UI. */
export const QUOTE_STATUS: LabelMap<QuoteStatus> = {
  draft: { label: "Rascunho", cls: "neutral" },
  sent: { label: "Enviado", cls: "info" },
  approved: { label: "Aprovado", cls: "success" },
  rejected: { label: "Recusado", cls: "error" },
  expired: { label: "Expirado", cls: "warning" },
  cancelled: { label: "Cancelado", cls: "neutral" },
};

export const SERVICE_STATUS: LabelMap<ServiceStatus> = {
  waiting: { label: "Aguardando", cls: "neutral" },
  analysis: { label: "Em análise", cls: "info" },
  in_progress: { label: "Em execução", cls: "brand" },
  waiting_client: { label: "Aguardando cliente", cls: "warning" },
  completed: { label: "Concluído", cls: "success" },
  delivered: { label: "Entregue", cls: "success" },
  cancelled: { label: "Cancelado", cls: "neutral" },
};

export const FINANCE_STATUS: LabelMap<FinanceStatus> = {
  open: { label: "Em aberto", cls: "info" },
  paid: { label: "Pago", cls: "success" },
  overdue: { label: "Vencido", cls: "error" },
  cancelled: { label: "Cancelado", cls: "neutral" },
};

export const SERVICE_TYPE: Record<ServiceType, string> = {
  construction: "Construção de molde",
  maintenance: "Manutenção",
  alteration: "Alteração",
  machining: "Usinagem",
  other: "Outro",
};

export const MOLD_TYPE: Record<MoldType, string> = {
  single_cavity: "Monocavidade",
  multi_cavity: "Multicavidade",
};

/** Ordem das colunas no Kanban de serviços. */
export const SERVICE_KANBAN_ORDER: ServiceStatus[] = [
  "waiting",
  "analysis",
  "in_progress",
  "waiting_client",
  "completed",
  "delivered",
];
