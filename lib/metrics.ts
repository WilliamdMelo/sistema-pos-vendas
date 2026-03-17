import { calculateBusinessMinutes } from "@/lib/time";
import type { TicketMessage, WeeklyReport } from "@/lib/types";

function average(values: number[]) {
  if (!values.length) {
    return 0;
  }

  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function toDate(date: string, time: string) {
  return new Date(`${date}T${time}:00`);
}

function getMessagesForTicket(report: WeeklyReport, chamadoId: string) {
  return report.mensagens_chamado
    .filter((message) => message.chamado_id === chamadoId)
    .sort(
      (a, b) =>
        toDate(a.data_mensagem, a.hora_mensagem).getTime() -
        toDate(b.data_mensagem, b.hora_mensagem).getTime(),
    );
}

function getResponseMinutes(messages: TicketMessage[]) {
  const clientMessage = messages.find((message) => message.tipo_mensagem === "cliente");
  const supportMessage = messages.find((message) => message.tipo_mensagem === "suporte");

  if (!clientMessage || !supportMessage) {
    return 0;
  }

  return calculateBusinessMinutes(
    toDate(clientMessage.data_mensagem, clientMessage.hora_mensagem),
    toDate(supportMessage.data_mensagem, supportMessage.hora_mensagem),
  );
}

export function getLatestReport(reports: WeeklyReport[]) {
  return [...reports].sort(
    (a, b) =>
      new Date(b.meeting_info.data_reuniao).getTime() -
      new Date(a.meeting_info.data_reuniao).getTime(),
  )[0] ?? null;
}

export function getDashboardMetrics(report: WeeklyReport | null) {
  if (!report) {
    return {
      openTickets: 0,
      closedTickets: 0,
      outOfSla: 0,
      averageResponse: 0,
      averageResolution: 0,
      riskClients: 0,
      postInstallContacts: 0,
    };
  }

  const resolutionTimes = report.chamados
    .filter((ticket) => ticket.data_resolucao && ticket.hora_resolucao)
    .map((ticket) =>
      calculateBusinessMinutes(
        toDate(ticket.data_abertura, ticket.hora_abertura),
        toDate(ticket.data_resolucao, ticket.hora_resolucao),
      ),
    );

  const responseTimes = report.chamados.map((ticket) =>
    getResponseMinutes(getMessagesForTicket(report, ticket.id)),
  );

  return {
    openTickets: report.chamados.filter((ticket) => ticket.status !== "resolvido").length,
    closedTickets: report.chamados.filter((ticket) => ticket.status === "resolvido").length,
    outOfSla: report.indicators.chamados_fora_sla,
    averageResponse:
      report.indicators.tempo_medio_resposta || average(responseTimes),
    averageResolution:
      report.indicators.tempo_medio_resolucao || average(resolutionTimes),
    riskClients: report.clientes_risco.length,
    postInstallContacts: report.indicators.clientes_contatados_pos_instalacao,
  };
}

export function buildResponseChartData(report: WeeklyReport | null) {
  if (!report) {
    return [];
  }

  return report.chamados.map((ticket) => ({
    name: ticket.projeto_ou_painel,
    resposta: getResponseMinutes(getMessagesForTicket(report, ticket.id)),
  }));
}

export function buildStatusChartData(report: WeeklyReport | null) {
  if (!report) {
    return [];
  }

  const counts = report.chamados.reduce<Record<string, number>>((acc, ticket) => {
    acc[ticket.status] = (acc[ticket.status] ?? 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts).map(([name, chamados]) => ({ name, chamados }));
}

export function buildProblemChartData(report: WeeklyReport | null) {
  if (!report) {
    return [];
  }

  const counts = report.chamados.reduce<Record<string, number>>((acc, ticket) => {
    acc[ticket.descricao_problema] = (acc[ticket.descricao_problema] ?? 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}
