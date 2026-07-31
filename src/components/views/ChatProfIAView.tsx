import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquareText,
  Send,
  Sparkles,
  Bot,
  User,
  Trash2,
  Lightbulb,
  Crown,
} from 'lucide-react';
import { UserProfile } from '../../types';
import { Mascot } from '../Mascot';
import { getApiUrl } from '../../lib/api';

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

interface ChatProfIAViewProps {
  profile: UserProfile;
}

export const ChatProfIAView: React.FC<ChatProfIAViewProps> = ({ profile }) => {
  const isGestor = profile.email.toLowerCase().trim() === 'meuprofia@gmail.com';

  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: '1',
      role: 'model',
      content: isGestor
        ? `👑 MODO GESTOR ATIVADO\n\nOlá, Gestor! Reconheci seu acesso autorizado como Dono/Administrador para o e-mail **meuprofia@gmail.com**.\n\nVocê possui liberação total para consultar o Painel de Gestão e Métricas do App. Como posso ajudar você hoje com dados de usuários, faturamento, relatórios de uso ou estratégias do negócio?`
        : `Olá, ${
            profile.nome || 'Estudante'
          }! Eu sou o Prof IA, seu tutor particular de estudos 24h por dia. Como posso te ajudar hoje em ${
            profile.escolaridade
          }? Pode me enviar qualquer dúvida, exercício ou pedir uma explicação do zero!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const msg = textToSend || input;
    if (!msg.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: msg.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch(`${getApiUrl()}/api/gemini/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: msg,
          history,
          profile,
        }),
      });

      const data = await res.json();
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: data.reply || 'Desculpe, ocorreu um pequeno contratempo. Vamos tentar novamente?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'model',
          content: 'Erro de conexão com o servidor do Prof IA. Verifique sua rede e tente novamente.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: '1',
        role: 'model',
        content: isGestor
          ? '👑 Histórico do Gestor redefinido. Em que posso ajudar no gerenciamento do app?'
          : `Histórico limpo! Como posso te ajudar agora, ${profile.nome || 'Estudante'}?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const sugestoes = isGestor
    ? [
        'Exibir Painel de Gestão e Métricas',
        'Quantos usuários estão online e no total?',
        'Qual o total de planos assinados e receita mensal?',
        'Dicas para aumentar a conversão do Plano Premium',
      ]
    : [
        'Como organizar uma rotina de estudos eficiente?',
        'Me explique o Teorema de Pitágoras com um exemplo simples',
        'Quais as 5 competências da redação do ENEM?',
        `Me dê 3 dicas práticas para melhorar em ${profile.materiasOut[0] || 'Matemática'}`,
      ];

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-h-[800px] bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
      {/* Top Header Bar */}
      <div className={`p-4 text-white flex items-center justify-between shadow-xs ${isGestor ? 'bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950' : 'bg-[#1D3C8F]'}`}>
        <div className="flex items-center gap-3">
          <Mascot size="sm" />
          <div>
            <h1 className="font-bold text-base flex items-center gap-2">
              <span>{isGestor ? 'Chat do Gestor Prof IA' : 'Chat Prof IA'}</span>
              {isGestor ? (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-extrabold text-[10px] border border-amber-500/30 flex items-center gap-1">
                  <Crown className="w-3 h-3 text-amber-400" /> MODO GESTOR
                </span>
              ) : (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </h1>
            <p className="text-[11px] text-purple-200">
              {isGestor ? 'Acesso total para meuprofia@gmail.com' : `Tutor 24/7 • Nível ${profile.escolaridade}`}
            </p>
          </div>
        </div>

        <button
          onClick={handleClear}
          className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl text-xs flex items-center gap-1 transition-colors"
          title="Limpar Conversa"
        >
          <Trash2 className="w-4 h-4" />
          <span className="hidden sm:inline">Limpar</span>
        </button>
      </div>

      {/* Message Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#F4F7FC]/50 custom-scrollbar">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.role === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            {msg.role === 'model' ? (
              <div className="w-8 h-8 rounded-full bg-[#1D3C8F] p-0.5 flex items-center justify-center shrink-0">
                <Mascot size="sm" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#3A7BFF] text-white flex items-center justify-center shrink-0 text-xs font-bold">
                <User className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-xs ${
                msg.role === 'user'
                  ? 'bg-[#3A7BFF] text-white rounded-tr-xs'
                  : 'bg-white text-slate-800 border border-slate-100 rounded-tl-xs'
              }`}
            >
              {msg.content}
              <div
                className={`text-[10px] mt-2 text-right ${
                  msg.role === 'user' ? 'text-blue-100' : 'text-slate-400'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1D3C8F] p-0.5 flex items-center justify-center">
              <Mascot size="sm" />
            </div>
            <div className="bg-white p-3 rounded-2xl border border-slate-100 text-xs font-medium text-slate-500 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#8D67FF] animate-spin" />
              <span>Prof IA está formulando a explicação pedagógica...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Questions */}
      {messages.length <= 2 && (
        <div className="p-3 bg-white border-t border-slate-100 overflow-x-auto flex items-center gap-2 custom-scrollbar">
          <span className="text-[11px] font-bold text-slate-400 shrink-0 flex items-center gap-1">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Dicas:
          </span>
          {sugestoes.map((sug) => (
            <button
              key={sug}
              onClick={() => handleSend(sug)}
              className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-[#8D67FF]/10 hover:text-[#8D67FF] text-slate-700 font-medium rounded-xl shrink-0 transition-colors"
            >
              {sug}
            </button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-white border-t border-slate-100 flex items-center gap-2"
      >
        <input
          type="text"
          placeholder="Digite sua dúvida ou pedido de explicação..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#3A7BFF] bg-slate-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="p-3 bg-[#3A7BFF] hover:bg-[#2b65e0] text-white rounded-2xl shadow-md transition-all disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};
