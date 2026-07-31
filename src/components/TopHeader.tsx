import React, { useState, useRef, useEffect } from 'react';
import {
  Coins,
  Zap,
  User,
  RotateCcw,
  Sparkles,
  LogOut,
  ChevronDown,
  Menu,
  Crown,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import { UserProfile, UserStats } from '../types';
import { Mascot } from './Mascot';

interface TopHeaderProps {
  profile: UserProfile;
  stats: UserStats;
  onOpenProfile: () => void;
  onOpenGestor?: () => void;
  onRefazerAnamnese: () => void;
  onLogout: () => void;
  onToggleSidebar?: () => void;
  onOpenPremiumModal?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  profile,
  stats,
  onOpenProfile,
  onOpenGestor,
  onRefazerAnamnese,
  onLogout,
  onToggleSidebar,
  onOpenPremiumModal,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isGestor = profile.email.toLowerCase().trim() === 'meuprofia@gmail.com';

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-8 shrink-0 text-[#1A1A1A] sticky top-0 z-30">
      {/* Left side: Mobile Toggle & Greeting */}
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-[#1D3C8F] lg:hidden transition-colors"
            title="Abrir Menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        )}
        <div className="flex flex-col">
          <h2 className="font-bold text-base sm:text-lg text-[#1D3C8F] flex items-center gap-1.5">
            Olá, {profile.nome || 'Estudante'}! 👋
            {isGestor && (
              <span
                onClick={onOpenGestor}
                className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 font-extrabold text-[11px] cursor-pointer hover:bg-amber-200 transition-all shadow-2xs"
                title="Clique para abrir o Painel de Gestão do App"
              >
                <Crown className="w-3.5 h-3.5 text-amber-600 animate-bounce-slow" /> MODO GESTOR
              </span>
            )}
          </h2>
          <p className="text-xs text-gray-400 hidden sm:block">
            {isGestor
              ? 'Painel do Gestor Ativo para meuprofia@gmail.com'
              : 'Bom dia, pronto para os estudos hoje?'}
          </p>
        </div>
      </div>

      {/* Middle/Right side: Gamification Stats & Profile Pill */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        {/* Gamification Stats Pill */}
        <div className="flex items-center bg-[#F4F7FC] px-3 py-1.5 rounded-2xl space-x-2.5 text-xs border border-slate-100 shadow-2xs">
          <div className="flex items-center space-x-1.5" title="Moedas acumuladas">
            <div className="w-5 h-5 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
              <Coins className="w-3.5 h-3.5" />
            </div>
            <span className="text-[#1D3C8F] font-extrabold">{stats.moedas} <span className="text-[10px] text-slate-400 font-bold uppercase hidden md:inline">Moedas</span></span>
          </div>
          <div className="flex items-center space-x-1.5 border-l border-gray-200 pl-2.5" title="XP e Nível">
            <div className="w-5 h-5 rounded-lg bg-[#8D67FF]/10 text-[#8D67FF] flex items-center justify-center shrink-0">
              <Zap className="w-3.5 h-3.5" />
            </div>
            <span className="text-[#8D67FF] font-extrabold">Nível {Math.floor(stats.xp / 100) + 1} <span className="text-[10px] text-slate-400 font-medium hidden md:inline">({stats.xp} XP)</span></span>
          </div>
        </div>

        {/* Profile Pill & Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2.5 cursor-pointer hover:bg-gray-50 p-1.5 rounded-xl transition-colors focus:outline-none"
          >
            <div className="text-right hidden md:block">
              <p className="text-xs font-bold text-[#1D3C8F]">{stats.tituloAtual || 'Estudante de Elite'}</p>
              <p className="text-[10px] text-emerald-600 uppercase tracking-widest font-black flex items-center justify-end gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Plano Free (100% Liberado)
              </p>
            </div>
            <div className="w-9 h-9 bg-[#3A7BFF]/10 rounded-full border-2 border-[#3A7BFF] flex items-center justify-center overflow-hidden">
              <Mascot size="sm" />
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white text-slate-800 rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              {/* Header info */}
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50 rounded-t-2xl">
                <p className="font-semibold text-sm text-[#1D3C8F]">{profile.nome || 'Estudante'}</p>
                <p className="text-xs text-gray-400 truncate">{profile.email || 'estudante@profia.com'}</p>
                <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#8D67FF]/10 text-[#8D67FF]">
                  <Sparkles className="w-3 h-3" />
                  {profile.escolaridade || 'Estudante'}
                </div>
              </div>

              <div className="py-1 text-sm">
                {isGestor && onOpenGestor && (
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onOpenGestor();
                    }}
                    className="w-full text-left px-4 py-2.5 flex items-center gap-2.5 hover:bg-amber-50 text-amber-800 font-extrabold transition-colors border-b border-gray-100"
                  >
                    <Crown className="w-4 h-4 text-amber-500" />
                    Painel do Gestor
                  </button>
                )}

                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    onOpenProfile();
                  }}
                  className="w-full text-left px-4 py-2.5 flex items-center gap-2.5 hover:bg-gray-50 text-slate-700 font-medium transition-colors"
                >
                  <User className="w-4 h-4 text-[#3A7BFF]" />
                  Meu Perfil
                </button>

                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    onRefazerAnamnese();
                  }}
                  className="w-full text-left px-4 py-2.5 flex items-center gap-2.5 hover:bg-gray-50 text-slate-700 font-medium transition-colors"
                >
                  <RotateCcw className="w-4 h-4 text-[#8D67FF]" />
                  Refazer Anamnese
                </button>
              </div>

              {/* Plano Atual Section */}
              <div className="px-4 py-2.5 border-t border-b border-gray-100 bg-gray-50/80 my-1 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold uppercase tracking-wider text-gray-400 text-[10px]">
                    Plano Atual
                  </span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Free (100% Liberado)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setDropdownOpen(false);
                    if (onOpenPremiumModal) onOpenPremiumModal();
                  }}
                  className="w-full py-1.5 px-3 bg-gradient-to-r from-amber-400 via-purple-500 to-indigo-500 text-slate-950 font-black text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 cursor-pointer hover:opacity-95 transition-opacity"
                >
                  <Lock className="w-3.5 h-3.5 text-slate-950" />
                  <span>Conhecer o Premium (Em Breve)</span>
                </button>
              </div>

              <div className="pt-1">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    onLogout();
                  }}
                  className="w-full text-left px-4 py-2.5 flex items-center gap-2.5 hover:bg-red-50 text-red-600 font-medium transition-colors text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  Sair do App
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
