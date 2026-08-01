"use client";

import { useMemo, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDB, actions, uid } from "@/lib/store";
import { suggestNextTension, stockCostPerMeter, fmtBRL, otherUnit } from "@/lib/logic";
import { TwuString } from "@/lib/twu-data";
import { estimateMeters } from "@/lib/racquets-data";
import { StringPicker } from "@/components/string-picker";
import { StringProfileBars } from "@/components/charts";
import { Card, Field, inputCls, Btn } from "@/components/ui";
import { Sparkles } from "lucide-react";

function NewJobForm() {
  const db = useDB();
  const router = useRouter();
  const params = useSearchParams();
  const unit = db.settings.tensionUnit;

  const [racquetId, setRacquetId] = useState(params.get("racquet") ?? "");
  const suggestion = useMemo(
    () => (racquetId ? suggestNextTension(db, racquetId, unit) : null),
    [db, racquetId, unit]
  );

  const [stringMode, setStringMode] = useState<"stock" | "catalog" | "manual">("stock");
  const [stockItemId, setStockItemId] = useState("");
  const [selCatalog, setSelCatalog] = useState<TwuString | null>(null);
  const [manualString, setManualString] = useState("");
  const [gauge, setGauge] = useState("");
  const [tensionMain, setTensionMain] = useState("");
  const [tensionCross, setTensionCross] = useState("");
  const [meters, setMeters] = useState(String(db.settings.defaultMeters));
  const [stringCost, setStringCost] = useState("");
  const [labor, setLabor] = useState(String(db.settings.defaultLabor));
  const [total, setTotal] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const stock = db.stock.filter((s) => s.remainingMeters > 0);
  const selStock = stock.find((s) => s.id === stockItemId);
  const racquet = db.racquets.find((r) => r.id === racquetId);

  // custo automático quando sai do estoque
  const autoCost = selStock
    ? stockCostPerMeter(selStock.cost, selStock.totalMeters) * (+meters || 0)
    : undefined;

  const stringName =
    stringMode === "stock" ? selStock ? `${selStock.stringName}` : ""
    : stringMode === "catalog" ? selCatalog ? selCatalog.name : ""
    : manualString;

  const effGauge = stringMode === "stock" ? selStock?.gauge ?? gauge
    : stringMode === "catalog" ? selCatalog?.gauge ?? gauge : gauge;

  const effCost = stringCost !== "" ? +stringCost : autoCost;
  const totalNum = total !== "" ? +total : (effCost ?? 0) + (+labor || 0);
  const profit = totalNum - (effCost ?? 0);

  const save = () => {
    if (!racquetId || !stringName || !tensionMain) return;
    const id = uid();
    actions.upsertJob({
      id,
      racquetId,
      date: new Date(date + "T12:00:00").toISOString(),
      stringName,
      gauge: effGauge || undefined,
      tensionMain: +tensionMain,
      tensionCross: tensionCross ? +tensionCross : undefined,
      metersUsed: +meters || undefined,
      stockItemId: stringMode === "stock" ? stockItemId || undefined : undefined,
      stringCost: effCost != null ? +effCost.toFixed(2) : undefined,
      laborPrice: +labor || undefined,
      totalCharged: totalNum || undefined,
      notes: notes || undefined,
    });
    router.push(`/jobs/${id}`);
  };

  return (
    <div>
      <h1 className="mb-4 text-lg font-bold text-white">Novo encordoamento</h1>
      <div className="flex flex-col gap-3">
        <Card className="flex flex-col gap-3">
          <Field label="Raquete *">
            <select className={inputCls} value={racquetId}
              onChange={(e) => {
                setRacquetId(e.target.value);
                const r = db.racquets.find((x) => x.id === e.target.value);
                if (r?.headSize) setMeters(String(estimateMeters(r.headSize)));
              }}>
              <option value="">Selecione…</option>
              {db.racquets.filter((r) => !r.archived).map((r) => {
                const p = db.players.find((x) => x.id === r.playerId);
                return <option key={r.id} value={r.id}>{r.brand} {r.model} — {p?.name ?? "?"}</option>;
              })}
            </select>
            {racquet?.headSize && (
              <span className="mt-1 block text-xs text-slate-500">
                {racquet.headSize} pol² · sugestão de {estimateMeters(racquet.headSize)} m de corda
              </span>
            )}
          </Field>

          {suggestion && (
            <button type="button"
              onClick={() => { setTensionMain(String(suggestion.tension)); setTensionCross(String(suggestion.cross ?? suggestion.tension)); }}
              className="flex items-center gap-2 rounded-xl border border-lime-300/30 bg-lime-300/10 px-3 py-2 text-left text-xs text-lime-200 active:scale-[0.99]">
              <Sparkles size={14} className="shrink-0 text-lime-300" />
              Sugestão: {suggestion.tension} {unit} — toque para aplicar
            </button>
          )}
        </Card>

        <Card className="flex flex-col gap-3">
          <div className="flex gap-1 rounded-xl bg-white/5 p-1">
            {([["stock", "Do estoque"], ["catalog", "Catálogo"], ["manual", "Manual"]] as const).map(([k, label]) => (
              <button key={k} type="button" onClick={() => setStringMode(k)}
                className={`flex-1 rounded-lg py-1.5 text-xs font-semibold ${stringMode === k ? "bg-sky-500 text-white" : "text-slate-400"}`}>
                {label}
              </button>
            ))}
          </div>

          {stringMode === "stock" && (
            <Field label="Item do estoque" hint={stock.length === 0 ? "Estoque vazio — use catálogo ou manual." : undefined}>
              <select className={inputCls} value={stockItemId} onChange={(e) => setStockItemId(e.target.value)}>
                <option value="">Selecione…</option>
                {stock.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.stringName} {s.gauge} — restam {s.remainingMeters.toFixed(0)} m
                  </option>
                ))}
              </select>
            </Field>
          )}
          {stringMode === "catalog" && (
            <div>
              <StringPicker
                value={selCatalog?.name}
                offered={db.offeredStrings}
                placeholder="Ex.: Hyper-G, RPM Blast, Alu Power…"
                onSelect={(s) => { setSelCatalog(s); if (s.gauge) setGauge(s.gauge); }}
                onManual={(name) => {
                  setSelCatalog(null);
                  if (name) { setStringMode("manual"); setManualString(name); }
                }}
              />
              {selCatalog && (
                <div className="mt-3 rounded-xl border border-white/10 p-3">
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-sky-300">
                    Perfil da corda
                  </p>
                  <StringProfileBars string={selCatalog} />
                </div>
              )}
            </div>
          )}
          {stringMode === "manual" && (
            <Field label="Nome da corda">
              <input className={inputCls} placeholder="Marca e modelo" value={manualString} onChange={(e) => setManualString(e.target.value)} />
            </Field>
          )}

          <div className="grid grid-cols-2 gap-3">
            {stringMode !== "stock" && (
              <Field label="Calibre (mm)">
                <input className={inputCls} placeholder="1.25" value={gauge} onChange={(e) => setGauge(e.target.value)} />
              </Field>
            )}
            <Field label="Metros usados">
              <input className={inputCls} type="number" value={meters} onChange={(e) => setMeters(e.target.value)} />
            </Field>
            <Field label={`Tensão principal (${unit}) *`}
              hint={tensionMain ? otherUnit(+tensionMain, unit) : undefined}>
              <input className={inputCls} type="number" step="0.5" placeholder={unit === "kg" ? "23" : "52"} value={tensionMain} onChange={(e) => setTensionMain(e.target.value)} />
            </Field>
            <Field label={`Tensão travessa (${unit})`}>
              <input className={inputCls} type="number" step="0.5" value={tensionCross} onChange={(e) => setTensionCross(e.target.value)} />
            </Field>
          </div>
        </Card>

        <Card className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Custo da corda (R$)" hint={autoCost != null ? `auto: ${fmtBRL(autoCost)} (estoque)` : undefined}>
              <input className={inputCls} type="number" step="0.01" placeholder={autoCost != null ? autoCost.toFixed(2) : "0,00"} value={stringCost} onChange={(e) => setStringCost(e.target.value)} />
            </Field>
            <Field label="Mão de obra (R$)">
              <input className={inputCls} type="number" step="0.01" value={labor} onChange={(e) => setLabor(e.target.value)} />
            </Field>
            <Field label="Total cobrado (R$)" hint={total === "" ? `auto: ${fmtBRL(totalNum)}` : undefined}>
              <input className={inputCls} type="number" step="0.01" placeholder={totalNum.toFixed(2)} value={total} onChange={(e) => setTotal(e.target.value)} />
            </Field>
            <Field label="Data">
              <input className={inputCls} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </Field>
          </div>
          <p className="text-xs text-slate-400">
            Lucro estimado do serviço: <b className="text-lime-300">{fmtBRL(profit)}</b>
          </p>
          <Field label="Observações">
            <textarea className={inputCls} rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </Field>
        </Card>

        <Btn variant="lime" onClick={save} disabled={!racquetId || !stringName || !tensionMain} className="w-full">
          Registrar encordoamento
        </Btn>
      </div>
    </div>
  );
}

export default function NewJobPage() {
  return <Suspense><NewJobForm /></Suspense>;
}
