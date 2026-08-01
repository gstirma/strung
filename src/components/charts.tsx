"use client";

import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend,
} from "recharts";
import { StringJob } from "@/lib/types";

const AXIS = { fontSize: 10, fill: "#7d8aa5" };

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
