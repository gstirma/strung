"use client";

import { useDB, actions } from "@/lib/store";
import { restringAlerts, monthRevenue, fmtBRL, fmtDate } from "@/lib/logic";
import { Card, SectionTitle, Btn, Badge, EmptyState, Stat } from "@/components/ui";
import Link from "next/link";
import { routes } from "@/lib/routes";

const SLOGANS = [
  "Sua raquete em boas mãos. Sua evolução em primeiro lugar.",
  "Qualidade · Precisão · Performance.",
  "Cada detalhe faz a diferença dentro e fora da quadra.",
  "+ Desempenho · + Controle · + Durabilidade.",
];

export default function Dashboard() {
  const db = useDB();
  const alerts = restringAlerts(db);
  const { revenue, profit, count } = monthRevenue(db);
  const slogan = SLOGANS[new Date().getDate() % SLOGANS.length];
  const empty = db.players.length === 0 && db.racquets.length === 0;

  return (
    <div>
      <p className="mb-4 text-center text-xs italic text-slate-400">“{slogan}”</p>

      {empty ? (
        <EmptyState
          title="Bem-vindo!"
          subtitle="Cadastre um jogador e uma raquete para começar o prontuário — ou carregue dados de exemplo para explorar o app."
          action={
            <div className="flex gap-2">
              <Btn variant="lime" onClick={() => actions.seedDemo()}>Carregar exemplo</Btn>
              <Btn href="/players" variant="ghost">Começar</Btn>
            </div>
          }
        />
      ) : (
        <>
          <div className="flex gap-3">
            <Stat label="Serviços no mês" value={String(count)} />
            <Stat label="Faturamento" value={fmtBRL(revenue)} sub={`lucro ${fmtBRL(profit)}`} />
          </div>

          <SectionTitle action={<Link href="/racquets" className="text-xs text-sky-300">ver todas</Link>}>
            Quando trocar as cordas?
          </SectionTitle>
          <p className="mb-2 text-xs text-slate-500">
            Regra da casa: a cada <b className="text-lime-300">3–4 meses</b> ou <b className="text-lime-300">15–20 h de jogo</b>.
          </p>
          <div className="flex flex-col gap-2">
            {alerts.slice(0, 6).map((a) => (
              <Link key={a.racquet.id} href={routes.racquet(a.racquet.id)}>
                <Card className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {a.racquet.brand} {a.racquet.model}
                    </p>
                    <p className="text-xs text-slate-400">
                      {a.player?.name ?? "—"}
                      {a.lastJob && !a.lastJob.brokeAt && ` · encordoada em ${fmtDate(a.lastJob.date)}`}
                    </p>
                  </div>
                  {a.status === "sem-corda" && <Badge tone="red">sem corda</Badge>}
                  {a.status === "vencida" && <Badge tone="red">{a.days} dias · trocar!</Badge>}
                  {a.status === "atencao" && <Badge tone="amber">{a.days} dias</Badge>}
                  {a.status === "ok" && <Badge tone="lime">{a.days} dias · ok</Badge>}
                </Card>
              </Link>
            ))}
          </div>

          <SectionTitle>Últimos encordoamentos</SectionTitle>
          <div className="flex flex-col gap-2">
            {db.jobs.slice(0, 5).map((j) => {
              const r = db.racquets.find((x) => x.id === j.racquetId);
              return (
                <Link key={j.id} href={routes.job(j.id)}>
                  <Card className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium text-white">{j.stringName} {j.gauge}</p>
                      <p className="text-xs text-slate-400">
                        {r ? `${r.brand} ${r.model}` : "—"} · {fmtDate(j.date)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-sky-300">
                        {j.tensionMain}{j.tensionCross && j.tensionCross !== j.tensionMain ? `/${j.tensionCross}` : ""} {db.settings.tensionUnit}
                      </p>
                      <p className="text-xs text-lime-300">{fmtBRL(j.totalCharged)}</p>
                    </div>
                  </Card>
                </Link>
              );
            })}
            {db.jobs.length === 0 && (
              <EmptyState title="Nenhum encordoamento ainda" action={<Btn href="/jobs/new" variant="lime">Registrar o primeiro</Btn>} />
            )}
          </div>
        </>
      )}
    </div>
  );
}
