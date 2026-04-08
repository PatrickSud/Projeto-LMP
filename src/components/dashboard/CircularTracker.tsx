export function CircularTracker() {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-[2rem] shadow-sm border border-secondary-light-blue/60 mb-6 aspect-square relative overflow-hidden group hover:shadow-md transition-shadow">
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-lilac/10 to-transparent"></div>
      
      {/* Tracker Circle */}
      <div className="relative z-10 w-48 h-48 sm:w-56 sm:h-56 rounded-full border-4 border-primary-light/30 flex items-center justify-center bg-white shadow-xl shadow-primary-lilac/10 ring-4 ring-white ring-inset">
        
        {/* Progress indicator (visual placeholder) */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="46" fill="transparent" stroke="#F9FAFB" strokeWidth="8" />
          <circle cx="50" cy="50" r="46" fill="transparent" stroke="#8E06D6" strokeWidth="8" strokeDasharray="289" strokeDashoffset="144" strokeLinecap="round" className="opacity-80" />
        </svg>

        <div className="text-center relative z-20">
          <p className="text-gray-400 mb-0 font-medium tracking-[0.2em] text-[10px] uppercase">Dia do Ciclo</p>
          <span className="font-serif text-6xl text-primary-dark block leading-none mt-2">14</span>
        </div>
      </div>
      
      {/* Info */}
      <div className="mt-8 relative z-10 text-center">
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary-lilac/20 text-primary-dark text-xs font-semibold mb-2">
          Fase Ovulatória
        </span>
        <p className="text-sm text-gray-500 max-w-[220px] mx-auto leading-relaxed">
          Sua energia criativa e social está no auge hoje. Aproveite!
        </p>
      </div>
    </div>
  );
}
