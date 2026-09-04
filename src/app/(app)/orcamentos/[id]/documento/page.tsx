import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCompanyDoc } from "@/lib/queries";
import { QuoteDocument, QuoteDocStyle } from "@/components/quote/QuoteDocument";
import { quoteToDocData } from "@/components/quote/quoteToDocData";
import { DocActions } from "./DocActions";

export default async function DocumentoPage(props: {
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
    <div className="page" style={{ maxWidth: "none" }}>
      <QuoteDocStyle />
      <div style={{ maxWidth: 940, margin: "0 auto" }}>
        <div style={{ marginBottom: 18 }}>
          <DocActions id={id} approved={quote.status === "approved"} />
        </div>
        <div style={{ background: "var(--neutral-100)", borderRadius: "var(--radius-lg)", padding: "28px 20px", display: "flex", justifyContent: "center" }}>
          <div style={{ boxShadow: "var(--shadow-md)" }}>
            <QuoteDocument data={docData} />
          </div>
        </div>
      </div>
    </div>
  );
}
