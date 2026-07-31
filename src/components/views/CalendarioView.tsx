import React, { useState } from 'react';
import {
  CalendarDays,
  Plus,
  Clock,
  BookOpen,
  CheckCircle2,
  Trash2,
} from 'lucide-react';

interface CalendarEvent {
  id: string;
  dia: number;
  titulo: string;
}

export const CalendarioView: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDate());
  const [events, setEvents] = useState<CalendarEvent[]>([
    { id: '1', dia: 15, titulo: 'Simulado Geral de Exames' },
    { id: '2', dia: 20, titulo: 'Prova de Matemática e Raciocínio Lógico' },
    { id: '3', dia: 25, titulo: 'Entrega da Redação Semanal' },
  ]);

  // Form State
  const [newTitulo, setNewTitulo] = useState('');

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitulo.trim()) return;

    const event: CalendarEvent = {
      id: Date.now().toString(),
      dia: selectedDay,
      titulo: newTitulo.trim(),
    };

    setEvents([...events, event]);
    setNewTitulo('');
  };

  const handleRemoveEvent = (id: string) => {
    setEvents(events.filter((ev) => ev.id !== id));
  };

  const selectedDayEvents = events.filter((ev) => ev.dia === selectedDay);

  const daysArray = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="space-y-6 pb-8">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3A7BFF]/10 text-[#3A7BFF] font-semibold text-xs mb-2">
            <CalendarDays className="w-3.5 h-3.5" /> Organização Mensal
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Calendário de Estudos</h1>
          <p className="text-xs text-slate-500 mt-1">
            Agende suas provas, entregas e simulados importantes com alertas visuais.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Grid */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <h2 className="font-bold text-slate-900 text-base">Dias do Mês</h2>

          <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
            {daysArray.map((dayNum) => {
              const dayEvs = events.filter((e) => e.dia === dayNum);
              const isSelected = selectedDay === dayNum;

              return (
                <button
                  key={dayNum}
                  onClick={() => setSelectedDay(dayNum)}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col justify-between items-center h-20 ${
                    isSelected
                      ? 'border-[#3A7BFF] bg-[#3A7BFF] text-white font-bold shadow-md'
                      : 'border-slate-200 bg-white hover:border-slate-300 text-slate-800'
                  }`}
                >
                  <span className="text-sm">{dayNum}</span>
                  {dayEvs.length > 0 && (
                    <div className="flex gap-1 mt-1">
                      {dayEvs.map((ev, i) => (
                        <span
                          key={i}
                          className={`w-2 h-2 rounded-full ${
                            isSelected
                              ? 'bg-amber-300'
                              : ev.tipo === 'prova'
                              ? 'bg-rose-500'
                              : ev.tipo === 'simulado'
                              ? 'bg-[#8D67FF]'
                              : 'bg-emerald-500'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day Agenda & Form */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <h2 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">
            Agenda do Dia {selectedDay}
          </h2>

          {/* Events List for Day */}
          <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
            {selectedDayEvents.length > 0 ? (
              selectedDayEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2 text-xs"
                >
                  <span className="font-bold text-slate-900">{ev.titulo}</span>
                  <button
                    onClick={() => handleRemoveEvent(ev.id)}
                    className="p-1 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">
                Nenhum compromisso marcado para este dia.
              </p>
            )}
          </div>

          {/* Add Event Form */}
          <form onSubmit={handleAddEvent} className="pt-3 border-t border-slate-100 space-y-3">
            <h3 className="font-bold text-xs text-slate-800 flex items-center gap-1">
              <Plus className="w-3.5 h-3.5 text-[#3A7BFF]" /> Salvar Evento para o Dia {selectedDay}
            </h3>

            <input
              type="text"
              placeholder="Escreva o compromisso (Ex: Prova de Matemática, Estudar para Simulado...)"
              value={newTitulo}
              onChange={(e) => setNewTitulo(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#3A7BFF]"
            />

            <button
              type="submit"
              disabled={!newTitulo.trim()}
              className="w-full py-2.5 bg-[#3A7BFF] hover:bg-[#2b65e0] text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              Salvar no Calendário
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
