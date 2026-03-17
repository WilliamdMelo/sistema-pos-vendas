import type { WeeklyReport } from "@/lib/types";

export function createEmptyReport(): WeeklyReport {
  return {
    id: `report-${Date.now()}`,
    meeting_info: {
      empresa: "",
      setor: "",
      data_reuniao: "",
      horario_inicio: "",
      horario_fim: "",
      participantes: [],
      responsavel_conducao: "",
    },
    indicators: {
      periodo_inicio: "",
      periodo_fim: "",
      chamados_abertos_total: 0,
      chamados_fechados_total: 0,
      chamados_fora_sla: 0,
      tempo_medio_resposta: 0,
      tempo_medio_resolucao: 0,
      clientes_contatados_pos_instalacao: 0,
    },
    chamados: [],
    mensagens_chamado: [],
    pesquisa_satisfacao: [],
    clientes_risco: [],
    observacoes_gerais: "",
    instalacoes_recentes: [],
    oportunidades_comerciais: [],
    dificuldades: {
      principais_dificuldades: "",
      gargalo_comercial: "",
      gargalo_instalacao: "",
      gargalo_suporte_tecnico: "",
      gargalo_producao: "",
      gargalo_financeiro: "",
      gargalo_outro: "",
      sugestao_melhoria_processo: "",
    },
    acoes_melhoria: [],
    prioridades_proxima_semana: ["", "", "", "", ""],
    contato_proativo: [],
    resumo_final: {
      pontos_positivos_semana: "",
      pontos_atencao: "",
    },
    registro_ata: {
      responsavel_registro: "",
      supervisor_pos_vendas: "",
      gestor: "",
      cidade: "",
      data_ata: "",
    },
  };
}
