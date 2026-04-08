import { Sparkles } from 'lucide-react';
import { useDailyLog } from '../../hooks/useDailyLog';
import { useState, useEffect } from 'react';

export function NoteCard() {
  const { log, loading, updateNote } = useDailyLog();
  const [localNote, setLocalNote] = useState('');

  useEffect(() => {
    if (log && (log.intention !== undefined || log.learned !== undefined)) {
      setLocalNote(log.intention || log.learned || '');
    }
  }, [log?.intention, log?.learned]);

  const handleBlur = () => {
    if (log && localNote !== (log.intention || log.learned || '')) {
      updateNote(localNote);
    }
  };

  return (
    <div className="bg-primary-lilac/30 rounded-3xl p-6 border border-primary-lilac/50 relative overflow-hidden group hover:bg-primary-lilac/40 transition-colors shadow-sm flex flex-col min-h-[160px]">
      <div className="absolute -top-4 -right-4 p-4 opacity-20 group-hover:opacity-40 transition-opacity transform group-hover:scale-110 duration-500 pointer-events-none">
        <Sparkles size={80} className="text-primary-dark" strokeWidth={1} />
      </div>
      
      <div className="relative z-10 flex-grow flex flex-col">
        <p className="text-xs font-bold tracking-widest uppercase text-primary-dark/50 mb-2">
          Intenção do Dia
        </p>
        
        {loading ? (
          <div className="animate-pulse space-y-2 mt-2">
            <div className="h-6 bg-primary-lilac/50 rounded w-full"></div>
            <div className="h-6 bg-primary-lilac/50 rounded w-4/5"></div>
          </div>
        ) : (
          <textarea
            value={localNote}
            onChange={(e) => setLocalNote(e.target.value)}
            onBlur={handleBlur}
            placeholder="Qual sua intenção para hoje?"
            className="w-full bg-transparent border-none resize-none focus:outline-none focus:ring-0 font-serif text-xl text-primary-dark leading-snug placeholder:text-primary-dark/30 flex-grow"
            rows={3}
          />
        )}
      </div>
    </div>
  );
}
