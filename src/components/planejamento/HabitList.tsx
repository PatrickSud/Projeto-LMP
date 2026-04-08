import { Check } from 'lucide-react';
import type { Habit, HabitTracking } from '../../types';

interface HabitListProps {
  habits: Habit[];
  trackings: Record<string, HabitTracking>;
  dateStr: string;
  onToggle: (habitId: string, dateStr: string, completed: boolean) => void;
}

export function HabitList({ habits, trackings, dateStr, onToggle }: HabitListProps) {
  if (habits.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-gray-100 text-center animate-fade-in shadow-sm">
        <p className="text-gray-500 font-medium">Não há hábitos planeados para hoje!</p>
        <p className="text-gray-400 text-sm mt-2">Vá à aba Gerir para criar novos hábitos.</p>
      </div>
    );
  }

  const completedCount = habits.filter(h => trackings[h.id]?.completed).length;

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className="font-serif text-lg text-primary-dark">Progresso de Hoje</h3>
        <span className="text-xs font-sans text-gray-400 bg-white shadow-sm border border-gray-100 px-3 py-1 rounded-full font-medium">
          {completedCount} / {habits.length}
        </span>
      </div>

      <div className="bg-white rounded-3xl p-5 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-gray-100/50 flex flex-col space-y-4">
        {habits.map(habit => {
          const isCompleted = trackings[habit.id]?.completed || false;
          
          return (
            <button 
              key={habit.id}
              onClick={() => onToggle(habit.id, dateStr, !isCompleted)}
              className="flex items-center space-x-4 w-full text-left p-2 rounded-xl hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-primary-light/20 group"
            >
              <div className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                isCompleted 
                  ? 'bg-primary border-primary text-white scale-110 shadow-md shadow-primary/30' 
                  : 'border-gray-200 text-transparent group-hover:border-primary-light group-hover:bg-primary-lilac/10'
              }`}>
                <Check size={16} strokeWidth={isCompleted ? 3 : 2} className={isCompleted ? 'opacity-100' : 'opacity-0'} />
              </div>
              <span className={`text-[16px] transition-all duration-300 ${
                isCompleted ? 'text-gray-400 line-through' : 'text-gray-700 font-medium group-hover:text-primary-dark'
              }`}>
                {habit.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
