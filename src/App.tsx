import React, { useState, useEffect } from 'react';
import { ArrowLeft, LayoutDashboard } from 'lucide-react';
import { UserProfile, UserStats, AppModule, StudyMission, DaySchedule } from './types';
import { LandingPage } from './components/views/LandingPage';
import { AuthModal } from './components/views/AuthModal';
import { AnamneseView } from './components/views/AnamneseView';
import { TopHeader } from './components/TopHeader';
import { Sidebar } from './components/Sidebar';

// Views
import { DashboardView } from './components/views/DashboardView';
import { PlanoSemanaView } from './components/views/PlanoSemanaView';
import { MaterialInteligenteView } from './components/views/MaterialInteligenteView';
import { ChatProfIAView } from './components/views/ChatProfIAView';
import { QuizView } from './components/views/QuizView';
import { FlashcardsView } from './components/views/FlashcardsView';
import { SimuladoView } from './components/views/SimuladoView';
import { CriarProfIAView } from './components/views/CriarProfIAView';
import { RedacaoView } from './components/views/RedacaoView';
import { RegistrarEstudoView } from './components/views/RegistrarEstudoView';
import { RaioXView } from './components/views/RaioXView';
import { CalendarioView } from './components/views/CalendarioView';
import { LojaXPView } from './components/views/LojaXPView';
import { PerfilView } from './components/views/PerfilView';
import { GestorView } from './components/views/GestorView';
import { OpiniaoAlunoView } from './components/views/OpiniaoAlunoView';
import { ResetPasswordView } from './components/views/ResetPasswordView';
import { PremiumMysteryModal } from './components/PremiumMysteryModal';
import { getApiUrl } from './lib/api';

const DEFAULT_PROFILE: UserProfile = {
  nome: 'Lucas Silva',
  email: 'lucas@estudante.com',
  escolaridade: 'Ensino Médio',
  objetivos: ['Passar no ENEM', 'Aprovação em Vestibular'],
  materiasIn: ['Português', 'História', 'Biologia'],
  materiasOut: ['Matemática', 'Física', 'Química'],
  materiaPersonalizada: 'Programação Python',
  horarioRendimento: 'Noite',
  preferenciaAprendizado: 'Exercícios',
  situacaoEducacional: 'Escola',
  dificuldades: ['Foco e concentração', 'Procrastinação'],
  anamneseConcluida: true,
};

const DEFAULT_STATS: UserStats = {
  streak: 5,
  moedas: 18,
  xp: 340,
  tituloAtual: 'Aspirante a Sábio',
  tempoPlanejadoMin: 90,
  tarefasConcluidas: 8,
  quizzesRealizados: 4,
  simuladosRealizados: 1,
  redacoesEnviadas: 2,
};

