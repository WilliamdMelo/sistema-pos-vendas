import type {
  Client,
  Installation,
  Opportunity,
  RiskClient,
  Ticket,
  TicketMessage,
  WeeklyReport,
} from "@/lib/types";

export const mockClients: Client[] = [
  {
    id: "cli-1",
    name: "Larissa Costa",
    company: "Arenza Logistica",
    phone: "+55 11 99999-1001",
    email: "larissa@arenza.com",
  },
  {
    id: "cli-2",
    name: "Rafael Moura",
    company: "Nexa Office",
    phone: "+55 21 99999-1002",
    email: "rafael@nexaoffice.com",
  },
  {
    id: "cli-3",
    name: "Beatriz Alves",
    company: "Blue Commerce",
    phone: "+55 31 99999-1003",
    email: "beatriz@bluecommerce.com",
  },
];

export const mockTickets: Ticket[] = [
  {
    id: "tic-1",
    client_id: "cli-1",
    project: "Portal do Cliente",
    problem_type: "Performance",
    description: "Lentidao no carregamento da area de pedidos.",
    status: "aberto",
    opened_at: "2026-03-10T09:05:00.000Z",
    resolved_at: null,
    responsible: "Equipe Suporte N1",
    client: { name: "Larissa Costa", company: "Arenza Logistica" },
  },
  {
    id: "tic-2",
    client_id: "cli-2",
    project: "CRM Comercial",
    problem_type: "Integracao",
    description: "Erro na sincronizacao com ERP nas vendas aprovadas.",
    status: "fechado",
    opened_at: "2026-03-09T11:30:00.000Z",
    resolved_at: "2026-03-10T15:20:00.000Z",
    responsible: "Paulo Mendes",
    client: { name: "Rafael Moura", company: "Nexa Office" },
  },
  {
    id: "tic-3",
    client_id: "cli-3",
    project: "App do Franqueado",
    problem_type: "UX",
    description: "Usuarios nao conseguem anexar comprovantes.",
    status: "em andamento",
    opened_at: "2026-03-11T13:10:00.000Z",
    resolved_at: null,
    responsible: "Ana Ribeiro",
    client: { name: "Beatriz Alves", company: "Blue Commerce" },
  },
  {
    id: "tic-4",
    client_id: "cli-1",
    project: "Portal do Cliente",
    problem_type: "Financeiro",
    description: "Duplicidade no resumo de cobranca mensal.",
    status: "fechado",
    opened_at: "2026-03-07T08:15:00.000Z",
    resolved_at: "2026-03-07T17:45:00.000Z",
    responsible: "Marina Dias",
    client: { name: "Larissa Costa", company: "Arenza Logistica" },
  },
];

export const mockTicketMessages: TicketMessage[] = [
  { id: "msg-1", ticket_id: "tic-1", sender: "cliente", timestamp: "2026-03-10T09:05:00.000Z" },
  { id: "msg-2", ticket_id: "tic-1", sender: "suporte", timestamp: "2026-03-10T09:42:00.000Z" },
  { id: "msg-3", ticket_id: "tic-2", sender: "cliente", timestamp: "2026-03-09T11:30:00.000Z" },
  { id: "msg-4", ticket_id: "tic-2", sender: "suporte", timestamp: "2026-03-09T12:05:00.000Z" },
  { id: "msg-5", ticket_id: "tic-3", sender: "cliente", timestamp: "2026-03-11T13:10:00.000Z" },
  { id: "msg-6", ticket_id: "tic-3", sender: "suporte", timestamp: "2026-03-11T14:20:00.000Z" },
  { id: "msg-7", ticket_id: "tic-4", sender: "cliente", timestamp: "2026-03-07T08:15:00.000Z" },
  { id: "msg-8", ticket_id: "tic-4", sender: "suporte", timestamp: "2026-03-07T08:42:00.000Z" },
];

export const mockWeeklyReports: WeeklyReport[] = [
  {
    id: "rep-1",
    start_date: "2026-03-02",
    end_date: "2026-03-08",
    responsible: "Marina Dias",
    comments: "Semana com concentracao de chamados em performance e faturamento.",
    avg_response: 34,
    avg_resolution: 412,
  },
  {
    id: "rep-2",
    start_date: "2026-03-09",
    end_date: "2026-03-15",
    responsible: "Paulo Mendes",
    comments: "Reducao no backlog apos ajuste do fluxo de triagem e priorizacao.",
    avg_response: 29,
    avg_resolution: 356,
  },
];

export const mockRiskClients: RiskClient[] = [
  {
    id: "risk-1",
    client: "Arenza Logistica",
    project: "Portal do Cliente",
    problem: "Atraso recorrente na estabilizacao do modulo financeiro.",
    next_step: "War room com produto e engenharia.",
    deadline: "2026-03-19",
    status: "critico",
  },
  {
    id: "risk-2",
    client: "Blue Commerce",
    project: "App do Franqueado",
    problem: "Baixa adesao na nova rotina de anexos.",
    next_step: "Treinamento com CS e tutorial guiado.",
    deadline: "2026-03-22",
    status: "monitorando",
  },
];

export const mockInstallations: Installation[] = [
  {
    id: "inst-1",
    client_id: "cli-1",
    project: "Portal do Cliente",
    installed_at: "2026-02-20T10:00:00.000Z",
    owner: "Time Deploy",
    status: "concluida",
  },
];

export const mockOpportunities: Opportunity[] = [
  {
    id: "opp-1",
    client_id: "cli-2",
    title: "Modulo de SLA Avancado",
    stage: "proposta",
    value: 18000,
    expected_close: "2026-04-10",
  },
];
