export type Client = {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
};

export type Ticket = {
  id: string;
  client_id: string;
  project: string;
  problem_type: string;
  description: string;
  status: string;
  opened_at: string;
  resolved_at: string | null;
  responsible: string;
  client?: Pick<Client, "name" | "company"> | null;
};

export type TicketMessage = {
  id: string;
  ticket_id: string;
  sender: string;
  timestamp: string;
};

export type WeeklyReport = {
  id: string;
  start_date: string;
  end_date: string;
  responsible: string;
  comments: string;
  avg_response: number;
  avg_resolution: number;
};

export type RiskClient = {
  id: string;
  client: string;
  project: string;
  problem: string;
  next_step: string;
  deadline: string;
  status: string;
};

export type Opportunity = {
  id: string;
  client_id: string;
  title: string;
  stage: string;
  value: number;
  expected_close: string | null;
};

export type Installation = {
  id: string;
  client_id: string;
  project: string;
  installed_at: string;
  owner: string;
  status: string;
};
