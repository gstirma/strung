"use client";

// Geração de PDFs para envio ao cliente (WhatsApp/e-mail):
//  - Prontuário da Raquete (relatório completo)
//  - Comprovante de encordoamento (serviço individual)
// @react-pdf/renderer é importado dinamicamente (bundle pesado).

import React from "react";
import { DB, Racquet, StringJob, Player } from "./types";
import { jobsOfRacquet, suggestNextTension, fmtBRL, fmtDate, otherUnit } from "./logic";
import {
  findString, materialPT, stringProfile, stringHeadline, tensionCurve, usageAdvice,
} from "./twu-data";

const NAVY = "#0a1220";
const BLUE = "#2563eb";
const SKY = "#38bdf8";
const LIME = "#a3cc16";
const LIME_DARK = "#65a30d";
const GRAY = "#64748b";

/* eslint-disable @typescript-eslint/no-explicit-any */
async function lib() {
  return await import("@react-pdf/renderer");
}

/**
 * As fontes padrão do PDF (Helvetica/WinAnsi) não têm setas e alguns símbolos.
 * Troca pelos equivalentes que existem, para não sair caractere errado.
 */
function pdfSafe(t: string): string {
  return t
    .replace(/→/g, "->")
    .replace(/←/g, "<-")
    .replace(/[≥]/g, ">=")
    .replace(/[≤]/g, "<=")
    .replace(/…/g, "...")
    .replace(/[–—]/g, "-");
}

function fbText(j: StringJob): string {
  const f = j.feedback;
  if (!f) return "sem avaliação";
  const parts = [
    f.control != null && `controle ${f.control}/5`,
    f.power != null && `potência ${f.power}/5`,
    f.spin != null && `spin ${f.spin}/5`,
    f.comfort != null && `conforto ${f.comfort}/5`,
    f.durability != null && `durab. ${f.durability}/5`,
  ].filter(Boolean);
  return parts.join(" · ") || "sem avaliação";
}

function baseStyles(StyleSheet: any) {
  return StyleSheet.create({
    page: { padding: 32, fontSize: 10, fontFamily: "Helvetica", color: "#1e293b" },
    header: {
      backgroundColor: NAVY, borderRadius: 10, padding: 16, marginBottom: 14,
      flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    },
    brand: { color: "#ffffff", fontSize: 17, fontFamily: "Helvetica-BoldOblique" },
    brandSub: { color: LIME, fontSize: 8, marginTop: 3, letterSpacing: 1.5 },
    slogan: { color: "#94a3b8", fontSize: 7, marginTop: 4, fontFamily: "Helvetica-Oblique" },
    h2: {
      fontSize: 11, fontFamily: "Helvetica-Bold", color: BLUE,
      marginTop: 12, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1,
    },
    row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 3 },
    label: { color: GRAY },
    value: { fontFamily: "Helvetica-Bold" },
    tHead: {
      flexDirection: "row", backgroundColor: "#eff6ff", borderRadius: 4,
      paddingVertical: 4, paddingHorizontal: 6, marginBottom: 2,
      fontFamily: "Helvetica-Bold", fontSize: 8, color: BLUE,
    },
    tRow: {
      flexDirection: "row", paddingVertical: 4, paddingHorizontal: 6,
      borderBottomWidth: 0.5, borderBottomColor: "#e2e8f0", fontSize: 8,
    },
    big: { fontSize: 26, fontFamily: "Helvetica-Bold", color: BLUE },
    footer: {
      position: "absolute", bottom: 24, left: 32, right: 32,
      textAlign: "center", fontSize: 7, color: GRAY,
      borderTopWidth: 0.5, borderTopColor: "#e2e8f0", paddingTop: 6,
    },
    chip: {
      backgroundColor: "#f1f5f9", borderRadius: 8, paddingVertical: 2,
      paddingHorizontal: 6, marginRight: 4, fontSize: 8,
    },
    chips: { flexDirection: "row", flexWrap: "wrap", marginTop: 4 },
    note: { fontSize: 8, color: GRAY, marginTop: 2, fontFamily: "Helvetica-Oblique" },
  });
}

