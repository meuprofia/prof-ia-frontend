import React, { useState } from 'react';
import {
  CheckCircle2,
  Plus,
  Coins,
  Sparkles,
  Award,
  Clock,
  BookOpen,
} from 'lucide-react';
import { UserProfile, UserStats, StudyMission } from '../../types';

interface RegistrarEstudoViewProps {
  profile: UserProfile;
  stats: UserStats;
  missions: StudyMission[];
  onCompleteMission: (id: string) => void;
  onAddCustomTask: (task: { materia: string; topico: string; duracao: string }) => void;
}

export const RegistrarEstudoView: React.FC<RegistrarEstudoViewProps> = ({
  profile,
  stats,
  missions,
  onCompleteMission,
  onAddCustomTask,
}) => {
  const [materia, setMateria] = useState(profile.materiasOut[0] || 'Matemática');
  const [topico, setTopico] = useState('');
  const [duracao, setDuracao] = useState('45 min');

  const handleSubmitCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topico.trim()) return;

    onAddCustomTask({
      materia,
      topico,
      duracao,
    });

    setTopico('');
  };

  const completedCount = missions.filter((m) => m.concluida).length;
  const isWeekComplete = completedCount >= 15;

  return (
    <div className="space-y-6 pb-8">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-semibold text-xs mb-2">
            <CheckCircle2 className="w-3.5 h-3.5" /> Ganhe +1 Moeda por Tarefa e +10 no Bônus Semanal
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Registrar Estudo</h1>
          <p className="text-xs text-slate-500 mt-1">
            Marque as tarefas cumpridas ou registre estudos extras para acumular moedas e manter seu streak ativo.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form to Register Custom Task */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Plus className="w-4 h-4 text-[#3A7BFF]" />
            Registrar Estudo Avulso
          </h2>

          <form onSubmit={handleSubmitCustom} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Disciplina
              </label>
              <select
                value={materia}
                onChange={(e) => setMateria(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#3A7BFF] bg-white"
              >
                {[...profile.materiasIn, ...profile.materiasOut, profile.materiaPersonalizada, 'Outra'].filter(Boolean).map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Assunto / Tópico Estudado
              </label>
              <input
                type="text"
                placeholder="Ex: Leitura do cap. 3, Resolução de 20 exercícios..."
                value={topico}
                onChange={(e) => setTopico(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#3A7BFF]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tempo Dedicado
              </label>
              <select
                value={duracao}
                onChange={(e) => setDuracao(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#3A7BFF] bg-white"
              >
                <option value="15 min">15 minutos</option>
                <option value="30 min">30 minutos</option>
                <option value="45 min">45 minutos</option>
                <option value="60 min">1 hora</option>
                <option value="90 min">1h 30min</option>
                <option value="120 min">2 horas</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={!topico.trim()}
              className="w-full py-3 bg-[#3A7BFF] hover:bg-[#2b65e0] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              <Coins className="w-4 h-4 text-yellow-300" />
              <span>Confirmar Registro (+1 Moeda)</span>
            </button>
          </form>

          {/* Weekly Bonus Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-purple-500/10 border border-amber-200/80 space-y-2 mt-4">
            <div className="flex items-center justify-between text-xs font-bold text-amber-900">
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-600" /> Bônus Semanal
              </span>
              <span>
                {completedCount}/15 Concluídas
              </span>
            </div>
            <p className="text-[11px] text-amber-800 leading-normal">
              Complete no mínimo 15 metas na semana para resgatar o bônus semanal de <strong>+10 Moedas IA</strong>!
            </p>
          </div>
        </div>

        {/* Task List Section */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="font-bold text-slate-900 text-base">Minhas Metas Programadas</h2>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              {completedCount} concluídas
            </span>
          </div>

          <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-2 custom-scrollbar">
            {missions.map((m) => (
              <div
                key={m.id}
                onClick={() => onCompleteMission(m.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  m.concluida
                    ? 'bg-emerald-50/60 border-emerald-200 text-slate-600'
                    : 'bg-white border-slate-200 hover:border-[#3A7BFF]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2
                    className={`w-5 h-5 shrink-0 ${
                      m.concluida ? 'text-emerald-600' : 'text-slate-300'
                    }`}
                  />
                  <div>
                    <span className="text-[10px] font-bold text-[#3A7BFF] uppercase tracking-wider block">
                      {m.materia} • {m.duracao}
                    </span>
                    <h3
                      className={`font-bold text-xs ${
                        m.concluida ? 'line-through text-slate-500' : 'text-slate-900'
                      }`}
                    >
                      {m.topico}
                    </h3>
                  </div>
                </div>

                <span
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-lg ${
                    m.concluida
                      ? 'bg-emerald-200 text-emerald-900'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {m.concluida ? '+1 Moeda Ganha' : 'Ganhar +1 Moeda'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
