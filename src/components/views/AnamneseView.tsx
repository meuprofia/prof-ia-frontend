import React, { useState } from 'react';
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  BookOpen,
  Clock,
  Target,
  Brain,
  GraduationCap,
  AlertCircle,
} from 'lucide-react';
import { UserProfile, Escolaridade, SituacaoEducacional, HorarioRendimento, PreferenciaAprendizado } from '../../types';
import { Mascot } from '../Mascot';

interface AnamneseViewProps {
  initialProfile: UserProfile;
  onComplete: (updatedProfile: UserProfile) => void;
}

const ESCOLARIDADE_OPTIONS: Escolaridade[] = [
  'Ensino Fundamental I',
  'Ensino Fundamental II',
  'Ensino Médio',
  'Ensino Técnico',
  'Pré-Vestibular',
  'Graduação',
  'Pós-Graduação',
  'Mestrado',
  'Doutorado',
  'Concursos Públicos',
  'Certificações',
  'Outros',
];

const MATERIAS_LIST = [
  'Matemática',
  'Português',
  'Redação',
  'Física',
  'Química',
  'Biologia',
  'História',
  'Geografia',
  'Filosofia',
  'Sociologia',
  'Inglês',
  'Espanhol',
  'Literatura',
  'Artes',
  'Informática',
  'Matemática Financeira',
  'Administração',
  'Direito',
];

const SITUACAO_EDUCACIONAL_OPTIONS: SituacaoEducacional[] = [
  'Escola',
  'Curso técnico',
  'Curso preparatório',
  'Faculdade',
  'Pós graduação',
  'Não estudo atualmente',
];

const OBJETIVOS_LIST = [
  'Passar no ENEM',
  'Aprovação em Vestibular',
  'Aprovação em Concurso Público',
  'Melhorar desempenho escolar/acadêmico',
  'Reforçar matérias difíceis',
  'Aprender um novo assunto do zero',
  'Criar uma rotina de estudos consistente',
  'Obter certificação profissional',
];

const DIFICULDADES_LIST = [
  'Foco e concentração',
  'Falta de tempo',
  'Procrastinação',
  'Volume excessivo de conteúdo',
  'Não entendo a matéria fácil',
  'Esqueço o assunto rápido',
  'Ansiedade antes das provas',
  'Organização e planejamento',
];

