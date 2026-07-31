import React, { useState } from 'react';
import {
  ShoppingBag,
  Coins,
  Award,
  Sparkles,
  CheckCircle2,
  Lock,
  Gift,
  GraduationCap,
} from 'lucide-react';
import { UserStats } from '../../types';

interface LojaXPViewProps {
  stats: UserStats;
  onDeductCoins: (amount: number) => boolean;
  onUpdateTitle: (newTitle: string) => void;
}

export type RarityType = 'Comum' | 'Raro' | 'Épico' | 'Lendário' | 'Mítico';

interface ShopItem {
  id: string;
  nome: string;
  tipo: 'titulo' | 'trofeu' | 'certificado' | 'mítico';
  raridade: RarityType;
  preco: number;
  descricao: string;
  icone: React.ReactNode;
}

const RARITY_STYLES: Record<RarityType, { badge: string; border: string; glow: string; text: string }> = {
  Comum: {
    badge: 'bg-slate-100 text-slate-700 border-slate-300',
    border: 'border-slate-200 bg-white hover:border-slate-300',
    glow: '',
    text: 'text-slate-600',
  },
  Raro: {
    badge: 'bg-cyan-500/10 text-cyan-600 border-cyan-300',
    border: 'border-cyan-300 bg-gradient-to-b from-cyan-50/30 to-white hover:border-cyan-400',
    glow: 'shadow-cyan-500/10 hover:shadow-cyan-500/20',
    text: 'text-cyan-600',
  },
  Épico: {
    badge: 'bg-purple-500/10 text-[#8D67FF] border-purple-300',
    border: 'border-[#8D67FF]/40 bg-gradient-to-b from-purple-50/40 to-white hover:border-[#8D67FF]',
    glow: 'shadow-purple-500/10 hover:shadow-purple-500/20',
    text: 'text-[#8D67FF]',
  },
  Lendário: {
    badge: 'bg-amber-500/15 text-amber-700 border-amber-300 font-black',
    border: 'border-amber-400/60 bg-gradient-to-b from-amber-50/60 via-white to-amber-50/20 hover:border-amber-500',
    glow: 'shadow-amber-500/20 hover:shadow-amber-500/30 ring-1 ring-amber-400/30',
    text: 'text-amber-600',
  },
  Mítico: {
    badge: 'bg-rose-500/15 text-rose-700 border-rose-300 font-black animate-pulse',
    border: 'border-rose-400 bg-gradient-to-br from-rose-50/80 via-purple-50/40 to-amber-50/30 hover:border-rose-500',
    glow: 'shadow-rose-500/20 hover:shadow-rose-500/40 ring-2 ring-rose-400/40',
    text: 'text-rose-600',
  },
};

