import React from 'react';
import { Sparkles, Lock, X, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

interface PremiumMysteryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PremiumMysteryModal: React.FC<PremiumMysteryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border-2 border-[#8D67FF] shadow-2xl relative overflow-hidden space-y-6">
        {/* Glow Effects */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-[#8D67FF]/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-[#3A7BFF]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-extrabold text-xs">
          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          <span>PLANO ALTA PERFORMANCE • REVELAÇÃO EM BREVE</span>
        </div>

        {/* Title & Subtitle */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Plano Premium Prof IA
          </h2>
          <div className="mt-3 p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span><strong>Aviso:</strong> Hoje todas as ferramentas e IA do aplicativo estão <strong>100% liberadas gratuitamente</strong> no Plano Free para todos os alunos!</span>
          </div>
          <p className="text-xs sm:text-sm text-purple-200/90 mt-2 font-medium leading-relaxed">
            O ecossistema de recursos exclusivos para o lançamento do Plano Premium está em fase final de organização.
          </p>
        </div>

        {/* Price Mystery Box */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-between">
          <div>
            <span className="text-[11px] text-purple-200/80 font-bold block uppercase tracking-wider">
              Investimento Mensal
            </span>
            <div className="text-2xl sm:text-3xl font-black text-amber-300 flex items-center gap-2 mt-0.5">
              <span>R$ ???</span>
              <span className="text-[10px] font-bold text-purple-200/90 bg-purple-900/80 px-2.5 py-1 rounded-lg border border-purple-500/30">
                Lançamento Confidencial
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-400/30">
            <Lock className="w-5 h-5" />
          </div>
        </div>

        {/* Confidential Feature Teasers */}
        <div className="space-y-3">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-400/30">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-extrabold text-white block">
                [CONFIDENCIAL] Módulos Avançados de IA
              </span>
              <span className="text-[11px] text-purple-300/80 font-medium">
                Resumos, mapas mentais e simulados com tempo e foco ajustados em tempo real.
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-400/20 text-purple-300 flex items-center justify-center shrink-0 border border-purple-400/30">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-extrabold text-white block">
                [SEGREDO] Correções de Redação Sem Limites
              </span>
              <span className="text-[11px] text-purple-300/80 font-medium">
                Análise com critérios do ENEM e sugestões de reescrita detalhadas.
              </span>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-3.5 px-5 bg-gradient-to-r from-amber-400 via-purple-500 to-indigo-500 text-slate-950 font-black rounded-2xl text-sm text-center shadow-xl flex items-center justify-center gap-2 cursor-pointer hover:opacity-95 transition-opacity"
          >
            <Lock className="w-4 h-4 text-slate-950" />
            <span>Notificar-me no Lançamento • Em Breve</span>
          </button>
        </div>
      </div>
    </div>
  );
};
