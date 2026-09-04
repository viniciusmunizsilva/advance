import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { CompanyForm } from "./CompanyForm";

export default async function ConfiguracoesPage() {
  const supabase = await createClient();
  const { data: company } = await supabase.from("company_settings").select("*").eq("id", 1).single();

  return (
    <div className="page" style={{ maxWidth: 820 }}>
      <PageHeader title="Configurações" subtitle="Dados da empresa e preferências do sistema" />
      {company ? (
        <CompanyForm company={company} />
      ) : (
        <div className="card"><div className="card-body"><p className="hint" style={{ margin: 0 }}>Configurações indisponíveis.</p></div></div>
      )}
    </div>
  );
}
