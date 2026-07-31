import React, { useState, useEffect } from 'react';
import {
  CalendarDays,
  Sparkles,
  CheckCircle2,
  Circle,
  RotateCcw,
  Clock,
  BookOpen,
  Filter,
  RefreshCw,
  X,
  HelpCircle,
} from 'lucide-react';
import { UserProfile, DaySchedule, StudyMission } from '../../types';

interface PlanoSemanaViewProps {
  profile: UserProfile;
  schedule: DaySchedule[];
  onToggleMission: (missionId: string) => void;
  onRegeneratePlan: () => Promise<void>;
  onAddCustomMission?: (dayIndex: number, mission: { materia: string; topico: string; duracao: string }) => void;
}

// Helper to compute calendar dates for the active week (Monday to Sunday)
function getWeekDaysWithDates(refDate: Date = new Date()) {
  const dayOfWeek = refDate.getDay(); // 0 = Sun, 1 = Mon...
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const monday = new Date(refDate);
  monday.setDate(refDate.getDate() + diffToMonday);

  const daysNames = [
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
    'Domingo',
  ];

  return daysNames.map((dayName, idx) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + idx);

    const dayNum = String(d.getDate()).padStart(2, '0');
    const monthNum = String(d.getMonth() + 1).padStart(2, '0');
    const yearNum = d.getFullYear();

    const formattedDate = `${dayNum}/${monthNum}/${yearNum}`; // e.g. 01/10/2026
    const shortDate = `${dayNum}/${monthNum}`;

    return {
      dayName,
      shortDay: dayName.split('-')[0], // Segunda, Terça...
      formattedDate,
      shortDate,
      fullTitle: `${dayName} • ${formattedDate}`,
      tabLabel: `${dayName.split('-')[0]} ${shortDate}`,
      dateObj: d,
    };
  });
}

