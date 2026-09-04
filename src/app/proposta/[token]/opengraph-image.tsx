import { ImageResponse } from "next/og";
import { createClient } from "@/lib/supabase/server";
import { fmtBRLc } from "@/lib/format";
import type { PublicQuoteJson } from "@/components/quote/publicDocData";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Proposta comercial — Advance Tecnologia";

export default async function Image(props: { params: Promise<{ token: string }> }) {
  const { token } = await props.params;
  let q: PublicQuoteJson | null = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.rpc("get_public_quote", { p_token: token });
    q = (data as unknown as PublicQuoteJson) ?? null;
  } catch {
    q = null;
  }

  const cliente = q?.client ? q.client.trade_name || q.client.legal_name : "";
  const numero = q?.number ?? "";
  const total = q ? fmtBRLc(q.total) : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column",
          background: "#23509f", color: "#fff", padding: 72,
          fontFamily: "sans-serif", justifyContent: "space-between",
        }}
      >
        {/* grade técnica sutil */}
        <div
          style={{
            position: "absolute", inset: 0, display: "flex",
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: 4 }}>ADVANCE</div>
          <div style={{ fontSize: 22, opacity: 0.75, marginTop: 6 }}>
            Tecnologia em Moldes de Injeção
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 26, letterSpacing: 8, opacity: 0.8, textTransform: "uppercase" }}>
            Proposta comercial
          </div>
          <div style={{ display: "flex", fontSize: 92, fontWeight: 700, marginTop: 8 }}>
            {`Orçamento Nº ${numero}`}
          </div>
          {cliente ? (
            <div style={{ fontSize: 40, marginTop: 12, opacity: 0.95 }}>{cliente}</div>
          ) : null}
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div style={{ fontSize: 26, opacity: 0.8 }}>Toque para ver a proposta</div>
          {total ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
              <div style={{ fontSize: 22, opacity: 0.7, textTransform: "uppercase", letterSpacing: 4 }}>Total</div>
              <div style={{ fontSize: 56, fontWeight: 700 }}>{total}</div>
            </div>
          ) : null}
        </div>
      </div>
    ),
    size,
  );
}
