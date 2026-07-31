import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  RotateCcw,
} from 'lucide-react';
import { UserProfile, FlashcardItem } from '../../types';
import { getApiUrl } from '../../lib/api';

interface FlashcardsViewProps {
  profile: UserProfile;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({ profile }) => {
  const [assunto, setAssunto] = useState('');
  const [materia, setMateria] = useState(profile.materiasOut[0] || 'Matemática');
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState<FlashcardItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleGenerate = async () => {
    if (!assunto.trim()) return;
    setLoading(true);
    setCards([]);
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowHint(false);

    try {
      const res = await fetch(`${getApiUrl()}/api/gemini/flashcards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assunto, materia }),
      });
      const data = await res.json();
      if (data.flashcards && data.flashcards.length > 0) {
        setCards(
          data.flashcards.map((fc: any, i: number) => ({
            id: i.toString(),
            frente: fc.frente,
            verso: fc.verso,
            dica: fc.dica,
          }))
        );
      } else {
        alert('Não foi possível gerar flashcards.');
      }
    } catch (e) {
      console.error(e);
      alert('Erro de conexão ao gerar flashcards.');
    } finally {
      setLoading(false);
    }
  };

  const currentCard = cards[currentIndex];

  return (
    <div className="space-y-6 pb-8">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-[#8D67FF] font-semibold text-xs mb-2">
            <Layers className="w-3.5 h-3.5" /> Memorização Ativa
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Flashcards Inteligentes</h1>
          <p className="text-xs text-slate-500 mt-1">
            Gere 10 cartões dinâmicos de memorização para reforçar conceitos e definições.
          </p>
        </div>
      </div>

      {/* Generator Form */}
      {cards.length === 0 && !loading && (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs max-w-xl mx-auto space-y-4">
          <h2 className="font-bold text-slate-900 text-lg">Criar Baralho de Flashcards</h2>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              O que você deseja memorizar com Flashcards?
            </label>
            <input
              type="text"
              placeholder="Digite o tema ou assunto (Ex: Fórmula de Baskhara, Leis de Newton, Anatomia...)"
              value={assunto}
              onChange={(e) => setAssunto(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#8D67FF]"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={!assunto.trim()}
            className="w-full py-3.5 bg-[#8D67FF] hover:bg-[#7a52f0] text-white font-bold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Gerar 10 Flashcards com IA</span>
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white p-12 rounded-3xl border border-slate-100 shadow-xs text-center space-y-4 max-w-md mx-auto">
          <Sparkles className="w-10 h-10 text-[#8D67FF] animate-spin mx-auto" />
          <h3 className="font-bold text-slate-900 text-lg">Gerando Flashcards...</h3>
          <p className="text-xs text-slate-500">
            Sintetizando 10 perguntas e respostas objetivas sobre "{assunto}".
          </p>
        </div>
      )}

      {/* Active Flashcard Viewer */}
      {cards.length > 0 && currentCard && (
        <div className="max-w-xl mx-auto space-y-6">
          {/* Card Counter Bar */}
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 bg-white px-5 py-2.5 rounded-2xl border border-slate-100 shadow-xs">
            <span>
              Cartão {currentIndex + 1} de {cards.length}
            </span>
            <button
              onClick={() => {
                setCards([]);
                setAssunto('');
              }}
              className="text-[#3A7BFF] hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Outro tema
            </button>
          </div>

          {/* Interactive Flip Card Container */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full min-h-[300px] bg-gradient-to-br from-white to-purple-50/50 rounded-3xl border-2 border-[#8D67FF]/30 p-8 shadow-md flex flex-col justify-between items-center text-center cursor-pointer transition-all hover:border-[#8D67FF] relative overflow-hidden group"
          >
            <div className="text-xs font-bold uppercase tracking-wider text-[#8D67FF] bg-purple-100 px-3 py-1 rounded-full">
              {isFlipped ? 'VERSO (EXPLICAÇÃO)' : 'FRENTE (CONCEITO / PERGUNTA)'}
            </div>

            <div className="my-auto py-6 space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-relaxed">
                {isFlipped ? currentCard.verso : currentCard.frente}
              </h2>

              {!isFlipped && showHint && currentCard.dica && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 font-medium animate-in fade-in">
                  💡 Dica: {currentCard.dica}
                </div>
              )}
            </div>

            <div className="text-xs font-medium text-slate-400 flex items-center gap-1 group-hover:text-[#8D67FF] transition-colors">
              <RotateCw className="w-3.5 h-3.5" /> Clique para virar o cartão
            </div>
          </div>

          {/* Card Controls */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => {
                if (currentIndex > 0) {
                  setCurrentIndex(currentIndex - 1);
                  setIsFlipped(false);
                  setShowHint(false);
                }
              }}
              disabled={currentIndex === 0}
              className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-1 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" /> Anterior
            </button>

            {currentCard.dica && !isFlipped && (
              <button
                onClick={() => setShowHint(!showHint)}
                className="px-3.5 py-2.5 bg-amber-50 text-amber-800 font-bold text-xs rounded-xl border border-amber-200 hover:bg-amber-100 transition-colors flex items-center gap-1.5"
              >
                <Lightbulb className="w-4 h-4 text-amber-600" />
                <span>{showHint ? 'Ocultar Dica' : 'Ver Dica'}</span>
              </button>
            )}

            <button
              onClick={() => {
                if (currentIndex < cards.length - 1) {
                  setCurrentIndex(currentIndex + 1);
                  setIsFlipped(false);
                  setShowHint(false);
                }
              }}
              disabled={currentIndex === cards.length - 1}
              className="px-4 py-2.5 bg-[#8D67FF] hover:bg-[#7a52f0] text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1 disabled:opacity-40"
            >
              Próximo <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
