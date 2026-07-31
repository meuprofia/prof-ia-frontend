import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Sparkles,
  Award,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  BarChart3,
} from 'lucide-react';
import { UserProfile, UserStats } from '../../types';
import { getApiUrl } from '../../lib/api';

interface RaioXViewProps {
  profile: UserProfile;
  stats: UserStats;
}

interface RaioXReport {
  diagnosticoGeral: string;
  desempenhoPorMateria: { materia: string; aproveitamento: number; nivel: string }[];
  pontosFortes: string[];
  pontosFracos: string[];
  planoAcaoRecomendado: string[];
}

export const RaioXView: React.FC<RaioXViewProps> = ({ profile, stats }) => {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<RaioXReport | null>(null);

  const fetchRaioX = async () => {
    setLoading(true);
    try {
      const res = await fetch(getApiUrl('/api/gemini/raio-x'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, stats }),
      });
      const data = await res.json();
      if (data.report) {
        setReport(data.report);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRaioX();
  }, []);

  return (
    <div className="space-y-6 pb-8">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8D67FF]/10 text-[#8D67FF] font-semibold text-xs mb-2">
            <BarChart3 className="w-3.5 h-3.5" /> Diagnóstico de Desempenho em Tempo Real
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Raio X do Conhecimento</h1>
          <p className="text-xs text-slate-500 mt-1">
            Mapeamento inteligente dos seus pontos fortes e fracos com plano de ação estratégico.
          </p>
        </div>

        <button
          onClick={fetchRaioX}
          disabled={loading}
          className="px-4 py-2.5 bg-[#8D67FF] hover:bg-[#7a52f0] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 shrink-0 disabled:opacity-50"
        >
          <RotateCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Atualizar Diagnóstico</span>
        </button>
      </div>

      {loading ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-100 shadow-xs text-center space-y-3 max-w-md mx-auto">
          <Sparkles className="w-10 h-10 text-[#8D67FF] animate-spin mx-auto" />
          <h3 className="font-bold text-slate-900 text-lg">Processando Métricas...</h3>
          <p className="text-xs text-slate-500">
            O Prof IA está cruzando dados de quizzes, simulados e metas para compilar o Raio X.
          </p>
        </div>
      ) : report ? (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* General Diagnosis Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-3">
            <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#8D67FF]" />
              Parecer de Desempenho do Tutor
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed bg-[#F4F7FC] p-4 rounded-2xl border border-slate-200/80">
              {report.diagnosticoGeral}
            </p>
          </div>

          {/* Subject Meters */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-4">
            <h2 className="font-bold text-slate-900 text-base">Aproveitamento por Disciplina</h2>
            <div className="space-y-3">
              {report.desempenhoPorMateria.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>{item.materia}</span>
                    <span className="text-[#3A7BFF]">{item.aproveitamento}% ({item.nivel})</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#3A7BFF] to-[#8D67FF] h-full rounded-full transition-all duration-500"
                      style={{ width: `${item.aproveitamento}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fortes vs Fracos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-3">
              <h3 className="font-bold text-emerald-700 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Domínio Sólido (Pontos Fortes)
              </h3>
              <ul className="space-y-2">
                {report.pontosFortes.map((pf, i) => (
                  <li key={i} className="text-xs text-slate-700 bg-emerald-50/60 p-3 rounded-xl border border-emerald-100">
                    {pf}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-3">
              <h3 className="font-bold text-amber-700 text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" /> Atenção Necessária (Pontos Fracos)
              </h3>
              <ul className="space-y-2">
                {report.pontosFracos.map((pf, i) => (
                  <li key={i} className="text-xs text-slate-700 bg-amber-50/60 p-3 rounded-xl border border-amber-100">
                    {pf}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Plan */}
          <div className="bg-gradient-to-r from-[#1D3C8F] to-[#284ebd] text-white p-6 rounded-3xl shadow-md space-y-3">
            <h3 className="font-bold text-base flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-300" />
              Plano de Ação Recomendado
            </h3>
            <div className="space-y-2 pt-1">
              {report.planoAcaoRecomendado.map((acao, i) => (
                <div key={i} className="p-3 rounded-xl bg-white/10 text-xs text-slate-100 backdrop-blur-xs flex items-start gap-2">
                  <span className="font-bold text-amber-300">{i + 1}.</span>
                  <span>{acao}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="py-20 text-center text-slate-400">
          Sem dados suficientes para gerar relatório.
        </div>
      )}
    </div>
  );
};
