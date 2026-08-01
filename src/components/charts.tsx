"use client";

import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend, Area, AreaChart,
} from "recharts";
import { StringJob } from "@/lib/types";
import { TwuString, StringProfile, tensionCurve, stringProfile } from "@/lib/twu-data";

const AXIS = { fontSize: 10, fill: "#7d8aa5" };

// ---------- Perfil da corda: barras de 1 a 5 ----------

const PROFILE_LABELS: [keyof StringProfile, string][] = [
  ["spin", "Spin"],
  ["control", "Controle"],
  ["power", "Potência"],
  ["comfort", "Conforto"],
  ["stability", "Estabilidade"],
];

export function StringProfileBars({ string: s }: { string: TwuString }) {
  const p = stringProfile(s);
  if (!p) return null;
  return (
    <div className="flex flex-col gap-1.5">
      {PROFILE_LABELS.map(([key, label]) => (
        <div key={key} className="flex items-center gap-2">
          <span className="w-24 shrink-0 text-xs text-slate-400">{label}</span>
          <div className="flex flex-1 gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <span
                key={n}
                className={`h-2 flex-1 rounded-full ${
                  p[key] >= n
                    ? p[key] >= 4 ? "bg-lime-300" : "bg-sky-400"
                    : "bg-white/10"
                }`}
              />
            ))}
          </div>
          <span className="w-4 text-right text-xs font-semibold text-slate-300">{p[key]}</span>
        </div>
      ))}
    </div>
  );
}

// ---------- Curva de queda da tensão ----------

export function TensionDecayChart({
  string: s, tension, unit,
}: { string: TwuString; tension: number; unit: "kg" | "lb" }) {
  const curve = tensionCurve(s, tension, unit);
  if (curve.length === 0)
    return <p className="py-4 text-center text-xs text-slate-500">Sem dados de perda de tensão para esta corda.</p>;
  const data = curve.map((p) => ({ label: p.label, Tensão: p.tension }));
  const min = Math.min(...data.map((d) => d.Tensão));
  const max = Math.max(...data.map((d) => d.Tensão));
  return (
    <ResponsiveContainer width="100%" height={170}>
      <AreaChart data={data} margin={{ top: 8, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="decay" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.45} />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#1c2b45" strokeDasharray="3 3" />
        <XAxis dataKey="label" tick={AXIS} tickLine={false} axisLine={false} />
        <YAxis tick={AXIS} tickLine={false} axisLine={false} width={52}
          domain={[Math.floor(min - 1), Math.ceil(max + 0.5)]} unit={` ${unit}`} />
        <Tooltip contentStyle={{ background: "#101b2e", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12, fontSize: 12 }} />
        <Area type="monotone" dataKey="Tensão" stroke="#38bdf8" strokeWidth={2.5} fill="url(#decay)" dot={{ r: 3, fill: "#38bdf8" }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function TensionChart({ jobs, unit }: { jobs: StringJob[]; unit: string }) {
  const data = jobs.map((j) => ({
    date: new Date(j.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }),
    Principal: j.tensionMain,
    Travessa: j.tensionCross ?? j.tensionMain,
  }));
  if (data.length < 2)
    return <p className="py-4 text-center text-xs text-slate-500">Registre mais encordoamentos para ver a evolução da tensão.</p>;
  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={data} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
        <CartesianGrid stroke="#1c2b45" strokeDasharray="3 3" />
        <XAxis dataKey="date" tick={AXIS} tickLine={false} axisLine={false} />
        <YAxis tick={AXIS} tickLine={false} axisLine={false} domain={["dataMin - 1", "dataMax + 1"]} unit={` ${unit}`} width={55} />
        <Tooltip contentStyle={{ background: "#101b2e", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12, fontSize: 12 }} />
        <Line type="monotone" dataKey="Principal" stroke="#38bdf8" strokeWidth={2.5} dot={{ r: 3, fill: "#38bdf8" }} />
        <Line type="monotone" dataKey="Travessa" stroke="#bef264" strokeWidth={2} dot={{ r: 2.5, fill: "#bef264" }} strokeDasharray="4 3" />
      </LineChart>
    </ResponsiveContainer>
  );
}

// Radar comparando o feedback dos dois últimos encordoamentos avaliados
export function FeedbackRadar({ jobs }: { jobs: StringJob[] }) {
  const rated = jobs.filter((j) => j.feedback).slice(-2);
  if (rated.length === 0)
    return <p className="py-4 text-center text-xs text-slate-500">Sem avaliações ainda — avalie após cada encordoamento.</p>;
  const [prev, last] = rated.length === 2 ? rated : [undefined, rated[0]];
  const keys = [
    ["Controle", "control"], ["Potência", "power"], ["Spin", "spin"],
    ["Conforto", "comfort"], ["Durabilidade", "durability"],
  ] as const;
  const data = keys.map(([label, k]) => ({
    attr: label,
    Atual: last?.feedback?.[k] ?? 0,
    ...(prev ? { Anterior: prev.feedback?.[k] ?? 0 } : {}),
  }));
  return (
    <ResponsiveContainer width="100%" height={220}>
      <RadarChart data={data} outerRadius="70%">
        <PolarGrid stroke="#1c2b45" />
        <PolarAngleAxis dataKey="attr" tick={{ fontSize: 10, fill: "#a8b3c7" }} />
        {prev && <Radar name={`Anterior (${prev.stringName})`} dataKey="Anterior" stroke="#64748b" fill="#64748b" fillOpacity={0.25} />}
        <Radar name={`Atual (${last?.stringName})`} dataKey="Atual" stroke="#bef264" fill="#bef264" fillOpacity={0.35} />
        <Legend wrapperStyle={{ fontSize: 10 }} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
