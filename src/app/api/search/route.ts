import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export type SearchResult = {
  id: string;
  title: string;
  subtitle?: string;
  value?: string;
  href: string;
  group: "Orçamentos" | "Clientes" | "Moldes" | "Serviços";
};

export async function GET(request: NextRequest) {
  const q = (request.nextUrl.searchParams.get("q") ?? "").trim();
  if (q.length < 1) return NextResponse.json({ results: [] });

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ results: [] }, { status: 401 });

  const term = `%${q}%`;

  const [clients, molds, quotes, services] = await Promise.all([
    supabase.from("clients").select("id, legal_name, trade_name, city").or(`legal_name.ilike.${term},trade_name.ilike.${term},document.ilike.${term}`).limit(5),
    supabase.from("molds").select("id, code, description").or(`code.ilike.${term},description.ilike.${term}`).limit(5),
    supabase.from("quotes").select("id, number, total, status").ilike("number", term).limit(5),
    supabase.from("services").select("id, title, status").ilike("title", term).limit(5),
  ]);

  const results: SearchResult[] = [];

  for (const c of clients.data ?? [])
    results.push({ id: c.id, group: "Clientes", title: c.trade_name || c.legal_name, subtitle: c.city ?? undefined, href: `/clientes/${c.id}` });
  for (const m of molds.data ?? [])
    results.push({ id: m.id, group: "Moldes", title: m.code, subtitle: m.description ?? undefined, href: `/moldes/${m.id}` });
  for (const qt of quotes.data ?? [])
    results.push({ id: qt.id, group: "Orçamentos", title: `#${qt.number}`, href: `/orcamentos/${qt.id}` });
  for (const s of services.data ?? [])
    results.push({ id: s.id, group: "Serviços", title: s.title, href: `/servicos/${s.id}` });

  return NextResponse.json({ results });
}
