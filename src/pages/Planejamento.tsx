import { useState, useEffect } from 'react';
import { useHabits } from '../hooks/useHabits';
import { HabitList } from '../components/planejamento/HabitList';
import { HabitManager } from '../components/planejamento/HabitManager';

export function Planejamento() {
  const { habits, trackings, loading, addHabit, toggleHabitCompletion, fetchTrackingsForDate, toggleHabitActive } = useHabits();
  const [activeTab, setActiveTab] = useState<'hoje' | 'gerir'>('hoje');
  
  const todayRaw = new Date();
  // Formato YYYY-MM-DD com compensação de fuso local
  const todayDate = new Date(todayRaw.getTime() - (todayRaw.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
  const todayDayOfWeek = todayRaw.getDay();

  useEffect(() => {
    fetchTrackingsForDate(todayDate);
  }, [todayDate, fetchTrackingsForDate]);

  const activeHabitsToday = habits.filter(h => h.isActive && h.daysOfWeek.includes(todayDayOfWeek));

  return (
    <div className="p-6 h-full flex flex-col pt-10 pb-28 min-h-screen bg-gray-50">
      <div className="mb-6">
        <h1 className="font-serif text-3xl font-bold text-primary-dark mb-2">Planejamento</h1>
        <p className="text-gray-500 text-[15px] leading-relaxed">
          Construa a sua disciplina definindo e rastreando os seus hábitos diários.
        </p>
      </div>

      {/* Tabs Selector */}
      <div className="flex bg-white rounded-2xl p-1 mb-8 shadow-sm border border-gray-100">
        <button
          onClick={() => setActiveTab('hoje')}
          className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'hoje' 
              ? 'bg-primary text-white shadow-md' 
              : 'text-gray-500 hover:text-primary-dark hover:bg-gray-50'
          }`}
        >
          Para Hoje
        </button>
        <button
          onClick={() => setActiveTab('gerir')}
          className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'gerir' 
              ? 'bg-primary text-white shadow-md' 
              : 'text-gray-500 hover:text-primary-dark hover:bg-gray-50'
          }`}
        >
          Gerir Hábitos
        </button>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="flex-grow flex flex-col items-center justify-center space-y-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium animate-pulse">A carregar hábitos...</p>
        </div>
      ) : (
        <div className="flex-grow">
          {activeTab === 'hoje' && (
            <HabitList 
              habits={activeHabitsToday} 
              trackings={trackings} 
              dateStr={todayDate} 
              onToggle={toggleHabitCompletion} 
            />
          )}

          {activeTab === 'gerir' && (
            <HabitManager 
              habits={habits}
              onAddHabit={addHabit}
              onToggleActive={toggleHabitActive}
            />
          )}
        </div>
      )}
    </div>
  );
}