function Header({ Text, View, s, business, title, compact }: any) {
  return (
    <View style={s.header}>
      <View style={{ flex: 1, paddingRight: 10 }}>
        <Text style={s.brand}>{business}</Text>
        <Text style={s.brandSub}>
          {compact ? "ENCORDOAMENTO" : "PROFESSOR DE TÊNIS E ENCORDOADOR"}
        </Text>
        <Text style={s.slogan}>“Sua raquete em boas mãos. Sua evolução em primeiro lugar.”</Text>
      </View>
      <Text style={{ color: SKY, fontSize: 9, fontFamily: "Helvetica-Bold", textAlign: "right" }}>
        {title}
      </Text>
    </View>
  );
}

/* ---------- Gráficos desenhados em vetor, nativos do PDF ---------- */

const PROFILE_ROWS: [keyof NonNullable<ReturnType<typeof stringProfile>>, string][] = [
  ["spin", "Spin"],
  ["control", "Controle"],
  ["power", "Potência"],
  ["comfort", "Conforto"],
  ["stability", "Estabilidade"],
];

/** Barras 1–5 do perfil da corda */
function ProfileChart({ Svg, Rect, SvgText, string: str, width = 250 }: any) {
  const p = stringProfile(str);
  if (!p) return null;
  const rowH = 15;
  const labelW = 62;
  const barW = width - labelW - 16;
  const cell = barW / 5;
  const height = PROFILE_ROWS.length * rowH + 4;

  return (
    <Svg width={width} height={height}>
      {PROFILE_ROWS.map(([key, label], i) => {
        const y = i * rowH + 2;
        const v = p[key];
        return (
          <React.Fragment key={key}>
            <SvgText x={0} y={y + 8} fill={GRAY} style={{ fontSize: 7 }}>{label}</SvgText>
            {[0, 1, 2, 3, 4].map((n) => (
              <Rect key={n} x={labelW + n * cell} y={y + 1} width={cell - 2.5} height={7} rx={3}
                fill={v >= n + 1 ? (v >= 4 ? LIME : SKY) : "#e2e8f0"} />
            ))}
            <SvgText x={width - 8} y={y + 8} fill="#1e293b" style={{ fontSize: 7 }}>{String(v)}</SvgText>
          </React.Fragment>
        );
      })}
    </Svg>
  );
}

/** Curva de queda da tensão da corda ao longo do uso */
function DecayChart({
  Svg, Polyline, Line, Circle, SvgText, string: str, tension, unit, width = 500, height = 128,
}: any) {
  const curve = tensionCurve(str, tension, unit);
  if (curve.length === 0) return null;

  const padL = 30, padR = 8, padT = 10, padB = 18;
  const w = width - padL - padR;
  const h = height - padT - padB;
  const vals = curve.map((c: { tension: number }) => c.tension);
  const min = Math.min(...vals) - 0.6;
  const max = Math.max(...vals) + 0.4;
  const x = (i: number) => padL + (i / (curve.length - 1)) * w;
  const y = (v: number) => padT + h - ((v - min) / (max - min || 1)) * h;

  const pts = curve.map((c: { tension: number }, i: number) => `${x(i)},${y(c.tension)}`).join(" ");
  const ticks = [max, (max + min) / 2, min];

  return (
    <Svg width={width} height={height}>
      {ticks.map((t, i) => (
        <React.Fragment key={i}>
          <Line x1={padL} y1={y(t)} x2={width - padR} y2={y(t)} strokeWidth={0.5} stroke="#e2e8f0" />
          <SvgText x={0} y={y(t) + 2.5} fill={GRAY} style={{ fontSize: 6 }}>{t.toFixed(1)}</SvgText>
        </React.Fragment>
      ))}
      <Polyline points={pts} fill="none" stroke={BLUE} strokeWidth={1.6} />
      {curve.map((c: { tension: number; label: string }, i: number) => (
        <React.Fragment key={i}>
          <Circle cx={x(i)} cy={y(c.tension)} r={2} fill={BLUE} />
          <SvgText x={x(i)} y={height - 6} fill={GRAY} style={{ fontSize: 6 }} textAnchor="middle">
            {c.label}
          </SvgText>
        </React.Fragment>
      ))}
      <SvgText x={padL} y={padT - 2} fill={GRAY} style={{ fontSize: 6 }}>{unit}</SvgText>
    </Svg>
  );
}

