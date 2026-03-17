"use client";

import { AlertTriangle, BadgeCheck, MessageSquareText, Target } from "lucide-react";

import { StatCard } from "@/components/stat-card";
import { getDashboardMetrics, getLatestReport } from "@/lib/metrics";
import { useWeeklyReports } from "@/lib/use-weekly-reports";

export function SummaryScreen() {
  const { reports, source } = useWeeklyReports();
  const report = getLatestReport(reports);
  const metrics = getDashboardMetrics(report);

  if (!report) {
    return <div>Nenhum relatorio disponivel.</div>;
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] bg-slate-950 px-6 py-7 text-white shadow-xl">
        <p className="text-xs uppercase tracking-[0.32em] text-sky-200/70">Resumo executivo</p>
        <h2 className="mt-3 text-4xl font-semibold tracking-tight">
          {report.meeting_info.empresa} · semana de {report.indicators.periodo_inicio} a {report.indicators.periodo_fim}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
          {report.resumo_final.pontos_positivos_semana}
        </p>
        <p className="mt-2 text-sm text-slate-400">Fonte: {source}</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Chamados ativos"
          value={String(metrics.openTickets)}
          helper="Extraido do mesmo relatorio usado nas demais telas."
          icon={<MessageSquareText className="h-5 w-5" />}
        />
        <StatCard
          label="Fora do SLA"
          value={String(metrics.outOfSla)}
          helper="Semana concentrada nos casos mais sensiveis."
          icon={<AlertTriangle className="h-5 w-5" />}
        />
        <StatCard
          label="Contatos pos-instalacao"
          value={String(metrics.postInstallContacts)}
          helper="Clientes acompanhados proativamente no periodo."
          icon={<BadgeCheck className="h-5 w-5" />}
        />
        <StatCard
          label="Oportunidades"
          value={String(report.oportunidades_comerciais.length)}
          helper="Leads quentes levantados pelo pos-vendas."
          icon={<Target className="h-5 w-5" />}
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Pontos de atencao</p>
          <p className="mt-4 text-lg leading-8 text-slate-800">
            {report.resumo_final.pontos_atencao}
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Observacoes gerais</p>
              <p className="mt-3 text-sm leading-6 text-slate-700">{report.observacoes_gerais}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Sugestao de melhoria</p>
              <p className="mt-3 text-sm leading-6 text-slate-700">
                {report.dificuldades.sugestao_melhoria_processo}
              </p>
            </div>
          </div>
        </article>

        <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Prioridades</p>
          <div className="mt-4 space-y-3">
            {report.prioridades_proxima_semana.map((priority, index) => (
              <div key={`${priority}-${index}`} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-800">
                {index + 1}. {priority}
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
