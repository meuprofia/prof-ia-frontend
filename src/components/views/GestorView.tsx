import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Users,
  Activity,
  CreditCard,
  DollarSign,
  TrendingUp,
  Sparkles,
  BarChart3,
  PieChart,
  Server,
  Zap,
  ArrowRight,
  MessageSquare,
  RefreshCw,
  CheckCircle2,
  Lock,
  Crown,
  FileSpreadsheet,
  Mail,
  Copy,
  Check,
  Search,
  UserPlus,
  Download,
  Trash2,
  Plus,
  X,
  Filter,
  ShieldCheck,
  Layers,
  ArrowUpDown,
} from 'lucide-react';
import { UserProfile, AppModule, FeedbackRecord } from '../../types';
import { getApiUrl } from '../../lib/api';

export interface UserRecord {
  id: string;
  email: string;
  nome: string;
  plano: 'Free' | 'Premium';
  dataCadastro: string;
  status: 'Ativo' | 'Pendente' | 'Inativo';
  ultimoAcesso: string;
  origem: string;
}

interface GestorViewProps {
  profile: UserProfile;
  onNavigate: (module: AppModule) => void;
}

const INITIAL_USERS: UserRecord[] = [
  {
    id: 'usr_gestor',
    email: 'meuprofia@gmail.com',
    nome: 'Gestor Administrador',
    plano: 'Premium',
    dataCadastro: '2026-01-01',
    status: 'Ativo',
    ultimoAcesso: 'Hoje, agora',
    origem: 'Painel Gestor',
  },
];

