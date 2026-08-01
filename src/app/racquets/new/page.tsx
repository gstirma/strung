"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useDB, actions, uid } from "@/lib/store";
import { RacquetSpec } from "@/lib/racquets-data";
import { RacquetPicker, RacquetSpecChips } from "@/components/racquet-picker";
import { Card, Field, inputCls, Btn, SectionTitle } from "@/components/ui";
import { X } from "lucide-react";

function NewRacquetForm() {
  const db = useDB();
  const router = useRouter();
  const params = useSearchParams();

  const [playerId, setPlayerId] = useState(params.get("player") ?? "");
  const [picked, setPicked] = useState<RacquetSpec | null>(null);
  const [manual, setManual] = useState(false);
  const [form, setForm] = useState({
    brand: "", model: "", headSize: "", weight: "", pattern: "", gripSize: "", notes: "",
  });
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const choose = (r: RacquetSpec) => {
    setPicked(r);
    setManual(false);
    setForm((f) => ({
      ...f,
      brand: r.brand,
      model: r.model,
      headSize: r.headSize ? String(r.headSize) : "",
      weight: r.weight ? String(r.weight) : "",
    }));
  };

  const clear = () => {
    setPicked(null);
    setManual(false);
    setForm({ brand: "", model: "", headSize: "", weight: "", pattern: "", gripSize: "", notes: "" });
  };

  const ready = !!playerId && !!form.brand.trim() && !!form.model.trim();

  const save = () => {
    if (!ready) return;
    const id = uid();
    actions.upsertRacquet({
      id,
      playerId,
      brand: form.brand.trim(),
      model: form.model.trim(),
      headSize: form.headSize ? +form.headSize : undefined,
      weight: form.weight ? +form.weight : undefined,
      pattern: form.pattern || undefined,
      gripSize: form.gripSize || undefined,
      notes: form.notes || undefined,
      specCode: picked?.code,
      balance: picked?.balance,
      swingweight: picked?.swingweight,
      flex: picked?.flex,
      createdAt: new Date().toISOString(),
    });
    router.push(`/racquets/${id}`);
  };

  return (
    <div>
      <h1 className="mb-4 text-lg font-bold text-white">Nova raquete</h1>

      <Card className="flex flex-col gap-3">
        <Field label="Jogador *">
          <select className={inputCls} value={playerId} onChange={(e) => setPlayerId(e.target.value)}>
            <option value="">Selecione…</option>
            {db.players.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          {db.players.length === 0 && (
            <span className="mt-1 block text-xs text-amber-300">
              Nenhum jogador cadastrado — <Link href="/players" className="underline">cadastre primeiro</Link>.
            </span>
          )}
        </Field>
      </Card>

      <SectionTitle>Raquete</SectionTitle>

      {picked || manual ? (
        <Card className="flex flex-col gap-3">
          <div className="flex items-start justify-between">
            <div className="min-w-0">
              {picked ? (
                <>
                  <p className="text-base font-bold text-white">{picked.brand} {picked.model}</p>
                  <p className="text-xs text-lime-300">specs do catálogo TWU</p>
                  <RacquetSpecChips r={picked} />
                </>
              ) : (
                <p className="text-sm font-semibold text-white">Cadastro manual</p>
              )}
            </div>
            <button type="button" onClick={clear} aria-label="Trocar raquete"
              className="shrink-0 p-1 text-slate-400 hover:text-white">
              <X size={18} />
            </button>
          </div>

          {manual && (
            <div className="grid grid-cols-2 gap-3">
              <Field label="Marca *">
                <input className={inputCls} placeholder="Babolat" value={form.brand} onChange={(e) => set("brand", e.target.value)} />
              </Field>
              <Field label="Modelo *">
                <input className={inputCls} placeholder="Pure Aero 98" value={form.model} onChange={(e) => set("model", e.target.value)} />
              </Field>
              <Field label="Cabeça (pol²)">
                <input className={inputCls} type="number" placeholder="98" value={form.headSize} onChange={(e) => set("headSize", e.target.value)} />
              </Field>
              <Field label="Peso (g)">
                <input className={inputCls} type="number" placeholder="305" value={form.weight} onChange={(e) => set("weight", e.target.value)} />
              </Field>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Field label="Padrão de cordas">
              <input className={inputCls} placeholder="16x19" value={form.pattern} onChange={(e) => set("pattern", e.target.value)} />
            </Field>
            <Field label="Empunhadura">
              <input className={inputCls} placeholder="L3" value={form.gripSize} onChange={(e) => set("gripSize", e.target.value)} />
            </Field>
          </div>
          <Field label="Observações">
            <textarea className={inputCls} rows={2} value={form.notes} onChange={(e) => set("notes", e.target.value)} />
          </Field>

          <Btn variant="lime" onClick={save} disabled={!ready}>Salvar raquete</Btn>
        </Card>
      ) : (
        <Card>
          <RacquetPicker onSelect={choose} onManual={() => setManual(true)} />
        </Card>
      )}
    </div>
  );
}

export default function NewRacquetPage() {
  return <Suspense><NewRacquetForm /></Suspense>;
}
