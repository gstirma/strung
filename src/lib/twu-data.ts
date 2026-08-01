import { TwuString, StringProfile } from "./twu-types";
import { TWU_RAW, TWU_REF_TENSION_LBS, parseTwu } from "./twu-raw";

export type { TwuString, StringProfile };
export { TWU_REF_TENSION_LBS };

export const TWU_STRINGS: TwuString[] = parseTwu(TWU_RAW).sort((a, b) =>
  a.name.localeCompare(b.name)
);

// ---------- Percentis: cada métrica vira nota 1–5 comparada ao banco todo ----------

function sortedValues(pick: (s: TwuString) => number | undefined): number[] {
  return TWU_STRINGS.map(pick)
    .filter((v): v is number => v != null)
    .sort((a, b) => a - b);
}

const SCALES = {
  stiffness: sortedValues((s) => s.stiffness),
  energy: sortedValues((s) => s.energyReturn),
  spin: sortedValues((s) => s.spin),
  loss: sortedValues((s) => s.tensionLoss),
};

// posição do valor dentro da distribuição (0–1)
function percentile(sorted: number[], value: number): number {
  if (sorted.length === 0) return 0.5;
  let lo = 0,
    hi = sorted.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (sorted[mid] < value) lo = mid + 1;
    else hi = mid;
  }
  return lo / sorted.length;
}

const toStars = (p: number) => Math.min(5, Math.max(1, Math.round(p * 4 + 1)));

/**
 * Traduz os números medidos em laboratório para o vocabulário do jogador.
 * A leitura segue a interpretação da própria TWU:
 *  - rigidez alta → menos efeito trampolim → mais controle, menos conforto
 *  - retorno de energia alto → mais potência
 *  - potencial de spin alto → mais efeito
 *  - perda de tensão baixa → a corda mantém o ajuste por mais tempo
 */
export function stringProfile(s: TwuString): StringProfile | null {
  if (s.stiffness == null && s.energyReturn == null && s.spin == null) return null;
  const pStiff = s.stiffness != null ? percentile(SCALES.stiffness, s.stiffness) : 0.5;
  const pEnergy = s.energyReturn != null ? percentile(SCALES.energy, s.energyReturn) : 0.5;
  const pSpin = s.spin != null ? percentile(SCALES.spin, s.spin) : 0.5;
  const pLoss = s.tensionLoss != null ? percentile(SCALES.loss, s.tensionLoss) : 0.5;
  return {
    control: toStars(pStiff),
    comfort: toStars(1 - pStiff),
    power: toStars(pEnergy),
    spin: toStars(pSpin),
    stability: toStars(1 - pLoss),
  };
}

/** Frase curta do tipo "corda de spin e controle" */
export function stringHeadline(s: TwuString): string {
  const p = stringProfile(s);
  if (!p) return materialPT(s.material);
  const traits: [string, number][] = [
    ["spin", p.spin],
    ["controle", p.control],
    ["potência", p.power],
    ["conforto", p.comfort],
    ["estabilidade", p.stability],
  ];
  const top = traits
    .filter(([, v]) => v >= 4)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([k]) => k);
  if (top.length === 0) return `${materialPT(s.material)} equilibrada`;
  return `${materialPT(s.material)} de ${top.join(" e ")}`;
}

// ---------- Curva de queda da tensão ----------

export interface TensionPoint {
  label: string;
  hours: number; // horas de jogo aproximadas
  tension: number; // na unidade pedida
  note: string;
}

/**
 * Reconstrói a queda de tensão a partir das três perdas medidas pela TWU,
 * reescalando da referência (51 lbs) para a tensão realmente usada.
 * A perda por impacto é distribuída ao longo das horas de jogo — a TWU mede
 * um número pequeno de impactos, então extrapolamos proporcionalmente ao uso.
 */
