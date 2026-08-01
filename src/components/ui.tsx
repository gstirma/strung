"use client";

import Link from "next/link";
import { ReactNode } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-[#101b2e]/80 p-4 shadow-lg shadow-black/20 ${className}`}>
      {children}
    </div>
  );
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-2 mt-6 flex items-center justify-between">
      <h2 className="text-sm font-semibold uppercase tracking-widest text-sky-300/90">{children}</h2>
      {action}
    </div>
  );
}

export function Btn({
  children, onClick, href, variant = "primary", type, className = "", disabled,
}: {
  children: ReactNode; onClick?: () => void; href?: string;
  variant?: "primary" | "ghost" | "danger" | "lime";
  type?: "button" | "submit"; className?: string; disabled?: boolean;
}) {
  const base = "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition active:scale-[0.98] disabled:opacity-40";
  const styles = {
    primary: "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-900/50",
    lime: "bg-lime-300 text-[#0a1220] shadow-md shadow-lime-900/30",
    ghost: "border border-white/15 text-slate-200 hover:bg-white/5",
    danger: "border border-red-500/40 text-red-400 hover:bg-red-500/10",
  }[variant];
  if (href) return <Link href={href} className={`${base} ${styles} ${className}`}>{children}</Link>;
  return (
    <button type={type ?? "button"} onClick={onClick} disabled={disabled} className={`${base} ${styles} ${className}`}>
      {children}
    </button>
  );
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-slate-500">{hint}</span>}
    </label>
  );
}

export const inputCls =
  "w-full rounded-xl border border-white/15 bg-[#0a1220] px-3 py-2.5 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:border-sky-400";

export function Badge({ children, tone = "slate" }: { children: ReactNode; tone?: "slate" | "lime" | "amber" | "red" | "sky" }) {
  const tones = {
    slate: "bg-white/10 text-slate-300",
    lime: "bg-lime-300/15 text-lime-300",
    amber: "bg-amber-400/15 text-amber-300",
    red: "bg-red-500/15 text-red-400",
    sky: "bg-sky-400/15 text-sky-300",
  }[tone];
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${tones}`}>{children}</span>;
}

// Avaliação 1–5 (bolinhas de tênis)
export function RatingInput({ value, onChange, label }: { value?: number; onChange: (v: number) => void; label: string }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm text-slate-300">{label}</span>
      <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n} type="button" onClick={() => onChange(n)}
            aria-label={`${label}: ${n} de 5`}
            className={`h-7 w-7 rounded-full text-sm leading-7 transition ${
              (value ?? 0) >= n ? "bg-lime-300 text-[#0a1220]" : "bg-white/10 text-slate-500"
            }`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

export function RatingDots({ value, label }: { value?: number; label: string }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-xs text-slate-400">{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <span key={n} className={`h-2.5 w-2.5 rounded-full ${(value ?? 0) >= n ? "bg-lime-300" : "bg-white/10"}`} />
        ))}
      </div>
    </div>
  );
}

export function EmptyState({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <Card className="flex flex-col items-center gap-3 py-10 text-center">
      <span className="text-4xl">🎾</span>
      <p className="font-semibold text-slate-200">{title}</p>
      {subtitle && <p className="max-w-xs text-sm text-slate-400">{subtitle}</p>}
      {action}
    </Card>
  );
}

export function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <Card className="flex-1">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-xl font-bold text-white">{value}</p>
      {sub && <p className="text-xs text-lime-300">{sub}</p>}
    </Card>
  );
}
