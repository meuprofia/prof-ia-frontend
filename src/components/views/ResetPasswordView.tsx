import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, KeyRound, Sparkles } from 'lucide-react';
import { Mascot } from '../Mascot';
import { getApiUrl } from '../../lib/api';

interface ResetPasswordViewProps {
  token: string;
  onSuccess: (message: string) => void;
  onCancel: () => void;
}

export const ResetPasswordView: React.FC<ResetPasswordViewProps> = ({
  token,
  onSuccess,
  onCancel,
}) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [validToken, setValidToken] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Validate token on mount
  useEffect(() => {
    async function verifyToken() {
      setLoading(true);
      setErrorMessage('');
      try {
        const res = await fetch(getApiUrl(`/api/auth/verify-token?token=${encodeURIComponent(token)}`));
        const data = await res.json();
        if (res.ok && data.valid) {
          setValidToken(true);
          setUserEmail(data.email || '');
        } else {
          setValidToken(false);
          setErrorMessage(data.error || 'Token de redefinição inválido ou expirado.');
        }
      } catch (err: any) {
        setValidToken(false);
        setErrorMessage('Não foi possível verificar a validade do link. Tente novamente.');
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      verifyToken();
    } else {
      setLoading(false);
      setValidToken(false);
      setErrorMessage('Nenhum código/token de redefinição foi fornecido.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (newPassword.length < 8) {
      setErrorMessage('A nova senha deve ter no mínimo 8 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('As senhas digitadas não coincidem. Digite novamente.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(getApiUrl('/api/auth/reset-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        onSuccess('Senha alterada com sucesso! Faça login com sua nova senha.');
      } else {
        setErrorMessage(data.error || 'Erro ao redefinir a senha. Tente novamente.');
      }
    } catch (err: any) {
      setErrorMessage('Ocorreu uma falha ao conectar com o servidor.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative my-8">
        {/* Header Branding */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#1D3C8F] to-[#3A7BFF] flex items-center justify-center mx-auto text-white shadow-md">
            <KeyRound className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Redefinição de Senha</h2>
          <p className="text-xs text-slate-500 font-medium">
            Escolha uma nova senha forte para acessar sua conta no Meu Prof IA
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-8 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-[#3A7BFF] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-semibold text-slate-600">Verificando segurança do link...</p>
          </div>
        )}

        {/* Invalid Token State */}
        {!loading && !validToken && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-red-900">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>Link Inválido ou Expirado</span>
              </div>
              <p className="text-red-700 leading-relaxed font-medium">
                {errorMessage || 'O link de redefinição de senha utilizado é inválido ou já expirou (validade de 1 hora).'}
              </p>
            </div>

            <button
              onClick={onCancel}
              className="w-full py-3 bg-[#3A7BFF] hover:bg-[#2b65e0] text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Solicitar Novo Link de Recuperação</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Valid Token Form */}
        {!loading && validToken && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {userEmail && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                <span>Redefinindo para:</span>
                <strong className="text-slate-900 font-bold">{userEmail}</strong>
              </div>
            )}

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Field 1: Nova Senha */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nova Senha (mínimo 8 caracteres)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  placeholder="Mínimo 8 caracteres"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#3A7BFF] focus:border-transparent font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none p-0.5 cursor-pointer"
                  title={showNewPassword ? 'Ocultar Senha' : 'Mostrar Senha'}
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4 text-[#3A7BFF]" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Field 2: Confirmar Nova Senha */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Confirmar Nova Senha
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  placeholder="Repita a nova senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#3A7BFF] focus:border-transparent font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none p-0.5 cursor-pointer"
                  title={showConfirmPassword ? 'Ocultar Senha' : 'Mostrar Senha'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4 text-[#3A7BFF]" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Password Validation Checklist */}
            <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-[11px]">
              <div className={`flex items-center gap-1.5 font-semibold ${newPassword.length >= 8 ? 'text-emerald-600' : 'text-slate-500'}`}>
                <CheckCircle2 className={`w-3.5 h-3.5 ${newPassword.length >= 8 ? 'text-emerald-600' : 'text-slate-300'}`} />
                <span>Pelo menos 8 caracteres ({newPassword.length}/8)</span>
              </div>
              <div className={`flex items-center gap-1.5 font-semibold ${newPassword && newPassword === confirmPassword ? 'text-emerald-600' : 'text-slate-500'}`}>
                <CheckCircle2 className={`w-3.5 h-3.5 ${newPassword && newPassword === confirmPassword ? 'text-emerald-600' : 'text-slate-300'}`} />
                <span>Senhas perfeitamente iguais</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-gradient-to-r from-[#1D3C8F] to-[#3A7BFF] hover:opacity-95 text-white font-extrabold rounded-xl shadow-md transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Salvando nova senha...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4.5 h-4.5" />
                  <span>Salvar Nova Senha</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
