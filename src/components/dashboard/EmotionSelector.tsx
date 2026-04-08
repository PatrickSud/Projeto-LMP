import { useState } from 'react';
import { ChevronDown, Sparkles, AlertCircle } from 'lucide-react';
import { useDailyLog } from '../../hooks/useDailyLog';
import { EMOTIONS } from '../../utils/emotions';

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
