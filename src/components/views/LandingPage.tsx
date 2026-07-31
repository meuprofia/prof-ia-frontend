import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  Brain,
  MessageSquare,
  Award,
  CheckCircle2,
  Clock,
  ArrowRight,
  HelpCircle,
  Trophy,
  Target,
  FileText,
  BarChart3,
  UserCheck,
  Zap,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Star,
  XCircle,
  Flame,
  GraduationCap,
  Lock,
} from 'lucide-react';
import { Mascot } from '../Mascot';

interface LandingPageProps {
  onStartNow?: () => void;
  onLoginClick?: () => void;
  onOpenAuth?: () => void;
  onDirectEnter?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartNow,
  onLoginClick,
  onOpenAuth,
  onDirectEnter,
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleAction = () => {
    if (onDirectEnter) {
      onDirectEnter();
    } else if (onOpenAuth) {
      onOpenAuth();
    } else if (onStartNow) {
      onStartNow();
    }
  };

  const handleLogin = () => {
    if (onLoginClick) {
      onLoginClick();
    } else if (onOpenAuth) {
      onOpenAuth();
    } else if (onDirectEnter) {
      onDirectEnter();
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqs = [
    {
      q: 'O que é o Meu Prof IA e como ele pode me ajudar?',
      a: 'O Meu Prof IA é a plataforma completa de estudos movida a Inteligência Artificial. Ele realiza seu diagnóstico (anamnese), cria um Plano Semanal Personalizado para sua rotina, tira suas dúvidas 24/7 com explicação passo a passo, corrige suas redações no modelo ENEM e prepara resumos e simulados com relatórios em tempo real.',
    },
    {
      q: 'Como funciona o Plano Semanal Personalizado?',
      a: 'Você preenche uma anamnese simples informando seus objetivos (ENEM, Concursos, Vestibulares, Faculdade ou Colégio) e disponibilidade de tempo. A IA calcula automaticamente e gera o cronograma ideal dia por dia, priorizando as matérias em que você mais precisa evoluir.',
    },
    {
      q: 'A correção de redação modelo ENEM é precisa?',
      a: 'Sim! Nossa IA avalia seu texto de forma criteriosa pelas 5 Competências oficiais do ENEM (domínio da norma culta, compreensão do tema, organização dos argumentos, mecanismo linguístico e proposta de intervenção), fornecendo nota detalhada de 0 a 1000 e sugestões práticas de reescrita.',
    },
    {
      q: 'Preciso pagar para começar a usar?',
      a: 'Não! O Plano Free é 100% liberado para todos os novos estudantes experimentarem os recursos de anamnese, cronograma semanal, tutor de dúvidas, quizzes e simulados. Você pode começar imediatamente sem nenhuma burocracia.',
    },
    {
      q: 'Posso acessar o Meu Prof IA no celular e no computador?',
      a: 'Com certeza! A plataforma é totalmente responsiva e otimizada para smartphones, tablets e computadores. Você estuda de onde estiver, no seu próprio ritmo.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans selection:bg-[#3A7BFF]/20 selection:text-[#1D3C8F]">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-[#1E293B] via-[#334155] to-[#0F172A] text-white text-[11px] sm:text-xs py-2 px-4 text-center font-semibold flex items-center justify-center gap-2 shadow-xs">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>✨ A Plataforma de Estudos com Inteligência Artificial nº 1 para ENEM, Concursos e Vestibulares</span>
        <span className="hidden md:inline text-amber-300 font-bold">• Teste Grátis Agora!</span>
      </div>

      {/* Top Navigation Navbar */}
      <nav className="bg-white/95 backdrop-blur-md sticky top-0 z-40 border-b border-slate-100 shadow-xs px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Mascot size="sm" animate={true} />
              <div className="flex flex-col">
                <span className="font-black text-2xl tracking-tight text-[#0F172A] leading-none flex items-center gap-1">
                  Meu Prof <span className="text-[#3A7BFF]">IA</span>
                </span>
              </div>
            </div>
            <div className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3A7BFF]/10 text-[#3A7BFF] border border-[#3A7BFF]/20 text-xs font-semibold ml-2">
              <Sparkles className="w-3.5 h-3.5 text-[#3A7BFF]" />
              <span>Inteligência Artificial que ensina de verdade</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleLogin}
              className="px-4 py-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-[#3A7BFF] transition-colors rounded-xl hover:bg-slate-50 cursor-pointer"
            >
              Já tenho conta
            </button>
            <button
              onClick={handleAction}
              className="px-5 py-2.5 text-xs sm:text-sm font-bold bg-[#3A7BFF] hover:bg-[#2563EB] text-white rounded-2xl shadow-md shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <span>Entrar no App</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section (Ultra Creative & High Conversion Inspired by Meu Assessor) */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:py-20 px-4 sm:px-8 bg-gradient-to-b from-white via-[#F1F5F9] to-[#F8FAFC]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#3A7BFF]/10 via-[#8D67FF]/10 to-[#10B981]/10 border border-[#3A7BFF]/20 text-[#3A7BFF] text-xs font-extrabold shadow-2xs">
              <Sparkles className="w-4 h-4 text-[#3A7BFF]" />
              <span>ESTUDE ATÉ 3X MAIS RÁPIDO COM INTELIGÊNCIA ARTIFICIAL</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Transforme sua rotina de estudos em uma jornada <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3A7BFF] via-[#6366F1] to-[#8D67FF]">inteligente e leve</span>.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Seu professor particular com IA disponível 24h por dia. O Prof IA analisa seu perfil, gera um plano de estudos personalizado, tira dúvidas na hora, corrige redações no modelo ENEM e acompanha sua evolução em tempo real.
            </p>

            {/* Action Button */}
            <div className="pt-2 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
              <button
                onClick={handleAction}
                className="w-full sm:w-auto px-8 py-4 bg-[#3A7BFF] hover:bg-[#2563EB] text-white font-extrabold rounded-2xl shadow-xl shadow-blue-500/25 hover:shadow-2xl transition-all hover:-translate-y-0.5 flex items-center justify-center gap-3 text-base sm:text-lg cursor-pointer group"
              >
                <span>Experimentar Grátis Agora</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Catchy Feature Pills below button */}
            <div className="pt-4 space-y-3">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-2.5 text-xs font-bold text-slate-700">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-[#3A7BFF] shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-[#3A7BFF]" />
                  <span>Plano Semanal Personalizado</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-[#8D67FF] shadow-2xs">
                  <Sparkles className="w-4 h-4 text-[#8D67FF]" />
                  <span>Anamnese & Diagnóstico de Perfil</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 shadow-2xs">
                  <Zap className="w-4 h-4 text-emerald-600" />
                  <span>Tutor IA 24/7 Dúvidas Ao Vivo</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 shadow-2xs">
                  <FileText className="w-4 h-4 text-amber-600" />
                  <span>Correção de redação modelo ENEM</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 shadow-2xs">
                  <Brain className="w-4 h-4 text-indigo-600" />
                  <span>Resumos & Editor de PDF com IA</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 shadow-2xs">
                  <Trophy className="w-4 h-4 text-rose-600" />
                  <span>Quizzes e Flashcards</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium text-center lg:text-left">
                ⚡ <strong className="text-slate-800">Tudo em um só lugar:</strong> Cronogramas, resumos, simulados e acompanhamento diário para alavancar suas notas!
              </p>
            </div>
          </div>

          {/* Right Interactive Mockup Showcase (Inspired by Meu Assessor) */}
          <div className="lg:col-span-5 relative flex justify-center items-center py-4">
            <div className="relative w-full max-w-md flex flex-col items-center">
              
              {/* Background Ambient Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-tr from-[#3A7BFF]/25 via-[#8D67FF]/20 to-[#10B981]/20 rounded-full blur-3xl -z-10" />

              {/* Floating Badge 1: Redação Nota 960 (Top Right) */}
              <div className="absolute -top-3 -right-2 bg-white p-3 sm:p-3.5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 max-w-[210px] animate-bounce-slow z-20">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-xs shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-slate-900 leading-tight">
                    Redação Avaliada
                  </h4>
                  <p className="text-[10px] text-emerald-600 font-bold">
                    Nota 960 (ENEM) 🎉
                  </p>
                </div>
              </div>

              {/* Main Mascot Center Stage */}
              <div className="my-8 hover:scale-105 transition-transform duration-300 drop-shadow-2xl">
                <Mascot size="2xl" animate={true} />
              </div>

              {/* Floating Badge 2: Anamnese Concluída (Mid Left) */}
              <div className="absolute top-1/2 -left-4 sm:-left-2 -translate-y-1/2 bg-white px-3.5 py-2.5 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-2.5 z-20">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#8D67FF] flex items-center justify-center font-bold text-xs shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-extrabold text-xs text-[#8D67FF] block leading-none">
                    Anamnese IA
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    Plano Semanal Gerado!
                  </span>
                </div>
              </div>

              {/* Floating Badge 3: Tutor IA Ativo (Bottom Right) */}
              <div className="absolute -bottom-2 right-2 sm:bottom-2 sm:right-2 bg-white px-4 py-2.5 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-3 z-20">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-xs text-slate-900 block leading-none">
                    Tutor IA 24/7
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold">
                    Respondendo dúvidas ao vivo
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Social Proof & Metrics Bar (Inspired by Meu Assessor) */}
      <section className="bg-slate-900 text-white py-10 px-4 sm:px-8 border-y border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          
          <div className="p-3">
            <span className="text-3xl sm:text-4xl font-black text-[#3A7BFF] block tracking-tight">
              98.4%
            </span>
            <span className="text-xs font-semibold text-slate-300 mt-1 block">
              Satisfação e Aumento de Notas
            </span>
          </div>

          <div className="p-3 border-l border-slate-800">
            <span className="text-3xl sm:text-4xl font-black text-[#8D67FF] block tracking-tight">
              24h/dia
            </span>
            <span className="text-xs font-semibold text-slate-300 mt-1 block">
              Tutor IA de Dúvidas Ativo
            </span>
          </div>

          <div className="p-3 border-l border-slate-800">
            <span className="text-3xl sm:text-4xl font-black text-emerald-400 block tracking-tight">
              +15
            </span>
            <span className="text-xs font-semibold text-slate-300 mt-1 block">
              Funções dentro do App
            </span>
          </div>

          <div className="p-3 border-l border-slate-800">
            <span className="text-3xl sm:text-4xl font-black text-amber-400 block tracking-tight">
              100%
            </span>
            <span className="text-xs font-semibold text-slate-300 mt-1 block">
              Gratuito para Começar
            </span>
          </div>

        </div>
      </section>

      {/* Como Funciona em 3 Passos Simples (How it Works) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-16 w-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 text-[#3A7BFF] font-bold text-xs mb-3">
            <Flame className="w-4 h-4" /> SIMPLES, RÁPIDO E EFICIENTE
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Como o Meu Prof IA Transforma Seus Estudos
          </h2>
          <p className="text-slate-600 mt-2 text-sm sm:text-base max-w-2xl mx-auto">
            Em 3 passos simples você sai da estagnação e constrói uma rotina imbatível rumo à sua aprovação.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Step 1 */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm relative hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-[#3A7BFF] text-white font-black text-xl flex items-center justify-center mb-5 shadow-md shadow-blue-500/20">
              1
            </div>
            <h3 className="font-extrabold text-lg text-slate-900 mb-2">
              Diagnóstico Inicial (Anamnese)
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              Responda perguntas rápidas sobre seu objetivo (ENEM, Concurso, Vestibular ou Escola) e descubra seu perfil de aprendizagem e pontos fracos.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm relative hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-[#8D67FF] text-white font-black text-xl flex items-center justify-center mb-5 shadow-md shadow-purple-500/20">
              2
            </div>
            <h3 className="font-extrabold text-lg text-slate-900 mb-2">
              Plano Semanal Personalizado
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              A IA organiza exatamente o que estudar a cada dia da semana, distribuindo horários, resumos, simulados e metas sem sobrecarregar você.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm relative hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white font-black text-xl flex items-center justify-center mb-5 shadow-md shadow-emerald-500/20">
              3
            </div>
            <h3 className="font-extrabold text-lg text-slate-900 mb-2">
              Prática Ativa & Evolução
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              Tire dúvidas no chat 24/7, envie suas redações para correção modelo ENEM, pratique com quizzes e acompanhe seu Raio-X de notas subindo.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Grid / Tudo o que você precisa em um só lugar */}
      <section className="bg-white py-16 px-4 sm:px-8 border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Tudo o que Você Precisa em um Só Lugar
            </h2>
            <p className="text-slate-600 mt-2 text-sm sm:text-base max-w-xl mx-auto">
              Substitua dezenas de ferramentas espalhadas por um ecossistema inteligente e integrado.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/70 hover:border-[#3A7BFF]/40 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-[#3A7BFF] flex items-center justify-center mb-4 font-bold">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900 mb-1">Anamnese do Estudante</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Diagnóstico profundo de facilidades, dificuldades, estilo de estudo e rotina de horários para personalizar cada detalhe.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/70 hover:border-[#3A7BFF]/40 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-purple-100 text-[#8D67FF] flex items-center justify-center mb-4 font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900 mb-1">Plano Semanal Personalizado</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Cronograma dinâmico gerado pela IA que distribui as disciplinas da semana com metas diárias claras de estudo.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/70 hover:border-[#3A7BFF]/40 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 font-bold">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900 mb-1">Tutor IA 24/7 (Chat Prof IA)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tire dúvidas instantâneas a qualquer hora do dia ou da noite com explicações didáticas e sem enrolação.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/70 hover:border-[#3A7BFF]/40 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4 font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900 mb-1">Correção de redação modelo ENEM</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Análise criteriosa pelas 5 competências oficiais com nota de 0 a 1000, apontamento de falhas e reescrita sugerida.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/70 hover:border-[#3A7BFF]/40 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4 font-bold">
                <Brain className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900 mb-1">Criar com IA & Gerar PDF</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Editor inteligente com fonte Arial e refino por IA para produzir resumos e trabalhos e baixá-los diretamente em PDF.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/70 hover:border-[#3A7BFF]/40 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4 font-bold">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900 mb-1">Quizzes e Flashcards</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Fixe o conhecimento com repetição espaçada e simulados do seu nível de escolaridade para fixação duradoura.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Matrix (Sem o Prof IA vs Com o Prof IA) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-16 w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Por que Escolher o Meu Prof IA?
          </h2>
          <p className="text-slate-600 mt-2 text-sm sm:text-base max-w-xl mx-auto">
            Veja a diferença entre tentar estudar sozinho com métodos antigos e ter um mentor com IA.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Sem o Prof IA */}
          <div className="bg-red-50/50 p-6 sm:p-8 rounded-3xl border border-red-200/80 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 font-extrabold text-xs mb-4">
                <XCircle className="w-4 h-4" /> Método sem Prof IA
              </div>
              <ul className="space-y-4 text-xs sm:text-sm text-slate-700 font-medium">
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold shrink-0 text-base">✕</span>
                  <span>Perde horas tentando criar cronogramas em planilhas que abandona depois.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold shrink-0 text-base">✕</span>
                  <span>Espera dias ou semanas para receber uma correção genérica de redação.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold shrink-0 text-base">✕</span>
                  <span>Fica travado em questões difíceis sem ninguém para tirar dúvidas na hora.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold shrink-0 text-base">✕</span>
                  <span>Não sabe se está evoluindo ou se está estudando as matérias certas.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Com o Prof IA */}
          <div className="bg-gradient-to-br from-blue-50/80 via-emerald-50/30 to-white p-6 sm:p-8 rounded-3xl border-2 border-[#3A7BFF] shadow-lg flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#3A7BFF]/10 rounded-full blur-2xl -z-10" />
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3A7BFF] text-white font-extrabold text-xs mb-4 shadow-sm">
                <CheckCircle2 className="w-4 h-4" /> COM O MEU PROF IA
              </div>
              <ul className="space-y-4 text-xs sm:text-sm text-slate-800 font-bold">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Plano Semanal Personalizado gerado em menos de 1 minuto pela IA.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Correção de redação modelo ENEM detalhada e instantânea.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Tutor IA 24/7 pronto para explicar qualquer matéria passo a passo.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Relatórios Raio-X com métricas exatas de evolução e desempenho.</span>
                </li>
              </ul>
            </div>

            <button
              onClick={handleAction}
              className="mt-6 w-full py-3.5 px-4 bg-[#3A7BFF] hover:bg-[#2563EB] text-white font-extrabold rounded-2xl shadow-md transition-all text-sm cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Garantir Meu Acesso Agora</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Pricing / Planos (Updated with Prompt Requirements) */}
      <section className="bg-slate-50 py-16 px-4 sm:px-8 border-t border-slate-200">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">Planos & Investimento</h2>
            <p className="text-slate-600 text-sm mt-1">Comece gratuitamente e evolua com inteligência total.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Free Plan */}
            <div className="bg-white rounded-3xl p-8 border-2 border-emerald-500 shadow-md flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-xl shadow-xs">
                100% LIBERADO PARA TODOS
              </div>
              <div>
                <div className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-extrabold text-xs mb-4 border border-emerald-200">
                  PLANO GRATUITO • TUDO LIBERADO
                </div>
                <h3 className="text-2xl font-black text-slate-900">Plano Free (Acesso Total)</h3>
                <p className="text-3xl font-black text-emerald-600 mt-2">
                  R$ 0 <span className="text-xs font-normal text-slate-500">/para sempre</span>
                </p>
                <p className="text-xs text-slate-600 mt-1 font-semibold">Todas as ferramentas do aplicativo estão 100% liberadas para os alunos!</p>

                <ul className="mt-6 space-y-3 text-xs sm:text-sm text-slate-700 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>Anamnese Inteligente</strong> de perfil</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>Plano Semanal Personalizado</strong> com regeneração por IA</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>Tutor Chat Prof IA 24/7</strong> para tirar todas as dúvidas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>Correção Completa de Redação</strong> no padrão ENEM</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>Quizzes, Flashcards & Simulados IA</strong> ilimitados</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>Material Inteligente & Criar com Prof IA</strong> (Aulas e PDFs)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>Raio-X de Desempenho</strong> e Mapeamento de Pontos Fortes</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={handleAction}
                className="mt-8 w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-md transition-colors text-sm cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Entrar no Plano Free (100% Liberado)</span>
              </button>
            </div>

            {/* Premium Plan (PLANO ALTA PERFORMANCE - MISTERIO & SUSPENSE) */}
            <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 rounded-3xl p-8 sm:p-10 border-2 border-[#8D67FF] shadow-2xl flex flex-col justify-between relative overflow-hidden text-white group">
              {/* Glow Effects */}
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-[#8D67FF]/30 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-[#3A7BFF]/20 rounded-full blur-3xl pointer-events-none" />

              <div className="absolute top-5 right-5 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 text-[10px] sm:text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 animate-pulse">
                <Lock className="w-3.5 h-3.5" /> REVELAÇÃO EM BREVE
              </div>

              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-extrabold text-xs mb-5">
                  <Sparkles className="w-4 h-4 text-amber-300" /> PLANO ALTA PERFORMANCE
                </div>
                <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Plano Premium</h3>
                
                {/* Suspense Price Box */}
                <div className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-purple-200/80 font-bold block uppercase tracking-wider">Investimento</span>
                    <div className="text-2xl sm:text-3xl font-black text-amber-300 flex items-center gap-2 mt-0.5">
                      <span>R$ ???</span>
                      <span className="text-[10px] font-bold text-purple-200/90 bg-purple-900/80 px-2.5 py-1 rounded-lg border border-purple-500/30">
                        Preço de Lançamento Confidencial
                      </span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-400/30">
                    <Lock className="w-5 h-5" />
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-purple-200/90 mt-5 leading-relaxed font-medium">
                  Estamos desenvolvendo o ecossistema de inteligência artificial de alta performance mais avançado para estudantes. Recursos exclusivos mantidos a sete chaves para multiplicar seu rendimento.
                </p>

                {/* Secret Feature Teasers */}
                <div className="mt-6 space-y-3">
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-400/30">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-extrabold text-white block">[CONFIDENCIAL] Módulos de IA de Alta Performance</span>
                      <span className="text-[10px] text-purple-300/70 font-medium">Capacidades avançadas de aceleração de aprendizado em fase final.</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-400/20 text-purple-300 flex items-center justify-center shrink-0 border border-purple-400/30">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-extrabold text-white block">[SEGREDO] Análises e Correções Sem Limites</span>
                      <span className="text-[10px] text-purple-300/70 font-medium">Processamento ultra-rápido com relatórios detalhados.</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-400/20 text-blue-300 flex items-center justify-center shrink-0 border border-blue-400/30">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-extrabold text-white block">[EM BREVE] Ferramentas Exclusivas do Aprovado</span>
                      <span className="text-[10px] text-purple-300/70 font-medium">Alunos do Plano Free terão vaga garantida na lista VIP.</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button
                  disabled
                  className="w-full py-4 px-5 bg-gradient-to-r from-amber-400 via-purple-500 to-indigo-500 text-slate-950 font-black rounded-2xl text-sm sm:text-base text-center shadow-xl flex items-center justify-center gap-2 cursor-not-allowed opacity-95"
                >
                  <Lock className="w-4 h-4 text-slate-950" />
                  <span>Plano Premium (Em Breve)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8 py-16 w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-extrabold text-xs mb-3">
            <HelpCircle className="w-4 h-4 text-[#3A7BFF]" /> TIRE SUAS DÚVIDAS
          </div>
          <h2 className="text-3xl font-black text-slate-900">Perguntas Frequentes</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs transition-all"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-5 text-left font-bold text-slate-900 text-sm sm:text-base flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50"
              >
                <span>{faq.q}</span>
                {openFaqIndex === idx ? (
                  <ChevronUp className="w-5 h-5 text-[#3A7BFF] shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                )}
              </button>

              {openFaqIndex === idx && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 font-medium animate-in fade-in">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Final Call To Action Banner */}
      <section className="bg-gradient-to-r from-[#3A7BFF] via-[#6366F1] to-[#8D67FF] text-white py-14 px-4 sm:px-8 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10 space-y-5">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Pronto para transformar sua rotina e garantir sua vaga?
          </h2>
          <p className="text-blue-100 text-sm sm:text-base max-w-xl mx-auto font-medium">
            Junte-se a milhares de estudantes que utilizam a Inteligência Artificial do Meu Prof IA para aprender mais rápido e alcançar o topo.
          </p>
          <div className="pt-2">
            <button
              onClick={handleAction}
              className="px-8 py-4 bg-white text-[#3A7BFF] hover:bg-slate-100 font-black rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 text-base sm:text-lg cursor-pointer inline-flex items-center gap-2"
            >
              <span>Começar Minha Preparação Grátis</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0F172A] text-white py-8 px-4 sm:px-8 mt-auto border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Mascot size="sm" />
            <span className="font-black text-white text-base">Meu Prof IA</span>
            <span>• Seu Professor Particular com IA</span>
          </div>
          <p>© {new Date().getFullYear()} Meu Prof IA. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};
