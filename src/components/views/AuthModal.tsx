import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, X, CheckCircle2, ArrowLeft, KeyRound } from 'lucide-react';
import { Mascot } from '../Mascot';
import { getApiUrl } from '../../lib/api';

interface AuthModalProps {
  initialMode?: 'login' | 'signup';
  successNotice?: string;
  onClose: () => void;
  onSuccess: (userData: { nome: string; email: string; isNewUser: boolean }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  initialMode = 'signup',
  successNotice,
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(
    initialMode === 'login' ? 'login' : 'signup'
  );
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [recoverySent, setRecoverySent] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'forgot') {
      if (!email) {
        setError('Por favor, informe seu e-mail para receber o link de redefinição.');
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(getApiUrl('/api/auth/forgot-password'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });

        const data = await res.json();
        if (res.ok) {
          setRecoverySent(true);
        } else {
          setError(data.error || 'Ocorreu um erro ao processar sua solicitação.');
        }
      } catch (err: any) {
        setError('Não foi possível conectar com o servidor. Tente novamente.');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!email || !senha) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    if (mode === 'signup' && !nome) {
      setError('Por favor, informe o seu nome para o cadastro.');
      return;
    }

    onSuccess({
      nome: nome || email.split('@')[0] || 'Estudante',
      email,
      isNewUser: mode === 'signup',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Click outside backdrop to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden relative z-10 animate-in zoom-in-95 duration-200">
        {/* Top Header Bar with Close Button */}
        <div className="bg-gradient-to-br from-[#1D3C8F] via-[#21439c] to-[#162C6B] text-white p-6 text-center relative overflow-hidden">
          {/* Close button with high visibility */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all cursor-pointer flex items-center justify-center"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex justify-center mb-2">
            <Mascot size="lg" animate={true} />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            {mode === 'forgot'
              ? 'Recuperação de Senha'
              : mode === 'login'
              ? 'Bem-vindo de volta!'
              : 'Crie sua conta no Meu Prof IA'}
          </h2>
          <p className="text-xs text-purple-200 mt-1">
            {mode === 'forgot'
              ? 'Enviaremos um link de redefinição para o seu e-mail'
              : mode === 'login'
              ? 'Acesse seu painel inteligente de estudos'
              : 'Comece sua jornada com o tutor inteligente'}
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {successNotice && (
            <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-extrabold border border-emerald-200 text-center flex items-center justify-center gap-2 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successNotice}</span>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-red-600 text-xs font-medium border border-red-100 text-center">
              {error}
            </div>
          )}

          {mode === 'forgot' ? (
            recoverySent ? (
              <div className="space-y-4 text-center py-2">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-extrabold text-slate-900 text-base">Instruções de Recuperação Enviadas</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Se o e-mail <strong className="text-slate-900">{email}</strong> estiver cadastrado, você receberá as instruções para redefinir sua senha em instantes.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setRecoverySent(false);
                    setError('');
                  }}
                  className="w-full py-3 bg-[#3A7BFF] hover:bg-[#2b65e0] text-white font-bold rounded-xl shadow-md text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Voltar para o Login</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Seu E-mail Cadastrado
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="seu.email@exemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#3A7BFF] focus:border-transparent"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#3A7BFF] hover:bg-[#2b65e0] text-white font-bold rounded-xl shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Enviar Link de Recuperação</span>
                </button>

                <div className="text-center pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setError('');
                    }}
                    className="text-xs font-semibold text-slate-600 hover:text-[#3A7BFF] hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Voltar para o Login</span>
                  </button>
                </div>
              </div>
            )
          ) : (
            <>
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Nome Completo
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required={mode === 'signup'}
                      placeholder="Ex: Ana Maria Silva"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#3A7BFF] focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="seu.email@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#3A7BFF] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Senha
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot');
                        setError('');
                        setRecoverySent(false);
                      }}
                      className="text-[11px] font-semibold text-[#3A7BFF] hover:underline cursor-pointer"
                    >
                      Esqueceu a senha?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#3A7BFF] focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none p-0.5"
                    title={showPassword ? 'Ocultar Senha' : 'Mostrar Senha'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-[#3A7BFF]" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#3A7BFF] hover:bg-[#2b65e0] text-white font-bold rounded-xl shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 mt-2 cursor-pointer"
              >
                <span>{mode === 'login' ? 'Entrar no Dashboard' : 'Continuar para Anamnese'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === 'login' ? 'signup' : 'login');
                    setError('');
                  }}
                  className="text-xs font-semibold text-[#3A7BFF] hover:underline block w-full text-center cursor-pointer"
                >
                  {mode === 'login'
                    ? 'Ainda não tem conta? Cadastre-se gratuitamente'
                    : 'Já tem uma conta? Clique aqui para entrar'}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