const SHOP_ITEMS: ShopItem[] = [
  // --- TÍTULOS (10 ITENS) ---
  {
    id: '1',
    nome: 'Aprendiz Dedicado',
    tipo: 'titulo',
    raridade: 'Comum',
    preco: 15,
    descricao: 'Título inicial para estudantes comprometidos com a rotina diária.',
    icone: '📖',
  },
  {
    id: '2',
    nome: 'Mestre dos Quizzes',
    tipo: 'titulo',
    raridade: 'Raro',
    preco: 35,
    descricao: 'Exiba o título oficial "Mestre dos Quizzes" no seu cabeçalho e perfil.',
    icone: '🎯',
  },
  {
    id: '3',
    nome: 'Gênio da Resolução Rápida',
    tipo: 'titulo',
    raridade: 'Raro',
    preco: 45,
    descricao: 'Destinado a quem resolve exercícios com velocidade e alta precisão.',
    icone: '⚡',
  },
  {
    id: '4',
    nome: 'Estrategista das Metas',
    tipo: 'titulo',
    raridade: 'Raro',
    preco: 50,
    descricao: 'Para quem atinge todas as suas missões com precisão milimétrica.',
    icone: '🧭',
  },
  {
    id: '5',
    nome: 'Sábio da Redação Nota 1000',
    tipo: 'titulo',
    raridade: 'Épico',
    preco: 75,
    descricao: 'Título prestigioso para quem domina a estrutura e coerência textual.',
    icone: '✒️',
  },
  {
    id: '6',
    nome: 'Lorde da Leitura Dinâmica',
    tipo: 'titulo',
    raridade: 'Épico',
    preco: 85,
    descricao: 'Título especial para estudantes focados em alta assimilação de textos.',
    icone: '📚',
  },
  {
    id: '7',
    nome: 'Soberano dos Simulados',
    tipo: 'titulo',
    raridade: 'Lendário',
    preco: 150,
    descricao: 'Título lendário exibido no perfil com insígnia dourada brilhante.',
    icone: '👑',
  },
  {
    id: '8',
    nome: 'Arquiteto do Aprendizado',
    tipo: 'titulo',
    raridade: 'Lendário',
    preco: 180,
    descricao: 'Para alunos que constroem rotinas e planos de estudo exemplares.',
    icone: '📐',
  },
  {
    id: '9',
    nome: 'Polímata Notável',
    tipo: 'titulo',
    raridade: 'Lendário',
    preco: 200,
    descricao: 'Reconhecimento para alunos que dominam múltiplas matérias com facilidade.',
    icone: '💡',
  },
  {
    id: '10',
    nome: 'Cérebro Quântico Supremo',
    tipo: 'mítico',
    raridade: 'Mítico',
    preco: 300,
    descricao: 'O título mais raro de todo o Prof IA. Apenas para os verdadeiros gênios.',
    icone: '🌌',
  },

  // --- TROFÉUS E MEDALHAS (10 ITENS) ---
  {
    id: '11',
    nome: 'Medalha de Bronze do Primeiro Passo',
    tipo: 'trofeu',
    raridade: 'Comum',
    preco: 20,
    descricao: 'Primeira conquista simbólica na sua jornada acadêmica no Prof IA.',
    icone: '🥉',
  },
  {
    id: '12',
    nome: 'Medalha de Prata da Perseverança',
    tipo: 'trofeu',
    raridade: 'Raro',
    preco: 40,
    descricao: 'Conquistada após acumular dezenas de sessões de estudo ativo.',
    icone: '🥈',
  },
  {
    id: '13',
    nome: 'Medalha de Ouro da Constância',
    tipo: 'trofeu',
    raridade: 'Raro',
    preco: 60,
    descricao: 'Concedida a estudantes que mantêm frequência diária ininterrupta.',
    icone: '🥇',
  },
  {
    id: '14',
    nome: 'Medalha de Honra ao Mérito',
    tipo: 'trofeu',
    raridade: 'Épico',
    preco: 100,
    descricao: 'Distinção especial por alcançar altas notas e acertos nos quizzes.',
    icone: '🎖️',
  },
  {
    id: '15',
    nome: 'Troféu Mestre do Conhecimento',
    tipo: 'trofeu',
    raridade: 'Épico',
    preco: 120,
    descricao: 'Troféu decorativo de vitrine para celebrar seu empenho nos estudos.',
    icone: '🏆',
  },
  {
    id: '16',
    nome: 'Troféu Chama da Sabedoria',
    tipo: 'trofeu',
    raridade: 'Épico',
    preco: 140,
    descricao: 'Escultura dourada representando a busca inabalável pelo saber.',
    icone: '🔥',
  },
  {
    id: '17',
    nome: 'Medalha do Concurseiro de Elite',
    tipo: 'trofeu',
    raridade: 'Lendário',
    preco: 180,
    descricao: 'Insígnia de alto prestígio para quem estuda focado para concursos.',
    icone: '🏅',
  },
  {
    id: '18',
    nome: 'Insígnia de Aço do Vestibulando',
    tipo: 'trofeu',
    raridade: 'Lendário',
    preco: 190,
    descricao: 'Emblema de resistência e foco absoluto para maratonas de provas.',
    icone: '🛡️',
  },
  {
    id: '19',
    nome: 'Troféu de Cristal Foco Total',
    tipo: 'trofeu',
    raridade: 'Lendário',
    preco: 220,
    descricao: 'Símbolo brilhante de alta concentração e disciplina intelectual.',
    icone: '💎',
  },
  {
    id: '20',
    nome: 'Troféu Supremo do Saber Contínuo',
    tipo: 'mítico',
    raridade: 'Mítico',
    preco: 350,
    descricao: 'O maior troféu da plataforma, banhado a ouro reluzente.',
    icone: '🏛️',
  },

  // --- CERTIFICADOS E MENÇÕES (10 ITENS) ---
  {
    id: '21',
    nome: 'Menção de Mérito Acadêmico',
    tipo: 'certificado',
    raridade: 'Comum',
    preco: 30,
    descricao: 'Diploma simbólico que atesta o esforço e dedicação diária.',
    icone: '📄',
  },
  {
    id: '22',
    nome: 'Certificado de Especialista em Redação',
    tipo: 'certificado',
    raridade: 'Raro',
    preco: 70,
    descricao: 'Reconhecimento por produzir textos coerentes e bem estruturados.',
    icone: '✍️',
  },
  {
    id: '23',
    nome: 'Certificado Digital de Aluno Notável',
    tipo: 'certificado',
    raridade: 'Raro',
    preco: 80,
    descricao: 'Certificado de honra assinado pelo Prof IA demonstrando empenho.',
    icone: '📜',
  },
  {
    id: '24',
    nome: 'Menção Honrosa de Excelência',
    tipo: 'certificado',
    raridade: 'Épico',
    preco: 110,
    descricao: 'Inscrição de honra registrada na sua galeria pessoal de conquistas.',
    icone: '🌟',
  },
  {
    id: '25',
    nome: 'Comendador do Conhecimento',
    tipo: 'certificado',
    raridade: 'Épico',
    preco: 130,
    descricao: 'Título honorífico com selo de cera virtual atestando liderança.',
    icone: '🏅',
  },
  {
    id: '26',
    nome: 'Diploma de Excelência em Raciocínio',
    tipo: 'certificado',
    raridade: 'Épico',
    preco: 140,
    descricao: 'Honraria concedida por alta taxa de acertos em quizzes de lógica.',
    icone: '🎓',
  },
  {
    id: '27',
    nome: 'Certificado de Superação Prof IA',
    tipo: 'certificado',
    raridade: 'Lendário',
    preco: 210,
    descricao: 'Atesta a evolução constante e a superação de metas de estudo.',
    icone: '🚀',
  },
  {
    id: '28',
    nome: 'Certificado de Domínio de Exames',
    tipo: 'certificado',
    raridade: 'Lendário',
    preco: 250,
    descricao: 'Certificação avançada atestando alto desempenho em simulados.',
    icone: <GraduationCap className="w-7 h-7 text-[#3A7BFF]" />,
  },
  {
    id: '29',
    nome: 'Lábaro da Vitória Estudantil',
    tipo: 'certificado',
    raridade: 'Lendário',
    preco: 260,
    descricao: 'Estandarte oficial de conquista e aprovação acadêmica no Prof IA.',
    icone: '🚩',
  },
  {
    id: '30',
    nome: 'Selo Oficial de Aprovação Prof IA',
    tipo: 'mítico',
    raridade: 'Mítico',
    preco: 500,
    descricao: 'Certificado digital de grau máximo emitido diretamente pelo Prof IA.',
    icone: '🎗️',
  },
];

