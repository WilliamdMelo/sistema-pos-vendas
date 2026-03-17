import { calculateBusinessMinutes } from "@/lib/time";
import type { RiskClient, Ticket, TicketMessage } from "@/lib/types";

function average(values: number[]) {
  if (!values.length) {
    return 0;
  }

  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

export function getDashboardMetrics(
  tickets: Ticket[],
  messages: TicketMessage[],
  riskClients: RiskClient[],
) {
  const responseTimes = tickets
    .map((ticket) => {
      const orderedMessages = messages
        .filter((message) => message.ticket_id === ticket.id)
        .sort(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
        );

      const firstClientMessage = orderedMessages.find(
        (message) => message.sender === "cliente",
      );
      const firstSupportMessage = orderedMessages.find(
        (message) => message.sender !== "cliente",
      );

      if (!firstClientMessage || !firstSupportMessage) {
        return null;
      }

      return calculateBusinessMinutes(
        new Date(firstClientMessage.timestamp),
        new Date(firstSupportMessage.timestamp),
      );
    })
    .filter((value): value is number => value !== null);

  const resolutionTimes = tickets
    .filter((ticket) => ticket.resolved_at)
    .map((ticket) =>
      calculateBusinessMinutes(
        new Date(ticket.opened_at),
        new Date(ticket.resolved_at!),
      ),
    );

  return {
    openTickets: tickets.filter((ticket) => ticket.status !== "fechado").length,
    closedTickets: tickets.filter((ticket) => ticket.status === "fechado").length,
    averageResponse: average(responseTimes),
    averageResolution: average(resolutionTimes),
    riskClients: riskClients.length,
  };
}

export function buildResponseChartData(
  tickets: Ticket[],
  messages: TicketMessage[],
) {
  return tickets.map((ticket) => {
    const orderedMessages = messages
      .filter((message) => message.ticket_id === ticket.id)
      .sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      );

    const firstClientMessage = orderedMessages.find(
      (message) => message.sender === "cliente",
    );
    const firstSupportMessage = orderedMessages.find(
      (message) => message.sender !== "cliente",
    );

    return {
      name: ticket.project,
      resposta:
        firstClientMessage && firstSupportMessage
          ? calculateBusinessMinutes(
              new Date(firstClientMessage.timestamp),
              new Date(firstSupportMessage.timestamp),
            )
          : 0,
    };
  });
}

export function buildStatusChartData(tickets: Ticket[]) {
  const counts = tickets.reduce<Record<string, number>>((acc, ticket) => {
    acc[ticket.status] = (acc[ticket.status] ?? 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts).map(([name, chamados]) => ({ name, chamados }));
}

export function buildProblemChartData(tickets: Ticket[]) {
  const counts = tickets.reduce<Record<string, number>>((acc, ticket) => {
    acc[ticket.problem_type] = (acc[ticket.problem_type] ?? 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}
