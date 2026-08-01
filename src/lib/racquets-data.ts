import { RACQUETS_RAW } from "./racquets-raw";

export interface RacquetSpec {
  code: string;
  brand: string;
  model: string;
  headSize?: number; // pol²
  length?: number; // pol
  weight?: number; // g (encordoada)
  balance?: number; // cm
  swingweight?: number;
  flex?: number; // RA — menor = mais flexível/confortável
  twistweight?: number;
  spin?: number; // rpm de referência
  sweetSpot?: number; // cm
}

function parse(raw: string): RacquetSpec[] {
  const num = (s: string) => {
    const n = parseFloat(s);
    return Number.isFinite(n) ? n : undefined;
  };
  const out: RacquetSpec[] = [];
  for (const line of raw.split("\n")) {
    const f = line.split("|");
    if (f.length < 3 || !f[1] || !f[2]) continue;
    out.push({
      code: f[0],
      brand: f[1],
      model: f[2],
      headSize: num(f[3]),
      length: num(f[4]),
      weight: num(f[5]),
      balance: num(f[6]),
      swingweight: num(f[7]),
      flex: num(f[8]),
      twistweight: num(f[9]),
      spin: num(f[10]),
      sweetSpot: num(f[11]),
    });
  }
  return out;
}

export const RACQUETS: RacquetSpec[] = parse(RACQUETS_RAW).sort((a, b) =>
  (a.brand + " " + a.model).localeCompare(b.brand + " " + b.model)
);

export const RACQUET_BRANDS: string[] = [...new Set(RACQUETS.map((r) => r.brand))].sort();

export function racquetLabel(r: RacquetSpec): string {
  return `${r.brand} ${r.model}`;
}

export function searchRacquets(query: string, limit = 25, brand?: string): RacquetSpec[] {
  const base = brand ? RACQUETS.filter((r) => r.brand === brand) : RACQUETS;
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return brand ? base.slice(0, limit) : [];
  return base
    .filter((r) => {
      const hay = `${r.brand} ${r.model}`.toLowerCase();
      return terms.every((t) => hay.includes(t));
    })
    .slice(0, limit);
}

export function findRacquet(brand: string, model: string): RacquetSpec | undefined {
  const b = brand.trim().toLowerCase();
  const m = model.trim().toLowerCase();
  return RACQUETS.find(
    (r) => r.brand.toLowerCase() === b && r.model.toLowerCase() === m
  );
}

/**
 * Metros de corda necessários, estimados a partir do tamanho da cabeça.
 * Um set de 12 m atende a maioria; cabeças grandes pedem um pouco mais.
 */
export function estimateMeters(headSize?: number): number {
  if (!headSize) return 12;
  if (headSize <= 95) return 10.5;
  if (headSize <= 100) return 11;
  if (headSize <= 107) return 11.5;
  if (headSize <= 115) return 12;
  return 12.5;
}

/** Leitura em português das specs que importam para o encordoador */
export function racquetHeadline(r: RacquetSpec): string {
  const parts: string[] = [];
  if (r.headSize) parts.push(`${r.headSize} pol²`);
  if (r.weight) parts.push(`${r.weight} g`);
  if (r.balance) parts.push(`balanço ${r.balance} cm`);
  if (r.flex) parts.push(`flex ${r.flex}`);
  return parts.join(" · ");
}
