import { useNavigate } from 'react-router-dom';
import { useWheelOfLife } from '../../hooks/useWheelOfLife';
import { Users, Sparkles, Brain, Dumbbell, ArrowRight } from 'lucide-react';

// ── Configuração dos pilares ────────────────────────────────────────────────
const PILLARS = [
  { key: 'social', label: 'Social', icon: Users, bar: 'bg-blue-400' },
  { key: 'spirituality', label: 'Espirit.', icon: Sparkles, bar: 'bg-violet-400' },
  { key: 'intellectual', label: 'Intelectual', icon: Brain, bar: 'bg-amber-400' },
  { key: 'physical', label: 'Físico', icon: Dumbbell, bar: 'bg-emerald-400' },
] as const;

// ── Helpers ─────────────────────────────────────────────────────────────────
function avgScore(scores: Record<string, number>) {
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

// ── Widget ──────────────────────────────────────────────────────────────────
export function WheelMiniCard() {
  const navigate = useNavigate();
  const { wheelData, loading } = useWheelOfLife();

  // ── Loading skeleton ───────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 mb-6 animate-pulse">
        <div className="flex justify-between mb-4">
          <div className="h-5 bg-gray-200 rounded w-1/3" />
          <div className="h-5 bg-gray-100 rounded w-20" />
        </div>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-3 mb-2.5">
            <div className="w-3 h-3 bg-gray-100 rounded" />
            <div className="w-16 h-3 bg-gray-100 rounded" />
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full" />
            <div className="w-4 h-3 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
    );
  }

  const avg = wheelData ? avgScore(wheelData.scores) : null;

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 mb-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-serif text-lg text-primary-dark font-bold">Roda da Vida</h3>
          {avg !== null && <ScoreBadge score={avg} />}
        </div>
        <button
          onClick={() => navigate('/vida')}
          className="flex items-center gap-1 text-xs font-bold text-primary px-3 py-1.5 bg-primary-lilac/30 rounded-xl hover:bg-primary-lilac/50 transition-colors"
        >
          {wheelData ? 'Atualizar' : 'Avaliar'}
          <ArrowRight size={13} />
        </button>
      </div>

      {/* Estado vazio */}
      {!wheelData ? (
        <div className="text-center py-4 bg-gray-50 rounded-2xl">
          <p className="text-sm text-gray-500 font-medium">Nenhuma avaliação ainda.</p>
          <p className="text-xs text-gray-400 mt-1">
            Toque em{' '}
            <strong className="text-primary font-medium">Avaliar</strong> para começar.
          </p>
        </div>
      ) : (
        <>
          {/* Barras de progresso */}
          <div className="space-y-2.5">
            {PILLARS.map(({ key, label, icon: Icon, bar }) => {
              const score = wheelData.scores[key] ?? 0;
              return (
                <div key={key} className="flex items-center gap-2">
                  <Icon size={12} className="text-gray-400 flex-shrink-0" />
                  <span className="text-xs text-gray-500 w-[72px] flex-shrink-0">{label}</span>
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${bar}`}
                      style={{ width: `${(score / 10) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-gray-600 w-4 text-right flex-shrink-0">
                    {score}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Data da última avaliação */}
          {wheelData.createdAt && (
            <p className="text-[10px] text-gray-400 mt-3 text-right">
              Avaliado em{' '}
              {new Date(wheelData.createdAt).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
              })}
            </p>
          )}
        </>
      )}
    </div>
  );
}
