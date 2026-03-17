"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Clock3,
  FolderClock,
  ShieldAlert,
  TimerReset,
} from "lucide-react";

import { ChartsSection } from "@/components/charts-section";
import { StatCard } from "@/components/stat-card";
import {
  buildProblemChartData,
  buildResponseChartData,
  buildStatusChartData,
  getDashboardMetrics,
} from "@/lib/metrics";
import {
  mockRiskClients,
  mockTicketMessages,
  mockTickets,
  mockWeeklyReports,
} from "@/lib/mock-data";
import { supabase } from "@/lib/supabase";
import type { RiskClient, Ticket, TicketMessage, WeeklyReport } from "@/lib/types";

export function DashboardScreen() {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [messages, setMessages] = useState<TicketMessage[]>(mockTicketMessages);
  const [riskClients, setRiskClients] = useState<RiskClient[]>(mockRiskClients);
  const [weeklyReports, setWeeklyReports] = useState<WeeklyReport[]>(mockWeeklyReports);
  const [source, setSource] = useState<"demo" | "supabase">("demo");

  useEffect(() => {
    async function loadDashboard() {
      if (!supabase) {
        return;
      }

      const [ticketsResult, messagesResult, riskClientsResult, reportsResult] =
        await Promise.all([
          supabase
            .from("tickets")
            .select(
              "id, client_id, project, problem_type, description, status, opened_at, resolved_at, responsible",
            ),
          supabase.from("ticket_messages").select("id, ticket_id, sender, timestamp"),
          supabase
            .from("risk_clients")
            .select("id, client, project, problem, next_step, deadline, status"),
          supabase
            .from("weekly_reports")
            .select(
              "id, start_date, end_date, responsible, comments, avg_response, avg_resolution",
            )
            .order("start_date", { ascending: false }),
        ]);

      if (
        ticketsResult.error ||
        messagesResult.error ||
        riskClientsResult.error ||
        reportsResult.error
      ) {
        return;
      }

      setTickets((ticketsResult.data as Ticket[]) ?? []);
      setMessages((messagesResult.data as TicketMessage[]) ?? []);
      setRiskClients((riskClientsResult.data as RiskClient[]) ?? []);
      setWeeklyReports((reportsResult.data as WeeklyReport[]) ?? []);
      setSource("supabase");
    }

    void loadDashboard();
  }, []);

  const metrics = useMemo(
    () => getDashboardMetrics(tickets, messages, riskClients),
    [tickets, messages, riskClients],
  );

  const latestReport = weeklyReports[0];

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] bg-slate-950 px-6 py-7 text-white shadow-xl">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.32em] text-sky-200/70">
              Central operacional
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight">
              Visao consolidada do pos-vendas.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
              Monitore o backlog, velocidade de atendimento, gargalos recorrentes e
              clientes que precisam de acao preventiva.
            </p>
          </div>
          <div className="grid gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-slate-400">Origem dos dados</p>
              <p className="mt-1 font-semibold capitalize">{source}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-slate-400">Relatorio mais recente</p>
              <p className="mt-1 font-semibold">
                {latestReport
                  ? `${latestReport.start_date} ate ${latestReport.end_date}`
                  : "Sem dados"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard
          label="Chamados abertos"
          value={String(metrics.openTickets)}
          helper="Tickets que ainda exigem acao do time."
          icon={<FolderClock className="h-5 w-5" />}
        />
        <StatCard
          label="Chamados fechados"
          value={String(metrics.closedTickets)}
          helper="Resolvidos dentro do ciclo selecionado."
          icon={<Activity className="h-5 w-5" />}
        />
        <StatCard
          label="Media resposta"
          value={`${metrics.averageResponse} min`}
          helper="Primeira resposta em horario comercial."
          icon={<Clock3 className="h-5 w-5" />}
        />
        <StatCard
          label="Media resolucao"
          value={`${metrics.averageResolution} min`}
          helper="Tempo medio ate fechamento do ticket."
          icon={<TimerReset className="h-5 w-5" />}
        />
        <StatCard
          label="Clientes em risco"
          value={String(metrics.riskClients)}
          helper="Contas sensiveis pedindo plano de contencao."
          icon={<ShieldAlert className="h-5 w-5" />}
        />
      </section>

      <ChartsSection
        responseData={buildResponseChartData(tickets, messages)}
        statusData={buildStatusChartData(tickets)}
        problemData={buildProblemChartData(tickets)}
      />
    </div>
  );
}
