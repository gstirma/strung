import { DB, Player, Racquet, StringJob } from "./types";
import { findString } from "./twu-data";

export const fmtBRL = (v: number | undefined) =>
  (v ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const LB_PER_KG = 2.20462;

/** Converte a tensão para a outra unidade, para mostrar as duas juntas */
export function otherUnit(value: number, unit: "kg" | "lb"): string {
  const v = unit === "lb" ? value / LB_PER_KG : value * LB_PER_KG;
  return `${v.toFixed(1).replace(".", ",")} ${unit === "lb" ? "kg" : "lb"}`;
}

/** "52/50 lb" — principal e travessa quando forem diferentes */
export function tensionLabel(job: { tensionMain: number; tensionCross?: number }, unit: string): string {
  const cross = job.tensionCross && job.tensionCross !== job.tensionMain ? `/${job.tensionCross}` : "";
  return `${job.tensionMain}${cross} ${unit}`;
}

export const fmtDate = (iso: string | undefined) =>
  iso ? new Date(iso).toLocaleDateString("pt-BR") : "—";

export const daysSince = (iso: string) =>
  Math.floor((Date.now() - +new Date(iso)) / 86400000);

export function jobsOfRacquet(db: DB, racquetId: string): StringJob[] {
  return db.jobs
    .filter((j) => j.racquetId === racquetId)
    .sort((a, b) => +new Date(a.date) - +new Date(b.date));
}

export function lastJobOfRacquet(db: DB, racquetId: string): StringJob | undefined {
  const jobs = jobsOfRacquet(db, racquetId);
  return jobs[jobs.length - 1];
}

// Regra Alex Pretti Tennis: trocar a cada 3–4 meses ou 15–20 h de jogo.
// Se soubermos as horas/semana do jogador, o limite vem das horas; senão, 105 dias.
export function restringLimitDays(player?: Player): number {
  if (player?.hoursPerWeek && player.hoursPerWeek > 0) {
    const days = Math.round((17.5 / player.hoursPerWeek) * 7); // ~17,5 h de jogo
    return Math.min(Math.max(days, 14), 120);
  }
  return 105; // ~3,5 meses
}

export interface RestringAlert {
  racquet: Racquet;
  player?: Player;
  lastJob?: StringJob;
  days: number; // dias desde o último encordoamento
  limit: number;
  status: "ok" | "atencao" | "vencida" | "sem-corda";
}

export function restringAlerts(db: DB): RestringAlert[] {
  return db.racquets
    .filter((r) => !r.archived)
    .map((r) => {
      const player = db.players.find((p) => p.id === r.playerId);
      const lastJob = lastJobOfRacquet(db, r.id);
      const limit = restringLimitDays(player);
      if (!lastJob)
        return { racquet: r, player, lastJob, days: 0, limit, status: "sem-corda" as const };
      if (lastJob.brokeAt)
        return { racquet: r, player, lastJob, days: daysSince(lastJob.brokeAt), limit, status: "sem-corda" as const };
      const days = daysSince(lastJob.date);
      const status: RestringAlert["status"] =
        days >= limit ? "vencida" : days >= limit * 0.75 ? "atencao" : "ok";
      return { racquet: r, player, lastJob, days, limit, status };
    })
    .sort((a, b) => {
      const rank = { "sem-corda": 0, vencida: 1, atencao: 2, ok: 3 };
      return rank[a.status] - rank[b.status] || b.days - a.days;
    });
}

// ---------- Sugestão inteligente da próxima tensão ----------

export interface TensionSuggestion {
  tension: number;
  cross?: number;
  rationale: string[];
}

export function suggestNextTension(
  db: DB,
  racquetId: string,
  unit: "kg" | "lb"
): TensionSuggestion | null {
  const jobs = jobsOfRacquet(db, racquetId);
  if (jobs.length === 0) return null;

  const last = jobs[jobs.length - 1];
  const step = unit === "kg" ? 0.5 : 1; // passo de ajuste
  const min = unit === "kg" ? 18 : 40;
  const max = unit === "kg" ? 30 : 66;

  let tension = last.tensionMain;
  const rationale: string[] = [
    `Base: última tensão usada (${last.tensionMain} ${unit} · ${last.stringName}).`,
  ];

  const f = last.feedback;
  if (f) {
    let delta = 0;
    if ((f.control ?? 3) <= 2 && (f.power ?? 3) >= 4) {
      delta += 2 * step;
      rationale.push("Jogador relatou pouco controle e muita potência → subir tensão.");
    } else if ((f.control ?? 3) <= 2) {
      delta += step;
      rationale.push("Controle abaixo do ideal → leve aumento de tensão.");
    }
    if ((f.power ?? 3) <= 2) {
      delta -= step;
      rationale.push("Pouca potência relatada → reduzir tensão para mais profundidade.");
    }
    if ((f.comfort ?? 3) <= 2) {
      delta -= step;
      const twu = findString(last.stringName);
      if (twu?.stiffness != null && twu.stiffness > 220) {
        rationale.push(
          `Desconforto relatado e a ${twu.name} é rígida (${twu.stiffness} lb/pol na TWU) → reduzir tensão ou trocar por poliéster mais macio (<200) / multifilamento.`
        );
      } else {
        rationale.push("Desconforto relatado → reduzir tensão (ou considerar corda mais macia/multifilamento).");
      }
    }
    if ((f.spin ?? 3) <= 2) {
      const twu = findString(last.stringName);
      if (twu?.spin != null && twu.spin < 5) {
        rationale.push(
          `Pouco spin e a corda atual tem potencial de spin baixo na TWU (${twu.spin}) → considerar poliéster com formato/texturizado (spin ≥ 6) ou calibre mais fino.`
        );
      } else {
        rationale.push("Pouco spin → considerar calibre mais fino (ex.: 1.20–1.25) ou poliéster com formato.");
      }
    }
    if (delta === 0 && (f.control ?? 0) >= 4 && (f.comfort ?? 0) >= 3) {
      rationale.push("Avaliações boas e equilibradas → manter o setup atual.");
    }
    tension += delta;
  } else {
    rationale.push("Sem avaliação do último encordoamento — mantendo a tensão anterior.");
  }

  // Corda que perde muita tensão (dado TWU) merece aviso de estabilidade
  const twuLast = findString(last.stringName);
  if (twuLast?.tensionLoss != null && twuLast.tensionLoss >= 45) {
    rationale.push(
      `A ${twuLast.name} perde ~${twuLast.tensionLoss}% da tensão (TWU) → ela "morre" rápido; vale trocar com mais frequência ou escolher uma corda mais estável (<35%).`
    );
  }

  // Quebra precoce (< 20 dias) sugere calibre mais grosso, não mudança de tensão
  if (last.brokeAt) {
    const dur = Math.floor((+new Date(last.brokeAt) - +new Date(last.date)) / 86400000);
    if (dur >= 0 && dur < 20) {
      rationale.push(`Corda quebrou em ${dur} dia(s) → considerar calibre mais grosso (1.30) ou poliéster mais durável.`);
    }
  }

  // Consistência: se as 3 últimas tensões convergiram e avaliação foi boa, reforça manter
  if (jobs.length >= 3) {
    const t3 = jobs.slice(-3).map((j) => j.tensionMain);
    if (Math.max(...t3) - Math.min(...t3) <= step) {
      rationale.push("Tensão estável nos últimos encordoamentos — jogador encontrou a referência dele.");
    }
  }

  tension = Math.min(Math.max(Math.round(tension / step) * step, min), max);
  const crossDiff = (last.tensionCross ?? last.tensionMain) - last.tensionMain;
  return { tension, cross: +(tension + crossDiff).toFixed(1), rationale };
}

// ---------- Estatísticas financeiras / consumo ----------

export function monthRevenue(db: DB): { revenue: number; profit: number; count: number } {
  const now = new Date();
  const jobs = db.jobs.filter((j) => {
    const d = new Date(j.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const revenue = jobs.reduce((s, j) => s + (j.totalCharged ?? 0), 0);
  const cost = jobs.reduce((s, j) => s + (j.stringCost ?? 0), 0);
  return { revenue, profit: revenue - cost, count: jobs.length };
}

export function stockCostPerMeter(cost: number, totalMeters: number): number {
  return totalMeters > 0 ? cost / totalMeters : 0;
}

export function avgFeedback(jobs: StringJob[]) {
  const rated = jobs.filter((j) => j.feedback);
  const avg = (k: "control" | "power" | "spin" | "comfort" | "durability") => {
    const vals = rated.map((j) => j.feedback?.[k]).filter((v): v is number => v != null);
    return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
  };
  return {
    control: avg("control"), power: avg("power"), spin: avg("spin"),
    comfort: avg("comfort"), durability: avg("durability"), n: rated.length,
  };
}
