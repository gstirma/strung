"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDB, actions } from "@/lib/store";
import { lastJobOfRacquet, fmtDate, fmtBRL } from "@/lib/logic";
import { Card, SectionTitle, Btn, Badge, EmptyState } from "@/components/ui";
import { Plus, Trash2, MessageCircle } from "lucide-react";

export default function PlayerDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const db = useDB();
  const router = useRouter();

  const player = db.players.find((p) => p.id === id);
  if (!player) return <p className="py-10 text-center text-sm text-slate-400">Jogador não encontrado.</p>;

  const racquets = db.racquets.filter((r) => r.playerId === player.id && !r.archived);
  const jobs = db.jobs.filter((j) => racquets.some((r) => r.id === j.racquetId));
  const totalSpent = jobs.reduce((s, j) => s + (j.totalCharged ?? 0), 0);
  const wa = player.phone?.replace(/\D/g, "");

  return (
    <div>
      <Card className="bg-gradient-to-br from-[#12233f] to-[#101b2e]">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-lime-300">Perfil do jogador</p>
        <h1 className="mt-1 text-xl font-bold text-white">{player.name}</h1>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <Badge tone="sky">{player.level}</Badge>
          {player.hoursPerWeek && <Badge>{player.hoursPerWeek} h/semana</Badge>}
          {player.court && <Badge>{player.court}</Badge>}
          {player.style && <Badge>{player.style}</Badge>}
          {player.ball && <Badge>🎾 {player.ball}</Badge>}
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
          <span>{jobs.length} serviço(s) · total {fmtBRL(totalSpent)}</span>
          {wa && (
            <a href={`https://wa.me/55${wa}`} target="_blank" rel="noreferrer"
              className="flex items-center gap-1 text-lime-300">
              <MessageCircle size={14} /> WhatsApp
            </a>
          )}
        </div>
      </Card>

      <SectionTitle action={
        <Link href={`/racquets/new?player=${player.id}`} className="flex items-center gap-1 text-xs text-lime-300">
          <Plus size={12} /> adicionar
        </Link>
      }>
        Raquetes
      </SectionTitle>

      {racquets.length === 0 ? (
        <EmptyState title="Sem raquetes" action={<Btn href={`/racquets/new?player=${player.id}`} variant="lime">Cadastrar raquete</Btn>} />
      ) : (
        <div className="flex flex-col gap-2">
          {racquets.map((r) => {
            const last = lastJobOfRacquet(db, r.id);
            return (
              <Link key={r.id} href={`/racquets/${r.id}`}>
                <Card className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-semibold text-white">{r.brand} {r.model}</p>
                    <p className="text-xs text-slate-400">
                      {last ? `${last.stringName} · ${last.tensionMain} ${db.settings.tensionUnit} · ${fmtDate(last.date)}` : "sem histórico"}
                    </p>
                  </div>
                  <span className="text-lime-300">›</span>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      <div className="mt-8 flex justify-center">
        <Btn variant="danger" onClick={() => {
          if (confirm(`Excluir ${player.name}, suas raquetes e todo o histórico?`)) {
            actions.deletePlayer(player.id);
            router.push("/players");
          }
        }}>
          <Trash2 size={14} /> Excluir jogador
        </Btn>
      </div>
    </div>
  );
}