const DEFAULT_SCHEDULE: DaySchedule[] = [
  {
    dia: 'Segunda-feira',
    missoes: [
      { id: 'm1', materia: 'Matemática', topico: 'Funções Quadráticas e Gráficos', duracao: '45 min', tipo: 'Teoria + Exercícios', concluida: true },
      { id: 'm2', materia: 'Português', topico: 'Sintaxe e Orações Subordinadas', duracao: '30 min', tipo: 'Flashcards', concluida: true },
    ],
  },
  {
    dia: 'Terça-feira',
    missoes: [
      { id: 'm3', materia: 'Física', topico: 'Cinemática e Leis de Newton', duracao: '50 min', tipo: 'Exercícios Práticos', concluida: false },
      { id: 'm4', materia: 'História', topico: 'Era Vargas e Segunda Guerra', duracao: '40 min', tipo: 'Resumo com IA', concluida: false },
    ],
  },
  {
    dia: 'Quarta-feira',
    missoes: [
      { id: 'm5', materia: 'Redação', topico: 'Estruturação da Proposta de Intervenção', duracao: '60 min', tipo: 'Prática de Escrita', concluida: false },
      { id: 'm6', materia: 'Biologia', topico: 'Ecologia e Cadeias Alimentares', duracao: '35 min', tipo: 'Quiz de Fixação', concluida: false },
    ],
  },
  {
    dia: 'Quinta-feira',
    missoes: [
      { id: 'm7', materia: 'Química', topico: 'Estequiometria e Soluções', duracao: '45 min', tipo: 'Exercícios', concluida: false },
      { id: 'm8', materia: 'Filosofia', topico: 'Racionalismo vs Empirismo', duracao: '30 min', tipo: 'Leitura Didática', concluida: false },
    ],
  },
  {
    dia: 'Sexta-feira',
    missoes: [
      { id: 'm9', materia: 'Geografia', topico: 'Urbanização e Globalização', duracao: '40 min', tipo: 'Mapa Mental', concluida: false },
      { id: 'm10', materia: 'Matemática', topico: 'Geometria Plana', duracao: '45 min', tipo: 'Simulado Rápido', concluida: false },
    ],
  },
  {
    dia: 'Sábado',
    missoes: [
      { id: 'm11', materia: 'Simulado', topico: 'Simulado de 20 Questões Mistas', duracao: '90 min', tipo: 'Simulado Realístico', concluida: false },
    ],
  },
  {
    dia: 'Domingo',
    missoes: [
      { id: 'm12', materia: 'Revisão', topico: 'Revisão Semanal dos Pontos Fracos', duracao: '45 min', tipo: 'Raio X', concluida: false },
    ],
  },
];

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('prof_ia_auth') === 'true';
  });
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authSuccessNotice, setAuthSuccessNotice] = useState<string>('');
  const [resetToken, setResetToken] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('token');
    }
    return null;
  });
  const [isViewingLandingPage, setIsViewingLandingPage] = useState<boolean>(false);
  const [activeModule, setActiveModule] = useState<AppModule>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [showPremiumModal, setShowPremiumModal] = useState<boolean>(false);

  // User Profile & Stats State
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('prof_ia_profile');
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });

  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('prof_ia_stats');
    return saved ? JSON.parse(saved) : DEFAULT_STATS;
  });

  const [schedule, setSchedule] = useState<DaySchedule[]>(DEFAULT_SCHEDULE);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('prof_ia_auth', isAuthenticated ? 'true' : 'false');
    localStorage.setItem('prof_ia_profile', JSON.stringify(profile));
    localStorage.setItem('prof_ia_stats', JSON.stringify(stats));
  }, [isAuthenticated, profile, stats]);

  // Auth Handlers
  const handleLoginSuccess = (data: { nome: string; email: string; isNewUser: boolean } | string) => {
    setIsAuthenticated(true);
    setShowAuthModal(false);
    setIsViewingLandingPage(false);
    if (typeof data === 'object') {
      setProfile((prev) => ({
        ...prev,
        nome: data.nome || prev.nome,
        email: data.email || prev.email,
        anamneseConcluida: data.isNewUser ? false : true,
      }));
    } else {
      setProfile((prev) => ({ ...prev, email: data, anamneseConcluida: true }));
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsViewingLandingPage(false);
    localStorage.removeItem('prof_ia_auth');
  };

  const handleRefazerAnamnese = () => {
    setIsViewingLandingPage(false);
    setProfile((prev) => ({ ...prev, anamneseConcluida: false }));
  };

  const handleAnamneseComplete = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    setIsViewingLandingPage(false);
    setActiveModule('dashboard');
  };

  // Gamification helpers
  const rewardCoins = (amount: number) => {
    setStats((prev) => ({
      ...prev,
      moedas: prev.moedas + amount,
      xp: prev.xp + amount * 10,
    }));
  };

  const deductCoins = (amount: number): boolean => {
    if (stats.moedas < amount) return false;
    setStats((prev) => ({
      ...prev,
      moedas: prev.moedas - amount,
    }));
    return true;
  };

  const handleUpdateTitle = (newTitle: string) => {
    setStats((prev) => ({
      ...prev,
      tituloAtual: newTitle,
    }));
  };

  // Schedule task toggle
  const handleToggleMission = (missionId: string) => {
    let newlyCompleted = false;

    setSchedule((prev) =>
      prev.map((day) => ({
        ...day,
        missoes: day.missoes.map((m) => {
          if (m.id === missionId) {
            newlyCompleted = !m.concluida;
            return { ...m, concluida: !m.concluida };
          }
          return m;
        }),
      }))
    );

    if (newlyCompleted) {
      rewardCoins(1);
      setStats((prev) => ({
        ...prev,
        tarefasConcluidas: prev.tarefasConcluidas + 1,
      }));
    }
  };

  const handleAddCustomMissionToDay = (
    dayIndex: number,
    task: { materia: string; topico: string; duracao: string }
  ) => {
    const newMission: StudyMission = {
      id: Date.now().toString(),
      materia: task.materia,
      topico: task.topico,
      duracao: task.duracao,
      tipo: 'Personalizado',
      concluida: false,
    };

    setSchedule((prev) => {
      const copy = [...prev];
      if (copy[dayIndex]) {
        copy[dayIndex] = {
          ...copy[dayIndex],
          missoes: [...copy[dayIndex].missoes, newMission],
        };
      }
      return copy;
    });
  };

  const handleAddCustomTask = (task: { materia: string; topico: string; duracao: string }) => {
    const newMission: StudyMission = {
      id: Date.now().toString(),
      materia: task.materia,
      topico: task.topico,
      duracao: task.duracao,
      tipo: 'Estudo Avulso',
      concluida: true,
    };

    setSchedule((prev) => {
      const copy = [...prev];
      if (copy[0]) {
        copy[0].missoes.unshift(newMission);
      }
      return copy;
    });

    rewardCoins(1);
    setStats((prev) => ({
      ...prev,
      tarefasConcluidas: prev.tarefasConcluidas + 1,
    }));
  };

  const handleRegeneratePlan = async () => {
    try {
      const res = await fetch(getApiUrl('/api/gemini/study-plan'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile }),
      });
      const data = await res.json();
      if (data.schedule && data.schedule.length > 0) {
        setSchedule(data.schedule);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Find next mission
  const allMissions = schedule.flatMap((d) => d.missoes);
  const nextMission = allMissions.find((m) => !m.concluida);

  // Unauthenticated OR Landing Page Preview Mode
  if (!isAuthenticated || isViewingLandingPage) {
    return (
      <>
        {isAuthenticated && (
          <div className="bg-[#162C6B] text-white px-4 py-2.5 flex items-center justify-between sticky top-0 z-50 text-xs sm:text-sm font-semibold border-b border-white/10 shadow-md">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Você está conectado como <strong className="text-cyan-300">{profile.nome}</strong>
            </span>
            <button
              onClick={() => setIsViewingLandingPage(false)}
              className="px-3.5 py-1.5 rounded-xl bg-[#3A7BFF] hover:bg-[#2563EB] text-white font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Voltar ao Meu Dashboard</span>
            </button>
          </div>
        )}

        <LandingPage
          onOpenAuth={() => setShowAuthModal(true)}
          onStartNow={() => {
            if (isAuthenticated) {
              setIsViewingLandingPage(false);
            } else {
              setShowAuthModal(true);
            }
          }}
          onLoginClick={() => {
            if (isAuthenticated) {
              setIsViewingLandingPage(false);
            } else {
              setShowAuthModal(true);
            }
          }}
          onDirectEnter={() => {
            if (!isAuthenticated) {
              setIsAuthenticated(true);
            }
            setIsViewingLandingPage(false);
            setActiveModule('dashboard');
          }}
        />

        {resetToken && (
          <ResetPasswordView
            token={resetToken}
            onSuccess={(message) => {
              setResetToken(null);
              setAuthSuccessNotice(message);
              setShowAuthModal(true);
              if (typeof window !== 'undefined') {
                window.history.replaceState({}, '', window.location.pathname);
              }
            }}
            onCancel={() => {
              setResetToken(null);
              setShowAuthModal(true);
              if (typeof window !== 'undefined') {
                window.history.replaceState({}, '', window.location.pathname);
              }
            }}
          />
        )}

        {showAuthModal && (
          <AuthModal
            initialMode={authSuccessNotice ? 'login' : 'signup'}
            successNotice={authSuccessNotice}
            onClose={() => {
              setShowAuthModal(false);
              setAuthSuccessNotice('');
            }}
            onSuccess={handleLoginSuccess}
          />
        )}
      </>
    );
  }

  // Anamnese Flow
  if (!profile.anamneseConcluida) {
    return (
      <AnamneseView
        initialProfile={profile}
        onComplete={handleAnamneseComplete}
      />
    );
  }

  // Main Authenticated Application Dashboard
  return (
    <div className="min-h-screen bg-[#F4F7FC] font-sans flex flex-col text-slate-800">
      {/* Top Header */}
      <TopHeader
        profile={profile}
        stats={stats}
        onRefazerAnamnese={handleRefazerAnamnese}
        onLogout={handleLogout}
        onOpenProfile={() => setActiveModule('perfil')}
        onOpenGestor={() => setActiveModule('gestor')}
        onToggleSidebar={() => setIsMobileSidebarOpen(true)}
        onOpenPremiumModal={() => setShowPremiumModal(true)}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <Sidebar
          activeModule={activeModule}
          onSelectModule={setActiveModule}
          userEmail={profile.email}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          onOpenPremiumModal={() => setShowPremiumModal(true)}
        />

        {/* Dynamic Active Module Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-4">
            {/* Universal Top Back Button for Sub-modules */}
            {activeModule !== 'dashboard' && (
              <button
                onClick={() => setActiveModule('dashboard')}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-[#3A7BFF] hover:border-[#3A7BFF] font-bold text-xs shadow-xs transition-all cursor-pointer group"
              >
                <ArrowLeft className="w-4 h-4 text-[#3A7BFF] group-hover:-translate-x-1 transition-transform" />
                <span>Voltar ao Dashboard</span>
              </button>
            )}

            {activeModule === 'dashboard' && (
              <DashboardView
                profile={profile}
                stats={stats}
                nextMission={nextMission}
                onNavigate={setActiveModule}
                onCompleteMission={handleToggleMission}
              />
            )}

            {activeModule === 'plano_semana' && (
              <PlanoSemanaView
                profile={profile}
                schedule={schedule}
                onToggleMission={handleToggleMission}
                onRegeneratePlan={handleRegeneratePlan}
                onAddCustomMission={handleAddCustomMissionToDay}
              />
            )}

            {(activeModule === 'material' || activeModule === 'material_inteligente') && (
              <MaterialInteligenteView profile={profile} />
            )}

            {activeModule === 'chat' && (
              <ChatProfIAView profile={profile} />
            )}

            {activeModule === 'quiz' && (
              <QuizView profile={profile} onRewardCoins={rewardCoins} />
            )}

            {activeModule === 'flashcards' && (
              <FlashcardsView profile={profile} />
            )}

            {activeModule === 'simulado' && (
              <SimuladoView profile={profile} />
            )}

            {activeModule === 'criar' && (
              <CriarProfIAView profile={profile} />
            )}

            {activeModule === 'redacao' && (
              <RedacaoView
                profile={profile}
                onRecordEssaySubmitted={() => {
                  setStats((prev) => ({
                    ...prev,
                    redacoesEnviadas: prev.redacoesEnviadas + 1,
                  }));
                }}
              />
            )}

            {(activeModule === 'registrar' || activeModule === 'registrar_estudo') && (
              <RegistrarEstudoView
                profile={profile}
                stats={stats}
                missions={allMissions}
                onCompleteMission={handleToggleMission}
                onAddCustomTask={handleAddCustomTask}
              />
            )}

            {activeModule === 'raio_x' && (
              <RaioXView profile={profile} stats={stats} />
            )}

            {activeModule === 'calendario' && (
              <CalendarioView />
            )}

            {(activeModule === 'loja' || activeModule === 'loja_xp') && (
              <LojaXPView
                stats={stats}
                onDeductCoins={deductCoins}
                onUpdateTitle={handleUpdateTitle}
              />
            )}

            {activeModule === 'perfil' && (
              <PerfilView
                profile={profile}
                stats={stats}
                onRefazerAnamnese={handleRefazerAnamnese}
                onNavigate={setActiveModule}
              />
            )}

            {activeModule === 'gestor' && (
              <GestorView
                profile={profile}
                onNavigate={setActiveModule}
              />
            )}

            {activeModule === 'opiniao' && (
              <OpiniaoAlunoView profile={profile} />
            )}
          </div>
        </main>
      </div>

      <PremiumMysteryModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
      />

      {resetToken && (
        <ResetPasswordView
          token={resetToken}
          onSuccess={(message) => {
            setResetToken(null);
            setAuthSuccessNotice(message);
            setShowAuthModal(true);
            if (typeof window !== 'undefined') {
              window.history.replaceState({}, '', window.location.pathname);
            }
          }}
          onCancel={() => {
            setResetToken(null);
            if (typeof window !== 'undefined') {
              window.history.replaceState({}, '', window.location.pathname);
            }
          }}
        />
      )}
    </div>
  );
}

export default App;
