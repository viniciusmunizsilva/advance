"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { initials } from "@/lib/format";

type Props = { userName: string; userEmail?: string };

export function UserMenu({ userName, userEmail }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        className="avatar"
        onClick={() => setOpen((v) => !v)}
        aria-label="Menu do usuário"
        aria-haspopup="menu"
        aria-expanded={open}
        style={{ border: "none" }}
      >
        {initials(userName)}
      </button>

      {open && (
        <div
          role="menu"
          className="card"
          style={{
            position: "absolute",
            right: 0,
            top: "calc(100% + 8px)",
            width: 220,
            boxShadow: "var(--shadow-lg)",
            zIndex: 50,
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--border)" }}>
            <div style={{ fontWeight: 600, fontSize: 13.5 }}>{userName}</div>
            {userEmail && (
              <div className="hint" style={{ marginTop: 2, wordBreak: "break-all" }}>
                {userEmail}
              </div>
            )}
          </div>
          <button
            role="menuitem"
            onClick={signOut}
            className="sb-item"
            style={{ borderRadius: 0, padding: "11px 14px", color: "var(--error)" }}
          >
            <LogOut aria-hidden />
            <span>Sair</span>
          </button>
        </div>
      )}
    </div>
  );
}