export const PlanoSemanaView: React.FC<PlanoSemanaViewProps> = ({
  profile,
  schedule,
  onToggleMission,
  onRegeneratePlan,
  onAddCustomMission,
}) => {
  const [loadingRegen, setLoadingRegen] = useState(false);
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  // Custom task form state
  const [customMateria, setCustomMateria] = useState('');
  const [customTopico, setCustomTopico] = useState('');
  const [showCustomForm, setShowCustomForm] = useState(false);

  // Renewal Modal State
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [isAutoPrompt, setIsAutoPrompt] = useState(false);
  const [renewNotice, setRenewNotice] = useState('');

  // Calculate dates for current week
  const weekDays = getWeekDaysWithDates(new Date());

  // Check 7-day automatic renewal condition on mount
  useEffect(() => {
    const lastPlanStr = localStorage.getItem('prof_ia_last_plan_date');
    const now = new Date();

    if (lastPlanStr) {
      const lastPlanDate = new Date(lastPlanStr);
      const diffTime = Math.abs(now.getTime() - lastPlanDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Calculate Monday of current week
      const monday = new Date();
      const day = monday.getDay();
      const diffToMon = day === 0 ? -6 : 1 - day;
      monday.setDate(monday.getDate() + diffToMon);
      monday.setHours(0, 0, 0, 0);

      const promptKey = `prof_ia_renew_prompt_${monday.toISOString().split('T')[0]}`;
      const alreadyPrompted = sessionStorage.getItem(promptKey) === 'true';

      if ((diffDays >= 7 || lastPlanDate < monday) && !alreadyPrompted) {
        setIsAutoPrompt(true);
        setShowRenewModal(true);
        sessionStorage.setItem(promptKey, 'true');
      }
    } else {
      localStorage.setItem('prof_ia_last_plan_date', now.toISOString());
    }
  }, []);

  const handleOpenRecalculateModal = () => {
    setIsAutoPrompt(false);
    setShowRenewModal(true);
  };

  const handleConfirmRegen = async () => {
    setLoadingRegen(true);
    try {
      await onRegeneratePlan();
      localStorage.setItem('prof_ia_last_plan_date', new Date().toISOString());
      setShowRenewModal(false);
      setRenewNotice('Plano de Estudos renovado com sucesso pela IA!');
      setTimeout(() => setRenewNotice(''), 5000);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingRegen(false);
    }
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTopico.trim()) return;

    if (onAddCustomMission) {
      onAddCustomMission(activeDayIndex, {
        materia: customMateria.trim() || 'Estudo Pessoal',
        topico: customTopico.trim(),
        duracao: '30 min',
      });
    }

    setCustomMateria('');
    setCustomTopico('');
    setShowCustomForm(false);
  };

  const currentDay = schedule[activeDayIndex] || schedule[0];
  const currentWeekDayInfo = weekDays[activeDayIndex] || weekDays[0];

  return (
    <div className="space-y-6 pb-8">
      {/* Toast Notification */}
      {renewNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center justify-between text-xs font-bold animate-in fade-in duration-200 shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{renewNotice}</span>
          </div>
          <button onClick={() => setRenewNotice('')} className="text-emerald-700 hover:text-emerald-900 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3A7BFF]/10 text-[#3A7BFF] font-semibold text-xs mb-2">
            <CalendarDays className="w-3.5 h-3.5" /> Cronograma Personalizado IA • Ciclo de 7 Dias
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Plano da Semana</h1>
          <p className="text-xs text-slate-500 mt-1">
            Meta adaptada para o seu nível ({profile.escolaridade}) e horário de maior rendimento ({profile.horarioRendimento}).
          </p>
        </div>

        <button
          onClick={handleOpenRecalculateModal}
          disabled={loadingRegen}
          className="px-5 py-2.5 bg-gradient-to-r from-[#3A7BFF] to-[#8D67FF] hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 shrink-0 disabled:opacity-50 cursor-pointer"
        >
          <Sparkles className={`w-4 h-4 ${loadingRegen ? 'animate-spin' : ''}`} />
          <span>Recalcular Plano com IA</span>
        </button>
      </div>

      {/* Days Tabs with Real Dates (DD/MM/YYYY) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {schedule.map((dayItem, idx) => {
          const totalM = dayItem.missoes.length;
          const completedM = dayItem.missoes.filter((m) => m.concluida).length;
          const isDone = totalM > 0 && totalM === completedM;
          const isActive = idx === activeDayIndex;
          const dayDateInfo = weekDays[idx] || weekDays[0];

          return (
            <button
              key={dayItem.dia}
              onClick={() => setActiveDayIndex(idx)}
              className={`px-4 py-3 rounded-2xl border text-left shrink-0 transition-all cursor-pointer ${
                isActive
                  ? 'border-[#3A7BFF] bg-[#3A7BFF] text-white font-bold shadow-md'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="text-xs uppercase font-extrabold tracking-wider opacity-90">
                {dayDateInfo.shortDay}
              </div>
              <div className={`text-[11px] font-medium font-mono ${isActive ? 'text-blue-100' : 'text-slate-500'}`}>
                {dayDateInfo.formattedDate}
              </div>
              <div className="text-[11px] mt-1.5 flex items-center gap-1 font-medium">
                {isDone ? (
                  <span className={isActive ? 'text-emerald-200' : 'text-emerald-600 font-bold'}>
                    ✓ 100%
                  </span>
                ) : (
                  <span>
                    {completedM}/{totalM} atividades
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Day Missions List */}
      {currentDay && (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
            <div>
              <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <span>Metas para {currentDay.dia}</span>
              </h2>
              <span className="text-xs font-semibold text-[#3A7BFF] block mt-0.5">
                📅 {currentWeekDayInfo.formattedDate}
              </span>
            </div>
            <span className="text-xs text-slate-500 font-medium bg-slate-50 px-3 py-1 rounded-full border border-slate-200/80 shrink-0">
              {currentDay.missoes.filter((m) => m.concluida).length} de {currentDay.missoes.length} completadas
            </span>
          </div>

          <div className="space-y-3">
            {currentDay.missoes.map((mission) => (
              <div
                key={mission.id}
                onClick={() => onToggleMission(mission.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                  mission.concluida
                    ? 'bg-emerald-50/60 border-emerald-200 text-slate-600'
                    : 'bg-white border-slate-200 hover:border-[#3A7BFF] shadow-xs'
                }`}
              >
                <div className="pt-0.5">
                  {mission.concluida ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300 shrink-0" />
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${
                        mission.concluida
                          ? 'bg-emerald-200 text-emerald-800'
                          : 'bg-[#3A7BFF]/10 text-[#3A7BFF]'
                      }`}
                    >
                      {mission.materia}
                    </span>
                    <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {mission.duracao} • {mission.tipo}
                    </span>
                  </div>

                  <h3
                    className={`font-bold text-sm ${
                      mission.concluida ? 'line-through text-slate-500' : 'text-slate-900'
                    }`}
                  >
                    {mission.topico}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          {/* Add custom item form */}
          <div className="pt-4 border-t border-slate-100">
            {!showCustomForm ? (
              <button
                onClick={() => setShowCustomForm(true)}
                className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 border border-dashed border-slate-300 text-slate-700 font-bold text-xs rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>+ Acrescentar tarefa personalizada para este dia</span>
              </button>
            ) : (
              <form onSubmit={handleAddCustom} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-xs text-slate-800">Nova Tarefa no Plano Semanal</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Matéria (Ex: Física, História...)"
                    value={customMateria}
                    onChange={(e) => setCustomMateria(e.target.value)}
                    className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#3A7BFF]"
                  />
                  <input
                    type="text"
                    placeholder="Tópico / O que estudar..."
                    value={customTopico}
                    onChange={(e) => setCustomTopico(e.target.value)}
                    className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#3A7BFF]"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowCustomForm(false)}
                    className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 font-semibold cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={!customTopico.trim()}
                    className="px-4 py-1.5 bg-[#3A7BFF] hover:bg-[#2b65e0] text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
                  >
                    Adicionar ao Plano
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Renewal Confirmation Modal (Sim / Não) */}
      {showRenewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-5 text-slate-800 relative">
            <button
              type="button"
              onClick={() => setShowRenewModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-[#8D67FF]/10 text-[#8D67FF] flex items-center justify-center font-bold">
              <Sparkles className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900">
                {isAutoPrompt
                  ? 'Renovar Plano Semanal com IA?'
                  : 'Recalcular Plano de Estudos com IA?'}
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">
                O <strong className="text-[#3A7BFF]">Prof IA</strong> analisará seu desempenho recente, tarefas executadas, nível de perfil e pontos fortes para construir um novo plano de estudos sob medida para os próximos 7 dias.
              </p>
            </div>

            <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-100 flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-[#8D67FF] shrink-0" />
              <span className="text-xs text-purple-900 font-semibold">
                Deseja autorizar a IA a gerar um novo plano para os próximos 7 dias?
              </span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowRenewModal(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Não
              </button>
              <button
                type="button"
                onClick={handleConfirmRegen}
                disabled={loadingRegen}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#3A7BFF] to-[#8D67FF] text-white font-extrabold text-xs shadow-md hover:opacity-95 transition-opacity flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className={`w-4 h-4 ${loadingRegen ? 'animate-spin' : ''}`} />
                <span>{loadingRegen ? 'Gerando Plano...' : 'Sim, Gerar Novo Plano'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

