// Modelos de dados — Alex Pretti Tennis · Gestão de Encordoamento

export type Level =
  | "Iniciante"
  | "Intermediário"
  | "Avançado"
  | "Competitivo"
  | "Profissional";

export type CourtType = "Saibro" | "Rápida" | "Grama" | "Variada";

export interface Player {
  id: string;
  name: string;
  phone?: string;
  level: Level;
  style?: string; // estilo de jogo (fundo de quadra, all-court, saque-voleio…)
  hoursPerWeek?: number; // horas de jogo por semana
  court?: CourtType;
  ball?: string; // bola habitual
  notes?: string;
  createdAt: string;
}

export interface Racquet {
  id: string;
  playerId: string;
  brand: string;
  model: string;
  headSize?: number; // pol²
  weight?: number; // g (sem corda)
  pattern?: string; // ex.: 16x19
  gripSize?: string; // ex.: L3 / 4 3/8
  notes?: string;
  archived?: boolean;
  createdAt: string;
  // specs vindas do catálogo TWU, quando a raquete foi escolhida na busca
  specCode?: string;
  balance?: number; // cm
  swingweight?: number;
  flex?: number; // RA
}


export interface StockItem {
  id: string;
  stringName: string; // marca + modelo
  gauge?: string;
  kind: "Rolo" | "Set";
  totalMeters: number; // rolo típico: 200 m · set: 12 m
  remainingMeters: number;
  cost: number; // custo total pago (R$)
  createdAt: string;
}

export interface Feedback {
  control?: number; // 1–5
  power?: number;
  spin?: number;
  comfort?: number;
  durability?: number;
  comment?: string;
  ratedAt?: string;
}

export interface StringJob {
  id: string;
  racquetId: string;
  date: string; // ISO
  stringName: string;
  gauge?: string;
  hybrid?: boolean;
  crossStringName?: string; // se híbrido
  tensionMain: number; // na unidade das configurações
  tensionCross?: number;
  metersUsed?: number;
  stockItemId?: string;
  stringCost?: number; // custo da corda neste serviço
  laborPrice?: number; // mão de obra
  totalCharged?: number; // valor cobrado do cliente
  brokeAt?: string; // ISO — quando a corda quebrou/foi cortada
  feedback?: Feedback;
  notes?: string;
}

export interface Settings {
  businessName: string;
  tensionUnit: "kg" | "lb";
  defaultLabor: number;
  defaultMeters: number;
}

export interface DB {
  players: Player[];
  racquets: Racquet[];
  jobs: StringJob[];
  stock: StockItem[];
  offeredStrings: string[]; // nomes (TWU) das cordas que o encordoador oferece
  settings: Settings;
}
