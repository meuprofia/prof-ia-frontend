import React, { useState } from 'react';
import {
  FileCheck2,
  Upload,
  Sparkles,
  Award,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import { UserProfile, EssayCorrection } from '../../types';
import { getApiUrl } from '../../lib/api';

interface RedacaoViewProps {
  profile: UserProfile;
  onRecordEssaySubmitted: () => void;
}

export const RedacaoView: React.FC<RedacaoViewProps> = ({
  profile,
  onRecordEssaySubmitted,
}) => {
  const [tema, setTema] = useState('');
  const [textoRedacao, setTextoRedacao] = useState('');
  const [imagemBase64, setImagemBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [avaliacao, setAvaliacao] = useState<EssayCorrection | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagemBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleEvaluate = async () => {
    if (!textoRedacao.trim() && !imagemBase64) return;
    setLoading(true);
    setAvaliacao(null);

    try {
      const res = await fetch(`${getApiUrl()}/api/gemini/redacao`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          textoRedacao,
          tema,
          imagemBase64,
        }),
      });
      const data = await res.json();
      if (data.avaliacao) {
        setAvaliacao(data.avaliacao);
        onRecordEssaySubmitted();
      } else {
        alert('Erro ao avaliar redação.');
      }
    } catch (e) {
      console.error(e);
      alert('Erro de conexão ao enviar redação para a IA.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 font-semibold text-xs mb-2">
            <FileCheck2 className="w-3.5 h-3.5" /> Avaliação Rigorosa do Prof IA (Nota 0 a 1000)
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Redação com Prof IA</h1>
          <p className="text-xs text-slate-500 mt-1">
            Envie a foto do seu manuscrito ou digite seu texto para receber nota detalhada de 0 a 1000 pelas 5 competências fundamentais da escrita.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Column */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <h2 className="font-bold text-slate-900 text-base">Enviar Redação</h2>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Tema da Redação
            </label>
            <input
              type="text"
              placeholder="Ex: Desafios para a valorização da educação no Brasil..."
              value={tema}
              onChange={(e) => setTema(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#3A7BFF]"
            />
          </div>

          {/* Photo upload option */}
          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center hover:border-[#3A7BFF] transition-colors relative bg-slate-50/50">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {imagemBase64 ? (
              <div className="space-y-2">
                <img
                  src={imagemBase64}
                  alt="Manuscrito"
                  className="max-h-36 mx-auto rounded-lg shadow-xs object-cover"
                />
                <p className="text-xs text-emerald-600 font-semibold">
                  ✓ Imagem da folha anexa
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setImagemBase64(null);
                  }}
                  className="text-xs text-red-500 hover:underline"
                >
                  Remover foto
                </button>
              </div>
            ) : (
              <div className="space-y-2 py-2">
                <Upload className="w-8 h-8 text-[#3A7BFF] mx-auto" />
                <p className="text-xs font-semibold text-slate-700">
                  Tirar ou enviar foto da folha escrita
                </p>
                <p className="text-[11px] text-slate-400">
                  O Prof IA transcreverá sua caligrafia automaticamente
                </p>
              </div>
            )}
          </div>

          <div className="text-center text-xs text-slate-400 font-semibold">OU DIGITE ABAIXO</div>

          {/* Text input */}
          <textarea
            rows={10}
            placeholder="Digite aqui o texto da sua redação (mínimo 7 linhas)..."
            value={textoRedacao}
            onChange={(e) => setTextoRedacao(e.target.value)}
            className="w-full p-4 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#3A7BFF] bg-white resize-none"
          />

          <button
            onClick={handleEvaluate}
            disabled={loading || (!textoRedacao.trim() && !imagemBase64)}
            className="w-full py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Corrigindo Redação...' : 'Corrigir Redação'}</span>
          </button>
        </div>

        {/* Evaluation Result Column */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-4 min-h-[400px]">
          <h2 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">
            Avaliação & Nota Oficial
          </h2>

          {loading ? (
            <div className="py-20 text-center space-y-3">
              <Sparkles className="w-10 h-10 text-rose-500 animate-spin mx-auto" />
              <p className="text-xs text-slate-500 font-medium">
                Corretor IA analisando norma culta, coesão, repertório e proposta de intervenção...
              </p>
            </div>
          ) : avaliacao ? (
            <div className="space-y-4 animate-in fade-in duration-300">
              {/* Score Banner */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-[#1D3C8F] text-white flex items-center justify-between shadow-md">
                <div>
                  <p className="text-xs uppercase tracking-wider text-purple-200 font-semibold">
                    Nota Final
                  </p>
                  <p className="text-4xl font-extrabold text-amber-400 mt-1">
                    {avaliacao.notaFinal} <span className="text-lg font-normal text-white/80">/ 1000</span>
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white/10 text-amber-300 flex items-center justify-center">
                  <Award className="w-7 h-7" />
                </div>
              </div>

              {/* Competencias Breakdown */}
              <div className="space-y-2">
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                  Desempenho por Competência (0 a 200)
                </h3>
                {avaliacao.competencias.map((comp, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>{comp.nome}</span>
                      <span className="text-[#3A7BFF]">{comp.nota} / 200</span>
                    </div>
                    <p className="text-slate-600">{comp.feedback}</p>
                  </div>
                ))}
              </div>

              {/* Parecer Geral */}
              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100 text-xs text-purple-950 space-y-1">
                <strong className="block font-bold text-purple-900">Parecer Pedagógico Geral:</strong>
                <p className="leading-relaxed">{avaliacao.parecerGeral}</p>
              </div>

              {/* Pontos Fortes & Melhoria */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
                  <strong className="text-emerald-900 font-bold block">✓ Pontos Fortes:</strong>
                  <ul className="list-disc list-inside text-emerald-800 space-y-0.5">
                    {avaliacao.pontosFortes.map((pf, i) => (
                      <li key={i}>{pf}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
                  <strong className="text-amber-900 font-bold block">🎯 Onde Melhorar:</strong>
                  <ul className="list-disc list-inside text-amber-800 space-y-0.5">
                    {avaliacao.pontosMelhoria.map((pm, i) => (
                      <li key={i}>{pm}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-24 text-center text-slate-400 space-y-2">
              <FileCheck2 className="w-8 h-8 mx-auto stroke-1" />
              <p className="text-xs">Sua correção de redação aparecerá detalhada aqui.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
