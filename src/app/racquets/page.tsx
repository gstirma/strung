"use client";

import { useDB } from "@/lib/store";
import { lastJobOfRacquet, fmtDate } from "@/lib/logic";
import { Card, Btn, EmptyState, Badge } from "@/components/ui";
import Link from "next/link";
import { Plus } from "lucide-react";
import { routes } from "@/lib/routes";

export default function RacquetsPage() {
  const db = useDB();
  const racquets = db.racquets.filter((r) => !r.archived);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-bold text-white">Raquetes</h1>
        <Btn href="/racquets/new" variant="lime"><Plus size={16} /> Nova</Btn>
      </div>

      {racquets.length === 0 ? (
        <EmptyState
          title="Nenhuma raquete cadastrada"
          subtitle="Cada raquete ganha um prontuário completo: cordas, tensões, avaliações e QR Code."
          action={<Btn href="/racquets/new" variant="lime">Cadastrar raquete</Btn>}
        />
      ) : (
        <div className="flex flex-col gap-2">
          {racquets.map((r) => {
            const player = db.players.find((p) => p.id === r.playerId);
            const last = lastJobOfRacquet(db, r.id);
            return (
              <Link key={r.id} href={routes.racquet(r.id)}>
                <Card className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-semibold text-white">{r.brand} {r.model}</p>
                    <p className="text-xs text-slate-400">
                      {player?.name ?? "sem jogador"}
                      {r.pattern && ` · ${r.pattern}`}
                      {r.headSize && ` · ${r.headSize} pol²`}
                    </p>
                  </div>
                  <div className="text-right">
                    {last ? (
                      <>
                        <p className="text-xs text-slate-400">{last.stringName}</p>
                        <Badge tone="sky">{last.tensionMain} {db.settings.tensionUnit} · {fmtDate(last.date)}</Badge>
                      </>
                    ) : (
                      <Badge>sem histórico</Badge>
                    )}
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
