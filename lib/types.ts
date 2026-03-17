export type MeetingInfo = {
  empresa: string;
  setor: string;
  data_reuniao: string;
  horario_inicio: string;
  horario_fim: string;
  participantes: string[];
  responsavel_conducao: string;
};

export type WeeklyIndicators = {
  periodo_inicio: string;
  periodo_fim: string;
  chamados_abertos_total: number;
  chamados_fechados_total: number;
  chamados_fora_sla: number;
  tempo_medio_resposta: number;
  tempo_medio_resolucao: number;
  clientes_contatados_pos_instalacao: number;
};

export type ReportTicketStatus =
  | "aberto"
  | "em andamento"
  | "resolvido"
  | "aguardando cliente";

export type ReportTicket = {
  id: string;
  cliente: string;
  projeto_ou_painel: string;
  descricao_problema: string;
  data_abertura: string;
  hora_abertura: string;
  data_resposta: string;
  hora_resposta: string;
  data_resolucao: string;
  hora_resolucao: string;
  descricao_atendimento: string;
  status: ReportTicketStatus;
};

export type TicketMessageType = "cliente" | "suporte";

export type TicketMessage = {
  id: string;
  chamado_id: string;
  tipo_mensagem: TicketMessageType;
  data_mensagem: string;
  hora_mensagem: string;
};

export type SatisfactionType = "vendedor" | "empresa";

export type SatisfactionSurvey = {
  id: string;
  cliente: string;
  nota: number;
  tipo_nps: SatisfactionType;
  comentario_cliente: string;
};

export type RiskStatus = "andamento" | "critico" | "resolvido";

export type RiskClient = {
  id: string;
  cliente: string;
  projeto_painel: string;
  problema_relato: string;
  proximo_passo: string;
  prazo: string;
  status_atual: RiskStatus;
};

export type RecentInstallation = {
  id: string;
  cliente: string;
  data_instalacao: string;
  contato_pos_instalacao: string;
  situacao_cliente: string;
  acoes_necessarias: string;
};

export type OpportunityType =
  | "upgrade_painel"
  | "nova_tela"
  | "contrato_manutencao"
  | "indicacao";

export type CommercialOpportunity = {
  id: string;
  cliente: string;
  tipo_oportunidade: OpportunityType;
  acao_sugerida: string;
  responsavel: string;
  prazo: string;
};

export type ImprovementActionStatus = "pendente" | "andamento" | "concluido";

export type ImprovementAction = {
  id: string;
  acao: string;
  responsavel: string;
  prazo: string;
  status: ImprovementActionStatus;
};

export type ProactiveContactType = "ligacao" | "whatsapp";

export type ProactiveContact = {
  id: string;
  cliente: string;
  tipo_contato: ProactiveContactType;
};

export type Difficulties = {
  principais_dificuldades: string;
  gargalo_comercial: string;
  gargalo_instalacao: string;
  gargalo_suporte_tecnico: string;
  gargalo_producao: string;
  gargalo_financeiro: string;
  gargalo_outro: string;
  sugestao_melhoria_processo: string;
};

export type FinalSummary = {
  pontos_positivos_semana: string;
  pontos_atencao: string;
};

export type MinutesRecord = {
  responsavel_registro: string;
  supervisor_pos_vendas: string;
  gestor: string;
  cidade: string;
  data_ata: string;
};

export type WeeklyReport = {
  id: string;
  meeting_info: MeetingInfo;
  indicators: WeeklyIndicators;
  chamados: ReportTicket[];
  mensagens_chamado: TicketMessage[];
  pesquisa_satisfacao: SatisfactionSurvey[];
  clientes_risco: RiskClient[];
  observacoes_gerais: string;
  instalacoes_recentes: RecentInstallation[];
  oportunidades_comerciais: CommercialOpportunity[];
  dificuldades: Difficulties;
  acoes_melhoria: ImprovementAction[];
  prioridades_proxima_semana: string[];
  contato_proativo: ProactiveContact[];
  resumo_final: FinalSummary;
  registro_ata: MinutesRecord;
};
