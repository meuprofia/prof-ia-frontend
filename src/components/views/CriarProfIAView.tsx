import React, { useState, useRef } from 'react';
import {
  PenTool,
  Bold,
  Italic,
  Underline,
  Sparkles,
  Download,
  Heading1,
  Heading2,
  Type,
  CheckCircle2,
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { UserProfile } from '../../types';
import { getApiUrl } from '../../lib/api';

interface CriarProfIAViewProps {
  profile: UserProfile;
}

export const CriarProfIAView: React.FC<CriarProfIAViewProps> = ({ profile }) => {
  const editorRef = useRef<HTMLDivElement>(null);

  const [currentColor, setCurrentColor] = useState<'black' | 'red'>('black');
  const [loadingRefine, setLoadingRefine] = useState(false);
  const [instrucaoAI, setInstrucaoAI] = useState('');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Execute formatting command on contentEditable
  const format = (cmd: string, value: string = '') => {
    document.execCommand(cmd, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  // Color handler restricted strictly to Black and Red
  const handleSetColor = (color: 'black' | 'red') => {
    setCurrentColor(color);
    format('foreColor', color === 'black' ? '#000000' : '#E74C3C');
  };

  // AI Refine Content
  const handleAIRefine = async () => {
    if (!editorRef.current) return;
    const currentContent = editorRef.current.innerText;
    if (!currentContent.trim()) return;

    setLoadingRefine(true);
    try {
      const res = await fetch(`${getApiUrl()}/api/gemini/editor-refine`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          texto: currentContent,
          instrucao: instrucaoAI || 'Aprimorar clareza, coesão e gramática',
        }),
      });
      const data = await res.json();
      if (data.textoAprimorado && editorRef.current) {
        editorRef.current.innerText = data.textoAprimorado;
      }
    } catch (e) {
      console.error(e);
      alert('Erro ao aprimorar texto com IA.');
    } finally {
      setLoadingRefine(false);
    }
  };

  // Generate and directly download PDF without opening any preview or text below
  const handleGeneratePDFDirect = async () => {
    if (!editorRef.current) return;
    const innerHTML = editorRef.current.innerHTML.trim();
    const innerText = editorRef.current.innerText.trim();

    if (!innerText) {
      alert('Digite algum texto no editor antes de gerar o PDF.');
      return;
    }

    setIsGeneratingPdf(true);
    setDownloadSuccess(false);

    try {
      // Off-screen element to render A4 print structure safely
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.left = '-9999px';
      container.style.top = '-9999px';
      container.style.width = '794px'; // A4 width in px at 96dpi
      container.style.padding = '48px';
      container.style.backgroundColor = '#ffffff';
      container.style.color = '#000000';
      container.style.fontFamily = 'Arial, sans-serif';
      container.style.lineHeight = '1.6';

      container.innerHTML = `
        <div style="border-bottom: 2px solid #3A7BFF; padding-bottom: 12px; margin-bottom: 24px; font-size: 12px; color: #666; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <strong style="color: #000; font-size: 14px; display: block;">Documento do Estudante • Prof IA</strong>
            <span>Estudante: ${profile.nome || 'Aluno'} (${profile.escolaridade})</span>
          </div>
          <div style="text-align: right;">
            <span>${new Date().toLocaleDateString('pt-BR')}</span>
          </div>
        </div>
        <div style="font-size: 14px; min-height: 400px; color: #111827;">${innerHTML}</div>
        <div style="margin-top: 40px; border-top: 1px solid #e5e7eb; padding-top: 12px; font-size: 10px; color: #9ca3af; text-align: center;">
          Gerado pela plataforma Prof IA • Todos os direitos reservados.
        </div>
      `;

      document.body.appendChild(container);

      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      document.body.removeChild(container);

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Documento_Prof_IA_${new Date().toISOString().slice(0, 10)}.pdf`);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 5000);
    } catch (err) {
      console.error(err);
      // Fallback text PDF
      const pdf = new jsPDF();
      const lines = pdf.splitTextToSize(innerText, 180);
      pdf.text(lines, 15, 15);
      pdf.save('Documento_Prof_IA.pdf');
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 5000);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3A7BFF]/10 text-[#3A7BFF] font-semibold text-xs mb-2">
            <PenTool className="w-3.5 h-3.5" /> Editor de Texto "Faça Você Mesmo"
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Criar com o Prof IA</h1>
          <p className="text-xs text-slate-500 mt-1">
            Editor configurado na fonte <strong>Arial</strong> com cores de destaque Preto e Vermelho e suporte a refino por IA.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {downloadSuccess && (
            <div className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>PDF Baixado!</span>
            </div>
          )}

          <button
            onClick={handleGeneratePDFDirect}
            disabled={isGeneratingPdf}
            className="px-5 py-3 bg-[#3A7BFF] hover:bg-[#2b65e0] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            title="Baixar diretamente em PDF"
          >
            <Download className={`w-4 h-4 ${isGeneratingPdf ? 'animate-bounce' : ''}`} />
            <span>{isGeneratingPdf ? 'Gerando...' : 'Gerar e baixar PDF'}</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden font-arial flex flex-col justify-between">
        <div>
          {/* Editor Toolbar (Strictly Arial, Bold, Italic, Underline, Titles, Colors Black & Red) */}
          <div className="p-3 bg-slate-100 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1">
              <button
                onClick={() => format('bold')}
                className="p-2 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors cursor-pointer"
                title="Negrito (Ctrl+B)"
              >
                <Bold className="w-4 h-4" />
              </button>

              <button
                onClick={() => format('italic')}
                className="p-2 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors cursor-pointer"
                title="Itálico (Ctrl+I)"
              >
                <Italic className="w-4 h-4" />
              </button>

              <button
                onClick={() => format('underline')}
                className="p-2 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors cursor-pointer"
                title="Sublinhado (Ctrl+U)"
              >
                <Underline className="w-4 h-4" />
              </button>

              <div className="w-px h-5 bg-slate-300 mx-1" />

              <button
                onClick={() => format('formatBlock', '<h1>')}
                className="p-2 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors cursor-pointer"
                title="Título Grande (H1)"
              >
                <Heading1 className="w-4 h-4" />
              </button>

              <button
                onClick={() => format('formatBlock', '<h2>')}
                className="p-2 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors cursor-pointer"
                title="Subtítulo (H2)"
              >
                <Heading2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => format('formatBlock', '<p>')}
                className="p-2 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors text-xs font-bold cursor-pointer"
                title="Texto Normal"
              >
                <Type className="w-4 h-4" />
              </button>

              <div className="w-px h-5 bg-slate-300 mx-1" />

              {/* MANDATORY ONLY TWO COLORS: Black & Red */}
              <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 px-1">Cores:</span>
                <button
                  type="button"
                  onClick={() => handleSetColor('black')}
                  className={`w-6 h-6 rounded-md bg-black border-2 transition-transform cursor-pointer ${
                    currentColor === 'black' ? 'border-[#3A7BFF] scale-110' : 'border-transparent'
                  }`}
                  title="Cor Preta (#000000)"
                />
                <button
                  type="button"
                  onClick={() => handleSetColor('red')}
                  className={`w-6 h-6 rounded-md bg-[#E74C3C] border-2 transition-transform cursor-pointer ${
                    currentColor === 'red' ? 'border-[#3A7BFF] scale-110' : 'border-transparent'
                  }`}
                  title="Cor Vermelha (#E74C3C)"
                />
              </div>
            </div>

            <div className="text-[11px] font-bold text-slate-500 bg-slate-200 px-2.5 py-1 rounded-md">
              Fonte: Arial
            </div>
          </div>

          {/* Editable Canvas (EMPTY INNER DOM, USES PLACEHOLDER ONLY) */}
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            data-placeholder="Digite seu trabalho, resumo ou modelo de redação aqui..."
            className="font-arial p-8 sm:p-10 min-h-[450px] outline-none text-slate-900 leading-relaxed text-base cursor-text"
          />
        </div>

        {/* AI Refine Bar */}
        <div className="p-4 bg-purple-50 border-t border-purple-100 flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center gap-2 font-bold text-purple-900 text-xs shrink-0">
            <Sparkles className="w-4 h-4 text-[#8D67FF]" />
            <span>Refinar com Prof IA:</span>
          </div>

          <input
            type="text"
            placeholder="Ex: Corrigir gramática, resumir em tópicos, simplificar linguagem..."
            value={instrucaoAI}
            onChange={(e) => setInstrucaoAI(e.target.value)}
            className="flex-1 px-4 py-2 rounded-xl border border-purple-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#8D67FF]"
          />

          <button
            onClick={handleAIRefine}
            disabled={loadingRefine}
            className="px-4 py-2 bg-[#8D67FF] hover:bg-[#7a52f0] text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
          >
            {loadingRefine ? 'Aprimorando...' : 'Aplicar Refino'}
          </button>
        </div>
      </div>
    </div>
  );
};
