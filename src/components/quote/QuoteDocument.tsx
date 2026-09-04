import { fmtBRLc, fmtDate } from "@/lib/format";
import { SERVICE_TYPE, MOLD_TYPE, type ServiceType, type MoldType } from "@/lib/domain";
import { QUOTE_DOC_CSS } from "./quoteDocStyles";

export type QuoteDocData = {
  number: string;
  createdAt: string | null;
  validityDate: string | null;
  responsible: string | null;
  serviceType: ServiceType | null;
  description: string | null;
  deadline: string | null;
  paymentTerms: string | null;
  freight: string | null;
  notes: string | null;
  subtotal: number;
  discount: number;
  total: number;
  client: {
    legalName: string;
    tradeName: string | null;
    document: string | null;
    contact: string | null;
    phone: string | null;
    email: string | null;
    city: string | null;
  } | null;
  mold: {
    code: string;
    description: string | null;
    cavities: number | null;
    type: MoldType | null;
  } | null;
  items: { description: string; quantity: number; unit_price: number; total: number }[];
  company: {
    legalName: string;
    document: string | null;
    address: string | null;
    phone: string | null;
    email: string | null;
    website: string | null;
    logoUrl: string;
  };
};

/** Injeta os estilos do documento uma vez por página que o utiliza. */
export function QuoteDocStyle() {
  return <style dangerouslySetInnerHTML={{ __html: QUOTE_DOC_CSS }} />;
}

export function QuoteDocument({ data }: { data: QuoteDocData }) {
  const c = data.client;
  const m = data.mold;
  const clientName = c ? c.tradeName || c.legalName : "Cliente não selecionado";
  const showLegal = c?.tradeName && c.tradeName !== c.legalName ? c.legalName : null;

  const clientSub = c
    ? [showLegal, c.document ? `CNPJ ${c.document}` : null, c.contact, c.city]
        .filter(Boolean)
        .join(" · ")
    : "Selecione um cliente para preencher a proposta.";

  return (
    <div className="qdoc">
      <div className="qdoc-page">
        {/* Header */}
        <div className="qdoc-head">
          <div className="qdoc-brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={data.company.logoUrl} alt={data.company.legalName} />
            <div className="tag">
              {data.company.legalName}
              <br />
              Moldes de injeção plástica · Precisão ±0,001 mm
            </div>
          </div>
          <div className="qdoc-id">
            <div className="eyebrow">Proposta comercial</div>
            <div className="num">
              <small>Nº </small>
              {data.number}
            </div>
          </div>
        </div>
        <div className="qdoc-rule" />

        {/* Meta */}
        <div className="qdoc-meta">
          <div className="m"><div className="l">Emissão</div><div className="v mono">{fmtDate(data.createdAt)}</div></div>
          <div className="m"><div className="l">Validade</div><div className="v mono">{fmtDate(data.validityDate)}</div></div>
          <div className="m"><div className="l">Responsável técnico</div><div className="v">{data.responsible || "—"}</div></div>
        </div>

        {/* Cliente + molde */}
        <div className="qdoc-parties">
          <div className="qdoc-party">
            <div className="qdoc-sec-label">Cliente</div>
            <div className="name">{clientName}</div>
            <div className="sub">{clientSub}</div>
          </div>
          <div className="qdoc-party">
            <div className="qdoc-sec-label">Molde &amp; serviço</div>
            <div className="name" style={{ fontSize: 14 }}>
              {m ? `${m.code}${m.description ? ` — ${m.description}` : ""}` : data.serviceType ? SERVICE_TYPE[data.serviceType] : "—"}
            </div>
            <div className="sub">
              {[
                data.serviceType ? SERVICE_TYPE[data.serviceType] : null,
                m?.type ? MOLD_TYPE[m.type] : null,
                m?.cavities ? `${m.cavities} cavidades` : null,
              ].filter(Boolean).join(" · ") || "—"}
            </div>
          </div>
        </div>

        {/* Escopo */}
        <div className="qdoc-scope">
          <div className="qdoc-sec-label">Escopo do fornecimento</div>
          {data.description && <p className="intro">{data.description}</p>}
          <table className="qdoc-items">
            <thead>
              <tr>
                <th>Descrição</th>
                <th className="r qty-col">Qtd.</th>
                <th className="r val-col">Valor</th>
              </tr>
            </thead>
            <tbody>
              {data.items.length === 0 ? (
                <tr><td className="desc" colSpan={3} style={{ color: "var(--doc-mut)" }}>Nenhum item adicionado.</td></tr>
              ) : (
                data.items.map((it, i) => (
                  <tr key={i}>
                    <td className="desc">
                      <div className="d">{it.description}</div>
                      {it.quantity !== 1 && (
                        <div className="u">{fmtBRLc(it.unit_price)} / un.</div>
                      )}
                    </td>
                    <td className="qty">{it.quantity}</td>
                    <td className="r">{fmtBRLc(it.total)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="qdoc-totals">
            <div className="box">
              <div className="row"><span>Subtotal</span><span className="mono">{fmtBRLc(data.subtotal)}</span></div>
              {data.discount > 0 && (
                <div className="row"><span>Desconto</span><span className="mono">− {fmtBRLc(data.discount)}</span></div>
              )}
              <div className="grand">
                <span className="lbl">Total</span>
                <span className="amt">{fmtBRLc(data.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Condições comerciais */}
        <div className="qdoc-cond">
          <div className="item"><div className="l">Prazo de entrega</div><div className="v">{data.deadline || "A combinar"}</div></div>
          <div className="item"><div className="l">Forma de pagamento</div><div className="v">{data.paymentTerms || "A combinar"}</div></div>
          <div className="item"><div className="l">Frete</div><div className="v">{data.freight || "A combinar"}</div></div>
        </div>

        {/* Observações */}
        {data.notes && (
          <div className="qdoc-obs">
            <div className="l">Observações</div>
            <div className="t">{data.notes}</div>
          </div>
        )}

        {/* Aceite */}
        <div className="qdoc-accept">
          <div className="l">Aceite da proposta</div>
          <div className="qdoc-sign">
            <div className="col">
              <div className="line" />
              <div className="who">{data.company.legalName}</div>
              <div className="fields">Responsável · Data</div>
            </div>
            <div className="col">
              <div className="line" />
              <div className="who">{clientName}</div>
              <div className="fields">Nome · Assinatura · Data</div>
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div className="qdoc-foot">
          <span>{data.company.legalName}{data.company.document ? ` · CNPJ ${data.company.document}` : ""}</span>
          <span className="mono">{[data.company.phone, data.company.website].filter(Boolean).join(" · ")}</span>
        </div>
      </div>
    </div>
  );
}