export const AnamneseView: React.FC<AnamneseViewProps> = ({
  initialProfile,
  onComplete,
}) => {
  const [step, setStep] = useState(1);

  // Form State
  const [escolaridade, setEscolaridade] = useState<Escolaridade>(
    initialProfile.escolaridade || 'Ensino Médio'
  );
  const [objetivos, setObjetivos] = useState<string[]>(
    initialProfile.objetivos || ['Passar no ENEM']
  );
  const [materiasIn, setMateriasIn] = useState<string[]>(
    initialProfile.materiasIn || ['Português', 'História']
  );
  const [materiasOut, setMateriasOut] = useState<string[]>(
    initialProfile.materiasOut || ['Matemática', 'Física']
  );
  const [materiaPersonalizada, setMateriaPersonalizada] = useState(
    initialProfile.materiaPersonalizada || ''
  );
  const [horarioRendimento, setHorarioRendimento] = useState<HorarioRendimento>(
    initialProfile.horarioRendimento || 'Noite'
  );
  const [preferenciaAprendizado, setPreferenciaAprendizado] = useState<PreferenciaAprendizado>(
    initialProfile.preferenciaAprendizado || 'Exercícios'
  );
  const [situacaoEducacional, setSituacaoEducacional] = useState<SituacaoEducacional>(
    initialProfile.situacaoEducacional || 'Escola'
  );
  const [dificuldades, setDificuldades] = useState<string[]>(
    initialProfile.dificuldades || ['Foco e concentração', 'Procrastinação']
  );

  const [customAprendizadoText, setCustomAprendizadoText] = useState('');
  const [customCurteText, setCustomCurteText] = useState('');

  // Toggle multi-select items
  const toggleSelect = (list: string[], setList: (v: string[]) => void, item: string, max?: number) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      if (max && list.length >= max) return;
      setList([...list, item]);
    }
  };

  const handleFinish = () => {
    const finalPreferencia =
      preferenciaAprendizado === 'Outros' && customAprendizadoText.trim()
        ? (customAprendizadoText.trim() as PreferenciaAprendizado)
        : preferenciaAprendizado;

    const finalMateriasIn = customCurteText.trim()
      ? [...materiasIn, customCurteText.trim()]
      : materiasIn;

    const updatedProfile: UserProfile = {
      ...initialProfile,
      escolaridade,
      objetivos,
      materiasIn: finalMateriasIn,
      materiasOut,
      materiaPersonalizada,
      horarioRendimento,
      preferenciaAprendizado: finalPreferencia,
      situacaoEducacional,
      dificuldades,
      anamneseConcluida: true,
    };
    onComplete(updatedProfile);
  };

  return (
    <div className="min-h-screen bg-[#F4F7FC] py-8 px-4 flex flex-col justify-center items-center font-sans">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        {/* Header Progress Bar */}
        <div className="bg-[#1D3C8F] text-white p-6 relative">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Mascot size="sm" />
              <span className="font-bold text-lg">Anamnese do Estudante</span>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/10 text-[#B69DFF]">
              Passo {step} de 8
            </span>
          </div>

          <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#3A7BFF] h-full transition-all duration-300 rounded-full"
              style={{ width: `${(step / 8) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6 sm:p-8">
          {/* STEP 1: Nível de Escolaridade */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-[#3A7BFF] font-semibold text-sm">
                <GraduationCap className="w-5 h-5" />
                <span>Passo 1 • Qual é o seu nível de escolaridade atual?</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                {ESCOLARIDADE_OPTIONS.map((item) => (
                  <button
                    key={item}
                    onClick={() => setEscolaridade(item)}
                    className={`p-3.5 rounded-2xl text-left border text-sm font-medium transition-all flex items-center justify-between ${
                      escolaridade === item
                        ? 'border-[#3A7BFF] bg-[#3A7BFF]/10 text-[#1D3C8F] font-bold shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <span>{item}</span>
                    {escolaridade === item && (
                      <CheckCircle2 className="w-4 h-4 text-[#3A7BFF]" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Principal Objetivo */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-[#3A7BFF] font-semibold text-sm">
                <Target className="w-5 h-5" />
                <span>Passo 2 • Quais são os seus principais objetivos de estudo?</span>
              </div>
              <p className="text-xs text-slate-500">Selecione um ou mais objetivos principais.</p>

              <div className="grid grid-cols-1 gap-2.5 pt-2">
                {OBJETIVOS_LIST.map((item) => {
                  const selected = objetivos.includes(item);
                  return (
                    <button
                      key={item}
                      onClick={() => toggleSelect(objetivos, setObjetivos, item)}
                      className={`p-3.5 rounded-2xl text-left border text-sm font-medium transition-all flex items-center justify-between ${
                        selected
                          ? 'border-[#8D67FF] bg-[#8D67FF]/10 text-[#1D3C8F] font-bold shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                      }`}
                    >
                      <span>{item}</span>
                      {selected && <CheckCircle2 className="w-4 h-4 text-[#8D67FF]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: Matérias que você curte mais vs Dificuldades */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <div className="flex items-center gap-2 text-[#3A7BFF] font-semibold text-sm">
                  <BookOpen className="w-5 h-5" />
                  <span>Passo 3 • Preferências de Matérias</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Selecione as matérias e adicione opções personalizadas se quiser.
                </p>
              </div>

              {/* SEÇÃO 1: Matérias que você curte mais */}
              <div className="space-y-3 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
                <h3 className="font-bold text-[#1D3C8F] text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <span>Matérias de Maior Afinidade (Foco Positivo IA):</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-1 custom-scrollbar">
                  {MATERIAS_LIST.map((mat) => {
                    const isSelected = materiasIn.includes(mat);
                    return (
                      <button
                        key={`in-${mat}`}
                        type="button"
                        onClick={() => toggleSelect(materiasIn, setMateriasIn, mat)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold transition-all flex items-center justify-between text-left cursor-pointer ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-100/80 text-emerald-900 shadow-xs font-bold'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                        }`}
                      >
                        <span className="truncate">{mat}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
                <div className="pt-1">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Escrever outra matéria que você curte:
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Astrofísica, Programação, Robótica..."
                    value={customCurteText}
                    onChange={(e) => setCustomCurteText(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-emerald-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
              </div>

              {/* SEÇÃO 2: Matérias com mais dificuldades ou que não curte muito */}
              <div className="space-y-3 bg-amber-50/50 p-4 rounded-2xl border border-amber-100">
                <h3 className="font-bold text-amber-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                    <Target className="w-3.5 h-3.5" />
                  </div>
                  <span>Matérias com Maior Dificuldade (Para Reforço com IA):</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-1 custom-scrollbar">
                  {MATERIAS_LIST.map((mat) => {
                    const isSelected = materiasOut.includes(mat);
                    return (
                      <button
                        key={`out-${mat}`}
                        type="button"
                        onClick={() => toggleSelect(materiasOut, setMateriasOut, mat)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold transition-all flex items-center justify-between text-left cursor-pointer ${
                          isSelected
                            ? 'border-amber-500 bg-amber-100 text-amber-900 shadow-xs font-bold'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                        }`}
                      >
                        <span className="truncate">{mat}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
                <div className="pt-1">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Escrever outra matéria personalizada com dificuldade:
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Cálculo 1, Anatomia Humana, Economia..."
                    value={materiaPersonalizada}
                    onChange={(e) => setMateriaPersonalizada(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-amber-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Horário de Maior Rendimento */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-[#3A7BFF] font-semibold text-sm">
                <Clock className="w-5 h-5" />
                <span>Passo 4 • Qual é o seu horário de maior rendimento?</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                {[
                  { id: 'Manhã', desc: 'Sinto mais foco logo cedo ao acordar' },
                  { id: 'Tarde', desc: 'Meu rendimento engata após o almoço' },
                  { id: 'Noite', desc: 'Prefiro o silêncio e calma da noite' },
                  { id: 'Tanto faz', desc: 'Consigo me adaptar em qualquer horário' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setHorarioRendimento(item.id as HorarioRendimento)}
                    className={`p-4 rounded-2xl text-left border text-sm font-medium transition-all flex flex-col justify-between ${
                      horarioRendimento === item.id
                        ? 'border-[#3A7BFF] bg-[#3A7BFF]/10 text-[#1D3C8F] font-bold shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <span className="text-base font-bold text-slate-900 mb-1">{item.id}</span>
                    <span className="text-xs text-slate-500 font-normal">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: Preferência de Aprendizado */}
          {step === 5 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-[#3A7BFF] font-semibold text-sm">
                <Sparkles className="w-5 h-5 text-[#8D67FF]" />
                <span>Passo 5 • Como você prefere aprender um assunto novo?</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  'Leitura',
                  'Exercícios',
                  'Flashcards',
                  'Explicações da IA',
                  'Simulados',
                  'Outros',
                ].map((item) => (
                  <button
                    key={item}
                    onClick={() => setPreferenciaAprendizado(item as PreferenciaAprendizado)}
                    className={`p-4 rounded-2xl text-left border text-sm font-medium transition-all flex items-center justify-between ${
                      preferenciaAprendizado === item
                        ? 'border-[#8D67FF] bg-[#8D67FF]/10 text-[#1D3C8F] font-bold shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <span>{item}</span>
                    {preferenciaAprendizado === item && (
                      <CheckCircle2 className="w-4 h-4 text-[#8D67FF]" />
                    )}
                  </button>
                ))}
              </div>

              {/* Se escolher 'Outros', abre a opção para escrever (Prompt 2) */}
              {preferenciaAprendizado === 'Outros' && (
                <div className="pt-2 animate-in fade-in duration-200">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Especifique sua preferência de aprendizado:
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Audioaulas, Resumos visuais, Mapas mentais..."
                    value={customAprendizadoText}
                    onChange={(e) => setCustomAprendizadoText(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#8D67FF]"
                  />
                </div>
              )}
            </div>
          )}

          {/* STEP 6: Situação Educacional Atual (Ordem Exata Prompt 2.C) */}
          {step === 6 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-[#3A7BFF] font-semibold text-sm">
                <GraduationCap className="w-5 h-5" />
                <span>Passo 6 • Qual é a sua situação educacional atual?</span>
              </div>

              <div className="space-y-2.5 pt-2">
                {SITUACAO_EDUCACIONAL_OPTIONS.map((item) => (
                  <button
                    key={item}
                    onClick={() => setSituacaoEducacional(item)}
                    className={`w-full p-3.5 rounded-2xl text-left border text-sm font-medium transition-all flex items-center justify-between ${
                      situacaoEducacional === item
                        ? 'border-[#3A7BFF] bg-[#3A7BFF]/10 text-[#1D3C8F] font-bold shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <span>{item}</span>
                    {situacaoEducacional === item && (
                      <CheckCircle2 className="w-4 h-4 text-[#3A7BFF]" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 7: Maiores Dificuldades (Escolha até 3) */}
          {step === 7 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-[#3A7BFF] font-semibold text-sm">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                <span>Passo 7 • Quais são suas maiores dificuldades? (Até 3)</span>
              </div>
              <p className="text-xs text-slate-500">
                Selecione no máximo 3 opções ({dificuldades.length}/3 selecionadas).
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                {DIFICULDADES_LIST.map((item) => {
                  const selected = dificuldades.includes(item);
                  return (
                    <button
                      key={item}
                      onClick={() => toggleSelect(dificuldades, setDificuldades, item, 3)}
                      className={`p-3.5 rounded-2xl text-left border text-sm font-medium transition-all flex items-center justify-between ${
                        selected
                          ? 'border-amber-500 bg-amber-50 text-amber-900 font-bold'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                      }`}
                    >
                      <span className="truncate">{item}</span>
                      {selected && <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 8: Tela de Conclusão / Perfil Identificado */}
          {step === 8 && (
            <div className="space-y-6 text-center animate-in fade-in duration-300">
              <div className="flex justify-center">
                <Mascot size="xl" animate={true} />
              </div>

              <div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                  Perfil Identificado com Sucesso!
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-3">
                  Seu Plano Personalizado do Prof IA
                </h3>
              </div>

              {/* Summary Card */}
              <div className="bg-[#F4F7FC] p-5 rounded-2xl border border-slate-200 text-left space-y-3 text-xs sm:text-sm text-slate-700">
                <p className="leading-relaxed">
                  <strong className="text-[#1D3C8F]">Diagnóstico do Tutor:</strong> Estudante do nível{' '}
                  <span className="font-bold text-[#3A7BFF]">{escolaridade}</span> ({situacaoEducacional}), com foco principal em{' '}
                  <span className="font-bold text-[#8D67FF]">{objetivos.join(', ')}</span>.
                </p>
                <p>
                  ⚡ Rendimento otimizado no período da <strong className="text-slate-900">{horarioRendimento}</strong> utilizando técnicas de{' '}
                  <strong className="text-slate-900">{preferenciaAprendizado}</strong>.
                </p>
                {materiasOut.length > 0 && (
                  <p>
                    🎯 <strong className="text-blue-700">Meta Prioritária de Reforço:</strong> {materiasOut.join(', ')}.
                  </p>
                )}
                {materiaPersonalizada && (
                  <p>
                    ✨ <strong className="text-purple-700">Módulo Especial Ativado:</strong> {materiaPersonalizada}.
                  </p>
                )}
                {dificuldades.length > 0 && (
                  <p>
                    🛡️ <strong className="text-amber-700">Estratégias Anti-Dificuldade:</strong> Enfrentando {dificuldades.join(', ')} com micro-metas diárias.
                  </p>
                )}
              </div>

              <p className="text-xs text-slate-500">
                Tudo pronto! Seu painel inteligente de estudos foi ajustado conforme suas escolhas.
              </p>
            </div>
          )}

          {/* Bottom Action Navigation */}
          <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
            {step > 1 && step < 8 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 flex items-center gap-1.5 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </button>
            ) : (
              <div />
            )}

            {step < 8 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-6 py-2.5 bg-[#3A7BFF] hover:bg-[#2b65e0] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <span>Próximo</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-base rounded-2xl shadow-lg transition-all hover:scale-102 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-5 h-5" />
                <span>Acessar Meu Painel Principal</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
