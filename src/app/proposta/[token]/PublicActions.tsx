"use client";

import { useState, useTransition } from "react";
import { Printer, CheckCircle2 } from "lucide-react";
import { approveProposalAction } from "./actions";

export function PublicActions({ token, status }: { token: string; status: string }) {
  const [pending, startTransition] = useTransition();
  const [approved, setApproved] = useState(status === "approved");
  const [error, setError] = useState<string | null>(null);
  const canApprove = status === "sent" || status === "expired";

  function approve() {
    setError(null);
    startTransition(async () => {
      const r = await approveProposalAction(token);
      if (!r.ok) {
        setError("Não foi possível aprovar agora. Tente novamente ou fale com a Advance.");
        return;
      }
      setApproved(true);
    });
  }

  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
      <button className="btn btn-secondary" onClick={() => window.print()}>
        <Printer aria-hidden /> <span>Baixar PDF</span>
      </button>

      {approved ? (
        <span className="badge success" style={{ height: 38, padding: "0 14px" }}>
          <CheckCircle2 aria-hidden style={{ width: 15 }} /> Proposta aprovada
        </span>
      ) : canApprove ? (
        <button className="btn btn-primary" onClick={approve} disabled={pending}>
          <CheckCircle2 aria-hidden /> <span>{pending ? "Aprovando…" : "Aprovar proposta"}</span>
        </button>
      ) : null}

      {error && <span className="form-error" style={{ width: "100%" }}>{error}</span>}
    </div>
  );
}
