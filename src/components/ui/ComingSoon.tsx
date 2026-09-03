import { Hammer } from "lucide-react";
import { PageHeader } from "./PageHeader";
import { EmptyState } from "./EmptyState";

type Props = {
  title: string;
  subtitle?: string;
  phase?: string;
};

/**
 * Placeholder de módulo ainda não implementado, mantendo o shell e o DS.
 * Substituído pela tela real na fase correspondente.
 */
export function ComingSoon({ title, subtitle, phase }: Props) {
  return (
    <div className="page">
      <PageHeader title={title} subtitle={subtitle} />
      <EmptyState
        icon={Hammer}
        title="Em construção"
        description={
          phase
            ? `Este módulo será implementado ${phase}.`
            : "Este módulo será implementado em breve."
        }
      />
    </div>
  );
}
