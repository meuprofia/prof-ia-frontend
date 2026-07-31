import React, { useState } from 'react';
import {
  HelpCircle,
  Sparkles,
  CheckCircle2,
  XCircle,
  Coins,
  ArrowRight,
  RotateCcw,
  Award,
} from 'lucide-react';
import { UserProfile, QuizQuestion } from '../../types';
import { getApiUrl } from '../../lib/api';

interface QuizViewProps {
  profile: UserProfile;
  onRewardCoins: (amount: number) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ profile, onRewardCoins }) => {
  const [assunto, setAssunto] = useState('');
  const [materia, setMateria] = useState(profile.materiasOut[0] || 'Matemática');
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [coinsEarned, setCoinsEarned] = useState(0);

  const handleGenerateQuiz = async () => {
    if (!assunto.trim()) return;
    setLoading(true);
    setQuestions([]);
    setCurrentIndex(0);
    setSelectedAnswers([]);
    setShowExplanation(false);
    setQuizFinished(false);
    setCoinsEarned(0);

    try {
      const API_URL = import.meta.env.VITE_API_URL || '';
const res = await fetch(`${API_URL}/api/gemini/quiz`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assunto,
          materia,
          nivel: profile.escolaridade,
        }),
      });
      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
      } else {
        alert('Não foi possível gerar as questões. Tente outro assunto.');
      }
    } catch (e) {
      console.error(e);
      alert('Erro de rede ao solicitar quiz para a IA.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (index: number) => {
    if (showExplanation) return;
    const newAnswers = [...selectedAnswers];
    newAnswers[currentIndex] = index;
    setSelectedAnswers(newAnswers);
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowExplanation(false);
    } else {
      // Finish Quiz and calculate correct answers
      let correctCount = 0;
      questions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.corretaIndex) {
          correctCount++;
        }
      });
      setCoinsEarned(correctCount);
      if (correctCount > 0) {
        onRewardCoins(correctCount); // 1 coin per correct answer (Prompt Req 2.E.5)
      }
      setQuizFinished(true);
    }
  };

  const currentQ = questions[currentIndex];

  return (
    <div className="space-y-6 pb-8">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 font-semibold text-xs mb-2">
            <HelpCircle className="w-3.5 h-3.5" /> Ganhe 1 Moeda por Acerto
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Quiz Personalizado</h1>
          <p className="text-xs text-slate-500 mt-1">
            Escolha o assunto e o Prof IA gerará 10 questões exclusivas com explicação instantânea.
          </p>
        </div>
      </div>

      {/* Generator Form if Quiz not active */}
      {questions.length === 0 && !loading && (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs max-w-xl mx-auto space-y-4">
          <h2 className="font-bold text-slate-900 text-lg">Configurar Quiz</h2>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              O que você deseja estudar no Quiz?
            </label>
            <input
              type="text"
              placeholder="Digite o assunto ou matéria (Ex: Equação do 2º Grau, Revolução Francesa, Anatomia...)"
              value={assunto}
              onChange={(e) => setAssunto(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#3A7BFF]"
            />
          </div>

          <button
            onClick={handleGenerateQuiz}
            disabled={!assunto.trim()}
            className="w-full py-3.5 bg-[#3A7BFF] hover:bg-[#2b65e0] text-white font-bold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Gerar 10 Questões com IA</span>
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="bg-white p-12 rounded-3xl border border-slate-100 shadow-xs text-center space-y-4 max-w-md mx-auto">
          <Sparkles className="w-10 h-10 text-[#8D67FF] animate-spin mx-auto" />
          <h3 className="font-bold text-slate-900 text-lg">Criando seu Quiz...</h3>
          <p className="text-xs text-slate-500">
            O Prof IA está elaborando 10 questões e gabaritos pedagógicos sobre "{assunto}".
          </p>
        </div>
      )}

      {/* Active Quiz Question Screen */}
      {questions.length > 0 && !quizFinished && currentQ && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-xs max-w-2xl mx-auto space-y-6">
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <span className="text-xs font-bold text-[#3A7BFF] uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full">
              Questão {currentIndex + 1} de {questions.length}
            </span>
            <span className="text-xs font-semibold text-slate-500">{materia}</span>
          </div>

          {/* Question Text */}
          <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
            {currentQ.pergunta}
          </h2>

          {/* Options List */}
          <div className="space-y-2.5">
            {currentQ.opcoes.map((opt, oIdx) => {
              const isSelected = selectedAnswers[currentIndex] === oIdx;
              const isCorrect = currentQ.corretaIndex === oIdx;

              let btnStyle = 'border-slate-200 bg-white hover:border-[#3A7BFF] text-slate-800';
              if (showExplanation) {
                if (isCorrect) {
                  btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                } else if (isSelected) {
                  btnStyle = 'border-red-500 bg-red-50 text-red-900 font-bold';
                } else {
                  btnStyle = 'border-slate-100 opacity-50 bg-slate-50';
                }
              }

              return (
                <button
                  key={oIdx}
                  onClick={() => handleSelectOption(oIdx)}
                  disabled={showExplanation}
                  className={`w-full p-4 rounded-2xl border text-left text-sm font-medium transition-all flex items-center justify-between ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center shrink-0">
                      {String.fromCharCode(65 + oIdx)}
                    </span>
                    <span>{opt}</span>
                  </div>

                  {showExplanation && (
                    <div>
                      {isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                      {isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-500" />}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box */}
          {showExplanation && (
            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100 space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center gap-1.5 font-bold text-purple-900 text-xs">
                <Sparkles className="w-4 h-4 text-[#8D67FF]" />
                <span>Explicação do Prof IA:</span>
              </div>
              <p className="text-xs text-purple-950 leading-relaxed">{currentQ.explicacao}</p>
            </div>
          )}

          {/* Next Button */}
          {showExplanation && (
            <button
              onClick={handleNextQuestion}
              className="w-full py-3.5 bg-[#3A7BFF] hover:bg-[#2b65e0] text-white font-bold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>
                {currentIndex < questions.length - 1 ? 'Próxima Questão' : 'Ver Resultado do Quiz'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Finished Quiz Screen */}
      {quizFinished && (
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xs max-w-md mx-auto text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">Quiz Concluído!</h2>
            <p className="text-xs text-slate-500 mt-1">Você respondeu todas as 10 questões.</p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
            <p className="text-xs font-semibold text-amber-800">Sua Pontuação:</p>
            <p className="text-3xl font-extrabold text-amber-600">
              {coinsEarned} / 10 acertos
            </p>
            <p className="text-xs text-amber-700 font-bold flex items-center justify-center gap-1 pt-1">
              <Coins className="w-4 h-4 text-yellow-500" /> +{coinsEarned} Moedas Adicionadas!
            </p>
          </div>

          <button
            onClick={() => {
              setQuestions([]);
              setAssunto('');
            }}
            className="w-full py-3.5 bg-[#3A7BFF] hover:bg-[#2b65e0] text-white font-bold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Fazer Outro Quiz</span>
          </button>
        </div>
      )}
    </div>
  );
};