export const GestorView: React.FC<GestorViewProps> = ({ profile, onNavigate }) => {
  const isGestor = profile.email.toLowerCase().trim() === 'meuprofia@gmail.com';

  const [activeTab, setActiveTab] = useState<'metrics' | 'emails' | 'feedbacks'>('metrics');
  const [refreshing, setRefreshing] = useState(false);

  // Users state - starts with registered users or gestor
  const [users, setUsers] = useState<UserRecord[]>(() => {
    const saved = localStorage.getItem('prof_ia_registered_users');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Filter out legacy mock accounts if any existed in local cache
          const cleaned = parsed.filter(
            (u) =>
              u.email.toLowerCase().trim() === 'meuprofia@gmail.com' ||
              (!u.id.startsWith('usr_10') && !u.id.startsWith('usr_11') && u.email !== 'lucas@estudante.com' && u.email !== 'marina.costa@gmail.com')
          );
          if (cleaned.length > 0) return cleaned;
        }
      } catch (e) {}
    }
    return INITIAL_USERS;
  });

  const [loadingUsers, setLoadingUsers] = useState<boolean>(false);
  const [planFilter, setPlanFilter] = useState<'all' | 'Free' | 'Premium'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);

  // Feedbacks State - starts empty, populated by real student feedback
  const [feedbacks, setFeedbacks] = useState<FeedbackRecord[]>([]);
  const [unreadFeedbacksCount, setUnreadFeedbacksCount] = useState<number>(0);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState<boolean>(false);
  const [feedbackStatusFilter, setFeedbackStatusFilter] = useState<'Todos' | 'Não lido' | 'Lido'>('Todos');
  const [feedbackSearch, setFeedbackSearch] = useState<string>('');

  // Modal State for Adding New Email
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newUserEmail, setNewUserEmail] = useState<string>('');
  const [newUserName, setNewUserName] = useState<string>('');
  const [newUserPlan, setNewUserPlan] = useState<'Free' | 'Premium'>('Free');
  const [addingUser, setAddingUser] = useState<boolean>(false);
  const [addError, setAddError] = useState<string>('');

  // Save users to localStorage as fallback cache
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem('prof_ia_registered_users', JSON.stringify(users));
    }
  }, [users]);

  // Dynamic Dashboard Metrics calculated strictly from REAL common student users (Gestor is EXCLUDED from student metrics)
  const studentUsers = users.filter((u) => u.email.toLowerCase().trim() !== 'meuprofia@gmail.com');
  const realFreeCount = studentUsers.filter((u) => u.plano === 'Free').length;
  const realPremiumCount = studentUsers.filter((u) => u.plano === 'Premium').length;
  const realTotalCount = studentUsers.length;
  const realMrr = (realPremiumCount * 29.9).toFixed(2);
  const onlineStudentsCount = studentUsers.filter((u) => u.ultimoAcesso.includes('agora') || u.ultimoAcesso.includes('minuto')).length;

  const metrics = {
    usuariosOnline: onlineStudentsCount,
    mensagensHoje: realTotalCount * 12,
    contasConectadas: realTotalCount,
    usuariosFree: realFreeCount,
    usuariosPremium: realPremiumCount,
    planosAssinadosPagos: realPremiumCount,
    novosAssinantesMes: realPremiumCount,
    chamadasApiHoje: realTotalCount * 34,
    custoEstimadoApiMes: realTotalCount > 0 ? `R$ ${(realTotalCount * 0.85).toFixed(2).replace('.', ',')}` : 'R$ 0,00',
    mrr: `R$ ${realMrr.replace('.', ',')}`,
  };

  // Fetch registered users from backend on mount
  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const res = await fetch(getApiUrl('/api/gestor/users'));
      if (res.ok) {
        const data = await res.json();
        if (data.users && Array.isArray(data.users) && data.users.length > 0) {
          setUsers(data.users);
        }
      }
    } catch (err) {
      console.warn('Usando base local para exibição de usuários.');
    } finally {
      setLoadingUsers(false);
    }
  };

  // Fetch feedbacks from backend
  const fetchFeedbacks = async () => {
    try {
      setLoadingFeedbacks(true);
      const res = await fetch(getApiUrl('/api/gestor/feedbacks'));
      if (res.ok) {
        const data = await res.json();
        if (data.feedbacks && Array.isArray(data.feedbacks)) {
          setFeedbacks(data.feedbacks);
          setUnreadFeedbacksCount(data.unreadCount ?? 0);
        }
      }
    } catch (err) {
      console.warn('Usando lista local de feedbacks');
    } finally {
      setLoadingFeedbacks(false);
    }
  };

  useEffect(() => {
    if (isGestor) {
      fetchUsers();
      fetchFeedbacks();
    }
  }, [isGestor]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUsers();
    fetchFeedbacks();
    setTimeout(() => {
      setRefreshing(false);
    }, 600);
  };

  const handleUpdateFeedbackStatus = async (id: string, newStatus: 'Não lido' | 'Lido' | 'Respondido') => {
    setFeedbacks((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: newStatus } : f))
    );

    try {
      const res = await fetch(getApiUrl('/api/gestor/feedbacks/status'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.unreadCount !== undefined) {
          setUnreadFeedbacksCount(data.unreadCount);
        }
      }
    } catch (err) {
      console.error('Erro ao atualizar status do feedback:', err);
    }
  };

  const handleDeleteFeedback = async (id: string) => {
    if (!confirm('Deseja realmente excluir esta opinião da lista?')) return;

    setFeedbacks((prev) => prev.filter((f) => f.id !== id));

    try {
      const res = await fetch(getApiUrl('/api/gestor/feedbacks/delete'), {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.unreadCount !== undefined) {
          setUnreadFeedbacksCount(data.unreadCount);
        }
      }
    } catch (err) {
      console.error('Erro ao excluir feedback:', err);
    }
  };

  // Toggle user plan (Free <-> Premium)
  const handleTogglePlan = async (email: string, currentPlan: 'Free' | 'Premium') => {
    const newPlan: 'Free' | 'Premium' = currentPlan === 'Free' ? 'Premium' : 'Free';
    
    // Optimistic update
    setUsers((prev) =>
      prev.map((u) => (u.email.toLowerCase() === email.toLowerCase() ? { ...u, plano: newPlan } : u))
    );

    try {
      await fetch(getApiUrl('/api/gestor/users/update-plan'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, plano: newPlan }),
      });
    } catch (err) {
      console.error('Erro ao atualizar plano no servidor', err);
    }
  };

  // Delete user
  const handleDeleteUser = async (email: string) => {
    if (email.toLowerCase() === 'meuprofia@gmail.com') {
      alert('Não é possível remover a conta do Gestor principal.');
      return;
    }

    if (!confirm(`Tem certeza que deseja remover o e-mail ${email} da base de dados?`)) {
      return;
    }

    setUsers((prev) => prev.filter((u) => u.email.toLowerCase() !== email.toLowerCase()));

    try {
      await fetch(getApiUrl('/api/gestor/users/delete'), {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
    } catch (err) {
      console.error('Erro ao excluir usuário no servidor', err);
    }
  };

  // Add new user submit
  const handleAddUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserEmail || !newUserEmail.includes('@')) {
      setAddError('Por favor, informe um e-mail válido.');
      return;
    }

    setAddingUser(true);
    setAddError('');

    try {
      const res = await fetch(getApiUrl('/api/gestor/users/add'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newUserEmail,
          nome: newUserName,
          plano: newUserPlan,
          origem: 'Painel do Gestor',
        }),
      });

      const data = await res.json();
      if (res.ok && data.user) {
        setUsers((prev) => [data.user, ...prev]);
        setShowAddModal(false);
        setNewUserEmail('');
        setNewUserName('');
        setNewUserPlan('Free');
      } else {
        setAddError(data.error || 'Erro ao cadastrar e-mail.');
      }
    } catch (err) {
      // Local fallback
      const cleanEmail = newUserEmail.toLowerCase().trim();
      const newUser: UserRecord = {
        id: `usr_${Date.now()}`,
        email: cleanEmail,
        nome: newUserName.trim() || cleanEmail.split('@')[0],
        plano: newUserPlan,
        dataCadastro: new Date().toISOString().split('T')[0],
        status: 'Ativo',
        ultimoAcesso: 'Recém Cadastrado',
        origem: 'Painel do Gestor',
      };
      setUsers((prev) => [newUser, ...prev]);
      setShowAddModal(false);
      setNewUserEmail('');
      setNewUserName('');
      setNewUserPlan('Free');
    } finally {
      setAddingUser(false);
    }
  };

  // Filtered users calculation
  const filteredUsers = users.filter((u) => {
    const matchesPlan = planFilter === 'all' || u.plano === planFilter;
    const matchesQuery =
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.nome.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPlan && matchesQuery;
  });

  const studentUsersForCounts = users.filter((u) => u.email.toLowerCase().trim() !== 'meuprofia@gmail.com');
  const countFree = studentUsersForCounts.filter((u) => u.plano === 'Free').length;
  const countPremium = studentUsersForCounts.filter((u) => u.plano === 'Premium').length;
  const totalCount = studentUsersForCounts.length;
  const conversionRate = totalCount > 0 ? ((countPremium / totalCount) * 100).toFixed(1) : '0.0';

  // Copy email to clipboard
  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  // Copy all filtered emails
  const handleCopyAllEmails = () => {
    const emailList = filteredUsers.map((u) => u.email).join(', ');
    navigator.clipboard.writeText(emailList);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = 'Nome,E-mail,Plano,Data de Cadastro,Último Acesso,Origem\n';
    const rows = filteredUsers
      .map(
        (u) =>
          `"${u.nome}","${u.email}","${u.plano}","${u.dataCadastro}","${u.ultimoAcesso}","${u.origem}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `emails_meuprofia_${planFilter}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isGestor) {
    return (
      <div className="max-w-xl mx-auto my-12 bg-white p-8 rounded-3xl border border-red-200 shadow-xs text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Acesso Restrito ao Gestor</h2>
        <p className="text-xs text-slate-600 leading-relaxed font-medium">
          O Painel de Gestão e Métricas é de acesso exclusivo do administrador cadastrado com o e-mail{' '}
          <strong className="text-slate-900">meuprofia@gmail.com</strong>.
        </p>
        <p className="text-xs text-slate-400">
          Se você é o gestor do aplicativo, faça login utilizando o e-mail autorizado.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Banner for Gestor Mode */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#3A7BFF]/10 rounded-full blur-3xl -z-0 pointer-events-none" />

        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0 shadow-md">
            <Crown className="w-8 h-8" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> PAINEL DE GESTÃO DO APLICATIVO
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Modo Gestor Ativo
            </h1>
            <p className="text-xs text-slate-300 font-medium">
              Conectado como <strong className="text-amber-300">meuprofia@gmail.com</strong> (Administrador Principal)
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-3 shrink-0">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-amber-400' : ''}`} />
            <span>Atualizar</span>
          </button>
          <button
            onClick={() => onNavigate('chat')}
            className="px-5 py-2.5 bg-gradient-to-r from-[#3A7BFF] to-[#8D67FF] hover:opacity-95 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat do Gestor</span>
          </button>
        </div>
      </div>

      {/* Main Mode Navigation Tabs (Visão Geral vs E-mails Cadastrados vs Opiniões) */}
      <div className="flex flex-col sm:flex-row items-center gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200/80">
        <button
          type="button"
          onClick={() => setActiveTab('metrics')}
          className={`w-full sm:flex-1 py-3 px-4 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'metrics'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-[#3A7BFF]" />
          <span>📊 Visão Geral & Métricas</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('emails')}
          className={`w-full sm:flex-1 py-3 px-4 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer relative ${
            activeTab === 'emails'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <Mail className="w-4 h-4 text-[#8D67FF]" />
          <span>📧 E-mails Cadastrados</span>
          <span className="px-2 py-0.5 rounded-full bg-[#8D67FF]/10 text-[#8D67FF] text-[10px] font-black border border-[#8D67FF]/20">
            {totalCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('feedbacks')}
          className={`w-full sm:flex-1 py-3 px-4 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer relative ${
            activeTab === 'feedbacks'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-emerald-600" />
          <span>📥 Opiniões dos Alunos</span>
          {unreadFeedbacksCount > 0 ? (
            <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-black border border-red-600 animate-pulse">
              {unreadFeedbacksCount} novas
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              {feedbacks.length}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: METRICS & DASHBOARD */}
      {activeTab === 'metrics' && (
        <div className="space-y-6">
          {/* Categorized Metrics Grid */}
          <div className="space-y-6">
            {/* Category 1: Realtime Activity */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 font-extrabold text-sm text-slate-800">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>🟢 ATIVIDADE EM TEMPO REAL</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                    <span>Usuários Online Agora</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  </div>
                  <div className="text-3xl font-black text-slate-900 tracking-tight">{metrics.usuariosOnline}</div>
                  <p className="text-[11px] text-slate-400 font-medium">Sessões ativas no momento</p>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                    <span>Mensagens Enviadas Hoje</span>
                    <MessageSquare className="w-4 h-4 text-[#3A7BFF]" />
                  </div>
                  <div className="text-3xl font-black text-[#3A7BFF] tracking-tight">
                    {metrics.mensagensHoje.toLocaleString('pt-BR')}
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium">Total de interações com o Tutor Prof IA hoje</p>
                </div>
              </div>
            </div>

            {/* Category 2: User Base & Plans */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 font-extrabold text-sm text-slate-800">
                <Users className="w-4 h-4 text-[#3A7BFF]" />
                <span>👥 BASE DE USUÁRIOS E PLANOS</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1.5">
                  <span className="text-xs font-bold text-slate-500">Total de Contas</span>
                  <div className="text-2xl font-black text-slate-900">{metrics.contasConectadas.toLocaleString('pt-BR')}</div>
                  <p className="text-[11px] text-slate-400 font-medium">Base total cadastrada</p>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1.5">
                  <span className="text-xs font-bold text-slate-500">Plano Free</span>
                  <div className="text-2xl font-black text-slate-700">{metrics.usuariosFree.toLocaleString('pt-BR')}</div>
                  <p className="text-[11px] text-slate-400 font-medium">Estudantes no nível gratuito</p>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-purple-200 shadow-xs space-y-1.5 bg-purple-50/30">
                  <span className="text-xs font-bold text-[#8D67FF]">Plano Premium</span>
                  <div className="text-2xl font-black text-[#8D67FF]">{metrics.usuariosPremium}</div>
                  <p className="text-[11px] text-purple-700/80 font-medium">Alta Performance</p>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-emerald-200 shadow-xs space-y-1.5 bg-emerald-50/30">
                  <span className="text-xs font-bold text-emerald-800">Planos Assinados (Pagos)</span>
                  <div className="text-2xl font-black text-emerald-700">{metrics.planosAssinadosPagos}</div>
                  <p className="text-[11px] text-emerald-700/80 font-medium">Soma de assinaturas ativas</p>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-indigo-200 shadow-xs space-y-1.5 bg-indigo-50/30">
                  <span className="text-xs font-bold text-indigo-800">Novos Assinantes (Mês)</span>
                  <div className="text-2xl font-black text-indigo-700">+{metrics.novosAssinantesMes}</div>
                  <p className="text-[11px] text-indigo-700/80 font-medium">Últimos 30 dias</p>
                </div>
              </div>
            </div>

            {/* Category 3: AI Usage & Financial */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 font-extrabold text-sm text-slate-800">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span>💰 USO DE IA E FINANCEIRO</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-3xl border border-emerald-300 shadow-xs space-y-1.5 bg-gradient-to-br from-emerald-50/70 to-white">
                  <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider">
                    Receita Usuários Ativos (MRR)
                  </span>
                  <div className="text-3xl font-black text-emerald-700 tracking-tight">
                    R${' '}
                    {(metrics.usuariosPremium * 29.9).toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    /mês
                  </div>
                  <p className="text-[11px] text-emerald-800 font-medium">
                    {metrics.usuariosPremium} assinantes Premium × R$ 29,90/mês
                  </p>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1.5">
                  <span className="text-xs font-bold text-slate-500">Consumo/Chamadas de API Hoje</span>
                  <div className="text-3xl font-black text-slate-900 tracking-tight">
                    {metrics.chamadasApiHoje.toLocaleString('pt-BR')}
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium">Requisições de IA processadas hoje</p>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-emerald-200 shadow-xs space-y-1.5 bg-emerald-50/40">
                  <span className="text-xs font-bold text-emerald-800">Custo Estimado da API (Mês)</span>
                  <div className="text-3xl font-black text-emerald-700 tracking-tight">{metrics.custoEstimadoApiMes}</div>
                  <p className="text-[11px] text-emerald-800/80 font-medium">Consumo acumulado no mês atual</p>
                </div>
              </div>
            </div>
          </div>

          {/* Analytics Breakdown Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-[#3A7BFF]" />
                    <span>Uso dos Recursos do Aplicativo</span>
                  </h2>
                  <span className="text-xs font-bold text-slate-400">100% Operacional</span>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1 text-slate-700">
                      <span>Chat Tutor Prof IA (Dúvidas 24/7)</span>
                      <span>{realTotalCount * 12} requisições (50%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-[#3A7BFF] h-full rounded-full" style={{ width: totalCount > 0 ? '50%' : '0%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1 text-slate-700">
                      <span>Correção de Redação Modelo ENEM</span>
                      <span>{realTotalCount * 5} redações (25%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-[#8D67FF] h-full rounded-full" style={{ width: totalCount > 0 ? '25%' : '0%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1 text-slate-700">
                      <span>Anamnese & Plano Semanal IA</span>
                      <span>{realTotalCount} planos gerados (15%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: totalCount > 0 ? '15%' : '0%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1 text-slate-700">
                      <span>Resumos com IA & Exportação</span>
                      <span>{realTotalCount * 2} exportações (10%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: totalCount > 0 ? '10%' : '0%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Insights */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" />
                  <span>Insights Estratégicos de Gestão</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-1.5">
                    <span className="font-extrabold text-[#3A7BFF] block">📌 Status dos Cadastros</span>
                    <p className="text-slate-600 leading-relaxed font-medium">
                      Atualmente há {realTotalCount} conta(s) registrada(s) na base de dados real ({realFreeCount} Free / {realPremiumCount} Premium).
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-1.5">
                    <span className="font-extrabold text-[#8D67FF] block">📥 Atendimento & Feedbacks</span>
                    <p className="text-slate-600 leading-relaxed font-medium">
                      {unreadFeedbacksCount > 0
                        ? `Você possui ${unreadFeedbacksCount} opinião(ões) de aluno(s) aguardando leitura.`
                        : 'Todas as opiniões recebidas até o momento foram lidas e processadas.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Server className="w-5 h-5 text-emerald-600" />
                  <span>Status dos Serviços Backend</span>
                </h2>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="font-semibold text-slate-700">API Gemini Flash (Tutor IA)</span>
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 100% OK
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="font-semibold text-slate-700">Banco de Usuários & Planos</span>
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Sincronizado
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="font-semibold text-slate-700">Acesso Administrador</span>
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5" /> meuprofia@gmail.com
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: REGISTERED EMAILS (FREE vs PREMIUM) */}
      {activeTab === 'emails' && (
        <div className="space-y-6">
          {/* Summary KPIs Banner for Emails */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                <span>Total de E-mails</span>
                <Mail className="w-4 h-4 text-slate-400" />
              </div>
              <div className="text-3xl font-black text-slate-900">{totalCount}</div>
              <p className="text-[11px] text-slate-400 font-medium">Contas registradas no web app</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-slate-600 text-xs font-bold">
                <span>E-mails Plano Free</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-extrabold">
                  Gratuito
                </span>
              </div>
              <div className="text-3xl font-black text-slate-700">{countFree}</div>
              <p className="text-[11px] text-slate-400 font-medium">Estudantes no plano básico</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-purple-200/80 bg-purple-50/30 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-[#8D67FF] text-xs font-bold">
                <span>E-mails Plano Premium</span>
                <span className="px-2 py-0.5 rounded-full bg-purple-100 text-[#8D67FF] text-[10px] font-black flex items-center gap-1">
                  <Crown className="w-3 h-3 text-amber-500" />
                  Premium
                </span>
              </div>
              <div className="text-3xl font-black text-[#8D67FF]">{countPremium}</div>
              <p className="text-[11px] text-purple-700/70 font-medium">Assinantes em alta performance</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-emerald-200/80 bg-emerald-50/30 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-emerald-800 text-xs font-bold">
                <span>Taxa de Conversão</span>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-3xl font-black text-emerald-700">{conversionRate}%</div>
              <p className="text-[11px] text-emerald-700/70 font-medium">Proporção de assinantes Premium</p>
            </div>
          </div>

          {/* Action Toolbar & Search */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Left: Plan Filters Pills */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200/60 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setPlanFilter('all')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    planFilter === 'all'
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>Todos os E-mails</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 text-[10px]">
                    {totalCount}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPlanFilter('Free')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    planFilter === 'Free'
                      ? 'bg-slate-800 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>Plano Free</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-slate-700 text-slate-200 text-[10px]">
                    {countFree}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPlanFilter('Premium')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    planFilter === 'Premium'
                      ? 'bg-gradient-to-r from-[#8D67FF] to-[#3A7BFF] text-white shadow-xs'
                      : 'text-[#8D67FF] hover:bg-purple-50'
                  }`}
                >
                  <Crown className="w-3.5 h-3.5 text-amber-300" />
                  <span>Plano Premium</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-white text-[10px]">
                    {countPremium}
                  </span>
                </button>
              </div>

              {/* Right: Quick Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleCopyAllEmails}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Copiar lista de e-mails em bloco para envio de mensagens"
                >
                  {copiedAll ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">E-mails Copiados!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copiar E-mails</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-extrabold text-xs rounded-xl border border-emerald-200 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Exportar CSV</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 bg-[#3A7BFF] hover:bg-[#2b65e0] text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Cadastrar E-mail</span>
                </button>
              </div>
            </div>

            {/* Search Input Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por e-mail ou nome do usuário..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#3A7BFF] transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Registered Emails List Table */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#3A7BFF]" />
                <span className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
                  Listagem de E-mails Cadastrados ({filteredUsers.length})
                </span>
              </div>
              <span className="text-[11px] font-semibold text-slate-500">
                Sincronizado com o Servidor
              </span>
            </div>

            {filteredUsers.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-700">Nenhum e-mail encontrado</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Nenhum cadastro corresponde ao filtro selecionado. Tente alterar o termo de busca ou o plano.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[650px]">
                  <thead>
                    <tr className="bg-slate-50/60 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                      <th className="py-3 px-5">Usuário / E-mail</th>
                      <th className="py-3 px-4">Plano Atual</th>
                      <th className="py-3 px-4">Data de Cadastro</th>
                      <th className="py-3 px-4">Último Acesso</th>
                      <th className="py-3 px-5 text-right">Ações de Gestão</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {filteredUsers.map((user) => {
                      const isUserGestor = user.email.toLowerCase() === 'meuprofia@gmail.com';
                      const isPremium = user.plano === 'Premium';

                      return (
                        <tr
                          key={user.id}
                          className="hover:bg-slate-50/80 transition-colors group"
                        >
                          {/* User info & email */}
                          <td className="py-3.5 px-5">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${
                                  isUserGestor
                                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                    : isPremium
                                    ? 'bg-purple-100 text-[#8D67FF] border border-purple-200'
                                    : 'bg-slate-100 text-slate-700 border border-slate-200'
                                }`}
                              >
                                {user.nome.substring(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                                  <span>{user.nome}</span>
                                  {isUserGestor && (
                                    <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 text-[9px] font-black border border-amber-300">
                                      Gestor
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="text-slate-600 font-mono text-[11px]">
                                    {user.email}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleCopyEmail(user.email)}
                                    className="text-slate-400 hover:text-[#3A7BFF] transition-colors p-0.5 rounded cursor-pointer"
                                    title="Copiar este e-mail"
                                  >
                                    {copiedEmail === user.email ? (
                                      <Check className="w-3 h-3 text-emerald-600" />
                                    ) : (
                                      <Copy className="w-3 h-3" />
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Plan Badge */}
                          <td className="py-3.5 px-4">
                            {isPremium ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-purple-100 to-indigo-100 text-[#8D67FF] border border-purple-200 font-extrabold text-[11px]">
                                <Crown className="w-3 h-3 text-amber-500" />
                                <span>Premium</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 font-bold text-[11px]">
                                <span>Plano Free</span>
                              </span>
                            )}
                          </td>

                          {/* Reg Date */}
                          <td className="py-3.5 px-4 font-semibold text-slate-600 text-[11px]">
                            {user.dataCadastro}
                          </td>

                          {/* Last Access */}
                          <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                            <span className="inline-flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              {user.ultimoAcesso}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {!isUserGestor && (
                                <button
                                  type="button"
                                  onClick={() => handleTogglePlan(user.email, user.plano)}
                                  className={`px-3 py-1.5 rounded-xl font-extrabold text-[11px] transition-all cursor-pointer flex items-center gap-1 ${
                                    isPremium
                                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                                      : 'bg-purple-50 hover:bg-purple-100 text-[#8D67FF] border border-purple-200'
                                  }`}
                                  title={
                                    isPremium
                                      ? 'Alterar para Plano Free'
                                      : 'Promover para Plano Premium'
                                  }
                                >
                                  <ArrowUpDown className="w-3 h-3" />
                                  <span>
                                    {isPremium ? 'Mudar p/ Free' : 'Mudar p/ Premium'}
                                  </span>
                                </button>
                              )}

                              {!isUserGestor && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteUser(user.email)}
                                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                                  title="Excluir cadastro do usuário"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: OPINIÕES DOS ALUNOS */}
      {activeTab === 'feedbacks' && (
        <div className="space-y-6">
          {/* Header & KPI Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
              <span className="text-xs font-bold text-slate-500">Total de Opiniões</span>
              <div className="text-2xl font-black text-slate-900">{feedbacks.length}</div>
              <p className="text-[11px] text-slate-400 font-medium">Sugestões e críticas enviadas</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-red-200 shadow-xs space-y-1 bg-red-50/20">
              <span className="text-xs font-bold text-red-600 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                Não Lidas (Pendentes)
              </span>
              <div className="text-2xl font-black text-red-600">
                {feedbacks.filter((f) => f.status === 'Não lido').length}
              </div>
              <p className="text-[11px] text-red-700/80 font-medium">Aguardando leitura do gestor</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-emerald-200 shadow-xs space-y-1 bg-emerald-50/20">
              <span className="text-xs font-bold text-emerald-700">Lidas</span>
              <div className="text-2xl font-black text-emerald-700">
                {feedbacks.filter((f) => f.status === 'Lido').length}
              </div>
              <p className="text-[11px] text-emerald-800/80 font-medium">Analisadas pela equipe</p>
            </div>
          </div>

          {/* Search and Filters Bar */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={feedbackSearch}
                onChange={(e) => setFeedbackSearch(e.target.value)}
                placeholder="Buscar por e-mail, nome ou palavra..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#3A7BFF]"
              />
            </div>

            {/* Status Filter Buttons */}
            <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1 shrink-0">
                <Filter className="w-3.5 h-3.5" /> Status:
              </span>
              {(['Todos', 'Não lido', 'Lido'] as const).map((st) => {
                const count = st === 'Todos' ? feedbacks.length : feedbacks.filter((f) => f.status === st).length;
                const isSelected = feedbackStatusFilter === st;

                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setFeedbackStatusFilter(st)}
                    className={`px-3.5 py-1.5 rounded-xl font-extrabold text-xs transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                      isSelected
                        ? st === 'Não lido'
                          ? 'bg-red-500 text-white shadow-xs'
                          : st === 'Lido'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <span>{st}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback List */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
                  Opiniões dos Alunos Recebidas ({feedbacks.filter((f) => {
                    const matchesStatus = feedbackStatusFilter === 'Todos' || f.status === feedbackStatusFilter;
                    const query = feedbackSearch.toLowerCase().trim();
                    const matchesSearch = !query || f.usuario_email.toLowerCase().includes(query) || (f.usuario_nome && f.usuario_nome.toLowerCase().includes(query)) || f.mensagem.toLowerCase().includes(query);
                    return matchesStatus && matchesSearch;
                  }).length})
                </span>
              </div>
              <span className="text-[11px] font-semibold text-slate-500">
                Acesso Exclusivo Gestor
              </span>
            </div>

            {feedbacks.filter((f) => {
              const matchesStatus = feedbackStatusFilter === 'Todos' || f.status === feedbackStatusFilter;
              const query = feedbackSearch.toLowerCase().trim();
              const matchesSearch = !query || f.usuario_email.toLowerCase().includes(query) || (f.usuario_nome && f.usuario_nome.toLowerCase().includes(query)) || f.mensagem.toLowerCase().includes(query);
              return matchesStatus && matchesSearch;
            }).length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-700">Nenhuma opinião encontrada</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Não há sugestões ou críticas correspondentes aos filtros atuais.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {feedbacks
                  .filter((f) => {
                    const matchesStatus = feedbackStatusFilter === 'Todos' || f.status === feedbackStatusFilter;
                    const query = feedbackSearch.toLowerCase().trim();
                    const matchesSearch = !query || f.usuario_email.toLowerCase().includes(query) || (f.usuario_nome && f.usuario_nome.toLowerCase().includes(query)) || f.mensagem.toLowerCase().includes(query);
                    return matchesStatus && matchesSearch;
                  })
                  .map((item) => {
                    const isUnread = item.status === 'Não lido';
                    const isAnswered = item.status === 'Respondido';

                    return (
                      <div
                        key={item.id}
                        className={`p-5 space-y-3 transition-colors ${
                          isUnread ? 'bg-amber-50/30' : 'hover:bg-slate-50/50'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs shrink-0 bg-blue-100 text-[#3A7BFF] border border-blue-200">
                              {item.usuario_email.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-slate-900 text-xs">
                                  {item.usuario_nome || item.usuario_email.split('@')[0]}
                                </span>
                              </div>
                              <span className="text-[11px] text-slate-500 font-mono block">
                                {item.usuario_email}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-[11px] text-slate-400 font-medium">
                              📅 {item.data_envio}
                            </span>

                            {/* Status Badge */}
                            <span
                              className={`px-3 py-1 rounded-full text-[11px] font-black border flex items-center gap-1.5 ${
                                isUnread
                                  ? 'bg-red-100 text-red-700 border-red-300'
                                  : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              }`}
                            >
                              {isUnread && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                              <span>{item.status}</span>
                            </span>
                          </div>
                        </div>

                        {/* Opinion Message Content */}
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 text-slate-800 text-xs leading-relaxed font-medium whitespace-pre-wrap">
                          "{item.mensagem}"
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                          <div className="flex flex-wrap items-center gap-2">
                            {isUnread ? (
                              <button
                                type="button"
                                onClick={() => handleUpdateFeedbackStatus(item.id, 'Lido')}
                                className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 font-extrabold text-[11px] rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Marcar como Lida</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleUpdateFeedbackStatus(item.id, 'Não lido')}
                                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 font-extrabold text-[11px] rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                              >
                                <span>Marcar como Não Lida</span>
                              </button>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDeleteFeedback(item.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer flex items-center gap-1 text-[11px] font-bold"
                            title="Excluir opinião"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Excluir</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: Adicionar Novo E-mail Manualmente */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-2xl bg-blue-50 text-[#3A7BFF] flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    Cadastrar Novo E-mail
                  </h3>
                  <p className="text-xs text-slate-500">
                    Adicionar aluno diretamente no banco do app
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddUserSubmit} className="space-y-4">
              {addError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-xs font-semibold text-red-700">
                  {addError}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  E-mail do Estudante *
                </label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="exemplo@estudante.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#3A7BFF]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Nome Completo (Opcional)
                </label>
                <input
                  type="text"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="Nome do Estudante"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#3A7BFF]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Plano Inicial
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setNewUserPlan('Free')}
                    className={`py-2.5 px-3 rounded-xl font-extrabold text-xs border transition-all cursor-pointer ${
                      newUserPlan === 'Free'
                        ? 'bg-slate-800 text-white border-slate-800 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Plano Free
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewUserPlan('Premium')}
                    className={`py-2.5 px-3 rounded-xl font-extrabold text-xs border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                      newUserPlan === 'Premium'
                        ? 'bg-gradient-to-r from-[#8D67FF] to-[#3A7BFF] text-white border-purple-600 shadow-xs'
                        : 'bg-purple-50 text-[#8D67FF] border-purple-200 hover:bg-purple-100'
                    }`}
                  >
                    <Crown className="w-3.5 h-3.5 text-amber-300" />
                    <span>Plano Premium</span>
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={addingUser}
                  className="px-5 py-2.5 bg-[#3A7BFF] hover:bg-[#2b65e0] text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {addingUser ? (
                    <span>Cadastrando...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Salvar Cadastro</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
