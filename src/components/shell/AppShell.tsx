"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { ToastProvider } from "@/components/ui/toast";

type Props = {
  children: React.ReactNode;
  userName?: string;
  userEmail?: string;
  counts?: Record<string, number>;
};

/**
 * Casca da aplicação (sidebar + topbar + área de conteúdo com grade técnica).
 * Gerencia o estado off-canvas da sidebar no mobile.
 * A busca global (⌘K) será plugada em fase posterior.
 */
export function AppShell({ children, userName, userEmail, counts }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <ToastProvider>
      <div className="app">
        <Sidebar
          open={menuOpen}
          onNavigate={() => setMenuOpen(false)}
          counts={counts}
        />
        <div
          className={`scrim${menuOpen ? " open" : ""}`}
          onClick={() => setMenuOpen(false)}
          aria-hidden
        />
        <div className="main">
          <Topbar
            onMenu={() => setMenuOpen(true)}
            onSearch={() => {
              /* ⌘K — fase posterior */
            }}
            userName={userName}
            userEmail={userEmail}
          />
          <div className="page-scroll">{children}</div>
        </div>
      </div>
    </ToastProvider>
  );
}
