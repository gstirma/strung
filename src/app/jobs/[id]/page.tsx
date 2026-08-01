"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDB, actions } from "@/lib/store";
import { fmtBRL, fmtDate, daysSince } from "@/lib/logic";
import { Card, SectionTitle, Btn, Field, inputCls, RatingInput, RatingDots, Badge } from "@/components/ui";
import { Scissors, Trash2, FileDown } from "lucide-react";
import { jobReceiptBlob, sharePdf } from "@/lib/pdf";
import { findString, materialPT } from "@/lib/twu-data";

export default function JobDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const db = useDB();
  const router = useRouter();

  const job = db.jobs.find((j) => j.id === id);
  const racquet = job ? db.racquets.find((r) => r.id === job.racquetId) : undefined;
  const player = racquet ? db.players.find((p) => p.id === racquet.playerId) : undefined;

  const [editing, setEditing] = useState(false);
  const [fb, setFb] = useState(job?.feedback ?? {});
  const [pdfBusy, setPdfBusy] = useState(false);

  if (!job) return <p className="py-10 text-center text-sm text-slate-400">Serviço não encontrado.</p>;

  const unit = db.settings.tensionUnit;
  const profit = (job.totalCharged ?? 0) - (job.stringCost ?? 0);
  const twu = findString(job.stringName);

  const saveFeedback = () => {
    actions.upsertJob({ ...job, feedback: { ...fb, ratedAt: new Date().toISOString() } });
    setEditing(false);
  };

  const markBroken = () => {
    const d = prompt("Data em que a corda quebrou/foi cortada (AAAA-MM-DD):", new Date().toISOString().slice(0, 10));
    if (d) actions.upsertJob({ ...job, brokeAt: new Date(d + "T12:00:00").toISOString() });
  };

  return (
    <div>
      <Card className="bg-gradient-to-br from-[#12233f] to-[#101b2e]">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-lime-300">Encordoamento</p>
        <h1 className="mt-1 text-lg font-bold text-white">{job.stringName} {job.gauge}</h1>
        {job.hybrid && job.crossStringName && <p className="text-sm text-slate-400">híbrido com {job.crossStringName}</p>}
        <p className="text-sm text-slate-400">
          {racquet && <Link href={`/racquets/${racquet.id}`} className="text-sky-300">{racquet.brand} {racquet.model}</Link>}
          {player && <> · {player.name}</>}
        </p>
        <div className="mt-3 flex items-end justify-between">
          <div>
            <p className="text-xs text-slate-400">{fmtDate(job.date)}</p>
            {job.brokeAt
              ? <Badge tone="red">quebrou em {fmtDate(job.brokeAt)}</Badge>
              : <Badge tone="lime">{daysSince(job.date)} dias em uso</Badge>}
          </div>
          <p className="text-3xl font-black text-sky-300">
            {job.tensionMain}
            {job.tensionCross && job.tensionCross !== job.tensionMain && <span className="text-xl">/{job.tensionCross}</span>}
            <span className="text-sm font-medium text-slate-400"> {unit}</span>
          </p>
        </div>
      </Card>

      <Card className="mt-3 grid grid-cols-3 gap-2 py-3 text-center">
        <div>
          <p className="text-[10px] uppercase text-slate-500">Corda</p>
          <p className="text-sm font-semibold text-white">{fmtBRL(job.stringCost)}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase text-slate-500">Cobrado</p>
          <p className="text-sm font-semibold text-white">{fmtBRL(job.totalCharged)}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase text-slate-500">Lucro</p>
          <p className="text-sm font-semibold text-lime-300">{fmtBRL(profit)}</p>
        </div>
      </Card>

      {twu && (
        <Card className="mt-3 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-sky-300">Dados da corda (TWU)</p>
          <p className="mt-1 text-xs text-slate-300">
            {materialPT(twu.material)}
            {twu.stiffness != null && <> · rigidez <b className="text-white">{twu.stiffness}</b> lb/pol</>}
            {twu.tensionLoss != null && <> · perda de tensão <b className="text-white">{twu.tensionLoss}%</b></>}
            {twu.energyReturn != null && <> · energia <b className="text-white">{twu.energyReturn}%</b></>}
            {twu.spin != null && <> · spin <b className="text-white">{twu.spin}</b></>}
          </p>
        </Card>
      )}

      {job.notes && <Card className="mt-3 py-3 text-sm text-slate-300">{job.notes}</Card>}

      <Btn variant="primary" disabled={pdfBusy} className="mt-3 w-full" onClick={async () => {
        setPdfBusy(true);
        try {
          const blob = await jobReceiptBlob(db, job);
          await sharePdf(blob, `encordoamento-${fmtDate(job.date).replaceAll("/", "-")}.pdf`);
        } finally {
          setPdfBusy(false);
        }
      }}>
        <FileDown size={15} /> {pdfBusy ? "Gerando PDF…" : "Exportar PDF p/ enviar ao cliente"}
      </Btn>

      <SectionTitle
        action={!editing && (
          <button onClick={() => setEditing(true)} className="text-xs text-sky-300">
            {job.feedback ? "editar" : "avaliar agora"}
          </button>
        )}
      >
        Avaliação do jogador
      </SectionTitle>

      <Card>
        {editing ? (
          <div className="flex flex-col gap-1">
            <RatingInput label="Controle" value={fb.control} onChange={(v) => setFb({ ...fb, control: v })} />
            <RatingInput label="Potência" value={fb.power} onChange={(v) => setFb({ ...fb, power: v })} />
            <RatingInput label="Spin" value={fb.spin} onChange={(v) => setFb({ ...fb, spin: v })} />
            <RatingInput label="Conforto" value={fb.comfort} onChange={(v) => setFb({ ...fb, comfort: v })} />
            <RatingInput label="Durabilidade" value={fb.durability} onChange={(v) => setFb({ ...fb, durability: v })} />
            <Field label="Comentário">
              <textarea className={inputCls} rows={2} value={fb.comment ?? ""} onChange={(e) => setFb({ ...fb, comment: e.target.value })} />
            </Field>
            <div className="mt-2 flex gap-2">
              <Btn variant="lime" onClick={saveFeedback} className="flex-1">Salvar avaliação</Btn>
              <Btn variant="ghost" onClick={() => setEditing(false)}>Cancelar</Btn>
            </div>
          </div>
        ) : job.feedback ? (
          <div>
            <RatingDots label="Controle" value={job.feedback.control} />
            <RatingDots label="Potência" value={job.feedback.power} />
            <RatingDots label="Spin" value={job.feedback.spin} />
            <RatingDots label="Conforto" value={job.feedback.comfort} />
            <RatingDots label="Durabilidade" value={job.feedback.durability} />
            {job.feedback.comment && <p className="mt-2 text-sm italic text-slate-300">“{job.feedback.comment}”</p>}
            <p className="mt-1 text-xs text-slate-500">avaliado em {fmtDate(job.feedback.ratedAt)}</p>
          </div>
        ) : (
          <p className="py-2 text-center text-xs text-slate-500">
            Sem avaliação — ela alimenta a sugestão inteligente da próxima tensão.
          </p>
        )}
      </Card>

      <div className="mt-6 flex justify-center gap-2">
        {!job.brokeAt && (
          <Btn variant="ghost" onClick={markBroken}><Scissors size={14} /> Corda quebrou</Btn>
        )}
        <Btn variant="danger" onClick={() => {
          if (confirm("Excluir este encordoamento?")) {
            actions.deleteJob(job.id);
            router.push(racquet ? `/racquets/${racquet.id}` : "/");
          }
        }}>
          <Trash2 size={14} /> Excluir
        </Btn>
      </div>
    </div>
  );
}
