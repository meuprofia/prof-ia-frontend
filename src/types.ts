export type Escolaridade =
  | "Ensino Fundamental I"
  | "Ensino Fundamental II"
  | "Ensino Médio"
  | "Ensino Técnico"
  | "Pré-Vestibular"
  | "Graduação"
  | "Pós-Graduação"
  | "Mestrado"
  | "Doutorado"
  | "Concursos Públicos"
  | "Certificações"
  | "Outros";

export type SituacaoEducacional =
  | "Escola"
  | "Curso técnico"
  | "Curso preparatório"
  | "Faculdade"
  | "Pós graduação"
  | "Não estudo atualmente";

export type HorarioRendimento = "Manhã" | "Tarde" | "Noite" | "Tanto faz";

export type PreferenciaAprendizado =
  | "Leitura"
  | "Exercícios"
  | "Flashcards"
  | "Explicações da IA"
  | "Simulados"
  | "Outros";

export interface UserProfile {
  nome: string;
  email: string;
  escolaridade: Escolaridade;
  objetivos: string[];
  materiasIn: string[];
  materiasOut: string[];
  materiaPersonalizada?: string;
  horarioRendimento: HorarioRendimento;
  preferenciaAprendizado: PreferenciaAprendizado;
  situacaoEducacional: SituacaoEducacional;
  dificuldades: string[];
  anamneseConcluida: boolean;
  planoAtual?: "Free" | "Premium";
}

export interface UserStats {
  moedas: number;
  xp: number;
  streak: number;
  tituloAtual: string;
  tempoPlanejadoMin: number;
  tarefasConcluidas: number;
  quizzesRealizados: number;
  simuladosRealizados: number;
  redacoesEnviadas: number;
}

export interface StudyMission {
  id: string;
  dia?: string;
  materia: string;
  topico: string;
  duracao: string;
  tipo: string;
  concluida: boolean;
}

export interface DaySchedule {
  dia: string;
  missoes: StudyMission[];
}

export interface QuizQuestion {
  pergunta: string;
  opcoes: string[];
  corretaIndex: number;
  explicacao: string;
}

export interface FlashcardItem {
  id: string;
  frente: string;
  verso: string;
  dica?: string;
}

export interface SimuladoQuestion {
  materia: string;
  enunciado: string;
  opcoes: string[];
  corretaIndex: number;
  resolucao: string;
}

export interface EssayCompetencia {
  nome: string;
  nota: number;
  feedback: string;
}

export interface EssayCorrection {
  notaFinal: number;
  competencias: EssayCompetencia[];
  parecerGeral: string;
  pontosFortes: string[];
  pontosMelhoria: string[];
  sugestaoReescrita?: string;
}

export type ShopCategory =
  | "Troféus"
  | "Medalhas"
  | "Certificados"
  | "Títulos"
  | "Colecionáveis"
  | "Itens Épicos";

export type Raridade = "Comum" | "Raro" | "Épico" | "Lendário" | "Mítico";

export interface ShopItem {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  categoria: ShopCategory;
  raridade: Raridade;
  icone: string;
  desbloqueado: boolean;
  equipado?: boolean;
}

export interface CalendarEvent {
  id: string;
  titulo: string;
  data: string; // YYYY-MM-DD
  materia?: string;
  tipo: "Prova" | "Prazo" | "Lembrete" | "Simulado";
  prioridade: "Alta" | "Média" | "Baixa";
}

export interface FeedbackRecord {
  id: string;
  usuario_email: string;
  usuario_nome?: string;
  mensagem: string;
  data_envio: string;
  status: "Não lido" | "Lido";
  anonimo?: boolean;
}

export type AppModule =
  | "dashboard"
  | "plano_semana"
  | "material"
  | "material_inteligente"
  | "chat"
  | "quiz"
  | "flashcards"
  | "simulado"
  | "criar"
  | "redacao"
  | "registrar"
  | "registrar_estudo"
  | "raio_x"
  | "calendario"
  | "loja"
  | "loja_xp"
  | "perfil"
  | "gestor"
  | "opiniao";
