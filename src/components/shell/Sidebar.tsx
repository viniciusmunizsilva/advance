"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "@/lib/nav";

type Props = {
  open: boolean;
  onNavigate: () => void;
  counts?: Record<string, number>;
};

export function Sidebar({ open, onNavigate, counts }: Props) {
  const pathname = usePathname();

  return (
    <aside className={`sidebar${open ? " open" : ""}`}>
      <div className="sb-brand">
        <Image
          src="/brand/logo-advance-blue.png"
          alt="Advance Tecnologia"
          width={132}
          height={22}
          priority
        />
      </div>

      <nav className="sb-nav">
        {NAV.map((group, gi) => (
          <div className="sb-group" key={gi}>
            {group.label && <div className="sb-label">{group.label}</div>}
            {group.items.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(item.href + "/");
              const Icon = item.icon;
              const count = item.countKey ? counts?.[item.countKey] : undefined;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`sb-item${active ? " active" : ""}`}
                  onClick={onNavigate}
                >
                  <Icon aria-hidden />
                  <span>{item.label}</span>
                  {count != null && count > 0 && (
                    <span className="count">{count}</span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="sb-foot">Sistema interno · v1.0</div>
    </aside>
  );
}
