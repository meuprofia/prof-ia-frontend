import React from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  FileText,
  MessageSquareText,
  HelpCircle,
  Layers,
  Award,
  PenTool,
  FileCheck2,
  CheckCircle2,
  Activity,
  Calendar,
  ShoppingBag,
  User,
  X,
  Sparkles,
  Crown,
  MessageSquare,
  Lock,
} from 'lucide-react';
import { AppModule } from '../types';
import { Mascot } from './Mascot';

interface SidebarProps {
  currentModule?: AppModule;
  activeModule?: AppModule;
  onSelectModule: (module: AppModule) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  userEmail?: string;
  onOpenPremiumModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentModule,
  activeModule,
  onSelectModule,
  isOpenMobile = false,
  onCloseMobile,
  userEmail,
  onOpenPremiumModal,
}) => {
  const selectedModule = activeModule || currentModule || 'dashboard';

  const isGestor = (userEmail || '').toLowerCase().trim() === 'meuprofia@gmail.com';

  const menuItems: { id: AppModule; label: string; icon: React.ReactNode; badge?: string }[] = [
    ...(isGestor
      ? [
          {
            id: 'gestor' as AppModule,
            label: 'Painel do Gestor',
            icon: <Crown className="w-5 h-5 text-amber-400" />,
            badge: '👑 Dono',
          },
        ]
      : []),
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: 'plano_semana',
      label: 'Plano da Semana',
      icon: <CalendarDays className="w-5 h-5" />,
    },
    {
      id: 'material_inteligente',
      label: 'Material Inteligente',
      icon: <FileText className="w-5 h-5" />,
    },
    {
      id: 'chat',
      label: 'Chat Prof IA',
      icon: <MessageSquareText className="w-5 h-5" />,
      badge: '24/7',
    },
    {
      id: 'quiz',
      label: 'Quiz Personalizado',
      icon: <HelpCircle className="w-5 h-5" />,
    },
    {
      id: 'flashcards',
      label: 'Flashcards',
      icon: <Layers className="w-5 h-5" />,
    },
    {
      id: 'simulado',
      label: 'Simulado IA',
      icon: <Award className="w-5 h-5" />,
    },
    {
      id: 'criar',
      label: 'Criar com o Prof IA',
      icon: <PenTool className="w-5 h-5" />,
    },
    {
      id: 'redacao',
      label: 'Redação com Prof IA',
      icon: <FileCheck2 className="w-5 h-5" />,
    },
    {
      id: 'registrar_estudo',
      label: 'Registrar Estudo',
      icon: <CheckCircle2 className="w-5 h-5" />,
    },
    {
      id: 'raio_x',
      label: 'Raio X',
      icon: <Activity className="w-5 h-5" />,
    },
    {
      id: 'calendario',
      label: 'Calendário',
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      id: 'loja',
      label: 'Loja XP',
      icon: <ShoppingBag className="w-5 h-5" />,
      badge: 'Loja',
    },
    {
      id: 'perfil',
      label: 'Meu Perfil',
      icon: <User className="w-5 h-5" />,
      badge: 'Prof IA',
    },
    {
      id: 'opiniao',
      label: 'Opinião do Aluno',
      icon: <MessageSquare className="w-5 h-5" />,
      badge: 'Feedback',
    },
  ];

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-xs"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#1D3C8F] text-white flex flex-col shrink-0 transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-10 ${
          isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 px-5 flex items-center space-x-3 bg-[#162C6B] justify-between border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="relative group flex items-center justify-center shrink-0">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#3A7BFF] via-[#6366F1] to-[#A855F7] p-0.5 shadow-lg shadow-blue-500/20">
                <div className="w-full h-full bg-[#0F172A] rounded-[14px] flex items-center justify-center overflow-hidden">
                  <Mascot size="sm" />
                </div>
              </div>
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-[#162C6B] rounded-full animate-pulse" title="Prof IA Ativo" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5 leading-none">
                Meu Prof IA
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400/20 animate-pulse" />
              </span>
              <span className="text-[10px] text-cyan-300 font-bold uppercase tracking-wider mt-1 opacity-90">
                Tutor Inteligente
              </span>
            </div>
          </div>
          {/* Mobile Close Button */}
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-xl hover:bg-white/10 text-white lg:hidden transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 py-4 text-[13px] font-medium overflow-y-auto space-y-1 custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = selectedModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectModule(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full px-4 py-2 flex items-center justify-between cursor-pointer transition-all ${
                  isActive
                    ? 'bg-[#3A7BFF]/20 border-r-4 border-[#3A7BFF] font-bold text-white'
                    : 'hover:bg-white/10 text-white/80 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={isActive ? 'text-[#3A7BFF]' : 'text-white/70'}>
                    {item.icon}
                  </div>
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-[#3A7BFF] text-white'
                        : 'bg-white/10 text-white/90'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Promo Premium Card - Mystery Suspense Model */}
        <div className="p-4 mt-auto border-t border-white/10">
          <div 
            onClick={onOpenPremiumModal}
            className="bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 p-4 rounded-2xl text-xs flex flex-col space-y-2.5 shadow-lg border border-purple-500/30 text-white relative overflow-hidden group cursor-pointer hover:border-purple-400 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="font-black text-xs text-amber-300 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> PLANO PREMIUM
              </span>
              <span className="bg-amber-400/20 text-amber-300 text-[9px] font-black px-2 py-0.5 rounded-full border border-amber-400/30 flex items-center gap-1">
                <Lock className="w-2.5 h-2.5" /> REVELAÇÃO
              </span>
            </div>

            <div>
              <span className="font-extrabold text-sm text-white block">R$ ??? / mês</span>
              <p className="text-[11px] text-emerald-300 font-bold leading-tight mt-0.5">
                ✨ Plano Free com 100% dos recursos liberados!
              </p>
            </div>

            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenPremiumModal) onOpenPremiumModal();
              }}
              className="w-full bg-gradient-to-r from-amber-400 via-purple-500 to-indigo-500 text-slate-950 py-2 font-black text-xs rounded-xl hover:opacity-95 transition-opacity shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-slate-950" />
              <span>Conhecer o Premium</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
