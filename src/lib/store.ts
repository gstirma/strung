"use client";

// Store local-first: persiste tudo em localStorage e notifica os componentes
// via useSyncExternalStore. A troca por Supabase depois é só substituir esta
// camada (o schema equivalente está em supabase/schema.sql).

import { useSyncExternalStore } from "react";
import { DB, Player, Racquet, StringJob, StockItem, Settings } from "./types";

const KEY = "strung-db-v1";

const DEFAULT_SETTINGS: Settings = {
  businessName: "Alex Pretti Tennis",
  tensionUnit: "lb", // padrão do mercado brasileiro de encordoamento
  defaultLabor: 40,
  defaultMeters: 12,
};

const EMPTY: DB = {
  players: [],
  racquets: [],
  jobs: [],
  stock: [],
  offeredStrings: [],
  settings: DEFAULT_SETTINGS,
};

let db: DB | null = null;
const listeners = new Set<() => void>();

function load(): DB {
  if (db) return db;
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = localStorage.getItem(KEY);
    db = raw ? { ...EMPTY, ...JSON.parse(raw) } : { ...EMPTY };
  } catch {
    db = { ...EMPTY };
  }
  return db!;
}

function persist() {
  if (typeof window !== "undefined" && db) {
    localStorage.setItem(KEY, JSON.stringify(db));
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useDB(): DB {
  return useSyncExternalStore(subscribe, load, () => EMPTY);
}

export function uid(): string {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function mutate(fn: (d: DB) => void) {
  const d = load();
  db = { ...d };
  fn(db);
  persist();
}

// ---------- CRUD ----------

export const actions = {
  upsertPlayer(p: Player) {
    mutate((d) => {
      d.players = [...d.players.filter((x) => x.id !== p.id), p].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    });
  },
  deletePlayer(id: string) {
    mutate((d) => {
      d.players = d.players.filter((x) => x.id !== id);
      const rIds = d.racquets.filter((r) => r.playerId === id).map((r) => r.id);
      d.racquets = d.racquets.filter((r) => r.playerId !== id);
      d.jobs = d.jobs.filter((j) => !rIds.includes(j.racquetId));
    });
  },
  upsertRacquet(r: Racquet) {
    mutate((d) => {
      d.racquets = [...d.racquets.filter((x) => x.id !== r.id), r];
    });
  },
  deleteRacquet(id: string) {
    mutate((d) => {
      d.racquets = d.racquets.filter((x) => x.id !== id);
      d.jobs = d.jobs.filter((j) => j.racquetId !== id);
    });
  },
  upsertJob(j: StringJob) {
    mutate((d) => {
      const isNew = !d.jobs.some((x) => x.id === j.id);
      d.jobs = [...d.jobs.filter((x) => x.id !== j.id), j].sort(
        (a, b) => +new Date(b.date) - +new Date(a.date)
      );
      // baixa automática de estoque na criação
      if (isNew && j.stockItemId && j.metersUsed) {
        d.stock = d.stock.map((s) =>
          s.id === j.stockItemId
            ? { ...s, remainingMeters: Math.max(0, s.remainingMeters - j.metersUsed!) }
            : s
        );
      }
    });
  },
  deleteJob(id: string) {
    mutate((d) => {
      d.jobs = d.jobs.filter((x) => x.id !== id);
    });
  },
  upsertStock(s: StockItem) {
    mutate((d) => {
      d.stock = [...d.stock.filter((x) => x.id !== s.id), s].sort(
        (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
      );
    });
  },
  deleteStock(id: string) {
    mutate((d) => {
      d.stock = d.stock.filter((x) => x.id !== id);
    });
  },
  toggleOfferedString(name: string) {
    mutate((d) => {
      d.offeredStrings = d.offeredStrings.includes(name)
        ? d.offeredStrings.filter((n) => n !== name)
        : [...d.offeredStrings, name].sort((a, b) => a.localeCompare(b));
    });
  },
  saveSettings(s: Settings) {
    mutate((d) => {
      d.settings = s;
    });
  },
  importAll(json: string): boolean {
    try {
      const parsed = JSON.parse(json);
      if (!parsed || !Array.isArray(parsed.players)) return false;
      mutate((d) => Object.assign(d, { ...EMPTY, ...parsed }));
      return true;
    } catch {
      return false;
    }
  },
  exportAll(): string {
    return JSON.stringify(load(), null, 2);
  },
  wipe() {
    mutate((d) => Object.assign(d, structuredClone(EMPTY)));
  },
  seedDemo() {
    const now = Date.now();
    const day = 86400000;
    const iso = (daysAgo: number) => new Date(now - daysAgo * day).toISOString();
    mutate((d) => {
      const p1: Player = {
        id: "demo-p1", name: "Guilherme Stirma", level: "Avançado",
        style: "Fundo de quadra agressivo", hoursPerWeek: 5, court: "Saibro",
        ball: "Wilson US Open", phone: "47 99999-0000", createdAt: iso(400),
      };
      const p2: Player = {
        id: "demo-p2", name: "Marina Costa", level: "Intermediário",
        style: "All-court", hoursPerWeek: 3, court: "Rápida", createdAt: iso(300),
      };
      const r1: Racquet = {
        id: "demo-r1", playerId: p1.id, brand: "Babolat", model: "Pure Aero 98",
        headSize: 98, weight: 305, pattern: "16x20", gripSize: "L3", createdAt: iso(400),
      };
      const r2: Racquet = {
        id: "demo-r2", playerId: p1.id, brand: "Wilson", model: "Blade 98 v9",
        headSize: 98, weight: 305, pattern: "16x19", gripSize: "L3", createdAt: iso(350),
      };
      const r3: Racquet = {
        id: "demo-r3", playerId: p2.id, brand: "Head", model: "Speed MP 2024",
        headSize: 100, weight: 300, pattern: "16x19", gripSize: "L2", createdAt: iso(300),
      };
      const jobs: StringJob[] = [
        {
          id: "demo-j1", racquetId: r1.id, date: iso(210), stringName: "Babolat RPM Blast",
          gauge: "1.25", tensionMain: 53, tensionCross: 51, metersUsed: 12,
          stringCost: 55, laborPrice: 40, totalCharged: 95, brokeAt: iso(150),
          feedback: { control: 4, power: 2, spin: 4, comfort: 2, durability: 4, comment: "Muito controle, mas dura no braço.", ratedAt: iso(200) },
        },
        {
          id: "demo-j2", racquetId: r1.id, date: iso(145), stringName: "Solinco Hyper-G",
          gauge: "1.25", tensionMain: 51, tensionCross: 49, metersUsed: 12,
          stringCost: 60, laborPrice: 40, totalCharged: 100, brokeAt: iso(80),
          feedback: { control: 4, power: 3, spin: 5, comfort: 3, durability: 4, comment: "Ótimo spin, gostei da tensão mais baixa.", ratedAt: iso(140) },
        },
        {
          id: "demo-j3", racquetId: r1.id, date: iso(75), stringName: "Solinco Hyper-G",
          gauge: "1.25", tensionMain: 51, tensionCross: 49, metersUsed: 12,
          stringCost: 60, laborPrice: 40, totalCharged: 100,
          feedback: { control: 5, power: 3, spin: 5, comfort: 4, durability: 4, comment: "Setup ideal até agora.", ratedAt: iso(60) },
        },
        {
          id: "demo-j4", racquetId: r2.id, date: iso(50), stringName: "Luxilon ALU Power",
          gauge: "1.25", tensionMain: 52, tensionCross: 51, metersUsed: 12,
          stringCost: 75, laborPrice: 40, totalCharged: 120,
          feedback: { control: 5, power: 3, spin: 3, comfort: 3, durability: 3, ratedAt: iso(40) },
        },
        {
          id: "demo-j5", racquetId: r3.id, date: iso(30), stringName: "Tecnifibre X-One Biphase",
          gauge: "1.30", tensionMain: 53, tensionCross: 53, metersUsed: 12,
          stringCost: 90, laborPrice: 40, totalCharged: 135,
          feedback: { control: 3, power: 5, spin: 2, comfort: 5, durability: 3, comment: "Confortável demais, quer mais controle.", ratedAt: iso(20) },
        },
      ];
      const stock: StockItem[] = [
        {
          id: "demo-s1", stringName: "Solinco Hyper-G", gauge: "1.25", kind: "Rolo",
          totalMeters: 200, remainingMeters: 152, cost: 850, createdAt: iso(120),
        },
        {
          id: "demo-s2", stringName: "Babolat RPM Blast", gauge: "1.25", kind: "Rolo",
          totalMeters: 200, remainingMeters: 68, cost: 900, createdAt: iso(300),
        },
        {
          id: "demo-s3", stringName: "Tecnifibre X-One Biphase", gauge: "1.30", kind: "Set",
          totalMeters: 12, remainingMeters: 12, cost: 90, createdAt: iso(15),
        },
      ];
      d.players = [p1, p2];
      d.racquets = [r1, r2, r3];
      d.jobs = jobs.sort((a, b) => +new Date(b.date) - +new Date(a.date));
      d.stock = stock;
      d.offeredStrings = [
        "Babolat RPM Blast 17/1.25",
        "Luxilon ALU Power 125/16L",
        "Solinco Hyper-G 16L (1.25)",
        "Tecnifibre X-One Biphase 16",
      ];
    });
  },
};
