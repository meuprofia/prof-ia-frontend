import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Sparkles,
  FileSearch,
  GitFork,
  PenTool,
  Copy,
  Check,
  AlertCircle,
  Image as ImageIcon,
} from 'lucide-react';
import { UserProfile } from '../../types';
import { getApiUrl } from '../../lib/api';

interface MaterialInteligenteViewProps {
  profile: UserProfile;
}

export const MaterialInteligenteView: React.FC<MaterialInteligenteViewProps> = ({
  profile,
}) => {
  const [texto, setTexto] = useState('');
  const [imagemBase64, setImagemBase64] = useState<string | null>(null);
  const [acao, setAcao] = useState<'resumo' | 'mapa' | 'reescrita'>('resumo');
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagemBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleProcessar = async () => {
    if (!texto && !imagemBase64) return;
    setLoading(true);
    setResultado(null);

    try {
      const res = await fetch(`${getApiUrl()}/api/gemini/material`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texto, acao, imagemBase64 }),
      });
      const data = await res.json();
      setResultado(data.resultado || 'Sem resultado retornado.');
    } catch (err) {
      console.error(err);
      setResultado('Erro ao conectar com o Prof IA para processar o material.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!resultado) return;
    navigator.clipboard.writeText(resultado);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8D67FF]/10 text-[#8D67FF] font-semibold text-xs mb-2">
          <FileText className="w-3.5 h-3.5" /> Leitura & Síntese Inteligente
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">Material Inteligente</h1>
        <p className="text-xs text-slate-500 mt-1">
          Envie imagens de livros, apostilas ou cole seu texto. O Prof IA sintetiza em resumos, mapas mentais e reescritas.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Column */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <h2 className="font-bold text-slate-900 text-base">1. Forneça o Material</h2>

          {/* Upload Box */}
          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center hover:border-[#3A7BFF] transition-colors relative bg-slate-50/50">
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {imagemBase64 ? (
              <div className="space-y-2">
                <img
                  src={imagemBase64}
                  alt="Material Enviado"
                  className="max-h-36 mx-auto rounded-lg shadow-xs object-cover"
                />
                <p className="text-xs text-emerald-600 font-semibold">
                  ✓ Imagem anexada com sucesso!
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
                  Clique ou arraste a foto do livro/folha aqui
                </p>
                <p className="text-[11px] text-slate-400">
                  Formatos suportados: JPG, PNG, WEBP
                </p>
              </div>
            )}
          </div>

          <div className="text-center text-xs text-slate-400 font-semibold">OU COLE SEU TEXTO</div>

          {/* Textarea */}
          <textarea
            rows={6}
            placeholder="Cole aqui o trecho do capítulo, resumo de aula ou anotação para a IA analisar..."
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            className="w-full p-4 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#3A7BFF] bg-white resize-none"
          />

          <h2 className="font-bold text-slate-900 text-base pt-2">2. Escolha o Tipo de Saída</h2>

          {/* Action Types */}
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setAcao('resumo')}
              className={`p-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${
                acao === 'resumo'
                  ? 'border-[#3A7BFF] bg-[#3A7BFF] text-white shadow-xs'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              <FileSearch className="w-4 h-4" />
              <span>Resumo Prático</span>
            </button>

            <button
              type="button"
              onClick={() => setAcao('mapa')}
              className={`p-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${
                acao === 'mapa'
                  ? 'border-[#8D67FF] bg-[#8D67FF] text-white shadow-xs'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              <GitFork className="w-4 h-4" />
              <span>Mapa Mental</span>
            </button>

            <button
              type="button"
              onClick={() => setAcao('reescrita')}
              className={`p-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${
                acao === 'reescrita'
                  ? 'border-emerald-500 bg-emerald-500 text-white shadow-xs'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              <PenTool className="w-4 h-4" />
              <span>Reescrita Didática</span>
            </button>
          </div>

          <button
            onClick={handleProcessar}
            disabled={loading || (!texto && !imagemBase64)}
            className="w-full py-3.5 bg-[#3A7BFF] hover:bg-[#2b65e0] text-white font-bold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Sintetizando Material...' : 'Gerar com Prof IA'}</span>
          </button>
        </div>

        {/* Output Column */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex flex-col justify-between space-y-4 min-h-[400px]">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#8D67FF]" />
              Resultado Gerado
            </h2>
            {resultado && (
              <button
                onClick={handleCopy}
                className="text-xs font-semibold text-[#3A7BFF] hover:underline flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado!' : 'Copiar Texto'}</span>
              </button>
            )}
          </div>

          <div className="flex-1 bg-slate-50 p-5 rounded-2xl border border-slate-200/80 overflow-y-auto max-h-[480px] custom-scrollbar text-sm text-slate-800 whitespace-pre-wrap font-sans leading-relaxed">
            {loading ? (
              <div className="py-20 text-center space-y-3">
                <Sparkles className="w-8 h-8 text-[#8D67FF] animate-spin mx-auto" />
                <p className="text-xs text-slate-500 font-medium">
                  O Prof IA está lendo o conteúdo e estruturando a melhor sintese...
                </p>
              </div>
            ) : resultado ? (
              resultado
            ) : (
              <div className="py-20 text-center text-slate-400 space-y-2">
                <FileSearch className="w-8 h-8 mx-auto stroke-1" />
                <p className="text-xs">Seu resumo ou mapa mental aparecerá aqui.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
