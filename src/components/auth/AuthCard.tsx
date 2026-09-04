import Image from "next/image";

type Props = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

/** Casca visual centralizada para as telas de autenticação. */
export function AuthCard({ title, subtitle, children, footer }: Props) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: "var(--bg)",
      }}
    >
      <div className="card" style={{ width: 400, maxWidth: "100%" }}>
        <div style={{ padding: "32px 32px 8px", textAlign: "center" }}>
          <Image
            src="/brand/logo-advance-blue.png"
            alt="Advance Tecnologia"
            width={168}
            height={28}
            style={{ height: 28, width: "auto", margin: "0 auto 20px" }}
            priority
          />
          <h1 style={{ fontSize: 20, fontWeight: 600, margin: "0 0 4px" }}>
            {title}
          </h1>
          {subtitle && (
            <p className="hint" style={{ margin: 0 }}>
              {subtitle}
            </p>
          )}
        </div>
        <div style={{ padding: "20px 32px 28px" }}>{children}</div>
        {footer && (
          <div
            style={{
              padding: "14px 32px",
              borderTop: "1px solid var(--border)",
              textAlign: "center",
              fontSize: 13,
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
