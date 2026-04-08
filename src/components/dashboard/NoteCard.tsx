import { Sparkles } from 'lucide-react';

export function NoteCard() {
  return (
    <div className="bg-primary-lilac/30 rounded-3xl p-6 border border-primary-lilac/50 relative overflow-hidden group hover:bg-primary-lilac/40 transition-colors shadow-sm">
      <div className="absolute -top-4 -right-4 p-4 opacity-20 group-hover:opacity-40 transition-opacity transform group-hover:scale-110 duration-500">
        <Sparkles size={80} className="text-primary-dark" strokeWidth={1} />
      </div>
      
      <div className="relative z-10">
        <p className="text-xs font-bold tracking-widest uppercase text-primary-dark/50 mb-2">
          Lembrete do Dia
        </p>
        <p className="font-serif text-xl text-primary-dark leading-snug">
          "Manter o foco nas pequenas vitórias e ser gentil comigo mesma durante o processo."
        </p>
      </div>
    </div>
  );
}
