import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { QuoteDocument, QuoteDocStyle } from "@/components/quote/QuoteDocument";
import { publicJsonToDocData, type PublicQuoteJson } from "@/components/quote/publicDocData";
import { fmtBRLc } from "@/lib/format";
import { FitToWidth } from "./FitToWidth";
import { PublicActions } from "./PublicActions";

async function fetchQuote(token: string): Promise<PublicQuoteJson | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_public_quote", { p_token: token });
  if (error || !data) return null;
  return data as unknown as PublicQuoteJson;
}

async function getOrigin(): Promise<string> {
  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export async function generateMetadata(props: {
  params: Promise<{ token: string }>;
}): Promise<Metadata> {
  const { token } = await props.params;
  const q = await fetchQuote(token);
  if (!q) return { title: "Proposta — Advance" };

  const cliente = q.client ? q.client.trade_name || q.client.legal_name : "Cliente";
  const title = `Orçamento Nº ${q.number} — Advance`;
  const description = `Proposta para ${cliente} · Total ${fmtBRLc(q.total)}`;
  const origin = await getOrigin();
  return {
    metadataBase: new URL(origin),
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "Advance Tecnologia",
    },
    twitter: { card: "summary_large_image", title, description },
    robots: { index: false, follow: false },
  };
}

export default async function PropostaPage(props: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await props.params;
  const q = await fetchQuote(token);
  if (!q) notFound();

  const origin = await getOrigin();
  const docData = publicJsonToDocData(q, origin);

  return (
    <div style={{ background: "var(--neutral-100)", minHeight: "100vh" }}>
      <QuoteDocStyle />
      <style
        dangerouslySetInnerHTML={{
          __html: `@page{size:A4;margin:14mm}
@media print{.proposta-bar{display:none!important}.proposta-stage{background:#fff!important;padding:0!important}
.fit-doc{zoom:1!important;width:auto!important}.qdoc-page{box-shadow:none!important}}`,
        }}
      />

      {/* Barra topo (mobile-first) */}
      <div
        className="proposta-bar"
        style={{
          position: "sticky", top: 0, zIndex: 20,
          background: "rgba(255,255,255,.9)", backdropFilter: "blur(8px)",
          borderBottom: "1px solid var(--border)",
          display: "flex", alignItems: "center", gap: 12,
          padding: "12px 16px", flexWrap: "wrap",
        }}
      >
        <Image src="/brand/logo-advance-blue.png" alt="Advance" width={120} height={20}
          style={{ height: 20, width: "auto" }} priority />
        <span style={{ marginLeft: "auto" }} />
        <PublicActions token={token} status={q.status} />
      </div>

      {/* Documento */}
      <div className="proposta-stage" style={{ padding: "16px 12px 48px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <FitToWidth>
            <div style={{ boxShadow: "var(--shadow-md)" }}>
              <QuoteDocument data={docData} />
            </div>
          </FitToWidth>
        </div>
      </div>
    </div>
  );
}
