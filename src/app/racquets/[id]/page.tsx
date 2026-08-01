"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { useDB, actions } from "@/lib/store";
import {
  jobsOfRacquet, suggestNextTension, fmtBRL, fmtDate, daysSince, avgFeedback,
} from "@/lib/logic";
import { TensionChart, FeedbackRadar } from "@/components/charts";
import { Card, SectionTitle, Btn, Badge, RatingDots } from "@/components/ui";
import { QrCode, Sparkles, Trash2, FileDown } from "lucide-react";
import { racquetReportBlob, sharePdf } from "@/lib/pdf";

export default function RacquetDossier({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const db = useDB();
  const router = useRouter();
  const [showQR, setShowQR] = useState(false);
  const [pdfBusy, setPdfBusy] = useState(false);

  const racquet = db.racquets.find((r) => r.id === id);
  if (!racquet) return <p className="py-10 text-center text-sm text-slate-400">Raquete não encontrada.</p>;

  const player = db.players.find((p) => p.id === racquet.playerId);
  const jobs = jobsOfRacquet(db, racquet.id); // ordem cronológica
  const jobsDesc = [...jobs].reverse();
  const last = jobs[jobs.length - 1];
  const suggestion = suggestNextTension(db, racquet.id, db.settings.tensionUnit);
  const avg = avgFeedback(jobs);
  const unit = db.settings.tensionUnit;
  const qrUrl = typeof window !== "undefined" ? `${window.location.origin}/racquets/${racquet.id}` : "";

  return (
    <div>
      {/* Cabeçalho do prontuário */}
      <Card className="bg-gradient-to-br from-[#12233f] to-[#101b2e]">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-lime-300">Prontuário da Raquete</p>
            <h1 className="mt-1 text-xl font-bold text-white">{racquet.brand} {racquet.model}</h1>
            <p className="text-sm text-slate-400">
              {player ? <Link href={`/players/${player.id}`} className="text-sky-300">{player.name}</Link> : "sem jogador"}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {racquet.headSize && <Badge>{racquet.headSize} pol²</Badge>}
              {racquet.weight && <Badge>{racquet.weight} g</Badge>}
              {racquet.pattern && <Badge>{racquet.pattern}</Badge>}
              {racquet.gripSize && <Badge>grip {racquet.gripSize}</Badge>}
            </div>
          </div>
          <button onClick={() => setShowQR(!showQR)} aria-label="QR Code"
            className="rounded-xl border border-white/15 p-2.5 text-lime-300 active:scale-95">
            <QrCode size={22} />
          </button>
        </div>
        {showQR && (
          <div className="mt-4 flex flex-col items-center gap-2 rounded-xl bg-white p-4">
            <QRCodeSVG value={qrUrl} size={180} />
            <p className="text-center text-xs text-slate-600">
              Cole este QR na raquete — escaneou, abriu o prontuário.
            </p>
          </div>
        )}
      </Card>

      {/* Situação atual */}
      {last && (
        <Card className="mt-3 flex items-center justify-between py-3">
          <div>
            <p className="text-xs text-slate-400">Corda atual</p>
            <p className="text-sm font-semibold text-white">{last.stringName} {last.gauge}</p>
            <p className="text-xs text-slate-400">
              {last.brokeAt ? `quebrou em ${fmtDate(last.brokeAt)}` : `${daysSince(last.date)} dias em uso`}
            </p>
          </div>
          <p className="text-2xl font-black text-sky-300">
            {last.tensionMain}<span className="text-sm font-medium text-slate-400"> {unit}</span>
          </p>
        </Card>
      )}

      {/* Sugestão IA */}
      {suggestion && (
        <Card className="mt-3 border-lime-300/30">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-lime-300" />
            <p className="text-sm font-semibold text-lime-300">Sugestão para o próximo encordoamento</p>
          </div>
          <p className="mt-2 text-2xl font-black text-white">
            {suggestion.tension} {unit}
            {suggestion.cross !== suggestion.tension && (
              <span className="text-base font-semibold text-slate-400"> / {suggestion.cross} {unit} travessa</span>
            )}
          </p>
          <ul className="mt-2 flex list-disc flex-col gap-1 pl-4 text-xs text-slate-400">
            {suggestion.rationale.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
        </Card>
      )}

      <div className="mt-3 flex gap-2">
        <Btn href={`/jobs/new?racquet=${racquet.id}`} variant="lime" className="flex-1">
          + Novo encordoamento
        </Btn>
        <Btn variant="ghost" disabled={pdfBusy} onClick={async () => {
          setPdfBusy(true);
          try {
            const blob = await racquetReportBlob(db, racquet);
            await sharePdf(blob, `prontuario-${racquet.brand}-${racquet.model}.pdf`.replace(/\s+/g, "-").toLowerCase());
          } finally {
            setPdfBusy(false);
          }
        }}>
          <FileDown size={15} /> {pdfBusy ? "Gerando…" : "PDF"}
        </Btn>
      </div>

      {/* Evolução da tensão */}
      <SectionTitle>Evolução da tensão</SectionTitle>
      <Card><TensionChart jobs={jobs} unit={unit} /></Card>

      {/* Comparação de desempenho */}
      <SectionTitle>Desempenho percebido</SectionTitle>
      <Card>
        <FeedbackRadar jobs={jobs} />
        {avg.n > 0 && (
          <div className="mt-2 border-t border-white/10 pt-2">
            <p className="mb-1 text-xs text-slate-500">Média de {avg.n} avaliação(ões):</p>
            <RatingDots label="Controle" value={Math.round(avg.control)} />
            <RatingDots label="Potência" value={Math.round(avg.power)} />
            <RatingDots label="Spin" value={Math.round(avg.spin)} />
            <RatingDots label="Conforto" value={Math.round(avg.comfort)} />
            <RatingDots label="Durabilidade" value={Math.round(avg.durability)} />
          </div>
        )}
      </Card>

      {/* Histórico completo */}
      <SectionTitle>Histórico de cordas ({jobs.length})</SectionTitle>
      <div className="flex flex-col gap-2">
        {jobsDesc.map((j) => (
          <Link key={j.id} href={`/jobs/${j.id}`}>
            <Card className="py-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">
                    {j.stringName} {j.gauge}
                    {j.hybrid && j.crossStringName && <span className="text-slate-400"> + {j.crossStringName}</span>}
                  </p>
                  <p className="text-xs text-slate-400">
                    {fmtDate(j.date)}
                    {j.brokeAt && ` · quebrou ${fmtDate(j.brokeAt)}`}
                    {!j.feedback && " · sem avaliação"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-sky-300">
                    {j.tensionMain}{j.tensionCross && j.tensionCross !== j.tensionMain ? `/${j.tensionCross}` : ""} {unit}
                  </p>
                  <p className="text-xs text-lime-300">{fmtBRL(j.totalCharged)}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
        {jobs.length === 0 && <p className="text-center text-xs text-slate-500">Nenhum encordoamento registrado.</p>}
      </div>

      <div className="mt-8 flex justify-center">
        <Btn variant="danger" onClick={() => {
          if (confirm(`Excluir a raquete ${racquet.brand} ${racquet.model} e todo o histórico?`)) {
            actions.deleteRacquet(racquet.id);
            router.push("/racquets");
          }
        }}>
          <Trash2 size={14} /> Excluir raquete
        </Btn>
      </div>
    </div>
  );
}
