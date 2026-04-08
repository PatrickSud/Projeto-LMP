import { useMemo } from 'react';
import { useFinances, getCurrentMonthYear } from '../../hooks/useFinances';
import { TrendingUp, TrendingDown, Wallet, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ── Helpers ────────────────────────────────────────────────────────────────

const formatBRL = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const getTodayStr = () => {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .split('T')[0]; // "YYYY-MM-DD"
};

// ── Component ──────────────────────────────────────────────────────────────

export function DailyFinanceSummary() {
  const navigate = useNavigate();
  const monthYear = getCurrentMonthYear();
  const { records, loading } = useFinances(monthYear);

  const todayStr = getTodayStr();

  // Filtra apenas os registros de hoje
  const todayRecords = useMemo(
    () =>
      records.filter((r) => {
        const d = r.date instanceof Date ? r.date : new Date(r.date);
        return (
          new Date(d.getTime() - d.getTimezoneOffset() * 60000)
            .toISOString()
            .split('T')[0] === todayStr
        );
      }),
    [records, todayStr]
  );

  const todayIncome = todayRecords
    .filter((r) => r.type === 'income')
    .reduce((s, r) => s + r.amount, 0);

  const todayExpense = todayRecords
    .filter((r) => r.type === 'expense')
    .reduce((s, r) => s + r.amount, 0);

  const todayBalance = todayIncome - todayExpense;
  const hasActivity = todayRecords.length > 0;
  const isPositive = todayBalance >= 0;

  // ── Loading skeleton ───────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="mb-8 animate-pulse">
        <div className="h-5 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 space-y-3">
          <div className="h-4 bg-gray-100 rounded w-1/2" />
          <div className="flex gap-3">
            <div className="flex-1 h-16 bg-gray-100 rounded-2xl" />
            <div className="flex-1 h-16 bg-gray-100 rounded-2xl" />
            <div className="flex-1 h-16 bg-gray-100 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8 animate-fade-in">
      {/* Título da seção */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif text-xl text-primary-dark">
          Fechamento do Dia
        </h3>
        <button
          onClick={() => navigate('/financas')}
          className="flex items-center gap-1 text-xs font-bold text-primary px-3 py-1.5 bg-primary-lilac/30 rounded-xl hover:bg-primary-lilac/50 transition-colors"
        >
          Ver tudo
          <ArrowRight size={13} />
        </button>
      </div>

      <div className="bg-white rounded-3xl p-5 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-gray-100/50">

        {!hasActivity ? (
          /* Estado vazio */
          <div className="text-center py-3">
            <p className="text-gray-500 font-medium text-sm">
              Nenhum registro financeiro hoje.
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Toque em <strong className="text-primary font-medium">Ver tudo</strong> para adicionar entradas ou despesas.
            </p>
          </div>
        ) : (
          <>
            {/* Mini cards de resumo */}
            <div className="flex gap-2 mb-4">
              {/* Entradas */}
              <div className="flex-1 bg-emerald-50 border border-emerald-100 rounded-2xl p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <TrendingUp size={13} className="text-emerald-600" />
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide">
                    Entradas
                  </span>
                </div>
                <p className="text-sm font-bold text-emerald-700 leading-tight">
                  {formatBRL(todayIncome)}
                </p>
              </div>

              {/* Saídas */}
              <div className="flex-1 bg-rose-50 border border-rose-100 rounded-2xl p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <TrendingDown size={13} className="text-rose-500" />
                  <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wide">
                    Saídas
                  </span>
                </div>
                <p className="text-sm font-bold text-rose-600 leading-tight">
                  {formatBRL(todayExpense)}
                </p>
              </div>

              {/* Saldo */}
              <div
                className={`flex-1 rounded-2xl p-3 border ${
                  isPositive
                    ? 'bg-primary-lilac/20 border-primary-lilac/40'
                    : 'bg-orange-50 border-orange-100'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Wallet
                    size={13}
                    className={isPositive ? 'text-primary-dark' : 'text-orange-500'}
                  />
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wide ${
                      isPositive ? 'text-primary-dark' : 'text-orange-500'
                    }`}
                  >
                    Saldo
                  </span>
                </div>
                <p
                  className={`text-sm font-bold leading-tight ${
                    isPositive ? 'text-primary-dark' : 'text-orange-600'
                  }`}
                >
                  {isPositive ? '' : '−'}
                  {formatBRL(Math.abs(todayBalance))}
                </p>
              </div>
            </div>

            {/* Lista de registros do dia */}
            <div className="space-y-0 divide-y divide-gray-50">
              {todayRecords.map((r) => (
                <div key={r.id} className="flex items-center gap-3 py-2.5">
                  <span
                    className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                      r.type === 'income' ? 'bg-emerald-400' : 'bg-rose-400'
                    }`}
                  />
                  <p className="flex-1 text-sm text-gray-600 truncate">{r.description}</p>
                  {r.category && (
                    <span className="text-[10px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded-lg font-medium flex-shrink-0">
                      {r.category}
                    </span>
                  )}
                  <span
                    className={`text-sm font-bold flex-shrink-0 ${
                      r.type === 'income' ? 'text-emerald-600' : 'text-rose-500'
                    }`}
                  >
                    {r.type === 'expense' ? '−' : '+'}
                    {formatBRL(r.amount)}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
