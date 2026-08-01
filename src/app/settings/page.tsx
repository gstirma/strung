"use client";

import { useRef, useState } from "react";
import { useDB, actions } from "@/lib/store";
import { Card, Btn, Field, inputCls, SectionTitle } from "@/components/ui";
import { Download, Upload, Trash2 } from "lucide-react";

export default function SettingsPage() {
  const db = useDB();
  const [s, setS] = useState(db.settings);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const save = () => {
    actions.saveSettings(s);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const exportJson = () => {
    const blob = new Blob([actions.exportAll()], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `backup-encordoamento-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const importJson = (file: File) => {
    file.text().then((txt) => {
      if (actions.importAll(txt)) alert("Backup importado com sucesso!");
      else alert("Arquivo inválido.");
    });
  };

  return (
    <div>
      <h1 className="mb-4 text-lg font-bold text-white">Configurações</h1>

      <Card className="flex flex-col gap-3">
        <Field label="Nome do negócio">
          <input className={inputCls} value={s.businessName} onChange={(e) => setS({ ...s, businessName: e.target.value })} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Unidade de tensão">
            <select className={inputCls} value={s.tensionUnit} onChange={(e) => setS({ ...s, tensionUnit: e.target.value as "kg" | "lb" })}>
              <option value="kg">kg</option>
              <option value="lb">lb</option>
            </select>
          </Field>
          <Field label="Mão de obra padrão (R$)">
            <input className={inputCls} type="number" value={s.defaultLabor} onChange={(e) => setS({ ...s, defaultLabor: +e.target.value })} />
          </Field>
          <Field label="Metros por set (padrão)">
            <input className={inputCls} type="number" value={s.defaultMeters} onChange={(e) => setS({ ...s, defaultMeters: +e.target.value })} />
          </Field>
        </div>
        <Btn variant="lime" onClick={save}>{saved ? "Salvo ✓" : "Salvar configurações"}</Btn>
      </Card>

      <SectionTitle>Backup dos dados</SectionTitle>
      <Card className="flex flex-col gap-2">
        <p className="text-xs text-slate-400">
          Seus dados ficam salvos neste aparelho (funciona offline). Exporte um backup
          regularmente — e importe em outro aparelho para migrar.
        </p>
        <div className="flex gap-2">
          <Btn variant="ghost" onClick={exportJson} className="flex-1"><Download size={14} /> Exportar</Btn>
          <Btn variant="ghost" onClick={() => fileRef.current?.click()} className="flex-1"><Upload size={14} /> Importar</Btn>
          <input ref={fileRef} type="file" accept="application/json" className="hidden"
            onChange={(e) => e.target.files?.[0] && importJson(e.target.files[0])} />
        </div>
      </Card>

      <SectionTitle>Instalar no celular</SectionTitle>
      <Card className="text-xs leading-relaxed text-slate-400">
        <b className="text-slate-200">iPhone:</b> abra no Safari → Compartilhar → “Adicionar à Tela de Início”.<br />
        <b className="text-slate-200">Android:</b> abra no Chrome → menu ⋮ → “Instalar aplicativo”.
      </Card>

      <SectionTitle>Zona de perigo</SectionTitle>
      <Card>
        <Btn variant="danger" onClick={() => {
          if (confirm("Apagar TODOS os dados deste aparelho? Faça um backup antes!")) actions.wipe();
        }}>
          <Trash2 size={14} /> Apagar todos os dados
        </Btn>
      </Card>

      <p className="mt-8 text-center text-[10px] text-slate-600">
        {s.businessName} · Gestão de Encordoamento<br />
        Qualidade · Precisão · Performance
      </p>
    </div>
  );
}
