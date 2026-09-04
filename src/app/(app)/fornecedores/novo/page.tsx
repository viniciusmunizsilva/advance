import { PageHeader } from "@/components/ui/PageHeader";
import { SupplierForm } from "../SupplierForm";

export default function NovoFornecedorPage() {
  return (
    <div className="page" style={{ maxWidth: 820 }}>
      <PageHeader
        title="Novo fornecedor"
        breadcrumb={[{ label: "Fornecedores", href: "/fornecedores" }, { label: "Novo" }]}
      />
      <SupplierForm />
    </div>
  );
}
