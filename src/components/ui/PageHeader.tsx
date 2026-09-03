import Link from "next/link";
import { ChevronRight } from "lucide-react";

type Crumb = { label: string; href?: string };

type Props = {
  title: string;
  subtitle?: string;
  breadcrumb?: Crumb[];
  actions?: React.ReactNode;
};

export function PageHeader({ title, subtitle, breadcrumb, actions }: Props) {
  return (
    <div className="page-head">
      <div className="ph-text">
        {breadcrumb && breadcrumb.length > 0 && (
          <div className="breadcrumb">
            {breadcrumb.map((c, i) => (
              <span
                key={i}
                style={{ display: "inline-flex", alignItems: "center", gap: 7 }}
              >
                {i > 0 && <ChevronRight aria-hidden />}
                {c.href ? <Link href={c.href}>{c.label}</Link> : <span>{c.label}</span>}
              </span>
            ))}
          </div>
        )}
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-sub">{subtitle}</p>}
      </div>
      {actions && <div className="ph-actions">{actions}</div>}
    </div>
  );
}
