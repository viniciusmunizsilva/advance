import { type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { fmtBRLc, fmtDate } from "@/lib/format";
import { SERVICE_TYPE, MOLD_TYPE } from "@/lib/domain";

function esc(s: unknown): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function GET(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const supabase = await createClient();

  const [{ data: quote }, { data: company }] = await Promise.all([
    supabase
      .from("quotes")
      .select("*, clients(*), molds(*)")
      .eq("id", id)
      .single(),
    supabase.from("company_settings").select("*").eq("id", 1).single(),
  ]);

  if (!quote) {
    return new Response("Orçamento não encontrado.", {
      status: 404,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  const { data: items } = await supabase
    .from("quote_items")
    .select("*")
    .eq("quote_id", id)
    .order("sort_order");

  const c = quote.clients as {
    legal_name: string; trade_name: string | null; document: string | null;
    contact_name: string | null; phone: string | null; email: string | null; city: string | null;
  } | null;
  const m = quote.molds as {
    code: string; description: string | null; cavities: number | null;
    type: keyof typeof MOLD_TYPE | null;
  } | null;

  const origin = request.nextUrl.origin;
  const logo = company?.logo_url?.startsWith("http")
    ? company.logo_url
    : `${origin}${company?.logo_url ?? "/brand/logo-advance-blue.png"}`;

  const itemRows = (items ?? [])
    .map(
      (it) =>
        `<tr><td class="desc">${esc(it.description)}</td><td class="r">${esc(it.quantity)}</td><td class="r">${esc(fmtBRLc(it.unit_price))}</td><td class="r">${esc(fmtBRLc(it.total))}</td></tr>`,
    )
    .join("");

  const companyName = esc(company?.legal_name ?? "Advance Tecnologia em Moldes");
  const clientName = c ? esc(c.trade_name || c.legal_name) : "—";

  const html = `<!DOCTYPE html>
<html lang="pt-BR"><head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Orçamento ${esc(quote.number)} — Advance</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap">
<style>
:root{
  --primary-400:#4f7bcb;--primary-600:#23509f;--primary-700:#1d4184;
  --neutral-50:#f7f8fa;--neutral-200:#e1e5ea;--neutral-300:#cbd1d9;
  --neutral-500:#6b7480;--neutral-600:#4c5561;--neutral-900:#171b21;
  --font-sans:"IBM Plex Sans",-apple-system,Segoe UI,Roboto,sans-serif;
  --font-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
  --font-serif:"Playfair Display",Georgia,serif;--radius-sm:4px;
}
*{box-sizing:border-box}
html,body{margin:0;padding:0;background:var(--neutral-50)}
@page{size:A4;margin:0.6in}
.toolbar{max-width:210mm;margin:16px auto;display:flex;gap:10px;justify-content:flex-end;padding:0 12px}
.toolbar button,.toolbar a{font-family:var(--font-sans);font-size:13.5px;font-weight:600;height:38px;padding:0 16px;border-radius:6px;border:1px solid var(--neutral-300);background:#fff;color:var(--neutral-900);cursor:pointer;display:inline-flex;align-items:center;text-decoration:none}
.toolbar button.primary{background:var(--primary-600);color:#fff;border-color:var(--primary-600)}
.sheet{background:#fff;max-width:210mm;margin:0 auto 40px;padding:0.6in;box-shadow:0 2px 12px rgba(0,0,0,.08)}
.doc{font-family:var(--font-sans);color:var(--neutral-900);font-size:12.5px;line-height:1.55}
.doc .mono{font-family:var(--font-mono);font-variant-numeric:tabular-nums}
.pdf-head{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:22px;border-bottom:2px solid var(--primary-600);position:relative}
.pdf-head::before{content:"";position:absolute;inset:-10px -6px 14px;background-image:linear-gradient(to right,rgba(35,80,159,.06) 1px,transparent 1px),linear-gradient(to bottom,rgba(35,80,159,.06) 1px,transparent 1px);background-size:20px 20px;-webkit-mask-image:linear-gradient(105deg,#000 22%,transparent 58%);mask-image:linear-gradient(105deg,#000 22%,transparent 58%);pointer-events:none}
.pdf-head .brand img{height:26px;display:block;margin-bottom:12px}
.pdf-head .brand .tag{font-size:11px;color:var(--neutral-500);letter-spacing:.02em;max-width:230px;line-height:1.5}
.pdf-head .doc-id{text-align:right;position:relative}
.pdf-head .doc-id .eyebrow{font-family:var(--font-serif);font-style:italic;font-size:15px;color:var(--primary-600)}
.pdf-head .doc-id h1{font-family:var(--font-serif);font-size:34px;font-weight:700;letter-spacing:-.01em;margin:2px 0 8px;line-height:1}
.pdf-head .doc-id .meta{font-family:var(--font-mono);font-size:11.5px;color:var(--neutral-600);line-height:1.7}
.pdf-head .doc-id .meta b{color:var(--neutral-900)}
.sec{margin-top:26px}
.sec-label{font-size:10.5px;font-weight:600;letter-spacing:.13em;text-transform:uppercase;color:var(--primary-700);margin-bottom:10px}
.cols2{display:grid;grid-template-columns:1fr 1fr;gap:26px}
.kv{display:grid;grid-template-columns:auto 1fr;gap:5px 14px;font-size:12px}
.kv dt{color:var(--neutral-500)}
.kv dd{margin:0;font-weight:500}
.kv dd.mono{font-family:var(--font-mono)}
.block-title{font-size:15px;font-weight:600;margin:0 0 3px}
table.items{width:100%;border-collapse:collapse;margin-top:4px;font-size:12px}
table.items thead th{text-align:left;font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--neutral-500);padding:8px 12px;background:var(--neutral-50);border-top:1px solid var(--neutral-300);border-bottom:1px solid var(--neutral-300)}
table.items thead th.r{text-align:right}
table.items tbody td{padding:9px 12px;border-bottom:1px solid var(--neutral-200);vertical-align:top}
table.items tbody td.r{text-align:right;font-family:var(--font-mono);font-variant-numeric:tabular-nums}
table.items tbody td.desc{font-weight:500}
.totals{margin-top:16px;display:flex;justify-content:flex-end;break-inside:avoid}
.totals .box{width:290px}
.totals .row{display:flex;justify-content:space-between;padding:7px 0;font-size:12.5px;color:var(--neutral-600)}
.totals .row .mono{color:var(--neutral-900);font-family:var(--font-mono)}
.totals .row.total{border-top:2px solid var(--primary-600);margin-top:6px;padding-top:12px;font-size:16px;font-weight:700;color:var(--neutral-900)}
.totals .row.total .mono{color:var(--primary-700)}
.cond{margin-top:26px;display:grid;grid-template-columns:1fr 1fr;gap:14px 26px;break-inside:avoid}
.cond .item .l{font-size:10px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--neutral-500);margin-bottom:3px}
.cond .item .v{font-size:12.5px;font-weight:500}
.obs{margin-top:24px;padding:14px 16px;background:var(--neutral-50);border-left:3px solid var(--primary-400);border-radius:0 var(--radius-sm) var(--radius-sm) 0;font-size:12px;color:var(--neutral-600);line-height:1.6;break-inside:avoid;white-space:pre-wrap}
.obs .l{font-size:10px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--neutral-500);margin-bottom:4px}
.sign{margin-top:44px;display:grid;grid-template-columns:1fr 1fr;gap:60px;break-inside:avoid}
.sign .line{border-top:1px solid var(--neutral-500);padding-top:7px;font-size:11px;color:var(--neutral-600);text-align:center}
.pdf-foot{border-top:1px solid var(--neutral-300);padding-top:12px;margin-top:40px;display:flex;justify-content:space-between;align-items:center;font-size:10.5px;color:var(--neutral-500)}
.pdf-foot .mono{font-family:var(--font-mono)}
@media print{.toolbar{display:none}.sheet{box-shadow:none;margin:0;padding:0;max-width:none}body{background:#fff}}
</style></head>
<body>
<div class="toolbar">
  <a href="/orcamentos/${esc(id)}">Voltar</a>
  <button class="primary" onclick="window.print()">Imprimir / Salvar PDF</button>
</div>
<div class="sheet"><div class="doc">
  <div class="pdf-head">
    <div class="brand"><img src="${esc(logo)}" alt="${companyName}"><div class="tag">${companyName}<br>Moldes de injeção plástica · Precisão ±0,001 mm</div></div>
    <div class="doc-id"><div class="eyebrow">Proposta comercial</div><h1>Orçamento ${esc(quote.number)}</h1>
      <div class="meta">Emissão <b>${esc(fmtDate(quote.created_at))}</b><br>Validade <b>${esc(fmtDate(quote.validity_date))}</b></div></div>
  </div>

  <div class="sec cols2">
    <div><div class="sec-label">Cliente</div>
      <div class="block-title">${c ? esc(c.legal_name) : "—"}</div>
      <dl class="kv" style="margin-top:8px">
        <dt>CNPJ</dt><dd class="mono">${c ? esc(c.document || "—") : "—"}</dd>
        <dt>Contato</dt><dd>${c ? esc(c.contact_name || "—") : "—"}</dd>
        <dt>Telefone</dt><dd class="mono">${c ? esc(c.phone || "—") : "—"}</dd>
        <dt>E-mail</dt><dd>${c ? esc(c.email || "—") : "—"}</dd>
        <dt>Cidade</dt><dd>${c ? esc(c.city || "—") : "—"}</dd>
      </dl>
    </div>
    <div><div class="sec-label">Molde &amp; serviço</div>
      <div class="block-title">${m ? esc(`${m.code}${m.description ? " — " + m.description : ""}`) : "Serviço"}</div>
      <dl class="kv" style="margin-top:8px">
        <dt>Serviço</dt><dd>${quote.service_type ? esc(SERVICE_TYPE[quote.service_type]) : "—"}</dd>
        <dt>Cavidades</dt><dd class="mono">${m?.cavities ?? "—"}</dd>
        <dt>Tipo</dt><dd>${m?.type ? esc(MOLD_TYPE[m.type]) : "—"}</dd>
        <dt>Prazo</dt><dd>${esc(quote.deadline || "A combinar")}</dd>
      </dl>
    </div>
  </div>

  <div class="sec"><div class="sec-label">Descrição dos serviços</div>
    <table class="items"><thead><tr><th>Descrição</th><th class="r">Qtd.</th><th class="r">Valor unit.</th><th class="r">Total</th></tr></thead>
    <tbody>${itemRows || '<tr><td colspan="4">—</td></tr>'}</tbody></table>
    <div class="totals"><div class="box">
      <div class="row"><span>Subtotal</span><span class="mono">${esc(fmtBRLc(quote.subtotal))}</span></div>
      <div class="row"><span>Desconto</span><span class="mono">${quote.discount ? "− " + esc(fmtBRLc(quote.discount)) : esc(fmtBRLc(0))}</span></div>
      <div class="row total"><span>TOTAL</span><span class="mono">${esc(fmtBRLc(quote.total))}</span></div>
    </div></div>
  </div>

  <div class="cond">
    <div class="item"><div class="l">Prazo de entrega</div><div class="v">${esc(quote.deadline || "A combinar")}</div></div>
    <div class="item"><div class="l">Validade da proposta</div><div class="v">${esc(fmtDate(quote.validity_date))}</div></div>
    <div class="item"><div class="l">Condição de pagamento</div><div class="v">${esc(quote.payment_terms || "A combinar")}</div></div>
    <div class="item"><div class="l">Local do serviço</div><div class="v">${esc(company?.address || "Planta Advance")}</div></div>
  </div>

  ${quote.notes ? `<div class="obs"><div class="l">Observações</div>${esc(quote.notes)}</div>` : ""}

  <div class="sign">
    <div class="line">${companyName}</div>
    <div class="line">${clientName}</div>
  </div>

  <div class="pdf-foot">
    <span>${companyName} · CNPJ ${esc(company?.document || "—")}</span>
    <span class="mono">${esc(company?.phone || "")} · ${esc(company?.website || "")}</span>
  </div>
</div></div>
</body></html>`;

  return new Response(html, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
