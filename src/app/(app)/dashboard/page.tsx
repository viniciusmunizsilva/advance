import { ComingSoon } from "@/components/ui/ComingSoon";
import { fmtDateLong } from "@/lib/format";

export default function DashboardPage() {
  const hoje = fmtDateLong();
  const sub = hoje.charAt(0).toUpperCase() + hoje.slice(1);
  return <ComingSoon title="Visão geral" subtitle={sub} phase="na Fase 8 (dados reais)" />;
}
