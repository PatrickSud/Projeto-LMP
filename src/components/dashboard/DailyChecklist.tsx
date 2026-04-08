import { Check } from 'lucide-react';
import { useDailyLog } from '../../hooks/useDailyLog';

export function DailyChecklist() {
  const { log, loading, toggleTask } = useDailyLog();

  if (loading) {
    return (
      <div className="mb-8">
        <h3 className="font-serif text-xl text-primary-dark mb-4 flex items-center">
          Checklist Diário
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

  const tasks = log?.checklist || [];
  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="mb-8">
      <h3 className="font-serif text-xl text-primary-dark mb-4 flex items-center">
        Checklist Diário
        <span className="ml-3 text-xs font-sans text-gray-400 bg-gray-100 px-2 py-1 rounded-full font-medium">
          {completedCount}/{tasks.length}
        </span>
      </h3>
      
      <div className="bg-white rounded-3xl p-5 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-gray-100/50 flex flex-col space-y-4">
        {tasks.map(taskItem => (
          <button 
            key={taskItem.id}
            onClick={() => toggleTask(taskItem.id)}
            className="flex items-center space-x-3 group w-full text-left p-1 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-light/20"
          >
            <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
              taskItem.completed 
                ? 'bg-primary border-primary text-white scale-110 shadow-sm shadow-primary/20' 
                : 'border-gray-200 text-transparent group-hover:border-primary-light'
            }`}>
              <Check size={14} strokeWidth={taskItem.completed ? 3 : 2} className={taskItem.completed ? 'opacity-100' : 'opacity-0'} />
            </div>
            <span className={`text-[15px] transition-all duration-300 ${
              taskItem.completed ? 'text-gray-400 line-through' : 'text-gray-700 font-medium group-hover:text-primary-dark'
            }`}>
              {taskItem.task}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
