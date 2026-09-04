import { PageHeader } from "@/components/ui/PageHeader";
import { getSupplierOptions } from "@/lib/queries";
import { PayableForm } from "../PayableForm";

export default async function NovaContaPagarPage(props: {
  searchParams: Promise<{ supplier?: string }>;
}) {
  const { supplier } = await props.searchParams;
  const suppliers = await getSupplierOptions();

  return (
    <div className="page" style={{ maxWidth: 760 }}>
      <PageHeader title="Nova conta a pagar" breadcrumb={[{ label: "A pagar", href: "/a-pagar" }, { label: "Nova" }]} />
      <PayableForm suppliers={suppliers} defaultSupplierId={supplier} />
    </div>
  );
}
