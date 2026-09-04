import { PageHeader } from "@/components/ui/PageHeader";
import { ClientForm } from "../ClientForm";

export default function NovoClientePage() {
  return (
    <div className="page" style={{ maxWidth: 820 }}>
      <PageHeader
        title="Novo cliente"
        breadcrumb={[{ label: "Clientes", href: "/clientes" }, { label: "Novo" }]}
      />
      <ClientForm />
    </div>
  );
}
