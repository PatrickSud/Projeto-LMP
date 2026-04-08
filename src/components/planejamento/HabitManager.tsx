import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { Habit } from '../../types';

interface HabitManagerProps {
  habits: Habit[];
  onAddHabit: (title: string, daysOfWeek: number[]) => Promise<boolean>;
  onToggleActive: (habitId: string, isActive: boolean) => void;
}

const WEEK_DAYS = [
  { id: 0, label: 'D' },
  { id: 1, label: 'S' },
  { id: 2, label: 'T' },
  { id: 3, label: 'Q' },
  { id: 4, label: 'Q' },
  { id: 5, label: 'S' },
  { id: 6, label: 'S' }
];

export function HabitManager({ habits, onAddHabit, onToggleActive }: HabitManagerProps) {
  const [newTitle, setNewTitle] = useState('');
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]); // Seg a Sex base
  const [isAdding, setIsAdding] = useState(false);

  const toggleDay = (dayId: number) => {
    setSelectedDays(prev => 
      prev.includes(dayId) ? prev.filter(d => d !== dayId) : [...prev, dayId]
    );
  };

  const handleAddSubmit = async () => {
    if (!newTitle.trim() || selectedDays.length === 0) return;
    
    setIsAdding(true);
    const success = await onAddHabit(newTitle, selectedDays);
    if (success) {
      setNewTitle('');
      setSelectedDays([1, 2, 3, 4, 5]);
    }
    setIsAdding(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Formulário Novo Hábito */}
      <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-gray-100">
        <h3 className="font-serif text-xl text-primary-dark mb-4">Criar Novo Hábito</h3>
        
        <input 
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Ex: Ler 10 páginas"
          className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 mb-4 focus:ring-2 focus:ring-primary/20 text-gray-700 placeholder:text-gray-400"
        />
        
        <p className="text-sm text-gray-500 mb-2 font-medium">Dias da Semana</p>
        <div className="flex justify-between mb-6">
          {WEEK_DAYS.map(day => {
            const isSelected = selectedDays.includes(day.id);
            return (
              <button
                key={day.id}
                onClick={() => toggleDay(day.id)}
                className={`w-10 h-10 rounded-full font-bold text-sm transition-all flex items-center justify-center ${
                  isSelected 
                    ? 'bg-primary text-white shadow-md shadow-primary/20 scale-105' 
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                }`}
              >
                {day.label}
              </button>
            );
          })}
        </div>
        
        <button
          onClick={handleAddSubmit}
          disabled={isAdding || !newTitle.trim() || selectedDays.length === 0}
          className="w-full py-3 rounded-xl bg-primary-dark text-white font-bold flex items-center justify-center space-x-2 hover:bg-primary transition-all disabled:opacity-50"
        >
          {isAdding ? (
            <div className="w-5 h-5 border-2 border-white/80 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <Plus size={20} />
              <span>Adicionar Hábito</span>
            </>
          )}
        </button>
      </div>

      {/* Lista de Hábitos Gestão */}
      <div className="space-y-3">
        <h3 className="font-serif text-lg text-primary-dark ml-2">Meus Hábitos</h3>
        {habits.length === 0 ? (
          <p className="text-gray-400 text-sm italic text-center py-4">Nenhum hábito cadastrado ainda.</p>
        ) : (
          habits.map(habit => (
            <div key={habit.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between opacity-100 transition-opacity">
              <div className="flex-grow">
                <p className={`font-semibold text-gray-800 ${!habit.isActive && 'text-gray-400 line-through'}`}>{habit.title}</p>
                <div className="flex space-x-1 mt-1.5">
                  {WEEK_DAYS.map(d => (
                    <span 
                      key={d.id} 
                      className={`text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold ${
                        habit.daysOfWeek.includes(d.id) 
                          ? (habit.isActive ? 'bg-primary-lilac/50 text-primary' : 'bg-gray-200 text-gray-400')
                          : 'text-gray-300'
                      }`}
                    >
                      {d.label[0]}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => onToggleActive(habit.id, !habit.isActive)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  habit.isActive 
                    ? 'bg-red-50 text-red-500 hover:bg-red-100' 
                    : 'bg-green-50 text-green-600 hover:bg-green-100'
                }`}
              >
                {habit.isActive ? 'Pausar' : 'Ativar'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
