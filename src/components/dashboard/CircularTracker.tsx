import { useEffect, useState } from 'react';

export function CircularTracker() {
  const [dayOfMonth, setDayOfMonth] = useState(14);
  const [progress, setProgress] = useState(144);

  useEffect(() => {
    const today = new Date();
    const day = today.getDate();
    setDayOfMonth(day);
    
    // Obter dias totais do mês atual para calcular a porcentagem correta do círculo
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const progressPercent = day / daysInMonth;
    
    // Circunferência total do círculo = 289
    const offset = Math.max(0, 289 - (289 * progressPercent));
    
    // Delay para a animação do SVGs correr a partir do 0 quando renderiza
    setTimeout(() => {
      setProgress(offset);
    }, 100);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-[2rem] shadow-sm border border-secondary-light-blue/60 mb-6 aspect-square relative overflow-hidden group hover:shadow-[0_4px_25px_-5px_rgba(0,0,0,0.05)] transition-all">
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-lilac/10 to-transparent"></div>
      
      {/* Tracker Circle */}
      <div className="relative z-10 w-48 h-48 sm:w-56 sm:h-56 rounded-full border-4 border-primary-light/30 flex items-center justify-center bg-white shadow-xl shadow-primary-lilac/10 ring-4 ring-white ring-inset">
        
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="46" fill="transparent" stroke="#F9FAFB" strokeWidth="8" />
          <circle 
            cx="50" 
            cy="50" 
            r="46" 
            fill="transparent" 
            stroke="#8E06D6" 
            strokeWidth="8" 
            strokeDasharray="289" 
            strokeDashoffset={progress} 
            strokeLinecap="round" 
            className="opacity-80 transition-all duration-[1.5s] ease-out" 
          />
        </svg>

        <div className="text-center relative z-20">
          <p className="text-gray-400 mb-0 font-medium tracking-[0.2em] text-[10px] uppercase">Dia do Mês</p>
          <span className="font-serif text-6xl text-primary-dark block leading-none mt-2">{dayOfMonth}</span>
        </div>
      </div>
      
      {/* Info */}
      <div className="mt-8 relative z-10 text-center">
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary-lilac/20 text-primary-dark text-xs font-medium tracking-wide mb-2">
          Foco Diário
        </span>
        <p className="text-sm text-gray-500 max-w-[220px] mx-auto leading-relaxed">
          Mantenha a atenção plena naquilo que está sob o seu controlo.
        </p>
      </div>
    </div>
  );
}
