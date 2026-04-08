import { useEffect, useState } from 'react';
import { Check, Pencil, X } from 'lucide-react';
import { useHabits } from '../../hooks/useHabits';
import { HabitManager } from '../planejamento/HabitManager';

export function DailyChecklist() {
  const { habits, trackings, loading, toggleHabitCompletion, fetchTrackingsForDate, addHabit, toggleHabitActive, deleteHabit } = useHabits();
  const [isEditing, setIsEditing] = useState(false);

  const todayRaw = new Date();
  const todayDate = new Date(todayRaw.getTime() - (todayRaw.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
  const todayDayOfWeek = todayRaw.getDay();

  useEffect(() => {
    fetchTrackingsForDate(todayDate);
  }, [todayDate, fetchTrackingsForDate]);

  if (loading) {
    return (
      <div className="mb-8">
        <h3 className="font-serif text-xl text-primary-dark mb-4 flex items-center">
          Meu Ciclo
        </h3>
        <div className="bg-white rounded-3xl p-5 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-gray-100/50 flex flex-col space-y-4 animate-pulse">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex items-center space-x-3 w-full h-8 px-1">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-200"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const activeHabitsToday = habits.filter(h => h.isActive && h.daysOfWeek.includes(todayDayOfWeek));
  const completedCount = activeHabitsToday.filter(h => trackings[h.id]?.completed).length;

  return (
    <>
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-xl text-primary-dark flex items-center">
            Meu Ciclo
            <span className="ml-3 text-xs font-sans text-gray-400 bg-gray-100 px-2 py-1 rounded-full font-medium">
              {completedCount}/{activeHabitsToday.length}
            </span>
          </h3>
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-1.5 text-xs font-bold text-primary px-3 py-1.5 bg-primary-lilac/30 rounded-xl hover:bg-primary-lilac/50 transition-colors"
          >
            <Pencil size={14} />
            <span>Editar</span>
          </button>
        </div>
        
        {activeHabitsToday.length === 0 ? (
          <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-gray-100/50 text-center transform transition-all">
             <p className="text-gray-500 font-medium">Nenhuma atividade no ciclo de hoje!</p>
             <p className="text-gray-400 text-sm mt-1">Clique em <strong className="text-primary font-medium">Editar</strong> para configurar o seu calendário.</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-5 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-gray-100/50 flex flex-col space-y-4">
            {activeHabitsToday.map(habit => {
              const isCompleted = trackings[habit.id]?.completed || false;

              return (
                <button 
                  key={habit.id}
                  onClick={() => toggleHabitCompletion(habit.id, todayDate, !isCompleted)}
                  className="flex items-center space-x-3 group w-full text-left p-1 rounded-lg hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-primary-light/20"
                >
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-primary border-primary text-white scale-110 shadow-sm shadow-primary/20' 
                      : 'border-gray-200 text-transparent group-hover:border-primary-light'
                  }`}>
                    <Check size={14} strokeWidth={isCompleted ? 3 : 2} className={isCompleted ? 'opacity-100' : 'opacity-0'} />
                  </div>
                  <span className={`text-[15px] transition-all duration-300 ${
                    isCompleted ? 'text-gray-400 line-through' : 'text-gray-700 font-medium group-hover:text-primary-dark'
                  }`}>
                    {habit.title}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {isEditing && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex justify-center items-end sm:items-center">
          <div className="bg-gray-50 w-full max-w-md h-[85vh] sm:h-[80vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fade-in relative pt-4">
            <div className="px-6 flex justify-between items-center mb-2 pb-2">
              <h2 className="font-serif text-2xl font-bold text-primary-dark">Editar Ciclo</h2>
              <button 
                onClick={() => setIsEditing(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-500 hover:bg-gray-300 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="flex-grow overflow-y-auto px-6 py-4 pb-12 custom-scrollbar">
              <HabitManager 
                habits={habits}
                onAddHabit={addHabit}
                onToggleActive={toggleHabitActive}
                onDeleteHabit={deleteHabit}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
