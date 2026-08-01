"use client";

import { useMemo, useState } from "react";
import { Star, X, Search } from "lucide-react";
import { searchStrings, materialPT, stringHeadline, TwuString } from "@/lib/twu-data";
import { inputCls } from "./ui";

/**
 * Busca no banco TWU. Mostra primeiro as cordas que o encordoador oferece,
 * e cai para entrada manual quando a corda não está no catálogo.
 */
export function StringPicker({
  value, onSelect, onManual, offered = [], placeholder = "Buscar corda…", autoFocus,
}: {
  value?: string;
  onSelect: (s: TwuString) => void;
  onManual?: (name: string) => void;
  offered?: string[];
  placeholder?: string;
  autoFocus?: boolean;
}) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => (query.length >= 2 ? searchStrings(query, 12) : []), [query]);

  const offeredMatches = useMemo(() => {
    if (query.length < 2) return [];
    const q = query.toLowerCase();
    return offered.filter((n) => n.toLowerCase().includes(q));
  }, [offered, query]);

  const ordered = useMemo(() => {
    const off = new Set(offered.map((n) => n.toLowerCase()));
    return [...results].sort((a, b) => {
      const ao = off.has(a.name.toLowerCase()) ? 0 : 1;
      const bo = off.has(b.name.toLowerCase()) ? 0 : 1;
      return ao - bo;
    });
  }, [results, offered]);

  if (value) {
    return (
      <div className="flex items-center justify-between rounded-xl border border-lime-300/40 bg-lime-300/10 px-3 py-2.5">
        <span className="text-sm font-semibold text-white">{value}</span>
        <button type="button" aria-label="Trocar corda"
          onClick={() => { setQuery(""); onManual?.(""); }}
          className="p-1 text-slate-400 hover:text-white">
          <X size={16} />
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="relative">
        <Search size={15} className="pointer-events-none absolute left-3 top-3.5 text-slate-500" />
        <input className={`${inputCls} pl-9`} placeholder={placeholder} value={query} autoFocus={autoFocus}
          onChange={(e) => setQuery(e.target.value)} />
      </div>

      {query.length >= 2 && (
        <div className="mt-2 flex max-h-72 flex-col gap-1 overflow-y-auto">
          {ordered.map((s) => {
            const isOffered = offered.some((n) => n.toLowerCase() === s.name.toLowerCase());
            return (
              <button key={s.name} type="button" onClick={() => onSelect(s)}
                className={`flex items-center justify-between rounded-lg border px-3 py-2 text-left active:scale-[0.99] ${
                  isOffered ? "border-lime-300/40 bg-lime-300/10" : "border-white/10"
                }`}>
                <span className="min-w-0">
                  <p className="truncate text-sm text-white">{s.name}</p>
                  <p className="truncate text-[11px] text-slate-400">{stringHeadline(s)}</p>
                </span>
                {isOffered && <Star size={14} className="ml-2 shrink-0 fill-lime-300 text-lime-300" />}
              </button>
            );
          })}

          {ordered.length === 0 && (
            <p className="py-2 text-center text-xs text-slate-500">
              Nenhuma corda encontrada no banco TWU.
            </p>
          )}

          {onManual && (
            <button type="button" onClick={() => onManual(query.trim())}
              className="rounded-lg border border-dashed border-white/20 px-3 py-2 text-center text-xs text-slate-400 active:scale-[0.99]">
              Usar “<span className="text-slate-200">{query.trim()}</span>” como nome manual
            </button>
          )}
        </div>
      )}

      {query.length > 0 && query.length < 2 && (
        <p className="mt-2 text-center text-xs text-slate-600">Digite ao menos 2 letras…</p>
      )}

      {query.length === 0 && offeredMatches.length === 0 && offered.length > 0 && (
        <div className="mt-2">
          <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-slate-400">
            Cordas que ofereço
          </p>
          <div className="flex flex-wrap gap-1.5">
            {offered.map((n) => (
              <button key={n} type="button" onClick={() => setQuery(n)}
                className="inline-flex items-center gap-1 rounded-full bg-lime-300/15 px-2.5 py-1 text-xs font-medium text-lime-300 active:scale-95">
                <Star size={11} className="fill-lime-300" />
                {n}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function StringSpecLine({ s }: { s: TwuString }) {
  return (
    <p className="text-xs text-slate-400">
      {materialPT(s.material)}
      {s.gauge && ` · ${s.gauge} mm`}
      {s.stiffness != null && ` · rigidez ${s.stiffness}`}
      {s.spin != null && ` · spin ${s.spin}`}
    </p>
  );
}