export function tensionCurve(
  s: TwuString,
  appliedTension: number,
  unit: "kg" | "lb",
  totalHours = 20
): TensionPoint[] {
  if (s.staticLoss == null || s.stabilizationLoss == null) return [];
  const refLb = unit === "kg" ? TWU_REF_TENSION_LBS / 2.20462 : TWU_REF_TENSION_LBS;
  const k = appliedTension / refLb; // proporção em relação ao ensaio
  const conv = (lbs: number) => (unit === "kg" ? lbs / 2.20462 : lbs) * k;

  const afterStatic = appliedTension - conv(s.staticLoss);
  const afterStab = afterStatic - conv(s.stabilizationLoss);

  // A perda por impacto cresce rápido no começo e desacelera (raiz do tempo)
  const impactTotal = conv((s.impactLoss ?? 0) * 12);
  const at = (h: number) => afterStab - impactTotal * Math.sqrt(h / totalHours);

  const r = (v: number) => Math.round(v * 10) / 10;
  return [
    { label: "Puxada", hours: 0, tension: r(appliedTension), note: "tensão ajustada na máquina" },
    { label: "Na hora", hours: 0, tension: r(afterStatic), note: "perda estática, ainda na máquina" },
    { label: "24 h", hours: 0, tension: r(afterStab), note: "acomodação antes do primeiro jogo" },
    { label: "5 h", hours: 5, tension: r(at(5)), note: "após os primeiros treinos" },
    { label: "10 h", hours: 10, tension: r(at(10)), note: "metade da vida útil" },
    { label: `${totalHours} h`, hours: totalHours, tension: r(at(totalHours)), note: "hora de trocar" },
  ];
}

// ---------- Tempo de uso recomendado ----------

export interface UsageAdvice {
  hours: number; // horas de jogo recomendadas
  weeks?: number; // se soubermos a frequência do jogador
  reason: string;
}

/**
 * Estima a janela de troca a partir da estabilidade medida da corda,
 * ancorada na regra da casa (15–20 h de jogo).
 */
export function usageAdvice(s: TwuString, hoursPerWeek?: number): UsageAdvice {
  const loss = s.tensionLoss;
  let hours = 17.5;
  let reason = "referência da casa: 15–20 h de jogo.";

  if (loss != null) {
    if (loss >= 50) {
      hours = 10;
      reason = `perde ${loss}% da tensão (muito alta) — o ajuste sai antes das 15 h.`;
    } else if (loss >= 40) {
      hours = 14;
      reason = `perde ${loss}% da tensão — troque um pouco antes do usual.`;
    } else if (loss <= 25) {
      hours = 22;
      reason = `perde só ${loss}% da tensão — segura o ajuste por mais tempo.`;
    } else {
      reason = `perde ${loss}% da tensão, dentro do esperado para a categoria.`;
    }
  }

  const mat = s.material.toLowerCase();
  if (mat.includes("gut") && !mat.includes("nylon")) {
    hours = Math.max(hours, 25);
    reason += " Tripa natural mantém o toque por mais tempo.";
  }

  return {
    hours: Math.round(hours),
    weeks: hoursPerWeek && hoursPerWeek > 0 ? Math.round(hours / hoursPerWeek) : undefined,
    reason,
  };
}

// ---------- Tradução e busca ----------

export function materialPT(m: string): string {
  switch (m) {
    case "Polyester": return "Poliéster";
    case "Gut": return "Tripa Natural";
    case "Nylon": return "Nylon / Syn. Gut";
    case "Polyolefin": return "Poliolefina";
    case "": return "—";
    default: return m.startsWith("Nylon/") ? "Multifilamento" : m;
  }
}

export function searchStrings(query: string, limit = 20): TwuString[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];
  return TWU_STRINGS.filter((s) => {
    const hay = (s.name + " " + s.material).toLowerCase();
    return terms.every((t) => hay.includes(t));
  }).slice(0, limit);
}

export function findString(name: string): TwuString | undefined {
  const n = name.trim().toLowerCase();
  return (
    TWU_STRINGS.find((s) => s.name.toLowerCase() === n) ??
    TWU_STRINGS.find((s) => s.name.toLowerCase().includes(n) || n.includes(s.name.toLowerCase()))
  );
}
