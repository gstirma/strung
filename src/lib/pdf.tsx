"use client";

// Geração de PDFs para envio ao cliente (WhatsApp/e-mail):
//  - Prontuário da Raquete (relatório completo)
//  - Comprovante de encordoamento (serviço individual)
// @react-pdf/renderer é importado dinamicamente (bundle pesado).

import { DB, Racquet, StringJob, Player } from "./types";
import { jobsOfRacquet, suggestNextTension, fmtBRL, fmtDate } from "./logic";
import { findString, materialPT } from "./twu-data";

const NAVY = "#0a1220";
const BLUE = "#2563eb";
const SKY = "#38bdf8";
const LIME = "#a3cc16";
const GRAY = "#64748b";

/* eslint-disable @typescript-eslint/no-explicit-any */
async function lib() {
  return await import("@react-pdf/renderer");
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
    brand: { color: "#ffffff", fontSize: 20, fontFamily: "Helvetica-BoldOblique" },
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
        <Text style={s.brand}>STRUNG</Text>
        <Text style={s.brandSub}>
          {compact ? business.toUpperCase() : `${business.toUpperCase()} — THE TENNIS STRING MANAGER`}
        </Text>
        <Text style={s.slogan}>“Sua raquete em boas mãos. Sua evolução em primeiro lugar.”</Text>
      </View>
      <Text style={{ color: SKY, fontSize: 9, fontFamily: "Helvetica-Bold", textAlign: "right" }}>
        {title}
      </Text>
    </View>
  );
}

function Footer({ Text, s, business }: any) {
  return (
    <Text style={s.footer} fixed>
      {business} · Qualidade · Precisão · Performance · Gerado pelo STRUNG em {new Date().toLocaleDateString("pt-BR")}
    </Text>
  );
}

// ---------- Prontuário da Raquete ----------

export async function racquetReportBlob(db: DB, racquet: Racquet): Promise<Blob> {
  const { Document, Page, Text, View, StyleSheet, pdf } = await lib();
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
              <Text style={s.big}>{last.tensionMain}{last.tensionCross && last.tensionCross !== last.tensionMain ? `/${last.tensionCross}` : ""} {unit}</Text>
            </View>
            <View style={s.row}>
              <Text style={s.label}>Encordoada em {fmtDate(last.date)}{last.brokeAt ? ` · quebrou em ${fmtDate(last.brokeAt)}` : ""}</Text>
            </View>
            {twu && (
              <Text style={s.note}>
                Dados TWU: {materialPT(twu.material)}
                {twu.stiffness != null && ` · rigidez ${twu.stiffness} lb/pol`}
                {twu.tensionLoss != null && ` · perda de tensão ${twu.tensionLoss}%`}
                {twu.energyReturn != null && ` · retorno de energia ${twu.energyReturn}%`}
                {twu.spin != null && ` · potencial de spin ${twu.spin}`}
              </Text>
            )}
          </>
        )}

        {sug && (
          <>
            <Text style={s.h2}>Sugestão para o próximo encordoamento</Text>
            <Text style={{ fontSize: 14, fontFamily: "Helvetica-Bold", color: BLUE }}>
              {sug.tension} {unit}{sug.cross !== sug.tension ? ` / ${sug.cross} ${unit} travessa` : ""}
            </Text>
            {sug.rationale.map((r, i) => (
              <Text key={i} style={{ fontSize: 8, color: GRAY, marginTop: 2 }}>• {r}</Text>
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
            <Text style={{ width: "36%" }}>{fbText(j)}{j.feedback?.comment ? ` — “${j.feedback.comment}”` : ""}</Text>
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
  const { Document, Page, Text, View, StyleSheet, pdf } = await lib();
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

  const doc = (
    <Document title={`Encordoamento — ${fmtDate(job.date)}`}>
      <Page size="A5" style={s.page}>
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
          <Text style={s.big}>{job.tensionMain}{job.tensionCross && job.tensionCross !== job.tensionMain ? `/${job.tensionCross}` : ""} {unit}</Text>
        </View>
        {twu && (
          <Text style={s.note}>
            {materialPT(twu.material)}
            {twu.stiffness != null && ` · rigidez ${twu.stiffness} lb/pol (TWU)`}
            {twu.spin != null && ` · potencial de spin ${twu.spin}`}
          </Text>
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
            <Text style={{ fontSize: 8 }}>{job.notes}</Text>
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
