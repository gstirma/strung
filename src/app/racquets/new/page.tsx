"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useDB, actions, uid } from "@/lib/store";
import { Card, Field, inputCls, Btn } from "@/components/ui";

function NewRacquetForm() {
  const db = useDB();
  const router = useRouter();
  const params = useSearchParams();
  const [form, setForm] = useState({
    playerId: params.get("player") ?? "",
    brand: "", model: "", headSize: "", weight: "", pattern: "", gripSize: "", notes: "",
  });
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const save = () => {
    if (!form.brand || !form.model || !form.playerId) return;
    const id = uid();
    actions.upsertRacquet({
      id,
      playerId: form.playerId,
      brand: form.brand.trim(),
      model: form.model.trim(),
      headSize: form.headSize ? +form.headSize : undefined,
      weight: form.weight ? +form.weight : undefined,
      pattern: form.pattern || undefined,
      gripSize: form.gripSize || undefined,
      notes: form.notes || undefined,
      createdAt: new Date().toISOString(),
    });
    router.push(`/racquets/${id}`);
  };

  return (
    <div>
      <h1 className="mb-4 text-lg font-bold text-white">Nova raquete</h1>
      <Card className="flex flex-col gap-3">
        <Field label="Jogador *">
          <select className={inputCls} value={form.playerId} onChange={(e) => set("playerId", e.target.value)}>
            <option value="">Selecione…</option>
            {db.players.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          {db.players.length === 0 && (
            <span className="mt-1 block text-xs text-amber-300">
              Nenhum jogador cadastrado — <Link href="/players" className="underline">cadastre primeiro</Link>.
            </span>
          )}
        </Field>
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
        <Btn variant="lime" onClick={save} disabled={!form.brand || !form.model || !form.playerId}>
          Salvar raquete
        </Btn>
      </Card>
    </div>
  );
}

export default function NewRacquetPage() {
  return <Suspense><NewRacquetForm /></Suspense>;
}
