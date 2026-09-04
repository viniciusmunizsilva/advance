import type { Tables } from "@/lib/supabase/database.types";
import { fmtDateTime } from "@/lib/format";

type Log = Pick<
  Tables<"activity_logs">,
  "id" | "summary" | "action" | "actor_name" | "created_at"
>;

export function HistoryTimeline({ logs }: { logs: Log[] }) {
  if (logs.length === 0) {
    return <p className="hint" style={{ padding: "4px 0" }}>Nenhum evento registrado.</p>;
  }
  return (
    <div className="timeline">
      {logs.map((log) => (
        <div key={log.id} className="tl-item done">
          <div className="tl-title">{log.summary || log.action}</div>
          <div className="tl-meta">
            {fmtDateTime(log.created_at)}
            {log.actor_name ? ` · ${log.actor_name}` : ""}
          </div>
        </div>
      ))}
    </div>
  );
}
