"use client";

import { FormEvent, useMemo, useState } from "react";
import { ArrowLeft, Eye, Pencil, Save } from "lucide-react";

import { getLatestReport } from "@/lib/metrics";
import { useWeeklyReports } from "@/lib/use-weekly-reports";
import type { WeeklyReport } from "@/lib/types";

type ScreenMode = "list" | "view";

function sectionTitle(label: string) {
  return <p className="text-xs uppercase tracking-[0.28em] text-slate-500">{label}</p>;
}

function ReportViewer({ report, onBack }: { report: WeeklyReport; onBack: () => void }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para lista
        </button>
        <div className="text-right">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Relatorio selecionado</p>
          <p className="mt-1 text-lg font-semibold text-slate-950">{report.meeting_info.empresa || "Sem nome"}</p>
        </div>
      </div>

      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        {sectionTitle("Informacoes gerais da reuniao")}
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div><p className="text-sm text-slate-500">Empresa</p><p className="mt-1 font-medium text-slate-950">{report.meeting_info.empresa || "-"}</p></div>
          <div><p className="text-sm text-slate-500">Setor</p><p className="mt-1 font-medium text-slate-950">{report.meeting_info.setor || "-"}</p></div>
          <div><p className="text-sm text-slate-500">Data reuniao</p><p className="mt-1 font-medium text-slate-950">{report.meeting_info.data_reuniao || "-"}</p></div>
          <div><p className="text-sm text-slate-500">Horario</p><p className="mt-1 font-medium text-slate-950">{report.meeting_info.horario_inicio || "-"} ate {report.meeting_info.horario_fim || "-"}</p></div>
          <div className="md:col-span-2"><p className="text-sm text-slate-500">Participantes</p><p className="mt-1 font-medium text-slate-950">{report.meeting_info.participantes.join(", ") || "-"}</p></div>
          <div><p className="text-sm text-slate-500">Responsavel conducao</p><p className="mt-1 font-medium text-slate-950">{report.meeting_info.responsavel_conducao || "-"}</p></div>
        </div>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        {sectionTitle("Indicadores da semana")}
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
        {sectionTitle("Chamados")}
        <div className="mt-4 space-y-4">
          {report.chamados.map((item) => (
            <article key={item.id} className="rounded-3xl bg-slate-50 p-4">
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <div><p className="text-sm text-slate-500">Cliente</p><p className="font-medium text-slate-950">{item.cliente || "-"}</p></div>
                <div><p className="text-sm text-slate-500">Projeto ou painel</p><p className="font-medium text-slate-950">{item.projeto_ou_painel || "-"}</p></div>
                <div><p className="text-sm text-slate-500">Status</p><p className="font-medium text-slate-950">{item.status}</p></div>
                <div><p className="text-sm text-slate-500">Abertura</p><p className="font-medium text-slate-950">{item.data_abertura || "-"} {item.hora_abertura || ""}</p></div>
                <div><p className="text-sm text-slate-500">Resposta</p><p className="font-medium text-slate-950">{item.data_resposta || "-"} {item.hora_resposta || ""}</p></div>
                <div><p className="text-sm text-slate-500">Resolucao</p><p className="font-medium text-slate-950">{item.data_resolucao || "-"} {item.hora_resolucao || ""}</p></div>
                <div className="md:col-span-2 xl:col-span-4"><p className="text-sm text-slate-500">Descricao problema</p><p className="font-medium text-slate-950">{item.descricao_problema || "-"}</p></div>
                <div className="md:col-span-2 xl:col-span-4"><p className="text-sm text-slate-500">Descricao atendimento</p><p className="font-medium text-slate-950">{item.descricao_atendimento || "-"}</p></div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          {sectionTitle("Mensagens do chamado")}
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
          {sectionTitle("Pesquisa de satisfacao")}
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
          {sectionTitle("Clientes em risco / casos criticos")}
          <div className="mt-4 space-y-3">
            {report.clientes_risco.map((item) => (
              <div key={item.id} className="rounded-2xl bg-slate-50 p-4">
                <p className="font-medium text-slate-950">{item.cliente} · {item.status_atual}</p>
                <p className="mt-1 text-sm text-slate-700">{item.projeto_painel}</p>
                <p className="mt-2 text-sm text-slate-800">{item.problema_relato || "-"}</p>
                <p className="mt-2 text-sm text-slate-700">Proximo passo: {item.proximo_passo || "-"}</p>
                <p className="mt-1 text-sm text-slate-700">Prazo: {item.prazo || "-"}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          {sectionTitle("Instalacoes recentes")}
          <div className="mt-4 space-y-3">
            {report.instalacoes_recentes.map((item) => (
              <div key={item.id} className="rounded-2xl bg-slate-50 p-4">
                <p className="font-medium text-slate-950">{item.cliente}</p>
                <p className="mt-1 text-sm text-slate-700">Instalacao: {item.data_instalacao || "-"}</p>
                <p className="mt-2 text-sm text-slate-800">Contato: {item.contato_pos_instalacao || "-"}</p>
                <p className="mt-1 text-sm text-slate-800">Situacao: {item.situacao_cliente || "-"}</p>
                <p className="mt-1 text-sm text-slate-800">Acoes necessarias: {item.acoes_necessarias || "-"}</p>
              </div>
            ))}
          </div>
        </section>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          {sectionTitle("Oportunidades comerciais")}
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
          {sectionTitle("Contato proativo")}
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
        {sectionTitle("Dificuldades / gargalos")}
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
          {sectionTitle("Acoes de melhoria definidas")}
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
          {sectionTitle("Prioridades da proxima semana")}
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
          {sectionTitle("Observacoes adicionais")}
          <p className="mt-4 text-sm leading-7 text-slate-900">{report.observacoes_gerais || "-"}</p>
        </section>
        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          {sectionTitle("Resumo final")}
          <div className="mt-4 space-y-4">
            <div><p className="text-sm text-slate-500">Pontos positivos da semana</p><p className="mt-1 text-sm leading-7 text-slate-900">{report.resumo_final.pontos_positivos_semana || "-"}</p></div>
            <div><p className="text-sm text-slate-500">Pontos atencao</p><p className="mt-1 text-sm leading-7 text-slate-900">{report.resumo_final.pontos_atencao || "-"}</p></div>
          </div>
        </section>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        {sectionTitle("Registro da ata")}
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
  const { reports, saveReport, loading } = useWeeklyReports();
  const [screenMode, setScreenMode] = useState<ScreenMode>("list");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [message, setMessage] = useState("");

  const selectedReport = useMemo(() => {
    if (selectedId) {
      return reports.find((item) => item.id === selectedId) ?? null;
    }

    return getLatestReport(reports);
  }, [reports, selectedId]);

  function startRename(report: WeeklyReport) {
    setRenamingId(report.id);
    setRenameValue(report.meeting_info.empresa);
  }

  async function handleRename(event: FormEvent<HTMLFormElement>, report: WeeklyReport) {
    event.preventDefault();

    const trimmed = renameValue.trim();
    if (!trimmed) {
      setMessage("O nome do relatorio nao pode ficar vazio.");
      return;
    }

    const result = await saveReport({
      ...report,
      meeting_info: {
        ...report.meeting_info,
        empresa: trimmed,
      },
    });

    if (!result.ok) {
      setMessage(result.message);
      return;
    }

    setRenamingId(null);
    setRenameValue("");
    setMessage("Relatorio renomeado com sucesso.");
  }

  if (screenMode === "view" && selectedReport) {
    return <ReportViewer report={selectedReport} onBack={() => setScreenMode("list")} />;
  }

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Relatorios</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">Relatorios salvos</h2>
        </div>
      </div>

      {message ? (
        <p className="mt-4 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">{message}</p>
      ) : null}

      <div className="mt-5 space-y-3">
        {loading ? (
          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            Carregando relatorios...
          </div>
        ) : null}

        {!loading && reports.length === 0 ? (
          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            Nenhum relatorio salvo.
          </div>
        ) : null}

        {reports.map((report) => (
          <article key={report.id} className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
            {renamingId === report.id ? (
              <form className="space-y-3" onSubmit={(event) => void handleRename(event, report)}>
                <input
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-950"
                  value={renameValue}
                  onChange={(event) => setRenameValue(event.target.value)}
                  placeholder="Novo nome do relatorio"
                />
                <div className="flex flex-wrap gap-2">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white"
                  >
                    <Save className="h-4 w-4" />
                    Salvar nome
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRenamingId(null);
                      setRenameValue("");
                    }}
                    className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            ) : (
              <>
                <p className="text-lg font-semibold text-slate-950">{report.meeting_info.empresa || "Sem nome"}</p>
                <p className="mt-1 text-sm text-slate-600">
                  {report.meeting_info.data_reuniao || "-"} · {report.indicators.periodo_inicio || "-"} ate {report.indicators.periodo_fim || "-"}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedId(report.id);
                      setScreenMode("view");
                    }}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
                  >
                    <Eye className="h-4 w-4" />
                    Visualizar
                  </button>
                  <button
                    type="button"
                    onClick={() => startRename(report)}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
                  >
                    <Pencil className="h-4 w-4" />
                    Renomear
                  </button>
                </div>
              </>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
