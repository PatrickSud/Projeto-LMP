import { useState, useEffect } from 'react';
import { Users, Sparkles, Brain, Dumbbell, CheckCircle2 } from 'lucide-react';
import { useWheelOfLife } from '../hooks/useWheelOfLife';
import { PillarSlider } from '../components/vida/PillarSlider';
import { FeedbackSection } from '../components/vida/FeedbackSection';

// ── Configuração dos pilares (compartilhada com WheelMiniCard) ──────────────
const PILLARS = [
  { key: 'social',       label: 'Social',        icon: Users,    bar: 'bg-blue-400' },
  { key: 'spirituality', label: 'Espiritualidade',icon: Sparkles, bar: 'bg-violet-400' },
  { key: 'intellectual', label: 'Intelectual',    icon: Brain,    bar: 'bg-amber-400' },
  { key: 'physical',     label: 'Físico',         icon: Dumbbell, bar: 'bg-emerald-400' },
] as const;

function averageScore(scores: Record<string, number>) {
  const total = PILLARS.reduce((s, p) => s + (scores[p.key] ?? 0), 0);
  return Math.round((total / PILLARS.length) * 10) / 10;
}

function ScoreBadge({ score }: { score: number }) {
  const cls =
    score >= 7
      ? 'bg-emerald-100 text-emerald-700'
      : score >= 4
      ? 'bg-amber-100 text-amber-700'
      : 'bg-rose-100 text-rose-700';
  return (
    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${cls}`}>
      {score}/10
    </span>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────
export function Vida() {
  const { wheelData, allWheelData, loading, saveWheelData } = useWheelOfLife();

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
        social:        wheelData.scores.social        || 5,
        spirituality:  wheelData.scores.spirituality  || 5,
        intellectual:  wheelData.scores.intellectual  || 5,
        physical:      wheelData.scores.physical      || 5,
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
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 font-medium animate-pulse">A carregar a sua evolução...</p>
      </div>
    );
  }

  // Histórico: exclui o mais recente (já mostrado no formulário)
  const history = allWheelData.slice(1, 6);

  return (
    <div className="p-6 h-full flex flex-col pt-10 pb-28 min-h-screen bg-gray-50">

      {/* ── Header ── */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-primary-dark mb-3">Roda da Vida</h1>
        <p className="text-gray-500 text-[15px] leading-relaxed">
          Avalie de 1 a 10 as quatro principais áreas da sua vida. Seja sincera consigo mesma e observe a sua evolução.
        </p>
      </div>

      {/* ── Pilares ── */}
      <div className="space-y-4 mb-2 flex-grow">
        <PillarSlider label="Social"          icon={<Users    size={18} strokeWidth={2.5} />} value={scores.social}        onChange={(v) => handleScoreChange('social', v)} />
        <PillarSlider label="Espiritualidade" icon={<Sparkles size={18} strokeWidth={2.5} />} value={scores.spirituality}  onChange={(v) => handleScoreChange('spirituality', v)} />
        <PillarSlider label="Intelectual"     icon={<Brain    size={18} strokeWidth={2.5} />} value={scores.intellectual}  onChange={(v) => handleScoreChange('intellectual', v)} />
        <PillarSlider label="Físico"          icon={<Dumbbell size={18} strokeWidth={2.5} />} value={scores.physical}      onChange={(v) => handleScoreChange('physical', v)} />
        <FeedbackSection
          value={feedback}
          onChange={(val) => { setFeedback(val); if (savedSuccess) setSavedSuccess(false); }}
        />
      </div>

      {/* ── Botão Guardar ── */}
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
              <div className="w-5 h-5 border-2 border-white/80 border-t-transparent rounded-full animate-spin mr-2" />
              A guardar...
            </>
          ) : (
            <span>Guardar Avaliação</span>
          )}
        </button>

        <div className={`mt-4 h-6 flex items-center text-green-600 text-sm font-medium transition-all duration-500 ${
          savedSuccess ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
        }`}>
          <CheckCircle2 size={16} className="mr-2" />
          Avaliação guardada com sucesso!
        </div>
      </div>

      {/* ── Histórico de Avaliações ── */}
      {history.length > 0 && (
        <div className="mt-8 animate-fade-in">
          <h2 className="font-serif text-xl text-primary-dark mb-4">Histórico de Avaliações</h2>
          <div className="space-y-3">
            {history.map((record) => {
              const d =
                record.createdAt instanceof Date
                  ? record.createdAt
                  : new Date(record.createdAt as unknown as string);
              const avg = averageScore(record.scores);

              return (
                <div
                  key={record.id}
                  className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm"
                >
                  {/* Data + badge */}
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-xs font-bold text-gray-500">
                      {d.toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                    <ScoreBadge score={avg} />
                  </div>

                  {/* Mini barras em grid 2×2 */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    {PILLARS.map(({ key, label, bar }) => {
                      const score = record.scores[key] ?? 0;
                      return (
                        <div key={key} className="flex items-center gap-1.5">
                          <span className="text-[10px] text-gray-400 w-[68px] flex-shrink-0">
                            {label}
                          </span>
                          <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${bar}`}
                              style={{ width: `${(score / 10) * 100}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-bold text-gray-500 w-3 text-right flex-shrink-0">
                            {score}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Feedback snippet */}
                  {record.feedback && (
                    <p className="mt-3 text-xs text-gray-400 italic border-t border-gray-50 pt-2 line-clamp-2">
                      "{record.feedback}"
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
