"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Package, Settings, Plus } from "lucide-react";
import { RacquetIcon } from "./icons";

const tabs = [
  { href: "/", label: "Início", icon: Home },
  { href: "/racquets", label: "Raquetes", icon: RacquetIcon },
  { href: "/jobs/new", label: "", icon: Plus, center: true },
  { href: "/players", label: "Jogadores", icon: Users },
  { href: "/stock", label: "Estoque", icon: Package },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0a1220]/90 backdrop-blur">
      <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-baseline gap-1.5">
          <span className="bg-gradient-to-r from-white via-sky-300 to-blue-500 bg-clip-text text-xl font-black italic tracking-tight text-transparent">
            STRUNG
          </span>
          <span className="text-[10px] font-medium uppercase tracking-widest text-lime-300">
            Alex Pretti Tennis
          </span>
        </Link>
        <Link href="/settings" aria-label="Configurações" className="rounded-full p-2 text-slate-400 hover:bg-white/5">
          <Settings size={18} />
        </Link>
      </div>
    </header>
  );
}

export function BottomNav() {
  const path = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#0a1220]/95 backdrop-blur pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-1.5">
        {tabs.map(({ href, label, icon: Icon, center }) => {
          const active = href === "/" ? path === "/" : path.startsWith(href);
          if (center)
            return (
              <Link key={href} href={href} aria-label="Novo encordoamento"
                className="-mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-lime-300 to-lime-400 text-[#0a1220] shadow-lg shadow-lime-900/40 active:scale-95">
                <Icon size={26} strokeWidth={2.5} />
              </Link>
            );
          return (
            <Link key={href} href={href}
              className={`flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-[10px] font-medium ${
                active ? "text-lime-300" : "text-slate-500"
              }`}>
              <Icon size={20} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
