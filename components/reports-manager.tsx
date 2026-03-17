"use client";

import { FormEvent, useMemo, useState } from "react";
import { Plus, Save } from "lucide-react";

import { createEmptyReport } from "@/lib/report-defaults";
import { getLatestReport } from "@/lib/metrics";
import { useWeeklyReports } from "@/lib/use-weekly-reports";
import type {
  CommercialOpportunity,
  ImprovementAction,
  ProactiveContact,
  RecentInstallation,
  ReportTicket,
  RiskClient,
  SatisfactionSurvey,
  TicketMessage,
  WeeklyReport,
} from "@/lib/types";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{title}</p>
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-slate-600">{label}</span>
      {children}
    </label>
  );
}

function inputClassName() {
  return "w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-950";
}

function textAreaClassName() {
  return "min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-950";
}

export function ReportsManager() {
  const { reports, saveReport, source, loading } = useWeeklyReports();
  const latest = useMemo(() => getLatestReport(reports), [reports]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<WeeklyReport | null>(null);
  const [message, setMessage] = useState("Edite ou crie um relatorio completo.");

  const selectedReport =
    draft ??
    reports.find((item) => item.id === selectedId) ??
    latest ??
    createEmptyReport();

  function openReport(report: WeeklyReport) {
    setSelectedId(report.id);
    setDraft(JSON.parse(JSON.stringify(report)) as WeeklyReport);
  }

  function openNewReport() {
    const next = createEmptyReport();
    setSelectedId(next.id);
    setDraft(next);
  }

  function updateDraft(next: WeeklyReport) {
    setDraft(next);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!draft) {
      return;
    }

    const result = await saveReport(draft);
    if (result.ok) {
      setMessage(`Relatorio salvo com sucesso (${source === "supabase" ? "Supabase" : "demo"}).`);
      setSelectedId(draft.id);
      setDraft(null);
      return;
    }

    setMessage(result.message);
  }

  function updateTicket(index: number, partial: Partial<ReportTicket>) {
    const next = [...selectedReport.chamados];
    next[index] = { ...next[index], ...partial };
    updateDraft({ ...selectedReport, chamados: next });
  }

  function updateMessage(index: number, partial: Partial<TicketMessage>) {
    const next = [...selectedReport.mensagens_chamado];
    next[index] = { ...next[index], ...partial };
    updateDraft({ ...selectedReport, mensagens_chamado: next });
  }

  function updateSurvey(index: number, partial: Partial<SatisfactionSurvey>) {
    const next = [...selectedReport.pesquisa_satisfacao];
    next[index] = { ...next[index], ...partial };
    updateDraft({ ...selectedReport, pesquisa_satisfacao: next });
  }

  function updateRisk(index: number, partial: Partial<RiskClient>) {
    const next = [...selectedReport.clientes_risco];
    next[index] = { ...next[index], ...partial };
    updateDraft({ ...selectedReport, clientes_risco: next });
  }

  function updateInstallation(index: number, partial: Partial<RecentInstallation>) {
    const next = [...selectedReport.instalacoes_recentes];
    next[index] = { ...next[index], ...partial };
    updateDraft({ ...selectedReport, instalacoes_recentes: next });
  }

  function updateOpportunity(index: number, partial: Partial<CommercialOpportunity>) {
    const next = [...selectedReport.oportunidades_comerciais];
    next[index] = { ...next[index], ...partial };
    updateDraft({ ...selectedReport, oportunidades_comerciais: next });
  }

  function updateAction(index: number, partial: Partial<ImprovementAction>) {
    const next = [...selectedReport.acoes_melhoria];
    next[index] = { ...next[index], ...partial };
    updateDraft({ ...selectedReport, acoes_melhoria: next });
  }

  function updateContact(index: number, partial: Partial<ProactiveContact>) {
    const next = [...selectedReport.contato_proativo];
    next[index] = { ...next[index], ...partial };
    updateDraft({ ...selectedReport, contato_proativo: next });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Relatorios</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">Registros semanais</h2>
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
            <button
              key={report.id}
              type="button"
              onClick={() => openReport(report)}
              className="w-full rounded-[24px] border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-slate-950"
            >
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                {report.indicators.periodo_inicio} ate {report.indicators.periodo_fim}
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-950">
                {report.meeting_info.empresa}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                {report.meeting_info.setor} · {report.meeting_info.data_reuniao}
              </p>
            </button>
          ))}
        </div>
      </section>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <Section title="1. Informacoes gerais da reuniao">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Empresa">
              <input
                className={inputClassName()}
                value={selectedReport.meeting_info.empresa}
                onChange={(event) =>
                  updateDraft({
                    ...selectedReport,
                    meeting_info: {
                      ...selectedReport.meeting_info,
                      empresa: event.target.value,
                    },
                  })
                }
              />
            </Field>
            <Field label="Setor">
              <input
                className={inputClassName()}
                value={selectedReport.meeting_info.setor}
                onChange={(event) =>
                  updateDraft({
                    ...selectedReport,
                    meeting_info: {
                      ...selectedReport.meeting_info,
                      setor: event.target.value,
                    },
                  })
                }
              />
            </Field>
            <Field label="Data da reuniao">
              <input
                type="date"
                className={inputClassName()}
                value={selectedReport.meeting_info.data_reuniao}
                onChange={(event) =>
                  updateDraft({
                    ...selectedReport,
                    meeting_info: {
                      ...selectedReport.meeting_info,
                      data_reuniao: event.target.value,
                    },
                  })
                }
              />
            </Field>
            <Field label="Horario inicio">
              <input
                type="time"
                className={inputClassName()}
                value={selectedReport.meeting_info.horario_inicio}
                onChange={(event) =>
                  updateDraft({
                    ...selectedReport,
                    meeting_info: {
                      ...selectedReport.meeting_info,
                      horario_inicio: event.target.value,
                    },
                  })
                }
              />
            </Field>
            <Field label="Horario fim">
              <input
                type="time"
                className={inputClassName()}
                value={selectedReport.meeting_info.horario_fim}
                onChange={(event) =>
                  updateDraft({
                    ...selectedReport,
                    meeting_info: {
                      ...selectedReport.meeting_info,
                      horario_fim: event.target.value,
                    },
                  })
                }
              />
            </Field>
            <Field label="Responsavel conducao">
              <input
                className={inputClassName()}
                value={selectedReport.meeting_info.responsavel_conducao}
                onChange={(event) =>
                  updateDraft({
                    ...selectedReport,
                    meeting_info: {
                      ...selectedReport.meeting_info,
                      responsavel_conducao: event.target.value,
                    },
                  })
                }
              />
            </Field>
          </div>
          <Field label="Participantes (separados por virgula)">
            <input
              className={inputClassName()}
              value={selectedReport.meeting_info.participantes.join(", ")}
              onChange={(event) =>
                updateDraft({
                  ...selectedReport,
                  meeting_info: {
                    ...selectedReport.meeting_info,
                    participantes: event.target.value
                      .split(",")
                      .map((item) => item.trim())
                      .filter(Boolean),
                  },
                })
              }
            />
          </Field>
        </Section>

        <Section title="2. Indicadores da semana">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {Object.entries(selectedReport.indicators).map(([key, value]) => (
              <Field key={key} label={key.replaceAll("_", " ")}>
                <input
                  type={key.includes("periodo") ? "date" : "number"}
                  className={inputClassName()}
                  value={String(value)}
                  onChange={(event) =>
                    updateDraft({
                      ...selectedReport,
                      indicators: {
                        ...selectedReport.indicators,
                        [key]: key.includes("periodo")
                          ? event.target.value
                          : Number(event.target.value),
                      },
                    })
                  }
                />
              </Field>
            ))}
          </div>
        </Section>

        <Section title="3. Chamados">
          {selectedReport.chamados.map((ticket, index) => (
            <div key={ticket.id} className="rounded-3xl bg-slate-50 p-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Cliente"><input className={inputClassName()} value={ticket.cliente} onChange={(event) => updateTicket(index, { cliente: event.target.value })} /></Field>
                <Field label="Projeto ou painel"><input className={inputClassName()} value={ticket.projeto_ou_painel} onChange={(event) => updateTicket(index, { projeto_ou_painel: event.target.value })} /></Field>
                <Field label="Descricao problema"><textarea className={textAreaClassName()} value={ticket.descricao_problema} onChange={(event) => updateTicket(index, { descricao_problema: event.target.value })} /></Field>
                <Field label="Descricao atendimento"><textarea className={textAreaClassName()} value={ticket.descricao_atendimento} onChange={(event) => updateTicket(index, { descricao_atendimento: event.target.value })} /></Field>
                <Field label="Data abertura"><input type="date" className={inputClassName()} value={ticket.data_abertura} onChange={(event) => updateTicket(index, { data_abertura: event.target.value })} /></Field>
                <Field label="Hora abertura"><input type="time" className={inputClassName()} value={ticket.hora_abertura} onChange={(event) => updateTicket(index, { hora_abertura: event.target.value })} /></Field>
                <Field label="Data resposta"><input type="date" className={inputClassName()} value={ticket.data_resposta} onChange={(event) => updateTicket(index, { data_resposta: event.target.value })} /></Field>
                <Field label="Hora resposta"><input type="time" className={inputClassName()} value={ticket.hora_resposta} onChange={(event) => updateTicket(index, { hora_resposta: event.target.value })} /></Field>
                <Field label="Data resolucao"><input type="date" className={inputClassName()} value={ticket.data_resolucao} onChange={(event) => updateTicket(index, { data_resolucao: event.target.value })} /></Field>
                <Field label="Hora resolucao"><input type="time" className={inputClassName()} value={ticket.hora_resolucao} onChange={(event) => updateTicket(index, { hora_resolucao: event.target.value })} /></Field>
                <Field label="Status">
                  <select className={inputClassName()} value={ticket.status} onChange={(event) => updateTicket(index, { status: event.target.value as ReportTicket["status"] })}>
                    <option value="aberto">aberto</option>
                    <option value="em andamento">em andamento</option>
                    <option value="resolvido">resolvido</option>
                    <option value="aguardando cliente">aguardando cliente</option>
                  </select>
                </Field>
              </div>
            </div>
          ))}
          <button type="button" className="rounded-full bg-slate-950 px-4 py-2 text-sm text-white" onClick={() => updateDraft({ ...selectedReport, chamados: [...selectedReport.chamados, { id: `call-${Date.now()}`, cliente: "", projeto_ou_painel: "", descricao_problema: "", data_abertura: "", hora_abertura: "", data_resposta: "", hora_resposta: "", data_resolucao: "", hora_resolucao: "", descricao_atendimento: "", status: "aberto" }] })}>Adicionar chamado</button>
        </Section>

        <Section title="4. Mensagens do chamado">
          {selectedReport.mensagens_chamado.map((messageItem, index) => (
            <div key={messageItem.id} className="grid gap-4 rounded-3xl bg-slate-50 p-4 md:grid-cols-4">
              <Field label="Chamado ID"><input className={inputClassName()} value={messageItem.chamado_id} onChange={(event) => updateMessage(index, { chamado_id: event.target.value })} /></Field>
              <Field label="Tipo mensagem">
                <select className={inputClassName()} value={messageItem.tipo_mensagem} onChange={(event) => updateMessage(index, { tipo_mensagem: event.target.value as TicketMessage["tipo_mensagem"] })}>
                  <option value="cliente">cliente</option>
                  <option value="suporte">suporte</option>
                </select>
              </Field>
              <Field label="Data mensagem"><input type="date" className={inputClassName()} value={messageItem.data_mensagem} onChange={(event) => updateMessage(index, { data_mensagem: event.target.value })} /></Field>
              <Field label="Hora mensagem"><input type="time" className={inputClassName()} value={messageItem.hora_mensagem} onChange={(event) => updateMessage(index, { hora_mensagem: event.target.value })} /></Field>
            </div>
          ))}
          <button type="button" className="rounded-full bg-slate-950 px-4 py-2 text-sm text-white" onClick={() => updateDraft({ ...selectedReport, mensagens_chamado: [...selectedReport.mensagens_chamado, { id: `msg-${Date.now()}`, chamado_id: "", tipo_mensagem: "cliente", data_mensagem: "", hora_mensagem: "" }] })}>Adicionar mensagem</button>
        </Section>

        <Section title="5. Pesquisa de satisfacao">
          {selectedReport.pesquisa_satisfacao.map((survey, index) => (
            <div key={survey.id} className="grid gap-4 rounded-3xl bg-slate-50 p-4 md:grid-cols-4">
              <Field label="Cliente"><input className={inputClassName()} value={survey.cliente} onChange={(event) => updateSurvey(index, { cliente: event.target.value })} /></Field>
              <Field label="Nota"><input type="number" className={inputClassName()} value={survey.nota} onChange={(event) => updateSurvey(index, { nota: Number(event.target.value) })} /></Field>
              <Field label="Tipo NPS">
                <select className={inputClassName()} value={survey.tipo_nps} onChange={(event) => updateSurvey(index, { tipo_nps: event.target.value as SatisfactionSurvey["tipo_nps"] })}>
                  <option value="vendedor">vendedor</option>
                  <option value="empresa">empresa</option>
                </select>
              </Field>
              <Field label="Comentario"><textarea className={textAreaClassName()} value={survey.comentario_cliente} onChange={(event) => updateSurvey(index, { comentario_cliente: event.target.value })} /></Field>
            </div>
          ))}
          <button type="button" className="rounded-full bg-slate-950 px-4 py-2 text-sm text-white" onClick={() => updateDraft({ ...selectedReport, pesquisa_satisfacao: [...selectedReport.pesquisa_satisfacao, { id: `nps-${Date.now()}`, cliente: "", nota: 0, tipo_nps: "empresa", comentario_cliente: "" }] })}>Adicionar pesquisa</button>
        </Section>

        <Section title="6. Clientes em risco / casos criticos">
          {selectedReport.clientes_risco.map((item, index) => (
            <div key={item.id} className="grid gap-4 rounded-3xl bg-slate-50 p-4 md:grid-cols-3">
              <Field label="Cliente"><input className={inputClassName()} value={item.cliente} onChange={(event) => updateRisk(index, { cliente: event.target.value })} /></Field>
              <Field label="Projeto painel"><input className={inputClassName()} value={item.projeto_painel} onChange={(event) => updateRisk(index, { projeto_painel: event.target.value })} /></Field>
              <Field label="Problema relato"><textarea className={textAreaClassName()} value={item.problema_relato} onChange={(event) => updateRisk(index, { problema_relato: event.target.value })} /></Field>
              <Field label="Proximo passo"><textarea className={textAreaClassName()} value={item.proximo_passo} onChange={(event) => updateRisk(index, { proximo_passo: event.target.value })} /></Field>
              <Field label="Prazo"><input type="date" className={inputClassName()} value={item.prazo} onChange={(event) => updateRisk(index, { prazo: event.target.value })} /></Field>
              <Field label="Status atual">
                <select className={inputClassName()} value={item.status_atual} onChange={(event) => updateRisk(index, { status_atual: event.target.value as RiskClient["status_atual"] })}>
                  <option value="andamento">andamento</option>
                  <option value="critico">critico</option>
                  <option value="resolvido">resolvido</option>
                </select>
              </Field>
            </div>
          ))}
          <button type="button" className="rounded-full bg-slate-950 px-4 py-2 text-sm text-white" onClick={() => updateDraft({ ...selectedReport, clientes_risco: [...selectedReport.clientes_risco, { id: `risk-${Date.now()}`, cliente: "", projeto_painel: "", problema_relato: "", proximo_passo: "", prazo: "", status_atual: "andamento" }] })}>Adicionar cliente em risco</button>
        </Section>

        <Section title="7. Observacoes adicionais">
          <Field label="Observacoes gerais">
            <textarea className={textAreaClassName()} value={selectedReport.observacoes_gerais} onChange={(event) => updateDraft({ ...selectedReport, observacoes_gerais: event.target.value })} />
          </Field>
        </Section>

        <Section title="8. Instalacoes recentes">
          {selectedReport.instalacoes_recentes.map((item, index) => (
            <div key={item.id} className="grid gap-4 rounded-3xl bg-slate-50 p-4 md:grid-cols-3">
              <Field label="Cliente"><input className={inputClassName()} value={item.cliente} onChange={(event) => updateInstallation(index, { cliente: event.target.value })} /></Field>
              <Field label="Data instalacao"><input type="date" className={inputClassName()} value={item.data_instalacao} onChange={(event) => updateInstallation(index, { data_instalacao: event.target.value })} /></Field>
              <Field label="Contato pos instalacao"><input className={inputClassName()} value={item.contato_pos_instalacao} onChange={(event) => updateInstallation(index, { contato_pos_instalacao: event.target.value })} /></Field>
              <Field label="Situacao cliente"><textarea className={textAreaClassName()} value={item.situacao_cliente} onChange={(event) => updateInstallation(index, { situacao_cliente: event.target.value })} /></Field>
              <Field label="Acoes necessarias"><textarea className={textAreaClassName()} value={item.acoes_necessarias} onChange={(event) => updateInstallation(index, { acoes_necessarias: event.target.value })} /></Field>
            </div>
          ))}
          <button type="button" className="rounded-full bg-slate-950 px-4 py-2 text-sm text-white" onClick={() => updateDraft({ ...selectedReport, instalacoes_recentes: [...selectedReport.instalacoes_recentes, { id: `install-${Date.now()}`, cliente: "", data_instalacao: "", contato_pos_instalacao: "", situacao_cliente: "", acoes_necessarias: "" }] })}>Adicionar instalacao</button>
        </Section>

        <Section title="9. Oportunidades comerciais">
          {selectedReport.oportunidades_comerciais.map((item, index) => (
            <div key={item.id} className="grid gap-4 rounded-3xl bg-slate-50 p-4 md:grid-cols-3">
              <Field label="Cliente"><input className={inputClassName()} value={item.cliente} onChange={(event) => updateOpportunity(index, { cliente: event.target.value })} /></Field>
              <Field label="Tipo oportunidade">
                <select className={inputClassName()} value={item.tipo_oportunidade} onChange={(event) => updateOpportunity(index, { tipo_oportunidade: event.target.value as CommercialOpportunity["tipo_oportunidade"] })}>
                  <option value="upgrade_painel">upgrade_painel</option>
                  <option value="nova_tela">nova_tela</option>
                  <option value="contrato_manutencao">contrato_manutencao</option>
                  <option value="indicacao">indicacao</option>
                </select>
              </Field>
              <Field label="Acao sugerida"><textarea className={textAreaClassName()} value={item.acao_sugerida} onChange={(event) => updateOpportunity(index, { acao_sugerida: event.target.value })} /></Field>
              <Field label="Responsavel"><input className={inputClassName()} value={item.responsavel} onChange={(event) => updateOpportunity(index, { responsavel: event.target.value })} /></Field>
              <Field label="Prazo"><input type="date" className={inputClassName()} value={item.prazo} onChange={(event) => updateOpportunity(index, { prazo: event.target.value })} /></Field>
            </div>
          ))}
          <button type="button" className="rounded-full bg-slate-950 px-4 py-2 text-sm text-white" onClick={() => updateDraft({ ...selectedReport, oportunidades_comerciais: [...selectedReport.oportunidades_comerciais, { id: `opp-${Date.now()}`, cliente: "", tipo_oportunidade: "upgrade_painel", acao_sugerida: "", responsavel: "", prazo: "" }] })}>Adicionar oportunidade</button>
        </Section>

        <Section title="10. Dificuldades / gargalos">
          <div className="grid gap-4 md:grid-cols-2">
            {Object.entries(selectedReport.dificuldades).map(([key, value]) => (
              <Field key={key} label={key.replaceAll("_", " ")}>
                <textarea
                  className={textAreaClassName()}
                  value={value}
                  onChange={(event) =>
                    updateDraft({
                      ...selectedReport,
                      dificuldades: {
                        ...selectedReport.dificuldades,
                        [key]: event.target.value,
                      },
                    })
                  }
                />
              </Field>
            ))}
          </div>
        </Section>

        <Section title="11. Acoes de melhoria definidas">
          {selectedReport.acoes_melhoria.map((item, index) => (
            <div key={item.id} className="grid gap-4 rounded-3xl bg-slate-50 p-4 md:grid-cols-4">
              <Field label="Acao"><textarea className={textAreaClassName()} value={item.acao} onChange={(event) => updateAction(index, { acao: event.target.value })} /></Field>
              <Field label="Responsavel"><input className={inputClassName()} value={item.responsavel} onChange={(event) => updateAction(index, { responsavel: event.target.value })} /></Field>
              <Field label="Prazo"><input type="date" className={inputClassName()} value={item.prazo} onChange={(event) => updateAction(index, { prazo: event.target.value })} /></Field>
              <Field label="Status">
                <select className={inputClassName()} value={item.status} onChange={(event) => updateAction(index, { status: event.target.value as ImprovementAction["status"] })}>
                  <option value="pendente">pendente</option>
                  <option value="andamento">andamento</option>
                  <option value="concluido">concluido</option>
                </select>
              </Field>
            </div>
          ))}
          <button type="button" className="rounded-full bg-slate-950 px-4 py-2 text-sm text-white" onClick={() => updateDraft({ ...selectedReport, acoes_melhoria: [...selectedReport.acoes_melhoria, { id: `action-${Date.now()}`, acao: "", responsavel: "", prazo: "", status: "pendente" }] })}>Adicionar acao</button>
        </Section>

        <Section title="12. Prioridades da proxima semana">
          <div className="grid gap-4 md:grid-cols-2">
            {selectedReport.prioridades_proxima_semana.map((priority, index) => (
              <Field key={`priority-${index}`} label={`Prioridade ${index + 1}`}>
                <input
                  className={inputClassName()}
                  value={priority}
                  onChange={(event) => {
                    const next = [...selectedReport.prioridades_proxima_semana];
                    next[index] = event.target.value;
                    updateDraft({ ...selectedReport, prioridades_proxima_semana: next });
                  }}
                />
              </Field>
            ))}
          </div>
        </Section>

        <Section title="13. Contato proativo">
          {selectedReport.contato_proativo.map((item, index) => (
            <div key={item.id} className="grid gap-4 rounded-3xl bg-slate-50 p-4 md:grid-cols-2">
              <Field label="Cliente"><input className={inputClassName()} value={item.cliente} onChange={(event) => updateContact(index, { cliente: event.target.value })} /></Field>
              <Field label="Tipo contato">
                <select className={inputClassName()} value={item.tipo_contato} onChange={(event) => updateContact(index, { tipo_contato: event.target.value as ProactiveContact["tipo_contato"] })}>
                  <option value="ligacao">ligacao</option>
                  <option value="whatsapp">whatsapp</option>
                </select>
              </Field>
            </div>
          ))}
          <button type="button" className="rounded-full bg-slate-950 px-4 py-2 text-sm text-white" onClick={() => updateDraft({ ...selectedReport, contato_proativo: [...selectedReport.contato_proativo, { id: `contact-${Date.now()}`, cliente: "", tipo_contato: "ligacao" }] })}>Adicionar contato</button>
        </Section>

        <Section title="14. Resumo final">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Pontos positivos da semana">
              <textarea className={textAreaClassName()} value={selectedReport.resumo_final.pontos_positivos_semana} onChange={(event) => updateDraft({ ...selectedReport, resumo_final: { ...selectedReport.resumo_final, pontos_positivos_semana: event.target.value } })} />
            </Field>
            <Field label="Pontos de atencao">
              <textarea className={textAreaClassName()} value={selectedReport.resumo_final.pontos_atencao} onChange={(event) => updateDraft({ ...selectedReport, resumo_final: { ...selectedReport.resumo_final, pontos_atencao: event.target.value } })} />
            </Field>
          </div>
        </Section>

        <Section title="15. Registro da ata">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Object.entries(selectedReport.registro_ata).map(([key, value]) => (
              <Field key={key} label={key.replaceAll("_", " ")}>
                <input
                  type={key === "data_ata" ? "date" : "text"}
                  className={inputClassName()}
                  value={value}
                  onChange={(event) =>
                    updateDraft({
                      ...selectedReport,
                      registro_ata: {
                        ...selectedReport.registro_ata,
                        [key]: event.target.value,
                      },
                    })
                  }
                />
              </Field>
            ))}
          </div>
        </Section>

        <div className="sticky bottom-4 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 font-medium text-white shadow-lg transition hover:bg-[#0A2A66]"
          >
            <Save className="h-4 w-4" />
            Salvar relatorio completo
          </button>
        </div>
      </form>
    </div>
  );
}
