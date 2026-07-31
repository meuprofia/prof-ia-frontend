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

const createFreshProfile = (email: string, nome?: string): UserProfile => ({
  nome: nome || (email ? email.split('@')[0] : 'Novo Estudante'),
  email: email,
  escolaridade: 'Ensino Médio',
  objetivos: [],
  materiasIn: [],
  materiasOut: [],
  materiaPersonalizada: '',
  horarioRendimento: 'Manhã',
  preferenciaAprendizado: 'Exercícios',
  situacaoEducacional: 'Escola',
  dificuldades: [],
  anamneseConcluida: email.toLowerCase().trim() === 'meuprofia@gmail.com' ? true : false,
});

const createFreshStats = (): UserStats => ({
  streak: 0,
  moedas: 0,
  xp: 0,
  tituloAtual: 'Novato no Prof IA',
  tempoPlanejadoMin: 0,
  tarefasConcluidas: 0,
  quizzesRealizados: 0,
  simuladosRealizados: 0,
  redacoesEnviadas: 0,
});

const createFreshSchedule = (): DaySchedule[] => [
  { dia: 'Segunda-feira', missoes: [] },
  { dia: 'Terça-feira', missoes: [] },
  { dia: 'Quarta-feira', missoes: [] },
  { dia: 'Quinta-feira', missoes: [] },
  { dia: 'Sexta-feira', missoes: [] },
  { dia: 'Sábado', missoes: [] },
  { dia: 'Domingo', missoes: [] },
];

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('prof_ia_auth') === 'true';
  });
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('signup');
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

  // Active User Profile & Stats State (100% Real, tied to authenticated user email)
  const [profile, setProfile] = useState<UserProfile>(() => {
    const activeEmail = localStorage.getItem('prof_ia_active_email') || '';
    if (activeEmail) {
      const saved = localStorage.getItem(`prof_ia_profile_${activeEmail.toLowerCase().trim()}`);
      if (saved) return JSON.parse(saved);
      return createFreshProfile(activeEmail);
    }
    return createFreshProfile('');
  });

  const [stats, setStats] = useState<UserStats>(() => {
    const activeEmail = profile?.email || localStorage.getItem('prof_ia_active_email') || '';
    if (activeEmail) {
      const saved = localStorage.getItem(`prof_ia_stats_${activeEmail.toLowerCase().trim()}`);
      if (saved) return JSON.parse(saved);
    }
    return createFreshStats();
  });

  const [schedule, setSchedule] = useState<DaySchedule[]>(() => {
    const activeEmail = profile?.email || localStorage.getItem('prof_ia_active_email') || '';
    if (activeEmail) {
      const saved = localStorage.getItem(`prof_ia_schedule_${activeEmail.toLowerCase().trim()}`);
      if (saved) return JSON.parse(saved);
    }
    return createFreshSchedule();
  });

  // Sync state to per-user local storage
  useEffect(() => {
    localStorage.setItem('prof_ia_auth', isAuthenticated ? 'true' : 'false');
    const email = profile?.email ? profile.email.toLowerCase().trim() : '';
    if (email) {
      localStorage.setItem('prof_ia_active_email', email);
      localStorage.setItem(`prof_ia_profile_${email}`, JSON.stringify(profile));
      localStorage.setItem(`prof_ia_stats_${email}`, JSON.stringify(stats));
      localStorage.setItem(`prof_ia_schedule_${email}`, JSON.stringify(schedule));
    }
  }, [isAuthenticated, profile, stats, schedule]);

  // Auth Handlers
  const handleLoginSuccess = (data: { nome: string; email: string; isNewUser: boolean } | string) => {
    const email = (typeof data === 'object' ? data.email : data).toLowerCase().trim();
    const nome = typeof data === 'object' ? data.nome : email.split('@')[0];
    const isNew = typeof data === 'object' ? data.isNewUser : false;

    setIsAuthenticated(true);
    setShowAuthModal(false);
    setIsViewingLandingPage(false);

    // Save active email
    localStorage.setItem('prof_ia_active_email', email);

    // Check existing stored profile for this email
    const savedProf = localStorage.getItem(`prof_ia_profile_${email}`);
    const savedStats = localStorage.getItem(`prof_ia_stats_${email}`);
    const savedSchedule = localStorage.getItem(`prof_ia_schedule_${email}`);

    let activeProfile: UserProfile;
    if (savedProf) {
      activeProfile = JSON.parse(savedProf);
      if (isNew) activeProfile.anamneseConcluida = false;
    } else {
      activeProfile = createFreshProfile(email, nome);
    }

    let activeStats: UserStats = savedStats ? JSON.parse(savedStats) : createFreshStats();
    let activeSchedule: DaySchedule[] = savedSchedule ? JSON.parse(savedSchedule) : createFreshSchedule();

    setProfile(activeProfile);
    setStats(activeStats);
    setSchedule(activeSchedule);

    // Register user in Gestor list cache
    const registeredUsersSaved = localStorage.getItem('prof_ia_registered_users');
    let registeredUsersList: any[] = registeredUsersSaved ? JSON.parse(registeredUsersSaved) : [];
    if (!registeredUsersList.some((u) => u.email === email)) {
      registeredUsersList.push({
        id: `usr_${Date.now()}`,
        email: email,
        nome: nome,
        plano: email === 'meuprofia@gmail.com' ? 'Premium' : 'Free',
        dataCadastro: new Date().toISOString().split('T')[0],
        status: 'Ativo',
        ultimoAcesso: 'Hoje, agora',
        origem: 'App Login',
      });
      localStorage.setItem('prof_ia_registered_users', JSON.stringify(registeredUsersList));
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsViewingLandingPage(false);
    localStorage.removeItem('prof_ia_auth');
    localStorage.removeItem('prof_ia_active_email');
  };

  const handleRefazerAnamnese = () => {
    setIsViewingLandingPage(false);
    setProfile((prev) => ({ ...prev, anamneseConcluida: false }));
  };

  const handleAnamneseComplete = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    setIsViewingLandingPage(false);
    setActiveModule('dashboard');
    handleRegeneratePlan(updatedProfile);
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

  const handleRegeneratePlan = async (targetProfile?: UserProfile) => {
    const profToUse = targetProfile || profile;
    try {
      const res = await fetch(getApiUrl('/api/gemini/study-plan'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: profToUse }),
      });
      const data = await res.json();
      if (data.schedule && data.schedule.length > 0) {
        setSchedule(data.schedule);
        const userEmail = profToUse.email ? profToUse.email.toLowerCase().trim() : '';
        if (userEmail) {
          localStorage.setItem(`prof_ia_schedule_${userEmail}`, JSON.stringify(data.schedule));
        }
      }
    } catch (e) {
      console.error('Erro ao gerar plano de estudos:', e);
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
          onOpenLogin={() => {
            if (isAuthenticated) {
              setIsViewingLandingPage(false);
            } else {
              setAuthModalMode('login');
              setShowAuthModal(true);
            }
          }}
          onOpenSignup={() => {
            if (isAuthenticated) {
              setIsViewingLandingPage(false);
            } else {
              setAuthModalMode('signup');
              setShowAuthModal(true);
            }
          }}
        />

        {resetToken && (
          <ResetPasswordView
            token={resetToken}
            onSuccess={(message) => {
              setResetToken(null);
              setAuthSuccessNotice(message);
              setAuthModalMode('login');
              setShowAuthModal(true);
              if (typeof window !== 'undefined') {
                window.history.replaceState({}, '', window.location.pathname);
              }
            }}
            onCancel={() => {
              setResetToken(null);
              setAuthModalMode('login');
              setShowAuthModal(true);
              if (typeof window !== 'undefined') {
                window.history.replaceState({}, '', window.location.pathname);
              }
            }}
          />
        )}

        {showAuthModal && (
          <AuthModal
            initialMode={authSuccessNotice ? 'login' : authModalMode}
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
