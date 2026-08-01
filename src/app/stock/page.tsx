"use client";

import { useMemo, useState } from "react";
import { useDB, actions, uid } from "@/lib/store";
import { stockCostPerMeter, fmtBRL } from "@/lib/logic";
import { searchStrings, findString, materialPT } from "@/lib/twu-data";
import { Card, Btn, Field, inputCls, EmptyState, Badge, SectionTitle } from "@/components/ui";
import { Plus, X, Trash2, Star } from "lucide-react";

export default function StockPage() {
  const db = useDB();
  const [adding, setAdding] = useState(false);
  const [offerQuery, setOfferQuery] = useState("");
  const offerResults = useMemo(
    () => (offerQuery.length >= 2 ? searchStrings(offerQuery, 8) : []),
    [offerQuery]
  );
  const [form, setForm] = useState({
    stringName: "", gauge: "", kind: "Rolo" as "Rolo" | "Set", totalMeters: "200", cost: "",
  });

  const save = () => {
    if (!form.stringName.trim() || !form.cost) return;
    const total = +form.totalMeters || (form.kind === "Rolo" ? 200 : 12);
    actions.upsertStock({
      id: uid(),
      stringName: form.stringName.trim(),
      gauge: form.gauge || undefined,
      kind: form.kind,
      totalMeters: total,
      remainingMeters: total,
      cost: +form.cost,
      createdAt: new Date().toISOString(),
    });
    setForm({ stringName: "", gauge: "", kind: "Rolo", totalMeters: "200", cost: "" });
    setAdding(false);
  };

  const setsPerRoll = (m: number) => Math.floor(m / db.settings.defaultMeters);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-bold text-white">Estoque de cordas</h1>
        <Btn variant="lime" onClick={() => setAdding(!adding)}>
          {adding ? <X size={16} /> : <Plus size={16} />} {adding ? "Fechar" : "Adicionar"}
        </Btn>
      </div>

      {adding && (
        <Card className="mb-4 flex flex-col gap-3">
          <Field label="Corda (marca e modelo) *">
            <input className={inputCls} placeholder="Solinco Hyper-G" value={form.stringName}
              onChange={(e) => setForm({ ...form, stringName: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Calibre (mm)">
              <input className={inputCls} placeholder="1.25" value={form.gauge} onChange={(e) => setForm({ ...form, gauge: e.target.value })} />
            </Field>
            <Field label="Tipo">
              <select className={inputCls} value={form.kind}
                onChange={(e) => {
                  const kind = e.target.value as "Rolo" | "Set";
                  setForm({ ...form, kind, totalMeters: kind === "Rolo" ? "200" : "12" });
                }}>
                <option>Rolo</option>
                <option>Set</option>
              </select>
            </Field>
            <Field label="Metragem total (m)">
              <input className={inputCls} type="number" value={form.totalMeters} onChange={(e) => setForm({ ...form, totalMeters: e.target.value })} />
            </Field>
            <Field label="Custo pago (R$) *">
              <input className={inputCls} type="number" step="0.01" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} />
            </Field>
          </div>
          {form.cost && +form.totalMeters > 0 && (
            <p className="text-xs text-slate-400">
              Custo por set de {db.settings.defaultMeters} m:{" "}
              <b className="text-lime-300">
                {fmtBRL(stockCostPerMeter(+form.cost, +form.totalMeters) * db.settings.defaultMeters)}
              </b>
            </p>
          )}
          <Btn variant="lime" onClick={save} disabled={!form.stringName.trim() || !form.cost}>Adicionar ao estoque</Btn>
        </Card>
      )}

      {db.stock.length === 0 && !adding ? (
        <EmptyState
          title="Estoque vazio"
          subtitle="Cadastre rolos e sets: o app calcula custo por serviço, baixa os metros automaticamente e mostra sua lucratividade."
          action={<Btn variant="lime" onClick={() => setAdding(true)}>Adicionar corda</Btn>}
        />
      ) : (
        <div className="flex flex-col gap-2">
          {db.stock.map((s) => {
            const pct = s.totalMeters > 0 ? (s.remainingMeters / s.totalMeters) * 100 : 0;
            const perSet = stockCostPerMeter(s.cost, s.totalMeters) * db.settings.defaultMeters;
            return (
              <Card key={s.id} className="py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">{s.stringName} {s.gauge}</p>
                    <p className="text-xs text-slate-400">
                      {s.kind} · custo {fmtBRL(s.cost)} · {fmtBRL(perSet)}/set
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge tone={pct > 40 ? "lime" : pct > 15 ? "amber" : "red"}>
                      {s.remainingMeters.toFixed(0)} m ({setsPerRoll(s.remainingMeters)} sets)
                    </Badge>
                    <button aria-label="Excluir" onClick={() => confirm(`Remover ${s.stringName} do estoque?`) && actions.deleteStock(s.id)}
                      className="p-1 text-slate-500 hover:text-red-400">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div className={`h-full rounded-full ${pct > 40 ? "bg-lime-300" : pct > 15 ? "bg-amber-400" : "bg-red-500"}`}
                    style={{ width: `${pct}%` }} />
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <SectionTitle>Cordas que ofereço</SectionTitle>
      <Card className="flex flex-col gap-2">
        <p className="text-xs text-slate-400">
          Marque as cordas que você trabalha — elas aparecem como atalho ao registrar
          um encordoamento e com destaque na busca.
        </p>
        <input className={inputCls} placeholder="Buscar no banco TWU para marcar…"
          value={offerQuery} onChange={(e) => setOfferQuery(e.target.value)} />
        {offerResults.length > 0 && (
          <div className="flex flex-col gap-1">
            {offerResults.map((s) => {
              const offered = db.offeredStrings.includes(s.name);
              return (
                <button key={s.name} type="button"
                  onClick={() => actions.toggleOfferedString(s.name)}
                  className={`flex items-center justify-between rounded-lg border px-3 py-2 text-left active:scale-[0.99] ${
                    offered ? "border-lime-300/40 bg-lime-300/10" : "border-white/10"
                  }`}>
                  <div>
                    <p className="text-sm text-white">{s.name}</p>
                    <p className="text-[11px] text-slate-400">
                      {materialPT(s.material)}
                      {s.stiffness != null && ` · rigidez ${s.stiffness}`}
                      {s.spin != null && ` · spin ${s.spin}`}
                    </p>
                  </div>
                  <Star size={16} className={offered ? "fill-lime-300 text-lime-300" : "text-slate-600"} />
                </button>
              );
            })}
          </div>
        )}
        {db.offeredStrings.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1.5">
            {db.offeredStrings.map((name) => {
              const s = findString(name);
              return (
                <button key={name} type="button" onClick={() => actions.toggleOfferedString(name)}
                  title="Toque para desmarcar"
                  className="inline-flex items-center gap-1 rounded-full bg-lime-300/15 px-2.5 py-1 text-xs font-medium text-lime-300 active:scale-95">
                  <Star size={11} className="fill-lime-300" />
                  {name}{s?.material ? "" : ""}
                  <X size={11} className="opacity-60" />
                </button>
              );
            })}
          </div>
        )}
        {db.offeredStrings.length === 0 && offerResults.length === 0 && (
          <p className="text-center text-xs text-slate-600">Nenhuma corda marcada ainda.</p>
        )}
      </Card>

      <SectionTitle>Como funciona</SectionTitle>
      <Card className="text-xs leading-relaxed text-slate-400">
        Ao registrar um encordoamento com corda “do estoque”, o app baixa os metros usados
        e lança o custo proporcional (custo do rolo ÷ metragem × metros usados) no serviço —
        o lucro de cada serviço e do mês é calculado sozinho.
      </Card>
    </div>
  );
}
