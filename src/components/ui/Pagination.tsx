import Link from "next/link";

type Props = {
  page: number;
  pageSize: number;
  total: number;
  /** querystring base sem `page` (ex.: "q=abc") */
  baseQuery?: string;
  pathname: string;
};

export function Pagination({ page, pageSize, total, baseQuery = "", pathname }: Props) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;

  const href = (p: number) => {
    const params = new URLSearchParams(baseQuery);
    params.set("page", String(p));
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 20px",
        borderTop: "1px solid var(--border)",
        fontSize: 13,
      }}
    >
      <span className="result-count">
        Página {page} de {totalPages} · {total} registro{total === 1 ? "" : "s"}
      </span>
      <div style={{ display: "flex", gap: 8 }}>
        {page > 1 ? (
          <Link className="btn btn-secondary btn-sm" href={href(page - 1)}>
            Anterior
          </Link>
        ) : (
          <button className="btn btn-secondary btn-sm" disabled>
            Anterior
          </button>
        )}
        {page < totalPages ? (
          <Link className="btn btn-secondary btn-sm" href={href(page + 1)}>
            Próxima
          </Link>
        ) : (
          <button className="btn btn-secondary btn-sm" disabled>
            Próxima
          </button>
        )}
      </div>
    </div>
  );
}
