"use client";

import { Activity, Clock3, ShieldAlert, TimerReset, TriangleAlert } from "lucide-react";

import { ChartsSection } from "@/components/charts-section";
import { StatCard } from "@/components/stat-card";
import {
  buildProblemChartData,
  buildResponseChartData,
  buildStatusChartData,
  getDashboardMetrics,
  getLatestReport,
} from "@/lib/metrics";
import { useWeeklyReports } from "@/lib/use-weekly-reports";

export function DashboardScreen() {
  const { reports, source } = useWeeklyReports();
  const report = getLatestReport(reports);
  const metrics = getDashboardMetrics(report);

  if (!report) {
    return <div>Nenhum relatorio disponivel.</div>;
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] bg-slate-950 px-6 py-7 text-white shadow-xl">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.32em] text-sky-200/70">Dashboard sincronizado</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight">
              Indicadores derivados do relatorio semanal.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
              Todas as cartas, graficos e listas abaixo usam exatamente o mesmo registro exibido na tela de relatorios.
            </p>
          </div>
          <div className="grid gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-slate-400">Empresa</p>
              <p className="mt-1 font-semibold">{report.meeting_info.empresa}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-slate-400">Fonte</p>
              <p className="mt-1 font-semibold capitalize">{source}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard
          label="Chamados abertos"
          value={String(metrics.openTickets)}
          helper="Status diferente de resolvido."
          icon={<Activity className="h-5 w-5" />}
        />
        <StatCard
          label="Chamados resolvidos"
          value={String(metrics.closedTickets)}
          helper="Tickets encerrados no periodo."
          icon={<TimerReset className="h-5 w-5" />}
        />
        <StatCard
          label="Media resposta"
          value={`${metrics.averageResponse} min`}
          helper="Calculada a partir das mensagens do chamado."
          icon={<Clock3 className="h-5 w-5" />}
        />
        <StatCard
          label="Fora do SLA"
          value={String(metrics.outOfSla)}
          helper="Indicador consolidado da semana."
          icon={<TriangleAlert className="h-5 w-5" />}
        />
        <StatCard
          label="Clientes em risco"
          value={String(metrics.riskClients)}
          helper="Casos criticos cadastrados no relatorio."
          icon={<ShieldAlert className="h-5 w-5" />}
        />
      </section>

      <ChartsSection
        responseData={buildResponseChartData(report)}
        statusData={buildStatusChartData(report)}
        problemData={buildProblemChartData(report)}
      />

      <section className="grid gap-5 xl:grid-cols-2">
        <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Clientes em risco</p>
          <div className="mt-4 space-y-3">
            {report.clientes_risco.map((item) => (
              <div key={item.id} className="rounded-2xl bg-slate-50 p-4">
                <p className="font-semibold text-slate-950">{item.cliente}</p>
                <p className="mt-1 text-sm text-slate-700">{item.problema_relato}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.25em] text-slate-500">
                  {item.status_atual} · prazo {item.prazo}
                </p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Oportunidades comerciais</p>
          <div className="mt-4 space-y-3">
            {report.oportunidades_comerciais.map((item) => (
              <div key={item.id} className="rounded-2xl bg-slate-50 p-4">
                <p className="font-semibold text-slate-950">{item.cliente}</p>
                <p className="mt-1 text-sm text-slate-700">{item.acao_sugerida}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.25em] text-slate-500">
                  {item.tipo_oportunidade} · {item.responsavel}
                </p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
