"use client";

import { useState } from "react";
import Link from "next/link";
import { useDB, actions, uid } from "@/lib/store";
import { Level, CourtType } from "@/lib/types";
import { Card, Btn, Field, inputCls, EmptyState, Badge } from "@/components/ui";
import { Plus, X } from "lucide-react";
import { routes } from "@/lib/routes";

const LEVELS: Level[] = ["Iniciante", "Intermediário", "Avançado", "Competitivo", "Profissional"];
const COURTS: CourtType[] = ["Saibro", "Rápida", "Grama", "Variada"];

export default function PlayersPage() {
  const db = useDB();
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({
    name: "", phone: "", level: "Intermediário" as Level, style: "",
    hoursPerWeek: "", court: "Variada" as CourtType, ball: "",
  });

  const save = () => {
    if (!form.name.trim()) return;
    actions.upsertPlayer({
      id: uid(),
      name: form.name.trim(),
      phone: form.phone || undefined,
      level: form.level,
      style: form.style || undefined,
      hoursPerWeek: form.hoursPerWeek ? +form.hoursPerWeek : undefined,
      court: form.court,
      ball: form.ball || undefined,
      createdAt: new Date().toISOString(),
    });
    setForm({ name: "", phone: "", level: "Intermediário", style: "", hoursPerWeek: "", court: "Variada", ball: "" });
    setAdding(false);
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-bold text-white">Jogadores</h1>
        <Btn variant="lime" onClick={() => setAdding(!adding)}>
          {adding ? <X size={16} /> : <Plus size={16} />} {adding ? "Fechar" : "Novo"}
        </Btn>
      </div>

      {adding && (
        <Card className="mb-4 flex flex-col gap-3">
          <Field label="Nome *">
            <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Telefone / WhatsApp">
              <input className={inputCls} placeholder="47 9…" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </Field>
            <Field label="Nível">
              <select className={inputCls} value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value as Level })}>
                {LEVELS.map((l) => <option key={l}>{l}</option>)}
              </select>
            </Field>
            <Field label="Horas de jogo/semana">
              <input className={inputCls} type="number" value={form.hoursPerWeek} onChange={(e) => setForm({ ...form, hoursPerWeek: e.target.value })} />
            </Field>
            <Field label="Quadra habitual">
              <select className={inputCls} value={form.court} onChange={(e) => setForm({ ...form, court: e.target.value as CourtType })}>
                {COURTS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Estilo de jogo">
              <input className={inputCls} placeholder="Fundo de quadra…" value={form.style} onChange={(e) => setForm({ ...form, style: e.target.value })} />
            </Field>
            <Field label="Bola habitual">
              <input className={inputCls} placeholder="Wilson US Open" value={form.ball} onChange={(e) => setForm({ ...form, ball: e.target.value })} />
            </Field>
          </div>
          <Btn variant="lime" onClick={save} disabled={!form.name.trim()}>Salvar jogador</Btn>
        </Card>
      )}

      {db.players.length === 0 && !adding ? (
        <EmptyState
          title="Nenhum jogador ainda"
          subtitle="O perfil do jogador (nível, estilo, frequência) alimenta os alertas de troca e a sugestão de tensão."
          action={<Btn variant="lime" onClick={() => setAdding(true)}>Cadastrar jogador</Btn>}
        />
      ) : (
        <div className="flex flex-col gap-2">
          {db.players.map((p) => {
            const racquets = db.racquets.filter((r) => r.playerId === p.id && !r.archived);
            return (
              <Link key={p.id} href={routes.player(p.id)}>
                <Card className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-semibold text-white">{p.name}</p>
                    <p className="text-xs text-slate-400">
                      {p.level}{p.hoursPerWeek ? ` · ${p.hoursPerWeek} h/sem` : ""}{p.court ? ` · ${p.court}` : ""}
                    </p>
                  </div>
                  <Badge tone="sky">{racquets.length} raquete{racquets.length !== 1 ? "s" : ""}</Badge>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
