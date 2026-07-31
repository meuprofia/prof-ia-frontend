import React, { useState } from 'react';
import {
  Award,
  Sparkles,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Clock,
  BookOpen,
  FileCheck2,
} from 'lucide-react';
import { UserProfile, SimuladoQuestion } from '../../types';
import { getApiUrl } from '../../lib/api';

interface SimuladoViewProps {
  profile: UserProfile;
}

export const SimuladoView: React.FC<SimuladoViewProps> = ({ profile }) => {
  const [modeloSimulado, setModeloSimulado] = useState('');
  const [quantidade, setQuantidade] = useState<'10' | '20' | '30'>('10');
  const [observacao, setObservacao] = useState('');
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<SimuladoQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([]);
  const [finished, setFinished] = useState(false);

  const handleGenerate = async () => {
    if (!modeloSimulado.trim()) return;
    setLoading(true);
    setQuestions([]);
    setCurrentIndex(0);
    setSelectedAnswers([]);
    setFinished(false);

    try {
      const res = await fetch(getApiUrl('/api/gemini/simulado'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo: modeloSimulado,
          quantidade,
          materias: observacao || modeloSimulado,
          nivel: profile.escolaridade,
        }),
      });
      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        setSelectedAnswers(new Array(data.questions.length).fill(null));
      } else {
        alert('Não foi possível gerar o simulado.');
      }
    } catch (e) {
      console.error(e);
      alert('Erro ao conectar com o servidor para gerar simulado.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (qIdx: number, oIdx: number) => {
    if (finished) return;
    const newAnswers = [...selectedAnswers];
    newAnswers[qIdx] = oIdx;
    setSelectedAnswers(newAnswers);
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.corretaIndex) {
        score++;
      }
    });
    return score;
  };

  const currentQ = questions[currentIndex];

  return (
    <div className="space-y-6 pb-8">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 font-semibold text-xs mb-2">
            <Award className="w-3.5 h-3.5" /> Prova Realística com IA
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Simulado IA</h1>
          <p className="text-xs text-slate-500 mt-1">
            Simule exames oficiais (ENEM, OAB, Concursos) com 10, 20 ou 30 questões e resoluções explicadas.
          </p>
        </div>
      </div>

      {/* Configuration Form */}
      {questions.length === 0 && !loading && (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs max-w-xl mx-auto space-y-4">
          <h2 className="font-bold text-slate-900 text-lg">Configurar Simulado</h2>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Qual o Simulado / Exame que você deseja realizar?
            </label>
            <input
              type="text"
              placeholder="Escreva o tipo ou objetivo (Ex: Concurso PF, ENEM Biologia, OAB 1ª Fase, Matemática Superior...)"
              value={modeloSimulado}
              onChange={(e) => setModeloSimulado(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#3A7BFF]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Quantidade de Questões (10, 20 ou 30)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['10', '20', '30'] as const).map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setQuantidade(count)}
                  className={`py-2.5 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                    quantidade === count
                      ? 'border-[#3A7BFF] bg-[#3A7BFF] text-white shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {count} Questões
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Observação (Opcional)
            </label>
            <textarea
              rows={3}
              placeholder="Escreva qualquer instrução adicional ou detalhe específico caso queira (Ex: Dar mais peso em legislação, focar nas pegadinhas...)"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#3A7BFF] resize-none"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={!modeloSimulado.trim()}
            className="w-full py-3.5 bg-[#1D3C8F] hover:bg-[#152e70] text-white font-bold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-purple-300" />
            <span>Gerar Simulado de {quantidade} Questões</span>
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="bg-white p-12 rounded-3xl border border-slate-100 shadow-xs text-center space-y-4 max-w-md mx-auto">
          <Sparkles className="w-10 h-10 text-[#3A7BFF] animate-spin mx-auto" />
          <h3 className="font-bold text-slate-900 text-lg">Elaborando a Prova...</h3>
          <p className="text-xs text-slate-500">
            O Prof IA está selecionando {quantidade} questões no padrão {modeloSimulado}.
          </p>
        </div>
      )}

      {/* Exam Simulation Active Screen */}
      {questions.length === 0 && !loading && null}
      {questions.length > 0 && !finished && currentQ && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-xs max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-[#1D3C8F] uppercase tracking-wider">
                Simulado {modeloSimulado} • Questão {currentIndex + 1} de {questions.length}
              </span>
              <p className="text-xs text-slate-500 mt-0.5">Méria: {currentQ.materia}</p>
            </div>
            <button
              onClick={() => setFinished(true)}
              className="px-4 py-1.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              Finalizar Prova
            </button>
          </div>

          <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
            {currentQ.enunciado}
          </h2>

          <div className="space-y-2.5">
            {currentQ.opcoes.map((opt, oIdx) => {
              const isSelected = selectedAnswers[currentIndex] === oIdx;
              return (
                <button
                  key={oIdx}
                  onClick={() => handleSelectOption(currentIndex, oIdx)}
                  className={`w-full p-4 rounded-2xl border text-left text-sm font-medium transition-all flex items-center gap-3 ${
                    isSelected
                      ? 'border-[#3A7BFF] bg-[#3A7BFF]/10 text-[#1D3C8F] font-bold shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300 text-slate-800'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full font-bold text-xs flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-[#3A7BFF] text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {String.fromCharCode(65 + oIdx)}
                  </span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 disabled:opacity-40"
            >
              Anterior
            </button>

            <button
              onClick={() => {
                if (currentIndex < questions.length - 1) {
                  setCurrentIndex(currentIndex + 1);
                } else {
                  setFinished(true);
                }
              }}
              className="px-6 py-2.5 bg-[#3A7BFF] hover:bg-[#2b65e0] text-white font-bold text-xs rounded-xl shadow-md transition-colors"
            >
              {currentIndex < questions.length - 1 ? 'Próxima Questão' : 'Concluir e Ver Gabarito'}
            </button>
          </div>
        </div>
      )}

      {/* Finished Result Summary & Resolutions */}
      {finished && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-xs max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2 border-b border-slate-100 pb-6">
            <h2 className="text-2xl font-extrabold text-slate-900">Gabarito e Resultado</h2>
            <p className="text-xs text-slate-500">
              Você acertou {calculateScore()} de {questions.length} questões (
              {Math.round((calculateScore() / questions.length) * 100)}%).
            </p>
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {questions.map((q, idx) => {
              const userAns = selectedAnswers[idx];
              const isCorrect = userAns === q.corretaIndex;

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border ${
                    isCorrect
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : 'bg-red-50/50 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold mb-2">
                    <span className="text-slate-700">Questão {idx + 1} ({q.materia})</span>
                    {isCorrect ? (
                      <span className="text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Correta
                      </span>
                    ) : (
                      <span className="text-red-700 flex items-center gap-1">
                        <XCircle className="w-4 h-4 text-red-600" /> Incorreta
                      </span>
                    )}
                  </div>

                  <p className="font-bold text-sm text-slate-900 mb-2">{q.enunciado}</p>

                  <p className="text-xs text-slate-700">
                    <strong>Gabarito Oficial:</strong> Alternativa {String.fromCharCode(65 + q.corretaIndex)} - {q.opcoes[q.corretaIndex]}
                  </p>

                  <div className="mt-2 p-3 bg-white/80 rounded-xl text-xs text-slate-700 font-sans border border-slate-100">
                    <strong>Resolução:</strong> {q.resolucao}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => {
              setQuestions([]);
              setFinished(false);
            }}
            className="w-full py-3.5 bg-[#3A7BFF] hover:bg-[#2b65e0] text-white font-bold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Fazer Novo Simulado</span>
          </button>
        </div>
      )}
    </div>
  );
};
