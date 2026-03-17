"use client";

import { FormEvent, useMemo, useState } from "react";
import { Eye, Pencil, Plus, Save, Trash2 } from "lucide-react";

import { createEmptyReport } from "@/lib/report-defaults";
import { getLatestReport } from "@/lib/metrics";
import { useWeeklyReports } from "@/lib/use-weekly-reports";
import type { WeeklyReport } from "@/lib/types";

type Mode = "view" | "edit";

function cardTitle(label: string) {
  return <p className="text-xs uppercase tracking-[0.28em] text-slate-500">{label}</p>;
}

function blockTitle(label: string) {
  return <h3 className="text-lg font-semibold text-slate-950">{label}</h3>;
}

function inputClassName() {
  return "w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-950";
}

function textAreaClassName() {
  return "min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-950";
}

function ReportViewer({ report }: { report: WeeklyReport }) {
  return (
    <div className="space-y-5">
      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        {cardTitle("Informacoes gerais")}
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div><p className="text-sm text-slate-500">Empresa</p><p className="mt-1 font-medium text-slate-950">{report.meeting_info.empresa || "-"}</p></div>
          <div><p className="text-sm text-slate-500">Setor</p><p className="mt-1 font-medium text-slate-950">{report.meeting_info.setor || "-"}</p></div>
          <div><p className="text-sm text-slate-500">Data</p><p className="mt-1 font-medium text-slate-950">{report.meeting_info.data_reuniao || "-"}</p></div>
          <div><p className="text-sm text-slate-500">Horario</p><p className="mt-1 font-medium text-slate-950">{report.meeting_info.horario_inicio || "-"} ate {report.meeting_info.horario_fim || "-"}</p></div>
          <div className="md:col-span-2"><p className="text-sm text-slate-500">Participantes</p><p className="mt-1 font-medium text-slate-950">{report.meeting_info.participantes.join(", ") || "-"}</p></div>
          <div><p className="text-sm text-slate-500">Responsavel conducao</p><p className="mt-1 font-medium text-slate-950">{report.meeting_info.responsavel_conducao || "-"}</p></div>
        </div>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        {cardTitle("Indicadores da semana")}
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Object.entries(report.indicators).map(([key, value]) => (
            <div key={key} className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{key.replaceAll("_", " ")}</p>
              <p className="mt-2 text-xl font-semibold text-slate-950">{String(value || "-")}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        {blockTitle("Chamados")}
        <div className="mt-4 space-y-4">
          {report.chamados.map((item) => (
            <article key={item.id} className="rounded-3xl bg-slate-50 p-4">
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <div><p className="text-sm text-slate-500">Cliente</p><p className="font-medium text-slate-950">{item.cliente || "-"}</p></div>
                <div><p className="text-sm text-slate-500">Projeto/painel</p><p className="font-medium text-slate-950">{item.projeto_ou_painel || "-"}</p></div>
                <div><p className="text-sm text-slate-500">Status</p><p className="font-medium text-slate-950">{item.status}</p></div>
                <div><p className="text-sm text-slate-500">Abertura</p><p className="font-medium text-slate-950">{item.data_abertura || "-"} {item.hora_abertura || ""}</p></div>
                <div><p className="text-sm text-slate-500">Resposta</p><p className="font-medium text-slate-950">{item.data_resposta || "-"} {item.hora_resposta || ""}</p></div>
                <div><p className="text-sm text-slate-500">Resolucao</p><p className="font-medium text-slate-950">{item.data_resolucao || "-"} {item.hora_resolucao || ""}</p></div>
                <div className="md:col-span-2 xl:col-span-4"><p className="text-sm text-slate-500">Problema</p><p className="font-medium text-slate-950">{item.descricao_problema || "-"}</p></div>
                <div className="md:col-span-2 xl:col-span-4"><p className="text-sm text-slate-500">Atendimento</p><p className="font-medium text-slate-950">{item.descricao_atendimento || "-"}</p></div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          {blockTitle("Mensagens do chamado")}
          <div className="mt-4 space-y-3">
            {report.mensagens_chamado.map((item) => (
              <div key={item.id} className="rounded-2xl bg-slate-50 p-4">
                <p className="font-medium text-slate-950">{item.chamado_id}</p>
                <p className="mt-1 text-sm text-slate-700">{item.tipo_mensagem} · {item.data_mensagem} {item.hora_mensagem}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          {blockTitle("Pesquisa de satisfacao")}
          <div className="mt-4 space-y-3">
            {report.pesquisa_satisfacao.map((item) => (
              <div key={item.id} className="rounded-2xl bg-slate-50 p-4">
                <p className="font-medium text-slate-950">{item.cliente} · nota {item.nota}</p>
                <p className="mt-1 text-sm text-slate-700">{item.tipo_nps}</p>
                <p className="mt-2 text-sm text-slate-800">{item.comentario_cliente || "-"}</p>
              </div>
            ))}
          </div>
        </section>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          {blockTitle("Clientes em risco / casos criticos")}
          <div className="mt-4 space-y-3">
            {report.clientes_risco.map((item) => (
              <div key={item.id} className="rounded-2xl bg-slate-50 p-4">
                <p className="font-medium text-slate-950">{item.cliente} · {item.status_atual}</p>
                <p className="mt-1 text-sm text-slate-700">{item.projeto_painel}</p>
                <p className="mt-2 text-sm text-slate-800">{item.problema_relato}</p>
                <p className="mt-2 text-sm text-slate-700">Proximo passo: {item.proximo_passo || "-"}</p>
                <p className="mt-1 text-sm text-slate-700">Prazo: {item.prazo || "-"}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          {blockTitle("Instalacoes recentes")}
          <div className="mt-4 space-y-3">
            {report.instalacoes_recentes.map((item) => (
              <div key={item.id} className="rounded-2xl bg-slate-50 p-4">
                <p className="font-medium text-slate-950">{item.cliente}</p>
                <p className="mt-1 text-sm text-slate-700">Instalacao: {item.data_instalacao || "-"}</p>
                <p className="mt-2 text-sm text-slate-800">Contato: {item.contato_pos_instalacao || "-"}</p>
                <p className="mt-1 text-sm text-slate-800">Situacao: {item.situacao_cliente || "-"}</p>
                <p className="mt-1 text-sm text-slate-800">Acoes: {item.acoes_necessarias || "-"}</p>
              </div>
            ))}
          </div>
        </section>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          {blockTitle("Oportunidades comerciais")}
          <div className="mt-4 space-y-3">
            {report.oportunidades_comerciais.map((item) => (
              <div key={item.id} className="rounded-2xl bg-slate-50 p-4">
                <p className="font-medium text-slate-950">{item.cliente}</p>
                <p className="mt-1 text-sm text-slate-700">{item.tipo_oportunidade}</p>
                <p className="mt-2 text-sm text-slate-800">{item.acao_sugerida || "-"}</p>
                <p className="mt-1 text-sm text-slate-700">{item.responsavel} · {item.prazo || "-"}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          {blockTitle("Contato proativo")}
          <div className="mt-4 space-y-3">
            {report.contato_proativo.map((item) => (
              <div key={item.id} className="rounded-2xl bg-slate-50 p-4">
                <p className="font-medium text-slate-950">{item.cliente}</p>
                <p className="mt-1 text-sm text-slate-700">{item.tipo_contato}</p>
              </div>
            ))}
          </div>
        </section>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        {blockTitle("Dificuldades / gargalos")}
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {Object.entries(report.dificuldades).map(([key, value]) => (
            <div key={key} className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{key.replaceAll("_", " ")}</p>
              <p className="mt-2 text-sm leading-6 text-slate-900">{value || "-"}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          {blockTitle("Acoes de melhoria")}
          <div className="mt-4 space-y-3">
            {report.acoes_melhoria.map((item) => (
              <div key={item.id} className="rounded-2xl bg-slate-50 p-4">
                <p className="font-medium text-slate-950">{item.acao}</p>
                <p className="mt-1 text-sm text-slate-700">{item.responsavel} · {item.prazo || "-"}</p>
                <p className="mt-1 text-sm text-slate-700">{item.status}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          {blockTitle("Prioridades da proxima semana")}
          <div className="mt-4 space-y-3">
            {report.prioridades_proxima_semana.map((item, index) => (
              <div key={`${item}-${index}`} className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-900">
                {index + 1}. {item || "-"}
              </div>
            ))}
          </div>
        </section>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          {blockTitle("Observacoes adicionais")}
          <p className="mt-4 text-sm leading-7 text-slate-900">{report.observacoes_gerais || "-"}</p>
        </section>
        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          {blockTitle("Resumo final")}
          <div className="mt-4 space-y-4">
            <div><p className="text-sm text-slate-500">Pontos positivos</p><p className="mt-1 text-sm leading-7 text-slate-900">{report.resumo_final.pontos_positivos_semana || "-"}</p></div>
            <div><p className="text-sm text-slate-500">Pontos de atencao</p><p className="mt-1 text-sm leading-7 text-slate-900">{report.resumo_final.pontos_atencao || "-"}</p></div>
          </div>
        </section>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        {blockTitle("Registro da ata")}
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {Object.entries(report.registro_ata).map(([key, value]) => (
            <div key={key} className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{key.replaceAll("_", " ")}</p>
              <p className="mt-2 font-medium text-slate-950">{value || "-"}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function ReportsManager() {
  const { reports, saveReport, deleteReport, source, loading } = useWeeklyReports();
  const latest = useMemo(() => getLatestReport(reports), [reports]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<WeeklyReport | null>(null);
  const [mode, setMode] = useState<Mode>("view");
  const [message, setMessage] = useState("Selecione um relatorio para visualizar.");

  const selectedReport =
    draft ??
    reports.find((item) => item.id === selectedId) ??
    latest ??
    createEmptyReport();

  function openView(report: WeeklyReport) {
    setSelectedId(report.id);
    setDraft(null);
    setMode("view");
  }

  function openEdit(report: WeeklyReport) {
    setSelectedId(report.id);
    setDraft(JSON.parse(JSON.stringify(report)) as WeeklyReport);
    setMode("edit");
  }

  function openNewReport() {
    const next = createEmptyReport();
    setSelectedId(next.id);
    setDraft(next);
    setMode("edit");
  }

  async function handleDelete(id: string) {
    const result = await deleteReport(id);
    if (!result.ok) {
      setMessage(result.message);
      return;
    }

    setMessage("Relatorio excluido com sucesso.");
    setDraft(null);
    setSelectedId(null);
    setMode("view");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft) return;

    const result = await saveReport(draft);
    if (!result.ok) {
      setMessage(result.message);
      return;
    }

    setMessage(`Relatorio salvo com sucesso (${source === "supabase" ? "Supabase" : "demo"}).`);
    setSelectedId(draft.id);
    setDraft(null);
    setMode("view");
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.72fr_1.28fr]">
      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Relatorios</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">Lista de registros</h2>
          </div>
          <button
            type="button"
            onClick={openNewReport}
            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white"
          >
            <Plus className="h-4 w-4" />
            Novo
          </button>
        </div>

        <p className="mt-4 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
          {loading ? "Carregando..." : message}
        </p>

        <div className="mt-5 space-y-3">
          {reports.map((report) => (
            <article key={report.id} className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                {report.indicators.periodo_inicio} ate {report.indicators.periodo_fim}
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-950">{report.meeting_info.empresa}</p>
              <p className="mt-1 text-sm text-slate-600">
                {report.meeting_info.setor} · {report.meeting_info.data_reuniao}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" onClick={() => openView(report)} className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900">
                  <Eye className="h-4 w-4" />
                  Visualizar
                </button>
                <button type="button" onClick={() => openEdit(report)} className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900">
                  <Pencil className="h-4 w-4" />
                  Editar
                </button>
                <button type="button" onClick={() => void handleDelete(report.id)} className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                  <Trash2 className="h-4 w-4" />
                  Excluir
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {mode === "view" ? (
        <ReportViewer report={selectedReport} />
      ) : (
        <form className="space-y-5" onSubmit={handleSubmit}>
          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            {cardTitle("Edicao rapida")}
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <input className={inputClassName()} placeholder="Empresa" value={selectedReport.meeting_info.empresa} onChange={(event) => setDraft({ ...selectedReport, meeting_info: { ...selectedReport.meeting_info, empresa: event.target.value } })} />
              <input className={inputClassName()} placeholder="Setor" value={selectedReport.meeting_info.setor} onChange={(event) => setDraft({ ...selectedReport, meeting_info: { ...selectedReport.meeting_info, setor: event.target.value } })} />
              <input type="date" className={inputClassName()} value={selectedReport.meeting_info.data_reuniao} onChange={(event) => setDraft({ ...selectedReport, meeting_info: { ...selectedReport.meeting_info, data_reuniao: event.target.value } })} />
              <input type="date" className={inputClassName()} value={selectedReport.indicators.periodo_inicio} onChange={(event) => setDraft({ ...selectedReport, indicators: { ...selectedReport.indicators, periodo_inicio: event.target.value } })} />
              <input type="date" className={inputClassName()} value={selectedReport.indicators.periodo_fim} onChange={(event) => setDraft({ ...selectedReport, indicators: { ...selectedReport.indicators, periodo_fim: event.target.value } })} />
              <input className={inputClassName()} placeholder="Responsavel conducao" value={selectedReport.meeting_info.responsavel_conducao} onChange={(event) => setDraft({ ...selectedReport, meeting_info: { ...selectedReport.meeting_info, responsavel_conducao: event.target.value } })} />
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <input type="number" className={inputClassName()} placeholder="Chamados abertos" value={selectedReport.indicators.chamados_abertos_total} onChange={(event) => setDraft({ ...selectedReport, indicators: { ...selectedReport.indicators, chamados_abertos_total: Number(event.target.value) } })} />
              <input type="number" className={inputClassName()} placeholder="Chamados fechados" value={selectedReport.indicators.chamados_fechados_total} onChange={(event) => setDraft({ ...selectedReport, indicators: { ...selectedReport.indicators, chamados_fechados_total: Number(event.target.value) } })} />
              <input type="number" className={inputClassName()} placeholder="Fora SLA" value={selectedReport.indicators.chamados_fora_sla} onChange={(event) => setDraft({ ...selectedReport, indicators: { ...selectedReport.indicators, chamados_fora_sla: Number(event.target.value) } })} />
              <input type="number" className={inputClassName()} placeholder="Contatos pos-instalacao" value={selectedReport.indicators.clientes_contatados_pos_instalacao} onChange={(event) => setDraft({ ...selectedReport, indicators: { ...selectedReport.indicators, clientes_contatados_pos_instalacao: Number(event.target.value) } })} />
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <textarea className={textAreaClassName()} placeholder="Pontos positivos da semana" value={selectedReport.resumo_final.pontos_positivos_semana} onChange={(event) => setDraft({ ...selectedReport, resumo_final: { ...selectedReport.resumo_final, pontos_positivos_semana: event.target.value } })} />
              <textarea className={textAreaClassName()} placeholder="Pontos de atencao" value={selectedReport.resumo_final.pontos_atencao} onChange={(event) => setDraft({ ...selectedReport, resumo_final: { ...selectedReport.resumo_final, pontos_atencao: event.target.value } })} />
            </div>
            <div className="mt-4">
              <textarea className={textAreaClassName()} placeholder="Observacoes gerais" value={selectedReport.observacoes_gerais} onChange={(event) => setDraft({ ...selectedReport, observacoes_gerais: event.target.value })} />
            </div>
            <div className="mt-6 flex justify-end">
              <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 font-medium text-white shadow-lg transition hover:bg-[#0A2A66]">
                <Save className="h-4 w-4" />
                Salvar alteracoes
              </button>
            </div>
          </section>
        </form>
      )}
    </div>
  );
}
