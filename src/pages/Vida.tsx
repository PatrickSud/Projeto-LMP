import { useState, useEffect } from 'react';
import { Users, Sparkles, Brain, Dumbbell, CheckCircle2 } from 'lucide-react';
import { useWheelOfLife } from '../hooks/useWheelOfLife';
import { PillarSlider } from '../components/vida/PillarSlider';
import { FeedbackSection } from '../components/vida/FeedbackSection';

export function Vida() {
  const { wheelData, loading, saveWheelData } = useWheelOfLife();
  
  const [scores, setScores] = useState({
    social: 5,
    spirituality: 5,
    intellectual: 5,
    physical: 5,
  });
  const [feedback, setFeedback] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (wheelData) {
      setScores({
        social: wheelData.scores.social || 5,
        spirituality: wheelData.scores.spirituality || 5,
        intellectual: wheelData.scores.intellectual || 5,
        physical: wheelData.scores.physical || 5,
      });
      setFeedback(wheelData.feedback || '');
    }
  }, [wheelData]);

  const handleScoreChange = (pillar: keyof typeof scores, value: number) => {
    setScores(prev => ({ ...prev, [pillar]: value }));
    if (savedSuccess) setSavedSuccess(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setSavedSuccess(false);
    
    const success = await saveWheelData(scores, feedback);
    
    setSaving(false);
    if (success) {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    }
  };

  if (loading) {
    return (
      <div className="p-6 h-full flex flex-col pt-12 pb-28 items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium animate-pulse">A carregar a sua evolução...</p>
      </div>
    );
  }

  return (
    <div className="p-6 h-full flex flex-col pt-10 pb-28 min-h-screen bg-gray-50">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-primary-dark mb-3">Roda da Vida</h1>
        <p className="text-gray-500 text-[15px] leading-relaxed">
          Avalie de 1 a 10 as quatro principais áreas da sua vida. Seja sincera consigo mesma e observe a sua evolução.
        </p>
      </div>

      <div className="space-y-4 mb-2 flex-grow">
        <PillarSlider
          label="Social"
          icon={<Users size={18} strokeWidth={2.5} />}
          value={scores.social}
          onChange={(val) => handleScoreChange('social', val)}
        />
        <PillarSlider
          label="Espiritualidade"
          icon={<Sparkles size={18} strokeWidth={2.5} />}
          value={scores.spirituality}
          onChange={(val) => handleScoreChange('spirituality', val)}
        />
        <PillarSlider
          label="Intelectual"
          icon={<Brain size={18} strokeWidth={2.5} />}
          value={scores.intellectual}
          onChange={(val) => handleScoreChange('intellectual', val)}
        />
        <PillarSlider
          label="Físico"
          icon={<Dumbbell size={18} strokeWidth={2.5} />}
          value={scores.physical}
          onChange={(val) => handleScoreChange('physical', val)}
        />

        <FeedbackSection 
          value={feedback} 
          onChange={(val) => { 
            setFeedback(val); 
            if (savedSuccess) setSavedSuccess(false); 
          }} 
        />
      </div>

      <div className="mt-8 flex flex-col items-center">
        <button
          onClick={handleSave}
          disabled={saving}
          className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 ${
            saving 
              ? 'bg-primary/70 cursor-not-allowed' 
              : 'bg-primary hover:bg-primary-dark hover:shadow-primary/30 transform hover:-translate-y-1'
          }`}
        >
          {saving ? (
            <>
              <div className="w-5 h-5 border-2 border-white/80 border-t-transparent rounded-full animate-spin mr-2"></div>
              A guardar...
            </>
          ) : (
            <span>Guardar Avaliação</span>
          )}
        </button>
        
        {/* Placeholder spacer mantendo o layout fluido ou mostrando o success */}
        <div className={`mt-4 h-6 flex items-center text-green-600 text-sm font-medium transition-all duration-500 ${
          savedSuccess ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
        }`}>
          <CheckCircle2 size={16} className="mr-2" />
          Avaliação guardada com sucesso!
        </div>
      </div>
    </div>
  );
}