/** Evolução da tensão: principal (cheia) e travessa (tracejada), como no app */
function HistoryChart({
  Svg, Polyline, Line, Circle, SvgText, jobs, unit, width = 500, height = 130,
}: any) {
  if (jobs.length < 2) return null;
  const padL = 30, padR = 8, padT = 12, padB = 26;
  const w = width - padL - padR;
  const h = height - padT - padB;
  const mains = jobs.map((j: StringJob) => j.tensionMain);
  const crosses = jobs.map((j: StringJob) => j.tensionCross ?? j.tensionMain);
  const all = [...mains, ...crosses];
  const min = Math.min(...all) - 1;
  const max = Math.max(...all) + 1;
  const x = (i: number) => padL + (i / (jobs.length - 1)) * w;
  const y = (v: number) => padT + h - ((v - min) / (max - min || 1)) * h;
  const mainPts = mains.map((v: number, i: number) => `${x(i)},${y(v)}`).join(" ");
  const crossPts = crosses.map((v: number, i: number) => `${x(i)},${y(v)}`).join(" ");
  const hasCross = crosses.some((c: number, i: number) => c !== mains[i]);
  const ticks = [max, (max + min) / 2, min];
  const legendY = height - 4;

  return (
    <Svg width={width} height={height}>
      {ticks.map((t, i) => (
        <React.Fragment key={i}>
          <Line x1={padL} y1={y(t)} x2={width - padR} y2={y(t)} strokeWidth={0.5} stroke="#e2e8f0" />
          <SvgText x={0} y={y(t) + 2.5} fill={GRAY} style={{ fontSize: 6 }}>{t.toFixed(1)}</SvgText>
        </React.Fragment>
      ))}

      <Polyline points={mainPts} fill="none" stroke={BLUE} strokeWidth={1.8} />
      {hasCross && (
        <Polyline points={crossPts} fill="none" stroke={LIME_DARK} strokeWidth={1.4}
          strokeDasharray="4 3" />
      )}

      {jobs.map((j: StringJob, i: number) => (
        <React.Fragment key={j.id}>
          <Circle cx={x(i)} cy={y(mains[i])} r={2.2} fill={BLUE} />
          {hasCross && <Circle cx={x(i)} cy={y(crosses[i])} r={1.8} fill={LIME_DARK} />}
          <SvgText x={x(i)} y={padT + h + 9} fill={GRAY} style={{ fontSize: 5.5 }} textAnchor="middle">
            {new Date(j.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
          </SvgText>
        </React.Fragment>
      ))}

      <SvgText x={padL} y={padT - 3} fill={GRAY} style={{ fontSize: 6 }}>{unit}</SvgText>
      <Line x1={padL} y1={legendY - 2} x2={padL + 12} y2={legendY - 2} stroke={BLUE} strokeWidth={1.8} />
      <SvgText x={padL + 16} y={legendY} fill={GRAY} style={{ fontSize: 6 }}>Principal</SvgText>
      {hasCross && (
        <>
          <Line x1={padL + 62} y1={legendY - 2} x2={padL + 74} y2={legendY - 2}
            stroke={LIME_DARK} strokeWidth={1.4} strokeDasharray="4 3" />
          <SvgText x={padL + 78} y={legendY} fill={GRAY} style={{ fontSize: 6 }}>Travessa</SvgText>
        </>
      )}
    </Svg>
  );
}

/** Radar do desempenho percebido pelo jogador — mesmo formato do app */
const RADAR_AXES: [keyof NonNullable<StringJob["feedback"]>, string][] = [
  ["control", "Controle"],
  ["power", "Potência"],
  ["spin", "Spin"],
  ["comfort", "Conforto"],
  ["durability", "Durabilidade"],
];

function RadarChart({
  Svg, Polygon, Line, SvgText, current, previous, size = 190,
}: any) {
  if (!current) return null;
  const cx = size / 2;
  const cy = size / 2 + 4;
  const R = size / 2 - 30;
  const n = RADAR_AXES.length;
  const angle = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const pt = (i: number, v: number) => {
    const r = (Math.max(0, Math.min(5, v)) / 5) * R;
    return [cx + r * Math.cos(angle(i)), cy + r * Math.sin(angle(i))];
  };
  const poly = (fb: NonNullable<StringJob["feedback"]>) =>
    RADAR_AXES.map(([k], i) => pt(i, (fb[k] as number) ?? 0).join(",")).join(" ");

  return (
    <Svg width={size} height={size}>
      {[1, 2, 3, 4, 5].map((ring) => (
        <Polygon key={ring}
          points={RADAR_AXES.map((_, i) => pt(i, ring).join(",")).join(" ")}
          fill="none" stroke="#e2e8f0" strokeWidth={0.4} />
      ))}
      {RADAR_AXES.map((_, i) => {
        const [px, py] = pt(i, 5);
        return <Line key={i} x1={cx} y1={cy} x2={px} y2={py} stroke="#e2e8f0" strokeWidth={0.4} />;
      })}

      {previous && (
        <Polygon points={poly(previous)} fill="#94a3b8" fillOpacity={0.28}
          stroke="#94a3b8" strokeWidth={1} />
      )}
      <Polygon points={poly(current)} fill={LIME} fillOpacity={0.35} stroke={LIME_DARK} strokeWidth={1.2} />

      {RADAR_AXES.map(([, label], i) => {
        const [px, py] = pt(i, 6.1);
        return (
          <SvgText key={label} x={px} y={py + 2} fill={GRAY} style={{ fontSize: 6 }} textAnchor="middle">
            {label}
          </SvgText>
        );
      })}
    </Svg>
  );
}

function Footer({ Text, s, business }: any) {
  return (
    <Text style={s.footer} fixed>
      {business} · Qualidade · Precisão · Performance · Emitido em {new Date().toLocaleDateString("pt-BR")}
    </Text>
  );
}

// ---------- Prontuário da Raquete ----------

export async function racquetReportBlob(db: DB, racquet: Racquet): Promise<Blob> {
  const {
    Document, Page, Text, View, StyleSheet, pdf,
    Svg, Rect, Line, Circle, Polyline, Polygon, Text: SvgText,
  } = (await lib()) as any;
  const s = baseStyles(StyleSheet);
  const player = db.players.find((p) => p.id === racquet.playerId);
  const jobs = jobsOfRacquet(db, racquet.id);
  const last = jobs[jobs.length - 1];
  const unit = db.settings.tensionUnit;
  const sug = suggestNextTension(db, racquet.id, unit);
  const twu = last ? findString(last.stringName) : undefined;
  const business = db.settings.businessName;
  const offered = db.offeredStrings
    .map((n) => findString(n))
    .filter((x): x is NonNullable<typeof x> => !!x);
  const advice = twu ? usageAdvice(twu, player?.hoursPerWeek) : null;
  const ratedJobs = jobs.filter((j) => j.feedback);

  const doc = (
    <Document title={`Prontuário — ${racquet.brand} ${racquet.model}`}>
      <Page size="A4" style={s.page}>
        <Header Text={Text} View={View} s={s} business={business} title="PRONTUÁRIO DA RAQUETE" />

        <Text style={{ fontSize: 16, fontFamily: "Helvetica-Bold" }}>
          {racquet.brand} {racquet.model}
        </Text>
        <View style={s.chips}>
          {player && <Text style={s.chip}>Jogador: {player.name}</Text>}
          {player?.level && <Text style={s.chip}>{player.level}</Text>}
          {racquet.headSize != null && <Text style={s.chip}>{racquet.headSize} pol²</Text>}
          {racquet.weight != null && <Text style={s.chip}>{racquet.weight} g</Text>}
          {racquet.pattern && <Text style={s.chip}>{racquet.pattern}</Text>}
          {racquet.gripSize && <Text style={s.chip}>grip {racquet.gripSize}</Text>}
        </View>

        {last && (
          <>
            <Text style={s.h2}>Corda atual</Text>
            <View style={{ ...s.row, alignItems: "flex-end" }}>
              <Text style={{ ...s.value, fontSize: 12 }}>{last.stringName} {last.gauge ?? ""}</Text>
              <View>
                <Text style={s.big}>{last.tensionMain}{last.tensionCross && last.tensionCross !== last.tensionMain ? `/${last.tensionCross}` : ""} {unit}</Text>
                <Text style={{ fontSize: 8, color: GRAY, textAlign: "right" }}>{otherUnit(last.tensionMain, unit)}</Text>
              </View>
            </View>
            <View style={s.row}>
              <Text style={s.label}>Encordoada em {fmtDate(last.date)}{last.brokeAt ? ` · quebrou em ${fmtDate(last.brokeAt)}` : ""}</Text>
            </View>
            {twu && (
              <Text style={s.note}>
                {stringHeadline(twu)}
                {twu.stiffness != null && ` · rigidez ${twu.stiffness} lb/pol`}
                {twu.tensionLoss != null && ` · perda de tensão ${twu.tensionLoss}%`}
                {twu.energyReturn != null && ` · retorno de energia ${twu.energyReturn}%`}
                {twu.spin != null && ` · potencial de spin ${twu.spin}`}
              </Text>
            )}
          </>
        )}

        {twu && (
          <>
            <Text style={s.h2}>Características desta corda</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <ProfileChart Svg={Svg} Rect={Rect} SvgText={SvgText} string={twu} width={240} />
              <View style={{ flex: 1, paddingLeft: 12 }}>
                <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold" }}>{stringHeadline(twu)}</Text>
                <Text style={{ fontSize: 7.5, color: GRAY, marginTop: 3 }}>
                  Notas de 1 a 5 comparando esta corda com as ~780 medidas em laboratório
                  pela Tennis Warehouse University.
                </Text>
              </View>
            </View>

            {last && (
              <>
                <Text style={s.h2}>Quanto a tensão cai com o uso</Text>
                <DecayChart Svg={Svg} Polyline={Polyline} Line={Line} Circle={Circle}
                  SvgText={SvgText} string={twu} tension={last.tensionMain} unit={unit} width={505} />
                <Text style={s.note}>
                  Partindo de {last.tensionMain} {unit}: a corda perde tensão já na puxada,
                  acomoda nas primeiras 24 h e continua caindo a cada impacto.
                  {advice && ` Recomendação de troca: por volta de ${advice.hours} h de jogo${
                    advice.weeks ? ` (~${advice.weeks} semanas para este jogador)` : ""
                  } — ${pdfSafe(advice.reason)}`}
                </Text>
              </>
            )}
          </>
        )}

        {jobs.length >= 2 && (
          <>
            <Text style={s.h2}>Evolução da tensão nos encordoamentos</Text>
            <HistoryChart Svg={Svg} Polyline={Polyline} Line={Line} Circle={Circle}
              SvgText={SvgText} jobs={jobs} unit={unit} width={505} />
          </>
        )}

        {ratedJobs.length > 0 && (
          <View wrap={false}>
            <Text style={s.h2}>Desempenho percebido pelo jogador</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <RadarChart Svg={Svg} Polygon={Polygon} Line={Line} SvgText={SvgText}
                current={ratedJobs[ratedJobs.length - 1].feedback}
                previous={ratedJobs.length >= 2 ? ratedJobs[ratedJobs.length - 2].feedback : undefined}
                size={190} />
              <View style={{ flex: 1, paddingLeft: 10 }}>
                <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold", color: LIME_DARK }}>
                  Atual: {ratedJobs[ratedJobs.length - 1].stringName}
                </Text>
                {ratedJobs.length >= 2 && (
                  <Text style={{ fontSize: 8, color: "#94a3b8", marginTop: 2 }}>
                    Anterior: {ratedJobs[ratedJobs.length - 2].stringName}
                  </Text>
                )}
                <Text style={{ fontSize: 7.5, color: GRAY, marginTop: 5 }}>
                  Notas de 1 a 5 dadas pelo jogador após cada encordoamento. É o que alimenta
                  a sugestão da próxima tensão.
                </Text>
              </View>
            </View>
          </View>
        )}

        {sug && (
          <>
            <Text style={s.h2}>Sugestão para o próximo encordoamento</Text>
            <Text style={{ fontSize: 14, fontFamily: "Helvetica-Bold", color: BLUE }}>
              {sug.tension} {unit}{sug.cross !== sug.tension ? ` / ${sug.cross} ${unit} travessa` : ""}
            </Text>
            {sug.rationale.map((r, i) => (
              <Text key={i} style={{ fontSize: 8, color: GRAY, marginTop: 2 }}>• {pdfSafe(r)}</Text>
            ))}
          </>
        )}

        {offered.length > 0 && (
          <>
            <Text style={s.h2}>Cordas disponíveis para o próximo serviço</Text>
            <View style={s.tHead}>
              <Text style={{ width: "42%" }}>Corda</Text>
              <Text style={{ width: "22%" }}>Material</Text>
              <Text style={{ width: "12%" }}>Rigidez</Text>
              <Text style={{ width: "12%" }}>Spin</Text>
              <Text style={{ width: "12%" }}>Estabil.</Text>
            </View>
            {offered.map((o) => (
              <View key={o.name} style={s.tRow} wrap={false}>
                <Text style={{ width: "42%" }}>{o.name}</Text>
                <Text style={{ width: "22%" }}>{materialPT(o.material)}</Text>
                <Text style={{ width: "12%" }}>{o.stiffness != null ? `${o.stiffness}` : "—"}</Text>
                <Text style={{ width: "12%" }}>{o.spin != null ? `${o.spin}` : "—"}</Text>
                <Text style={{ width: "12%" }}>{o.tensionLoss != null ? `${o.tensionLoss}%` : "—"}</Text>
              </View>
            ))}
            <Text style={s.note}>
              Rigidez menor = mais conforto · Spin maior = mais efeito · Estabilidade = perda de tensão (menor é melhor). Fonte: Tennis Warehouse University.
            </Text>
          </>
        )}

        <Text style={s.h2}>Histórico de encordoamentos ({jobs.length})</Text>
        <View style={s.tHead}>
          <Text style={{ width: "16%" }}>Data</Text>
          <Text style={{ width: "34%" }}>Corda</Text>
          <Text style={{ width: "14%" }}>Tensão</Text>
          <Text style={{ width: "36%" }}>Avaliação do jogador</Text>
        </View>
        {[...jobs].reverse().map((j) => (
          <View key={j.id} style={s.tRow} wrap={false}>
            <Text style={{ width: "16%" }}>{fmtDate(j.date)}</Text>
            <Text style={{ width: "34%" }}>{j.stringName} {j.gauge ?? ""}{j.brokeAt ? ` (quebrou ${fmtDate(j.brokeAt)})` : ""}</Text>
            <Text style={{ width: "14%" }}>{j.tensionMain}{j.tensionCross && j.tensionCross !== j.tensionMain ? `/${j.tensionCross}` : ""} {unit}</Text>
            <Text style={{ width: "36%" }}>{fbText(j)}{j.feedback?.comment ? ` — “${pdfSafe(j.feedback.comment)}”` : ""}</Text>
          </View>
        ))}

        <Footer Text={Text} s={s} business={business} />
      </Page>
    </Document>
  );
  return await pdf(doc).toBlob();
}

// ---------- Comprovante de serviço ----------

export async function jobReceiptBlob(db: DB, job: StringJob): Promise<Blob> {
  const {
    Document, Page, Text, View, StyleSheet, pdf,
    Svg, Rect, Line, Circle, Polyline, Text: SvgText,
  } = (await lib()) as any;
  const s = baseStyles(StyleSheet);
  const racquet = db.racquets.find((r) => r.id === job.racquetId);
  const player: Player | undefined = racquet
    ? db.players.find((p) => p.id === racquet.playerId)
    : undefined;
  const unit = db.settings.tensionUnit;
  const business = db.settings.businessName;
  const twu = findString(job.stringName);
  const offered = db.offeredStrings
    .map((n) => findString(n))
    .filter((x): x is NonNullable<typeof x> => !!x);
  const advice = twu ? usageAdvice(twu, player?.hoursPerWeek) : null;

  const doc = (
    <Document title={`Encordoamento — ${fmtDate(job.date)}`}>
      <Page size="A4" style={s.page}>
        <Header Text={Text} View={View} s={s} business={business} title="COMPROVANTE" compact />

        <View style={s.row}>
          <Text style={s.label}>Data</Text>
          <Text style={s.value}>{fmtDate(job.date)}</Text>
        </View>
        {player && (
          <View style={s.row}>
            <Text style={s.label}>Jogador</Text>
            <Text style={s.value}>{player.name}</Text>
          </View>
        )}
        {racquet && (
          <View style={s.row}>
            <Text style={s.label}>Raquete</Text>
            <Text style={s.value}>{racquet.brand} {racquet.model}</Text>
          </View>
        )}
        <View style={s.row}>
          <Text style={s.label}>Corda</Text>
          <Text style={s.value}>{job.stringName} {job.gauge ?? ""}</Text>
        </View>
        <View style={s.row}>
          <Text style={s.label}>Tensão</Text>
          <View>
            <Text style={s.big}>{job.tensionMain}{job.tensionCross && job.tensionCross !== job.tensionMain ? `/${job.tensionCross}` : ""} {unit}</Text>
            <Text style={{ fontSize: 8, color: GRAY, textAlign: "right" }}>{otherUnit(job.tensionMain, unit)}</Text>
          </View>
        </View>
        {twu && (
          <Text style={s.note}>
            {stringHeadline(twu)}
            {twu.stiffness != null && ` · rigidez ${twu.stiffness} lb/pol (TWU)`}
            {twu.spin != null && ` · potencial de spin ${twu.spin}`}
          </Text>
        )}

        {twu && (
          <>
            <Text style={s.h2}>Perfil da corda</Text>
            <ProfileChart Svg={Svg} Rect={Rect} SvgText={SvgText} string={twu} width={300} />

            <Text style={s.h2}>Queda da tensão com o uso</Text>
            <DecayChart Svg={Svg} Polyline={Polyline} Line={Line} Circle={Circle}
              SvgText={SvgText} string={twu} tension={job.tensionMain} unit={unit} width={505} height={125} />
            {advice && (
              <Text style={s.note}>
                Troca recomendada por volta de {advice.hours} h de jogo
                {advice.weeks ? ` (~${advice.weeks} semanas no seu ritmo)` : ""} — {pdfSafe(advice.reason)}
              </Text>
            )}
          </>
        )}

        <Text style={s.h2}>Valores</Text>
        {job.stringCost != null && (
          <View style={s.row}><Text style={s.label}>Corda</Text><Text>{fmtBRL(job.stringCost)}</Text></View>
        )}
        {job.laborPrice != null && (
          <View style={s.row}><Text style={s.label}>Mão de obra</Text><Text>{fmtBRL(job.laborPrice)}</Text></View>
        )}
        <View style={s.row}>
          <Text style={s.value}>Total</Text>
          <Text style={{ ...s.value, color: BLUE, fontSize: 13 }}>{fmtBRL(job.totalCharged)}</Text>
        </View>

        <Text style={s.h2}>Quando trocar?</Text>
        <Text style={{ fontSize: 8, color: GRAY }}>
          Recomendação {business}: troque as cordas a cada 3–4 meses ou 15–20 horas de jogo —
          perda de potência, perda de controle e cordas desfiadas são os sinais de alerta.
        </Text>

        {offered.length > 0 && (
          <>
            <Text style={s.h2}>Cordas que trabalhamos</Text>
            {offered.map((o) => (
              <View key={o.name} style={s.row} wrap={false}>
                <Text style={{ fontSize: 8 }}>{o.name}</Text>
                <Text style={{ fontSize: 8, color: GRAY }}>
                  {materialPT(o.material)}
                  {o.stiffness != null && ` · rigidez ${o.stiffness}`}
                  {o.spin != null && ` · spin ${o.spin}`}
                </Text>
              </View>
            ))}
          </>
        )}

        {job.notes && (
          <>
            <Text style={s.h2}>Observações</Text>
            <Text style={{ fontSize: 8 }}>{pdfSafe(job.notes)}</Text>
          </>
        )}

        <Footer Text={Text} s={s} business={business} />
      </Page>
    </Document>
  );
  return await pdf(doc).toBlob();
}

// ---------- Compartilhar / baixar ----------

export async function sharePdf(blob: Blob, filename: string) {
  const file = new File([blob], filename, { type: "application/pdf" });
  const nav = navigator as Navigator & { canShare?: (d: { files: File[] }) => boolean };
  if (nav.share && nav.canShare?.({ files: [file] })) {
    try {
      await nav.share({ files: [file], title: filename });
      return;
    } catch {
      // usuário cancelou o share — cai para download
    }
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
