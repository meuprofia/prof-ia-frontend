import React from 'react';
import {
  Flame,
  Coins,
  Zap,
  Target,
  Clock,
  CheckCircle2,
  CalendarDays,
  Sparkles,
  ArrowRight,
  MessageSquare,
  HelpCircle,
  FileCheck2,
  TrendingUp,
  Award,
  Bot,
  BrainCircuit,
  Layers,
  FileText,
  PenTool,
  Cpu,
  Trophy,
  GraduationCap,
} from 'lucide-react';
import { UserProfile, UserStats, StudyMission, AppModule } from '../../types';
import { Mascot } from '../Mascot';

interface DashboardViewProps {
  profile: UserProfile;
  stats: UserStats;
  nextMission?: StudyMission;
  onNavigate: (module: AppModule) => void;
  onCompleteMission: (id: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  stats,
  nextMission,
  onNavigate,
  onCompleteMission,
}) => {
  return (
    <div className="space-y-6 pb-8 font-sans">
      {/* Pending Anamnese Banner for real new users */}
      {!profile.anamneseConcluida && (
        <div className="bg-gradient-to-r from-[#1D3C8F] via-[#2B5AC6] to-[#3A7BFF] p-5 rounded-3xl text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 flex items-center justify-center shrink-0 border border-amber-400/30">
              <Sparkles className="w-6 h-6 text-amber-300 animate-bounce" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">Seu perfil está zerado! Vamos configurar com a IA?</h3>
              <p className="text-xs text-blue-100 mt-0.5">Responda à Anamnese Educacional em 1 minuto para o Prof IA analisar seus objetivos, seu ritmo e criar seu cronograma 100% real.</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('anamnese')}
            className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer whitespace-nowrap shrink-0 hover:scale-105"
          >
            Fazer Anamnese Agora
          </button>
        </div>
      )}

      {/* 4 Summary Stat Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: XP Total */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            XP Total
          </span>
          <div className="flex items-end justify-between mt-3">
            <span className="text-2xl font-bold text-[#1D3C8F]">{stats.xp}</span>
            <span className="text-[10px] bg-green-100 text-green-700 font-bold px-2.5 py-0.5 rounded-full uppercase">
              +12% hoje
            </span>
          </div>
        </div>

        {/* Card 2: Tempo Planejado */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Tempo Planejado
          </span>
          <div className="mt-3">
            <span className="text-2xl font-bold text-[#1D3C8F]">
              {Math.floor(stats.tempoPlanejadoMin / 60)}h {(stats.tempoPlanejadoMin % 60).toString().padStart(2, '0')}m
            </span>
            <div className="w-full h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
              <div className="w-3/4 h-full bg-[#3A7BFF] rounded-full" />
            </div>
          </div>
        </div>

        {/* Card 3: Questões Respondidas / Metas */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Tarefas & Exercícios
          </span>
          <div className="flex items-end justify-between mt-3">
            <span className="text-2xl font-bold text-[#1D3C8F]">{stats.tarefasConcluidas}</span>
            <span className="text-xs text-gray-400 font-medium italic">
              Meta: 15 / sem
            </span>
          </div>
        </div>

        {/* Card 4: Título Atual */}
        <div className="bg-white p-5 rounded-2xl border border-[#B69DFF] shadow-sm bg-gradient-to-br from-white to-[#B69DFF]/10 flex flex-col justify-between">
          <span className="text-xs font-bold text-[#8D67FF] uppercase tracking-wider">
            Título Atual
          </span>
          <div className="mt-2 flex items-center space-x-2">
            <div className="text-2xl">🏆</div>
            <span className="text-base font-bold text-[#8D67FF] truncate">
              {stats.tituloAtual || 'Estudante de Elite'}
            </span>
          </div>
        </div>
      </div>

      {/* Recommended Fast Actions (Moved above Sua Próxima Missão per user request) */}
      <div>
        <h3 className="font-bold text-[#1D3C8F] text-lg mb-3 flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-[#3A7BFF]" />
          <span>Ações Rápidas do Prof IA</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 1. Chat Prof IA */}
          <button
            onClick={() => onNavigate('chat')}
            className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between space-y-3 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-[#3A7BFF]/10 text-[#3A7BFF] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-[#1D3C8F] text-sm flex items-center gap-1.5">
                <span>Chat Prof IA</span>
                <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full font-extrabold">24H</span>
              </h4>
              <p className="text-xs text-gray-400 mt-1">
                Tire dúvidas instantâneas com seu professor tutor por inteligência artificial.
              </p>
            </div>
          </button>

          {/* 2. Quiz */}
          <button
            onClick={() => onNavigate('quiz')}
            className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between space-y-3 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-[#1D3C8F] text-sm">Quiz Personalizado IA</h4>
              <p className="text-xs text-gray-400 mt-1">
                Responda questões geradas sobre seu assunto foco e ganhe moedas e XP.
              </p>
            </div>
          </button>

          {/* 3. Flashcards */}
          <button
            onClick={() => onNavigate('flashcards')}
            className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between space-y-3 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-[#1D3C8F] text-sm">Flashcards Inteligentes</h4>
              <p className="text-xs text-gray-400 mt-1">
                Memorização rápida ativada por repetição espaçada e algoritmos de retenção.
              </p>
            </div>
          </button>

          {/* 4. Material Inteligente */}
          <button
            onClick={() => onNavigate('material_inteligente')}
            className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between space-y-3 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-[#1D3C8F] text-sm">Material Inteligente IA</h4>
              <p className="text-xs text-gray-400 mt-1">
                Resumos estruturados, mapas mentais e apostilas sintetizadas.
              </p>
            </div>
          </button>

          {/* 5. Redação com Prof IA */}
          <button
            onClick={() => onNavigate('redacao')}
            className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between space-y-3 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-[#8D67FF]/10 text-[#8D67FF] flex items-center justify-center group-hover:scale-110 transition-transform">
              <PenTool className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-[#1D3C8F] text-sm">Redação com Prof IA</h4>
              <p className="text-xs text-gray-400 mt-1">
                Análise sintática e estrutural com nota e correção instantânea por IA.
              </p>
            </div>
          </button>

          {/* 6. Criar com Prof IA */}
          <button
            onClick={() => onNavigate('criar')}
            className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between space-y-3 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-[#1D3C8F] text-sm">Criar com Prof IA</h4>
              <p className="text-xs text-gray-400 mt-1">
                Gere listas de exercícios, sínteses e simulados sob medida em segundos.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Main Grid: Left (Mission & Plan) + Right (Loja XP & Destaques) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Next Mission Box */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-md relative overflow-hidden">
            <div className="absolute top-2 right-2 p-2">
              <Mascot size="sm" className="opacity-25 pointer-events-none" />
            </div>
            <h3 className="text-[#1D3C8F] font-bold text-lg mb-1">Sua Próxima Missão</h3>
            <p className="text-gray-500 text-xs sm:text-sm mb-4 italic">
              "A persistência é o caminho do êxito."
            </p>

            {nextMission ? (
              <div className="bg-[#F4F7FC] p-4 sm:p-5 rounded-2xl border-l-4 border-[#3A7BFF] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-xs text-2xl text-[#3A7BFF] shrink-0">
                    📚
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#3A7BFF] uppercase tracking-wider bg-white px-2 py-0.5 rounded-md border border-gray-100">
                      {nextMission.materia}
                    </span>
                    <h4 className="font-bold text-[#1D3C8F] text-base mt-1">
                      {nextMission.topico}
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Duração: {nextMission.duracao} • Tipo: {nextMission.tipo}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => onCompleteMission(nextMission.id)}
                    className="flex-1 sm:flex-initial bg-[#3A7BFF] hover:bg-[#2860d8] text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md shadow-blue-200 transition-all text-center cursor-pointer"
                  >
                    Concluir (+1 🪙 / +10 XP)
                  </button>
                  <button
                    onClick={() => onNavigate('chat')}
                    className="bg-white hover:bg-gray-50 text-[#8D67FF] border border-[#B69DFF] px-3 py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer"
                    title="Pedir explicação ao Prof IA"
                  >
                    Explicar
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-[#F4F7FC] p-5 rounded-2xl border-l-4 border-emerald-500 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">🎉</div>
                  <div>
                    <h4 className="font-bold text-[#1D3C8F]">Todas as missões concluídas!</h4>
                    <p className="text-xs text-gray-500">Parabéns por manter os estudos em dia hoje.</p>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('quiz')}
                  className="bg-[#3A7BFF] text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Fazer Quiz
                </button>
              </div>
            )}
          </div>

          {/* Weekly Progress Visual Bar Chart */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-md">
            <h3 className="text-[#1D3C8F] font-bold text-md mb-6 flex items-center justify-between">
              <span>Progresso Semanal</span>
              <span className="text-xs font-normal text-gray-400">Atividades por dia</span>
            </h3>
            <div className="flex items-end justify-between h-32 px-2 sm:px-6">
              {[
                { day: 'SEG', height: 'h-16', active: false },
                { day: 'TER', height: 'h-24', active: false },
                { day: 'QUA', height: 'h-28', active: true },
                { day: 'QUI', height: 'h-10', active: false },
                { day: 'SEX', height: 'h-8', active: false },
                { day: 'SAB', height: 'h-8', active: false },
                { day: 'DOM', height: 'h-8', active: false },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center space-y-2">
                  <div
                    className={`w-7 sm:w-9 rounded-t-lg transition-all ${
                      item.active
                        ? 'bg-[#3A7BFF] shadow-lg shadow-blue-200 ' + item.height
                        : 'bg-[#3A7BFF]/20 ' + item.height
                    }`}
                  />
                  <span
                    className={`text-[10px] font-bold ${
                      item.active ? 'text-[#3A7BFF]' : 'text-gray-400'
                    }`}
                  >
                    {item.day}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Loja XP Rewards Box */}
          <div className="bg-[#8D67FF] rounded-3xl p-6 text-white shadow-lg shadow-purple-200">
            <h3 className="font-bold text-md mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span>Loja de Recompensas</span>
                <span className="bg-white/20 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                  XP
                </span>
              </span>
              <span className="text-xs font-bold text-yellow-300">🪙 {stats.moedas}</span>
            </h3>

            <div className="space-y-3">
              <div className="bg-white/10 p-3 rounded-xl flex items-center space-x-3 border border-white/20">
                <div className="text-2xl">🏆</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold truncate">Troféu Mestre do Conhecimento</p>
                  <p className="text-[10px] opacity-70 italic">Troféu Especial</p>
                </div>
                <span className="text-xs font-bold shrink-0">120 🪙</span>
              </div>

              <div className="bg-white/10 p-3 rounded-xl flex items-center space-x-3 border border-white/20">
                <div className="text-2xl">⚡</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold truncate">Dobro de Moedas (3 dias)</p>
                  <p className="text-[10px] opacity-70 italic">Item Épico</p>
                </div>
                <span className="text-xs font-bold shrink-0">90 🪙</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('loja_xp')}
              className="w-full mt-4 py-2.5 bg-white text-[#8D67FF] rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
            >
              Visitar Loja XP
            </button>
          </div>

          {/* Destaques & Badges Box */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-md">
            <h3 className="text-[#1D3C8F] font-bold text-md mb-4">Destaques</h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="h-24 bg-[#F4F7FC] rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-[#B69DFF] p-2 text-center">
                <span className="text-2xl grayscale mb-1">🥇</span>
                <span className="text-[8px] font-bold text-[#8D67FF] uppercase">Bloqueado</span>
              </div>
              <div className="h-24 bg-[#F4F7FC] rounded-2xl flex flex-col items-center justify-center border-2 border-[#3A7BFF] p-2 text-center">
                <GraduationCap className="w-6 h-6 text-[#3A7BFF] mb-1" />
                <span className="text-[8px] font-bold text-[#3A7BFF] uppercase">Iniciado</span>
              </div>
              <div className="h-24 bg-[#F4F7FC] rounded-2xl flex flex-col items-center justify-center border-2 border-[#2ECC71] p-2 text-center">
                <span className="text-2xl mb-1">⚡</span>
                <span className="text-[8px] font-bold text-[#2ECC71] uppercase">Nível {Math.floor(stats.xp / 100) + 1}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
