"use client";

import { Menu, Search, Plus } from "lucide-react";
import Link from "next/link";
import { UserMenu } from "./UserMenu";

type Props = {
  onMenu: () => void;
  onSearch: () => void;
  userName?: string;
  userEmail?: string;
};

export function Topbar({ onMenu, onSearch, userName = "Advance", userEmail }: Props) {
  return (
    <header className="topbar">
      <button
        className="btn btn-icon menu-btn"
        onClick={onMenu}
        aria-label="Abrir menu"
      >
        <Menu aria-hidden />
      </button>

      <button className="search-trigger" onClick={onSearch} aria-label="Buscar">
        <Search aria-hidden />
        <span>Buscar clientes, moldes, orçamentos…</span>
        <span className="kbd">⌘K</span>
      </button>

      <div className="topbar-right">
        <Link href="/orcamentos/novo" className="btn btn-primary btn-sm topbar-new-quote">
          <Plus aria-hidden />
          <span>Novo orçamento</span>
        </Link>
        <UserMenu userName={userName} userEmail={userEmail} />
      </div>
    </header>
  );
}
