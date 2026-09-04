import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCompanyDoc } from "@/lib/queries";
import { QuoteDocument, QuoteDocStyle } from "@/components/quote/QuoteDocument";
import { quoteToDocData } from "@/components/quote/quoteToDocData";
import { PrintBar } from "./PrintBar";

export const metadata = { title: "Orçamento — Advance" };

export default async function OrcamentoPdfPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const supabase = await createClient();

  const [{ data: quote }, company] = await Promise.all([
    supabase.from("quotes").select("*, clients(*), molds(*)").eq("id", id).single(),
    getCompanyDoc(),
  ]);
  if (!quote) notFound();

  const { data: items } = await supabase
    .from("quote_items").select("description, quantity, unit_price, total").eq("quote_id", id).order("sort_order");

  const docData = quoteToDocData(quote as never, items ?? [], company);

  return (
    <div style={{ background: "var(--neutral-100)", minHeight: "100vh" }}>
      <QuoteDocStyle />
      <style
        dangerouslySetInnerHTML={{
          __html: `@page{size:A4;margin:16mm}
@media print{.pdf-toolbar{display:none!important}.pdf-stage{background:#fff!important;padding:0!important}.qdoc-page{box-shadow:none!important}}`,
        }}
      />
      <PrintBar id={id} />
      <div className="pdf-stage" style={{ padding: "0 16px 48px", display: "flex", justifyContent: "center" }}>
        <div style={{ boxShadow: "var(--shadow-md)" }}>
          <QuoteDocument data={docData} />
        </div>
      </div>
    </div>
  );
}
