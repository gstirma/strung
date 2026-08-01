"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { RACQUETS, RACQUET_BRANDS, searchRacquets, racquetHeadline, RacquetSpec } from "@/lib/racquets-data";
import { inputCls } from "./ui";

/**
 * Busca nas ~1.380 raquetes do banco da TWU. Filtra por marca e por texto,
 * e permite cadastro manual para modelos fora do catálogo.
 */
export function RacquetPicker({
  onSelect, onManual,
}: {
  onSelect: (r: RacquetSpec) => void;
  onManual?: () => void;
}) {
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("");

  const results = useMemo(() => {
    if (!brand && query.length < 2) return [];
    return searchRacquets(query, 40, brand || undefined);
  }, [query, brand]);

  const countLabel = brand
    ? `${RACQUETS.filter((r) => r.brand === brand).length} modelos de ${brand}`
    : `${RACQUETS.length} raquetes no catálogo`;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <div className="w-28 shrink-0">
          <select className={inputCls} value={brand} onChange={(e) => setBrand(e.target.value)}>
            <option value="">Marca</option>
            {RACQUET_BRANDS.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div className="relative min-w-0 flex-1">
          <Search size={15} className="pointer-events-none absolute left-3 top-3.5 text-slate-500" />
          <input className={`${inputCls} pl-9`} placeholder="Ex.: Pure Aero…"
            value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      </div>
      <p className="text-[11px] text-slate-500">{countLabel}</p>

      {results.length > 0 && (
        <div className="flex max-h-80 flex-col gap-1 overflow-y-auto">
          {results.map((r) => (
            <button key={r.code} type="button" onClick={() => onSelect(r)}
              className="rounded-lg border border-white/10 px-3 py-2 text-left active:scale-[0.99]">
              <p className="text-sm text-white">{r.brand} {r.model}</p>
              <p className="text-[11px] text-slate-400">{racquetHeadline(r)}</p>
            </button>
          ))}
        </div>
      )}

      {(brand || query.length >= 2) && results.length === 0 && (
        <p className="py-2 text-center text-xs text-slate-500">Nenhuma raquete encontrada.</p>
      )}

      {onManual && (
        <button type="button" onClick={onManual}
          className="rounded-lg border border-dashed border-white/20 px-3 py-2 text-center text-xs text-slate-400 active:scale-[0.99]">
          Não achei — cadastrar manualmente
        </button>
      )}
    </div>
  );
}

export function RacquetSpecChips({ r }: { r: RacquetSpec }) {
  const chips: string[] = [];
  if (r.headSize) chips.push(`${r.headSize} pol²`);
  if (r.weight) chips.push(`${r.weight} g`);
  if (r.balance) chips.push(`balanço ${r.balance} cm`);
  if (r.swingweight) chips.push(`SW ${r.swingweight}`);
  if (r.flex) chips.push(`flex ${r.flex}`);
  if (r.length && r.length !== 27) chips.push(`${r.length}"`);
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {chips.map((c) => (
        <span key={c} className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-slate-300">{c}</span>
      ))}
    </div>
  );
}

export { X };