export const LojaXPView: React.FC<LojaXPViewProps> = ({
  stats,
  onDeductCoins,
  onUpdateTitle,
}) => {
  const [unlockedItems, setUnlockedItems] = useState<string[]>([]);
  const [redeemSuccessMsg, setRedeemSuccessMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'todos' | 'titulo' | 'trofeu' | 'certificado'>('todos');

  const filteredItems = activeTab === 'todos'
    ? SHOP_ITEMS
    : SHOP_ITEMS.filter((item) => item.tipo === activeTab || (activeTab === 'titulo' && item.tipo === 'mítico'));

  const handleBuy = (item: ShopItem) => {
    if (stats.moedas < item.preco) {
      alert(`Você precisa de ${item.preco} moedas para resgatar este item.`);
      return;
    }

    const success = onDeductCoins(item.preco);
    if (success) {
      setUnlockedItems([...unlockedItems, item.id]);
      if (item.tipo === 'titulo' || item.tipo === 'mítico') {
        onUpdateTitle(item.nome);
        setRedeemSuccessMsg(`Título "${item.nome}" equipado com sucesso!`);
      } else {
        setRedeemSuccessMsg(`Item "${item.nome}" resgatado com sucesso!`);
      }

      setTimeout(() => setRedeemSuccessMsg(null), 4000);
    }
  };

  return (
    <div className="space-y-6 pb-8 font-sans">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-[#8D67FF] text-white p-6 rounded-3xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-100 font-semibold text-xs mb-2">
            <ShoppingBag className="w-3.5 h-3.5 text-yellow-200" /> Recompensas do Estudante
          </div>
          <h1 className="text-2xl font-extrabold">Loja de Recompensas & Conquistas</h1>
          <p className="text-xs text-amber-100 mt-1">
            Troque suas moedas acumuladas nos estudos por títulos, troféus, medalhas e certificados exclusivos.
          </p>
        </div>

        {/* Current Balance Display */}
        <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl border border-white/30 flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-bold text-lg">
            <Coins className="w-6 h-6 text-slate-900" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-amber-200 tracking-wider">
              Seu Saldo Atual
            </span>
            <p className="text-xl font-black text-white">{stats.moedas} Moedas 🪙</p>
          </div>
        </div>
      </div>

      {redeemSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>{redeemSuccessMsg}</span>
        </div>
      )}

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {[
          { id: 'todos', label: 'Todos os Itens', count: SHOP_ITEMS.length },
          { id: 'titulo', label: 'Títulos & Status', count: SHOP_ITEMS.filter((i) => i.tipo === 'titulo' || i.tipo === 'mítico').length },
          { id: 'trofeu', label: 'Troféus & Medalhas', count: SHOP_ITEMS.filter((i) => i.tipo === 'trofeu').length },
          { id: 'certificado', label: 'Certificados & Menções', count: SHOP_ITEMS.filter((i) => i.tipo === 'certificado').length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#1D3C8F] text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full ${
                activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Shop Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => {
          const isOwned = unlockedItems.includes(item.id) || stats.tituloAtual === item.nome;
          const canAfford = stats.moedas >= item.preco;
          const rStyle = RARITY_STYLES[item.raridade] || RARITY_STYLES.Comum;

          return (
            <div
              key={item.id}
              className={`p-5 rounded-3xl border transition-all flex flex-col justify-between space-y-4 relative ${
                isOwned
                  ? 'bg-emerald-50/60 border-emerald-300 shadow-xs'
                  : `${rStyle.border} ${rStyle.glow}`
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/80 border border-slate-200/80 flex items-center justify-center text-2xl shadow-xs group-hover:scale-105 transition-transform">
                    {item.icone}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-extrabold border ${rStyle.badge}`}
                    >
                      {item.raridade}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500">
                      {item.tipo}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-1">
                    <span>{item.nome}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.descricao}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1 font-extrabold text-amber-600 text-sm">
                  <Coins className="w-4 h-4 text-amber-500" />
                  <span>{item.preco} Moedas</span>
                </div>

                {isOwned ? (
                  <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Adquirido
                  </span>
                ) : (
                  <button
                    onClick={() => handleBuy(item)}
                    disabled={!canAfford}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer ${
                      canAfford
                        ? 'bg-[#3A7BFF] hover:bg-[#2b65e0] text-white'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {!canAfford && <Lock className="w-3.5 h-3.5" />}
                    <span>Resgatar</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
