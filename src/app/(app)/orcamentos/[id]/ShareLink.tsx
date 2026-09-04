"use client";

import { useState } from "react";
import { Copy, ExternalLink, Check, MessageCircle } from "lucide-react";

export function ShareLink({ url, number }: { url: string; number: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  }

  const waText = encodeURIComponent(
    `Olá! Segue a proposta comercial da Advance (Orçamento Nº ${number}):\n${url}`,
  );

  return (
    <div className="card">
      <div className="card-head"><h3>Compartilhar com o cliente</h3></div>
      <div className="card-body">
        <p className="hint" style={{ marginTop: 0 }}>
          Link público da proposta — o cliente vê o documento e pode gerar o PDF, sem login.
        </p>
        <div
          className="mono"
          style={{
            fontSize: 12, background: "var(--neutral-100)", border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)", padding: "8px 10px", wordBreak: "break-all",
            marginBottom: 12, color: "var(--text-secondary)",
          }}
        >
          {url}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button className="btn btn-secondary btn-sm" onClick={copy}>
            {copied ? <Check aria-hidden /> : <Copy aria-hidden />}
            <span>{copied ? "Copiado" : "Copiar link"}</span>
          </button>
          <a className="btn btn-secondary btn-sm" href={url} target="_blank" rel="noopener noreferrer">
            <ExternalLink aria-hidden /> <span>Abrir</span>
          </a>
          <a className="btn btn-secondary btn-sm" href={`https://wa.me/?text=${waText}`} target="_blank" rel="noopener noreferrer">
            <MessageCircle aria-hidden /> <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
