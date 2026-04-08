import { useState, useMemo } from 'react';
import { useJourney } from '../hooks/useJourney';
import { useFinances, getCurrentMonthYear } from '../hooks/useFinances';
import { useWheelOfLife } from '../hooks/useWheelOfLife';
import { getEmotionMeta } from '../utils/emotions';
import { Sparkles, Calendar as CalendarIcon, CheckCircle2, XCircle, TrendingUp, TrendingDown, Wallet, Users, Brain, Dumbbell } from 'lucide-react';

// ── Helpers ────────────────────────────────────────────────────────────────
const formatBRL = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export function Jornada() {
  const { journeyData, loading } = useJourney();
  const { records: financeRecords } = useFinances(getCurrentMonthYear());
  const { wheelByDate } = useWheelOfLife();

  // Agrupa registros financeiros por data (YYYY-MM-DD) para lookup no calendário
  const financesByDate = useMemo(() => {
    const map: Record<string, typeof financeRecords> = {};
    financeRecords.forEach((r) => {
      const d = r.date instanceof Date ? r.date : new Date(r.date);
      const dateStr = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
        .toISOString()
        .split('T')[0];
      if (!map[dateStr]) map[dateStr] = [];
      map[dateStr].push(r);
    });
    return map;
  }, [financeRecords]);

  // Garante que é calculado corringo o TZ do current date.
  const todayRaw = new Date();
  const todayDateStr = new Date(todayRaw.getTime() - (todayRaw.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayDateStr);

  const year = todayRaw.getFullYear();
  const month = todayRaw.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const getDayInfo = (dateStr: string) => journeyData[dateStr] || null;

  const getRingColor = (info: any) => {
    if (!info || info.totalTasks === 0) return 'border-gray-200';
    const percentage = info.completedTasks / info.totalTasks;
    if (percentage === 1) return 'border-green-400 border-opacity-100 bg-green-50';
    if (percentage > 0) return 'border-orange-400 border-opacity-100 bg-orange-50';
    return 'border-gray-300 border-opacity-60 bg-gray-50';
  };

  const getDotEmotionColor = (level: number | undefined) => {
    if (!level) return 'transparent';
    const emotion = getEmotionMeta(level);
    return emotion?.hex || '#9CA3AF';
  };

  // Calcular Insights rápidos
  const expansionDays = Object.values(journeyData).filter(d => (d.emotionLevel || 0) >= 200).length;

  if (loading) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center space-y-4 h-full min-h-screen">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium animate-pulse">A decodificar a sua jornada...</p>
      </div>
    );
  }

  const selectedInfo = getDayInfo(selectedDate);
  const selectedEmotion = selectedInfo?.emotionLevel ? getEmotionMeta(selectedInfo.emotionLevel) : null;
  const isSelectedFuture = selectedDate > todayDateStr;

  // Finanças do dia selecionado
  const selectedDayFinances = financesByDate[selectedDate] ?? [];
  const selectedDayIncome = selectedDayFinances
    .filter((r) => r.type === 'income')
    .reduce((s, r) => s + r.amount, 0);
  const selectedDayExpense = selectedDayFinances
    .filter((r) => r.type === 'expense')
    .reduce((s, r) => s + r.amount, 0);
  const selectedDayBalance = selectedDayIncome - selectedDayExpense;

  // Roda da Vida do dia selecionado
  const selectedDayWheel = wheelByDate[selectedDate] ?? null;

  return (
    <div className="p-6 h-full flex flex-col pt-10 pb-28 min-h-screen bg-gray-50 max-w-md mx-auto">
      <div className="mb-6">
        <h1 className="font-serif text-3xl font-bold text-primary-dark mb-2">Sua Jornada</h1>
        <p className="text-gray-500 text-sm leading-relaxed">
          Padrões constroem realidades. Observe o reflexo das suas emoções através da consistência.
        </p>
      </div>

      {/* Insight Tag */}
      <div className="bg-primary-lilac/20 border border-primary-light/30 rounded-2xl p-4 mb-6 flex items-center space-x-4 animate-fade-in">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0 text-primary-dark">
          <Sparkles size={20} />
        </div>
        <div>
          <p className="text-xs text-primary-dark/70 font-bold tracking-widest uppercase mb-1">Mês Atual</p>
          <p className="text-primary-dark font-medium leading-snug">Você esteve em estado de Expansão (≥200Hz) por <strong className="font-bold">{expansionDays} dia(s)</strong>!</p>
        </div>
      </div>

      {/* Calendário */}
      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 mb-6 relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-serif text-xl text-gray-800 capitalize">
            {todayRaw.toLocaleString('default', { month: 'long' })} {year}
          </h2>
          <CalendarIcon size={20} className="text-gray-400" />
        </div>

        <div className="grid grid-cols-7 gap-2 gap-y-4 text-center">
          {/* Weekday headers */}
          {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, idx) => (
            <div key={idx} className="text-[10px] font-bold text-gray-400 uppercase">{day}</div>
          ))}

          {/* Blank prefix blocks */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
             <div key={`blank-${i}`} />
          ))}

          {/* Days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
             const dayNum = i + 1;
             const isToday = dayNum === todayRaw.getDate();
             const loopDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
             const isSelected = selectedDate === loopDateStr;
             
             const info = getDayInfo(loopDateStr);
             const ringClass = loopDateStr > todayDateStr ? 'border-dashed border-gray-100 bg-transparent' : getRingColor(info);
             const dotColor = loopDateStr > todayDateStr ? 'transparent' : getDotEmotionColor(info?.emotionLevel);

             return (
               <div key={dayNum} className="flex flex-col items-center" onClick={() => setSelectedDate(loopDateStr)}>
                  <div className={`relative w-9 h-9 rounded-full flex items-center justify-center border-[3px] transition-all cursor-pointer ${
                      isSelected ? 'ring-2 ring-primary ring-offset-2' : 'hover:bg-gray-50'
                    } ${ringClass}`}>
                    
                    {/* Day Number */}
                    <span className={`text-[12px] font-bold ${isToday ? 'text-primary' : 'text-gray-700'}`}>
                      {dayNum}
                    </span>

                    {/* Emotion Dot */}
                    {dotColor !== 'transparent' && (
                      <div 
                        className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: dotColor }}
                      />
                    )}
                  </div>

                  {/* Finance dots abaixo do círculo — verde e/ou rosa lado a lado */}
                  {financesByDate[loopDateStr] && loopDateStr <= todayDateStr
                    ? (() => {
                        const recs = financesByDate[loopDateStr];
                        const hasIncome = recs.some((r) => r.type === 'income');
                        const hasExpense = recs.some((r) => r.type === 'expense');
                        return (
                          <div className="flex gap-0.5 mt-1 h-2 items-center">
                            {hasIncome && (
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            )}
                            {hasExpense && (
                              <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                            )}
                          </div>
                        );
                      })()
                    : <div className="h-2 mt-1" /> /* espaço reservado para manter alinhamento */
                  }
               </div>
             )
          })}
        </div>
      </div>

      {/* Cartão Deep-Dive Diário */}
      <h3 className="font-serif text-lg text-primary-dark mb-4">Zoom do Dia</h3>
      <div className={`bg-white rounded-3xl p-6 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-gray-100 transition-all duration-300 ${
        selectedInfo ? 'ring-1 ring-primary-light/50' : ''
      }`}>
         <div className="flex justify-between items-start mb-4">
           <div>
             <p className="text-xs font-bold text-gray-400 tracking-wider">
               {new Date(selectedDate + "T12:00:00").toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' })}
             </p>
             {isSelectedFuture ? (
               <p className="text-gray-400 mt-2 text-sm italic">O mistério do futuro! O que este dia lhe reserva?</p>
             ) : (
               <div className="mt-2 flex items-center space-x-2">
                 {selectedEmotion ? (
                   <span className={`px-3 py-1 rounded-full text-xs font-bold ring-1 ring-black/5 ${selectedEmotion.color}`}>
                     {selectedEmotion.label} ({selectedEmotion.level}Hz)
                   </span>
                 ) : (
                   <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-bold">Emoção não registada</span>
                 )}
               </div>
             )}
           </div>
         </div>

         {!isSelectedFuture && selectedInfo && selectedInfo.intention && (
           <div className="bg-primary-lilac/10 rounded-xl p-4 mb-4 border border-primary-lilac/30">
             <p className="text-xs font-bold text-primary-dark/60 uppercase mb-1">A sua nota</p>
             <p className="text-gray-700 italic font-medium leading-relaxed">"{selectedInfo.intention}"</p>
           </div>
         )}

         {!isSelectedFuture && selectedInfo && selectedInfo.habitsDetails.length > 0 && (
           <div className="space-y-3 mt-4 pt-4 border-t border-gray-100">
             <p className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-2">Hábitos Planeados ({selectedInfo.completedTasks}/{selectedInfo.totalTasks})</p>
             {selectedInfo.habitsDetails.map((h, i) => (
               <div key={i} className="flex items-center text-sm font-medium">
                 {h.completed ? (
                   <CheckCircle2 size={16} className="text-green-500 mr-2 flex-shrink-0" />
                 ) : (
                   <XCircle size={16} className="text-gray-300 mr-2 flex-shrink-0" />
                 )}
                 <span className={h.completed ? 'text-gray-800' : 'text-gray-400 line-through'}>{h.title}</span>
               </div>
             ))}
           </div>
         )}

         {/* ── Finanças do dia ── */}
         {!isSelectedFuture && selectedDayFinances.length > 0 && (
           <div className="mt-4 pt-4 border-t border-gray-100">
             <p className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-3">
               Finanças do Dia
             </p>

             {/* Mini summary */}
             <div className="flex gap-2 mb-3">
               {selectedDayIncome > 0 && (
                 <div className="flex-1 min-w-0 bg-emerald-50 rounded-xl p-2.5 border border-emerald-100">
                   <TrendingUp size={11} className="text-emerald-600 mb-1" />
                   <p className="text-[11px] font-bold text-emerald-700 truncate">{formatBRL(selectedDayIncome)}</p>
                 </div>
               )}
               {selectedDayExpense > 0 && (
                 <div className="flex-1 min-w-0 bg-rose-50 rounded-xl p-2.5 border border-rose-100">
                   <TrendingDown size={11} className="text-rose-500 mb-1" />
                   <p className="text-[11px] font-bold text-rose-600 truncate">{formatBRL(selectedDayExpense)}</p>
                 </div>
               )}
               <div className={`flex-1 min-w-0 rounded-xl p-2.5 border ${
                 selectedDayBalance >= 0 ? 'bg-primary-lilac/20 border-primary-lilac/40' : 'bg-orange-50 border-orange-100'
               }`}>
                 <Wallet size={11} className={`mb-1 ${selectedDayBalance >= 0 ? 'text-primary-dark' : 'text-orange-500'}`} />
                 <p className={`text-[11px] font-bold truncate ${
                   selectedDayBalance >= 0 ? 'text-primary-dark' : 'text-orange-600'
                 }`}>
                   {selectedDayBalance < 0 ? '−' : ''}{formatBRL(Math.abs(selectedDayBalance))}
                 </p>
               </div>
             </div>

             {/* Lista de lançamentos */}
             <div className="space-y-2">
               {selectedDayFinances.map((r) => (
                 <div key={r.id} className="flex items-center gap-2 text-xs">
                   <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                     r.type === 'income' ? 'bg-emerald-400' : 'bg-rose-400'
                   }`} />
                   <span className="flex-1 text-gray-600 truncate">{r.description}</span>
                   {r.category && (
                     <span className="text-[10px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded-full font-medium flex-shrink-0">
                       {r.category}
                     </span>
                   )}
                   <span className={`font-bold flex-shrink-0 ${
                     r.type === 'income' ? 'text-emerald-600' : 'text-rose-500'
                   }`}>
                     {r.type === 'expense' ? '−' : '+'}{formatBRL(r.amount)}
                   </span>
                 </div>
               ))}
             </div>
           </div>
         )}

         {/* ── Roda da Vida do dia ── */}
         {!isSelectedFuture && selectedDayWheel && (
           <div className="mt-4 pt-4 border-t border-gray-100">
             <div className="flex items-center justify-between mb-3">
               <p className="text-xs font-bold text-gray-400 tracking-wider uppercase">Roda da Vida</p>
               {(() => {
                 const keys = ['social', 'spirituality', 'intellectual', 'physical'];
                 const avg = Math.round(keys.reduce((s, k) => s + (selectedDayWheel.scores[k] ?? 0), 0) / keys.length * 10) / 10;
                 const cls = avg >= 7 ? 'bg-emerald-100 text-emerald-700' : avg >= 4 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700';
                 return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cls}`}>{avg}/10</span>;
               })()}
             </div>
             <div className="grid grid-cols-2 gap-x-4 gap-y-2">
               {[
                 { key: 'social',       label: 'Social',       Icon: Users,    bar: 'bg-blue-400' },
                 { key: 'spirituality', label: 'Espirit.',      Icon: Sparkles, bar: 'bg-violet-400' },
                 { key: 'intellectual', label: 'Intelectual',   Icon: Brain,    bar: 'bg-amber-400' },
                 { key: 'physical',     label: 'Físico',        Icon: Dumbbell, bar: 'bg-emerald-400' },
               ].map(({ key, label, Icon, bar }) => {
                 const score = selectedDayWheel.scores[key] ?? 0;
                 return (
                   <div key={key} className="flex items-center gap-1.5">
                     <Icon size={10} className="text-gray-400 flex-shrink-0" />
                     <span className="text-[10px] text-gray-500 w-[52px] flex-shrink-0">{label}</span>
                     <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                       <div className={`h-full rounded-full ${bar}`} style={{ width: `${(score / 10) * 100}%` }} />
                     </div>
                     <span className="text-[10px] font-bold text-gray-600 w-3 text-right flex-shrink-0">{score}</span>
                   </div>
                 );
               })}
             </div>
             {selectedDayWheel.feedback && (
               <p className="mt-2.5 text-[10px] text-gray-400 italic border-t border-gray-50 pt-2 line-clamp-2">{selectedDayWheel.feedback}</p>
             )}
           </div>
         )}

         {/* Estado vazio — só exibe se não há nenhum dado */}
         {!isSelectedFuture && (!selectedInfo || (!selectedInfo.intention && selectedInfo.habitsDetails.length === 0 && !selectedInfo.emotionLevel)) && selectedDayFinances.length === 0 && !selectedDayWheel && (
           <p className="text-gray-400 text-sm text-center py-4 bg-gray-50 rounded-xl">Sem histórico de atividades para este dia.</p>
         )}
      </div>

    </div>
  );
}
