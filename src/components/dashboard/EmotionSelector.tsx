import { useState } from 'react';
import { ChevronDown, Sparkles, AlertCircle } from 'lucide-react';
import { useDailyLog } from '../../hooks/useDailyLog';

const EMOTIONS = [
  { level: 700, label: 'Iluminação', color: 'bg-yellow-100 text-yellow-700' },
  { level: 600, label: 'Paz', color: 'bg-cyan-100 text-cyan-700' },
  { level: 540, label: 'Alegria', color: 'bg-orange-100 text-orange-700' },
  { level: 500, label: 'Amor', color: 'bg-rose-100 text-rose-700' },
  { level: 400, label: 'Razão', color: 'bg-blue-100 text-blue-700' },
  { level: 350, label: 'Aceitação', color: 'bg-teal-100 text-teal-700' },
  { level: 310, label: 'Disposição', color: 'bg-green-100 text-green-700' },
  { level: 250, label: 'Neutralidade', color: 'bg-gray-100 text-gray-700' },
  { level: 200, label: 'Coragem', color: 'bg-violet-100 text-violet-700' },
  { level: 175, label: 'Orgulho', color: 'bg-red-50 text-red-700' },
  { level: 150, label: 'Raiva', color: 'bg-red-100 text-red-800' },
  { level: 125, label: 'Desejo', color: 'bg-pink-100 text-pink-700' },
  { level: 100, label: 'Medo', color: 'bg-stone-200 text-stone-700' },
  { level: 76, label: 'Tristeza', color: 'bg-indigo-100 text-indigo-700' },
  { level: 50, label: 'Apatia', color: 'bg-gray-200 text-gray-500' },
  { level: 30, label: 'Culpa', color: 'bg-zinc-800 text-zinc-300' },
  { level: 20, label: 'Vergonha', color: 'bg-black text-gray-300' },
];

export function EmotionSelector() {
  const { log, loading, updateEmotion } = useDailyLog();
  const [isOpen, setIsOpen] = useState(false);

  if (loading) {
     return (
       <div className="mb-6 bg-white rounded-3xl p-5 shadow-sm border border-gray-100 animate-pulse h-20 w-full" />
     );
  }

  const currentEmotion = EMOTIONS.find(e => e.level === log?.emotionLevel);

  const handleSelect = (level: number) => {
    updateEmotion(level);
    setIsOpen(false);
  };

  return (
    <div className="mb-8 relative z-30">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white rounded-3xl p-5 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-gray-100/50 flex items-center justify-between group transition-all hover:shadow-[0_4px_25px_-5px_rgba(0,0,0,0.1)]"
      >
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${currentEmotion ? currentEmotion.color : 'bg-primary-lilac/30 text-primary'}`}>
            {currentEmotion && currentEmotion.level >= 200 ? <Sparkles size={20} /> : currentEmotion ? <AlertCircle size={20} /> : <Sparkles size={20} />}
          </div>
          <div className="text-left">
            <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400 mb-0.5">Mapa de Emoções</p>
            <p className="font-serif text-lg text-primary-dark font-medium leading-none">
              {currentEmotion ? currentEmotion.label : 'Como se sente hoje?'}
            </p>
          </div>
        </div>
        <ChevronDown size={20} className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-[105%] left-0 right-0 bg-white rounded-3xl shadow-xl shadow-gray-200/60 border border-gray-100 p-2 z-50 max-h-[350px] overflow-y-auto transform origin-top animate-fade-in custom-scrollbar">
          <div className="p-3">
            <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-2">Positivas (Expansão)</h4>
            <div className="grid grid-cols-2 gap-2 mb-6">
              {EMOTIONS.filter(e => e.level >= 200).map(emotion => (
                <button
                  key={emotion.level}
                  onClick={() => handleSelect(emotion.level)}
                  className={`flex flex-col items-start p-3 rounded-2xl border transition-all ${
                    log?.emotionLevel === emotion.level 
                      ? 'border-primary bg-primary-lilac/10 ring-1 ring-primary/30' 
                      : 'border-transparent hover:bg-gray-50 hover:border-gray-200'
                  }`}
                >
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mb-1 border border-black/5 ${emotion.color}`}>
                    {emotion.level} Hz
                  </span>
                  <span className="font-medium text-gray-700 text-sm pl-1">{emotion.label}</span>
                </button>
              ))}
            </div>

            <h4 className="text-[11px] font-bold text-red-300 uppercase tracking-widest mb-3 px-2">Negativas (Contração)</h4>
            <div className="grid grid-cols-2 gap-2">
              {EMOTIONS.filter(e => e.level < 200).map(emotion => (
                <button
                  key={emotion.level}
                  onClick={() => handleSelect(emotion.level)}
                  className={`flex flex-col items-start p-3 rounded-2xl border transition-all ${
                    log?.emotionLevel === emotion.level 
                      ? 'border-red-400 bg-red-50 ring-1 ring-red-400/30' 
                      : 'border-transparent hover:bg-gray-50 hover:border-red-100'
                  }`}
                >
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mb-1 border border-white/20 ${emotion.color}`}>
                    {emotion.level} Hz
                  </span>
                  <span className="font-medium text-gray-700 text-sm pl-1">{emotion.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
