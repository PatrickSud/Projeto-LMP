import { Check } from 'lucide-react';
import { useState } from 'react';

const INITIAL_TASKS = [
  { id: 1, title: 'Beber 2L de água', completed: true },
  { id: 2, title: 'Meditação matinal (15 min)', completed: false },
  { id: 3, title: 'Revisar metas da semana', completed: false },
  { id: 4, title: 'Leitura antes de dormir', completed: false },
];

export function DailyChecklist() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  return (
    <div className="mb-8">
      <h3 className="font-serif text-xl text-primary-dark mb-4 flex items-center">
        Checklist Diário
        <span className="ml-3 text-xs font-sans text-gray-400 bg-gray-100 px-2 py-1 rounded-full font-medium">
          {tasks.filter(t => t.completed).length}/{tasks.length}
        </span>
      </h3>
      
      <div className="bg-white rounded-3xl p-5 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-gray-100/50 flex flex-col space-y-4">
        {tasks.map(task => (
          <button 
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className="flex items-center space-x-3 group w-full text-left p-1 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-light/20"
          >
            <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
              task.completed 
                ? 'bg-primary border-primary text-white scale-110 shadow-sm shadow-primary/20' 
                : 'border-gray-200 text-transparent group-hover:border-primary-light'
            }`}>
              <Check size={14} strokeWidth={task.completed ? 3 : 2} className={task.completed ? 'opacity-100' : 'opacity-0'} />
            </div>
            <span className={`text-[15px] transition-all duration-300 ${
              task.completed ? 'text-gray-400 line-through' : 'text-gray-700 font-medium group-hover:text-primary-dark'
            }`}>
              {task.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
