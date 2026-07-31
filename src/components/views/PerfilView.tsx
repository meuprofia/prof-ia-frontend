import React from 'react';
import {
  User,
  Sparkles,
  RotateCcw,
  BookOpen,
  Target,
  Brain,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  GraduationCap,
  Award,
  Zap,
  ShieldCheck,
  CalendarDays,
  FileText,
  Crown,
  ArrowRight,
  MessageSquare,
} from 'lucide-react';
import { UserProfile, UserStats, AppModule } from '../../types';
import { Mascot } from '../Mascot';

interface PerfilViewProps {
  profile: UserProfile;
  stats: UserStats;
  onRefazerAnamnese: () => void;
  onNavigate: (module: AppModule) => void;
}

export const PerfilView: React.FC<PerfilViewProps> = ({
  profile,
  stats,
  onRefazerAnamnese,
  onNavigate,
}) => {
  const isGestor = profile.email.toLowerCase().trim() === 'meuprofia@gmail.com';

  return (
    <div className="space-y-6 pb-10">
      {/* Gestor Mode Banner if email matches */}
      {isGestor && (
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white p-5 rounded-3xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center shrink-0">
              <Crown className="w-7 h-7 text-amber-100" />
            </div>
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 text-white font-extrabold text-[11px] mb-0.5">
                👑 MODO GESTOR ATIVADO
              </span>
              <h2 className="text-lg font-black">E-mail de Gestor Reconhecido: meuprofia@gmail.com</h2>
              <p className="text-xs text-amber-100 font-medium">
                Você tem permissão total para acessar o Painel de Gestão, métricas de usuários e faturamento do aplicativo.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('gestor')}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-300 font-extrabold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <span>Abrir Painel de Gestão</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Banner Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#3A7BFF]/10 border border-[#3A7BFF]/20 flex items-center justify-center shrink-0">
            <Mascot size="md" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#3A7BFF]/10 text-[#3A7BFF] font-bold text-xs mb-1">
              <Sparkles className="w-3.5 h-3.5" /> Perfil Definido pelo Prof IA
            </div>
            <h1 className="text-2xl font-black text-slate-900">
              Perfil de {profile.nome || 'Estudante'}
            </h1>
            <p className="text-xs text-slate-500">
              Diagnóstico pedagógico e mapeamento de estudo gerado a partir da sua Anamnese.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => onNavigate('opiniao')}
            className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Sugerir Melhorias</span>
          </button>
          <button
            onClick={onRefazerAnamnese}
            className="px-4 py-2.5 bg-purple-50 hover:bg-purple-100 text-[#8D67FF] border border-purple-200 font-bold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Refazer Anamnese</span>
          </button>
          <button
            onClick={() => onNavigate('plano_semana')}
            className="px-4 py-2.5 bg-[#3A7BFF] hover:bg-[#2563EB] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <CalendarDays className="w-4 h-4" />
            <span>Ver Plano da Semana</span>
          </button>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Card: Summary & Identity */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-6">
          <div>
            <div className="flex flex-col items-center text-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#3A7BFF] via-[#6366F1] to-[#8D67FF] p-1 shadow-md mb-3">
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden">
                  <Mascot size="lg" />
                </div>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900">{profile.nome || 'Estudante'}</h2>
              <p className="text-xs text-slate-500 mt-0.5">{profile.email || 'estudante@profia.com'}</p>
              
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                <span className="px-3 py-1 rounded-full bg-blue-50 text-[#3A7BFF] text-xs font-bold border border-blue-100">
                  {stats.tituloAtual || 'Aspirante a Sábio'}
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 shadow-2xs">
                  {profile.planoAtual ? `${profile.planoAtual} (100% Liberado)` : 'Plano Free (100% Liberado)'}
                </span>
              </div>
            </div>

            <div className="mt-6 space-y-3.5 text-xs text-slate-700">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="flex items-center gap-2 text-slate-500 font-medium">
                  <GraduationCap className="w-4 h-4 text-[#3A7BFF]" /> Escolaridade
                </span>
                <span className="font-bold text-slate-900">{profile.escolaridade}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="flex items-center gap-2 text-slate-500 font-medium">
                  <BookOpen className="w-4 h-4 text-[#8D67FF]" /> Situação Atual
                </span>
                <span className="font-bold text-slate-900">{profile.situacaoEducacional}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="flex items-center gap-2 text-slate-500 font-medium">
                  <Clock className="w-4 h-4 text-amber-500" /> Horário de Rendimento
                </span>
                <span className="font-bold text-slate-900">{profile.horarioRendimento}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="flex items-center gap-2 text-slate-500 font-medium">
                  <Brain className="w-4 h-4 text-emerald-500" /> Preferência de Estudo
                </span>
                <span className="font-bold text-slate-900">{profile.preferenciaAprendizado}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-2xl flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#3A7BFF] shrink-0 mt-0.5" />
              <p className="text-xs text-slate-600 leading-relaxed">
                Este perfil é utilizado continuamente pela Inteligência Artificial para personalizar seus simulados, resumos e questões.
              </p>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Mapped Strengths, Weaknesses, Goals & AI Recommendations */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Objetivos Mapeados */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
              <Target className="w-4 h-4 text-[#3A7BFF]" />
              <span>Objetivos Mapeados pelo Prof IA</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.objetivos && profile.objetivos.length > 0 ? (
                profile.objetivos.map((obj, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-[#3A7BFF] font-bold text-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {obj}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400">Nenhum objetivo específico registrado.</span>
              )}
            </div>
          </div>

          {/* Matérias: Facilidade vs Dificuldade */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Facilidades */}
            <div className="bg-white p-5 rounded-3xl border border-emerald-200/80 shadow-xs space-y-3 bg-emerald-50/20">
              <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-xs uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Maior Facilidade (Pontos Fortes)</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.materiasIn && profile.materiasIn.length > 0 ? (
                  profile.materiasIn.map((mat, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs"
                    >
                      {mat}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">Não informado</span>
                )}
              </div>
            </div>

            {/* Dificuldades */}
            <div className="bg-white p-5 rounded-3xl border border-rose-200/80 shadow-xs space-y-3 bg-rose-50/20">
              <div className="flex items-center gap-2 text-rose-800 font-extrabold text-xs uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Maior Dificuldade (Prioridades)</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.materiasOut && profile.materiasOut.length > 0 ? (
                  profile.materiasOut.map((mat, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-xl bg-rose-100 text-rose-800 font-bold text-xs"
                    >
                      {mat}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">Não informado</span>
                )}
              </div>
            </div>

          </div>

          {/* Matéria Personalizada (if set) */}
          {profile.materiaPersonalizada && (
            <div className="bg-white p-4 rounded-2xl border border-purple-200 bg-purple-50/40 flex items-center justify-between text-xs">
              <span className="font-bold text-purple-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#8D67FF]" /> Foco em Matéria/Interesse Específico:
              </span>
              <span className="font-extrabold text-[#8D67FF] bg-white px-3 py-1 rounded-xl border border-purple-200">
                {profile.materiaPersonalizada}
              </span>
            </div>
          )}

          {/* Diagnóstico Pedagógico do Prof IA */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <span>Direcionamento Pedagógico Gerado pelo Prof IA</span>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed font-medium">
                <p className="font-bold text-slate-900 mb-1">💡 Estratégia de Horário ({profile.horarioRendimento}):</p>
                O Prof IA alocou as matérias de maior peso e dificuldade (como {profile.materiasOut.join(', ') || 'as suas disciplinas prioritárias'}) no seu período de pico de foco ({profile.horarioRendimento.toLowerCase()}) para maximizar sua retenção.
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed font-medium">
                <p className="font-bold text-slate-900 mb-1">🎯 Foco Metodológico ({profile.preferenciaAprendizado}):</p>
                Suas sessões diárias priorizam a prática ativa baseada em {profile.preferenciaAprendizado.toLowerCase()}, alternando com revisões guiadas no chat para fixação permanente.
              </div>

              {profile.dificuldades && profile.dificuldades.length > 0 && (
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs text-slate-800 leading-relaxed font-medium">
                  <p className="font-bold text-amber-900 mb-1">⚠️ Combate a Obstáculos Identificados:</p>
                  A IA configurou lembretes e metas em blocos curtos para contornar problemas como: <strong>{profile.dificuldades.join(', ')}</strong>.
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={onRefazerAnamnese}
                className="text-xs font-bold text-[#3A7BFF] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Deseja alterar essas configurações? Refazer Anamnese</span>
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
