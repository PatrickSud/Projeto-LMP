import { useState } from 'react';
import type { FormEvent } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { useFinances, getCurrentMonthYear, shiftMonthYear } from '../hooks/useFinances';
import { useFinanceCategories } from '../hooks/useFinanceCategories';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Trash2,
  PlusCircle,
  Plus,
  X,
  StickyNote,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Tag,
  Check,
  Pencil,
} from 'lucide-react';

// ── Helpers ─────────────────────────────────────────────────────────────────

const formatBRL = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const formatBRLShort = (value: number) => {
  if (value >= 1000) return `R$${(value / 1000).toFixed(1)}k`;
  return `R$${value.toFixed(0)}`;
};

const formatDate = (date: Date) =>
  date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });

const monthYearLabel = (monthYear: string) => {
  const [m, y] = monthYear.split('-');
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ];
  return `${months[parseInt(m, 10) - 1]} ${y}`;
};

const currentMonthYear = getCurrentMonthYear();

// ── SummaryCard ─────────────────────────────────────────────────────────────

type SummaryCardProps = {
  label: string;
  value: number;
  icon: React.ReactNode;
  colorClass: string;
  bgClass: string;
  borderClass: string;
};

function SummaryCard({ label, value, icon, colorClass, bgClass, borderClass }: SummaryCardProps) {
  return (
    <div className={`flex-1 min-w-0 rounded-2xl p-4 border ${bgClass} ${borderClass} animate-fade-in`}>
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${colorClass} bg-white/60`}>
        {icon}
      </div>
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 truncate">{label}</p>
      <p className={`text-base font-bold ${colorClass} leading-tight`}>{formatBRL(value)}</p>
    </div>
  );
}

// ── BarChart personalizado ─────────────────────────────────────────────────

type FinanceChartProps = {
  totalIncome: number;
  totalExpense: number;
  balance: number;
};

// Tooltip customizado
function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ value: number; name: string }> }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-lg text-sm">
        <p className="font-bold text-gray-700">{payload[0].name}</p>
        <p className="font-bold text-gray-900 mt-0.5">{formatBRL(payload[0].value)}</p>
      </div>
    );
  }
  return null;
}

function FinanceChart({ totalIncome, totalExpense, balance }: FinanceChartProps) {
  const isPositive = balance >= 0;

  const data = [
    { name: 'Entradas', value: totalIncome, color: '#10b981' },
    { name: 'Saídas', value: totalExpense, color: '#f43f5e' },
    { name: 'Saldo', value: Math.abs(balance), color: isPositive ? '#8E06D6' : '#f97316' },
  ];

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 animate-fade-in">
      <div className="flex items-center gap-2 mb-1">
        <h2 className="font-serif text-lg font-bold text-primary-dark">Visão Geral</h2>
      </div>
      <p className="text-xs text-gray-400 mb-4">Comparativo do mês em reais</p>

      {/* Legenda */}
      <div className="flex gap-4 mb-4">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
            <span className="text-xs text-gray-500 font-medium">{d.name}</span>
          </div>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} barCategoryGap="35%" barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fontWeight: 600, fill: '#6b7280' }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            tickFormatter={formatBRLShort}
            width={55}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb' }} />
          <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={64}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.9} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── RecordRow ───────────────────────────────────────────────────────────────

type RecordRowProps = {
  date: Date;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category?: string;
  onDelete: () => void;
};

function RecordRow({ date, description, amount, type, category, onDelete }: RecordRowProps) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0 group animate-fade-in">
      <span className="text-xs text-gray-400 w-14 flex-shrink-0 font-medium">{formatDate(date)}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-700 font-medium truncate">{description}</p>
        {category && (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-400 mt-0.5">
            <Tag size={9} />
            {category}
          </span>
        )}
      </div>
      <span
        className={`text-sm font-bold flex-shrink-0 ${
          type === 'income' ? 'text-emerald-600' : 'text-rose-500'
        }`}
      >
        {type === 'expense' ? '−' : '+'}
        {formatBRL(amount)}
      </span>
      <button
        onClick={onDelete}
        className="ml-1 p-1.5 rounded-lg text-gray-300 hover:text-rose-400 hover:bg-rose-50 transition-all opacity-0 group-hover:opacity-100"
        aria-label="Excluir registro"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

// ── Modal de Adição ─────────────────────────────────────────────────────────

type AddModalProps = {
  onClose: () => void;
  onAdd: (
    type: 'income' | 'expense',
    amount: number,
    description: string,
    date: Date,
    category?: string
  ) => Promise<boolean>;
};

function AddModal({ onClose, onAdd }: AddModalProps) {
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Gestão de categorias dinâmicas
  const { incomeCategories, expenseCategories, addCategory, removeCategory } = useFinanceCategories();
  const [isManaging, setIsManaging] = useState(false);
  const [isAddingCat, setIsAddingCat] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  const categories = type === 'income' ? incomeCategories : expenseCategories;

  const handleTypeChange = (newType: 'income' | 'expense') => {
    setType(newType);
    setCategory('');
    setIsManaging(false);
    setIsAddingCat(false);
  };

  const handleAddCat = async () => {
    if (!newCatName.trim()) return;
    await addCategory(type, newCatName.trim());
    setCategory(newCatName.trim());
    setNewCatName('');
    setIsAddingCat(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount.replace(',', '.'));
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Insira um valor válido maior que zero.');
      return;
    }
    if (!description.trim()) {
      setError('Adicione uma descrição.');
      return;
    }
    setError('');
    setSaving(true);
    const success = await onAdd(
      type,
      parsedAmount,
      description.trim(),
      new Date(date + 'T12:00:00'),
      category || undefined
    );
    setSaving(false);
    if (success) onClose();
    else setError('Erro ao salvar. Tente novamente.');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md bg-white rounded-t-3xl p-6 pb-10 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-serif text-xl text-primary-dark font-bold">Novo Registro</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Toggle Tipo */}
        <div className="flex bg-gray-100 rounded-2xl p-1 mb-5">
          <button
            type="button"
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
              type === 'income'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => handleTypeChange('income')}
          >
            ↑ Entrada
          </button>
          <button
            type="button"
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
              type === 'expense'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => handleTypeChange('expense')}
          >
            ↓ Despesa
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Valor */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Valor (R$)
            </label>
            <input
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0"
              placeholder="0,00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-lg font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              required
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Descrição
            </label>
            <input
              type="text"
              placeholder={type === 'income' ? 'Ex: Salário de Abril…' : 'Ex: Supermercado, Aluguel…'}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              required
            />
          </div>

          {/* ── Categoria com gestão inline ── */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Categoria
              </label>
              <button
                type="button"
                onClick={() => { setIsManaging(!isManaging); setIsAddingCat(false); }}
                className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg transition-all ${
                  isManaging
                    ? 'bg-gray-200 text-gray-600'
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Pencil size={10} />
                {isManaging ? 'Concluir' : 'Gerenciar'}
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <div key={cat} className="relative flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => !isManaging && setCategory(cat === category ? '' : cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      isManaging
                        ? 'pr-6 bg-gray-50 text-gray-500 border-gray-200 cursor-default'
                        : category === cat
                          ? type === 'income'
                            ? 'bg-emerald-500 text-white border-emerald-500'
                            : 'bg-rose-500 text-white border-rose-500'
                          : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {cat}
                  </button>
                  {/* Botão de remover — só aparece no modo gerenciar */}
                  {isManaging && (
                    <button
                      type="button"
                      onClick={() => {
                        if (category === cat) setCategory('');
                        removeCategory(type, cat);
                      }}
                      className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-500 text-white rounded-full flex items-center justify-center hover:bg-rose-600 transition-all shadow-sm"
                      aria-label={`Remover ${cat}`}
                    >
                      <X size={9} strokeWidth={3} />
                    </button>
                  )}
                </div>
              ))}

              {/* Input inline para nova categoria */}
              {!isManaging && (
                isAddingCat ? (
                  <div className="flex items-center gap-1">
                    <input
                      autoFocus
                      type="text"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') { e.preventDefault(); handleAddCat(); }
                        if (e.key === 'Escape') { setIsAddingCat(false); setNewCatName(''); }
                      }}
                      placeholder="Nome…"
                      maxLength={24}
                      className="px-2.5 py-1.5 text-xs border border-primary/40 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/30 w-28"
                    />
                    <button
                      type="button"
                      onClick={handleAddCat}
                      className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all"
                    >
                      <Check size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => { setIsAddingCat(false); setNewCatName(''); }}
                      className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-all"
                    >
                      <X size={13} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsAddingCat(true)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold border border-dashed border-gray-300 text-gray-400 hover:border-primary hover:text-primary transition-all flex items-center gap-1"
                  >
                    <Plus size={11} />
                    Nova
                  </button>
                )
              )}
            </div>
          </div>

          {/* Data */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Data
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              required
            />
          </div>

          {error && (
            <p className="text-rose-500 text-sm font-medium bg-rose-50 px-4 py-2 rounded-xl">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-primary text-white py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary-dark transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <PlusCircle size={18} />}
            {saving ? 'Salvando…' : 'Adicionar Registro'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── RecordList ──────────────────────────────────────────────────────────────

type RecordListProps = {
  title: string;
  type: 'income' | 'expense';
  records: Array<{
    id: string;
    date: Date;
    description: string;
    amount: number;
    type: 'income' | 'expense';
    category?: string;
  }>;
  onDelete: (id: string) => void;
  accentClass: string;
  dotClass: string;
};

function RecordList({ title, type, records, onDelete, accentClass, dotClass }: RecordListProps) {
  const filtered = records.filter((r) => r.type === type);

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${dotClass}`} />
        <h2 className={`font-serif text-lg font-bold ${accentClass}`}>{title}</h2>
        <span className="ml-auto text-xs bg-gray-100 text-gray-500 font-bold px-2.5 py-0.5 rounded-full">
          {filtered.length}
        </span>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-gray-400 text-sm py-6 bg-gray-50 rounded-2xl">
          Nenhum registro ainda.
        </p>
      ) : (
        <div>
          {filtered.map((r) => (
            <RecordRow
              key={r.id}
              date={r.date}
              description={r.description}
              amount={r.amount}
              type={r.type}
              category={r.category}
              onDelete={() => onDelete(r.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Skeleton ────────────────────────────────────────────────────────────────

function FinancasSkeleton() {
  return (
    <div className="px-6 pt-12 pb-28 max-w-md mx-auto space-y-5 animate-pulse">
      <div className="h-8 bg-gray-200 rounded-xl w-2/3 mb-2" />
      <div className="h-4 bg-gray-100 rounded-xl w-1/2 mb-6" />
      <div className="flex gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex-1 h-24 bg-gray-100 rounded-2xl" />
        ))}
      </div>
      <div className="h-56 bg-gray-100 rounded-3xl" />
      {[1, 2].map((i) => (
        <div key={i} className="bg-gray-100 rounded-3xl h-40" />
      ))}
      <div className="bg-gray-100 rounded-3xl h-28" />
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────────────────────

export function Financas() {
  const [selectedMonth, setSelectedMonth] = useState(currentMonthYear);

  const {
    records,
    loading,
    monthNote,
    saveMonthNote,
    totalIncome,
    totalExpense,
    balance,
    addRecord,
    deleteRecord,
  } = useFinances(selectedMonth);

  const [showModal, setShowModal] = useState(false);
  const isCurrentMonth = selectedMonth === currentMonthYear;
  const isPositiveBalance = balance >= 0;

  if (loading) return <FinancasSkeleton />;

  return (
    <>
      <div className="px-6 pt-12 pb-28 max-w-md mx-auto space-y-5">

        {/* ── Header com navegação ── */}
        <header className="animate-fade-in">
          <h1 className="font-serif text-3xl text-primary-dark leading-tight font-bold">
            Gestor Financeiro
          </h1>

          {/* Seletor de Mês */}
          <div className="flex items-center gap-3 mt-3">
            <button
              onClick={() => setSelectedMonth((m) => shiftMonthYear(m, -1))}
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-all"
              aria-label="Mês anterior"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex-1 text-center">
              <span className="text-base font-bold text-gray-700">
                {monthYearLabel(selectedMonth)}
              </span>
              {isCurrentMonth && (
                <span className="ml-2 text-[10px] font-bold bg-primary-lilac/40 text-primary-dark px-2 py-0.5 rounded-full">
                  Atual
                </span>
              )}
            </div>

            <button
              onClick={() => setSelectedMonth((m) => shiftMonthYear(m, 1))}
              disabled={isCurrentMonth}
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Próximo mês"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </header>

        {/* ── Summary Cards ── */}
        <section className="flex gap-3 animate-fade-in">
          <SummaryCard
            label="Entradas"
            value={totalIncome}
            icon={<TrendingUp size={18} />}
            colorClass="text-emerald-600"
            bgClass="bg-emerald-50"
            borderClass="border-emerald-100"
          />
          <SummaryCard
            label="Despesas"
            value={totalExpense}
            icon={<TrendingDown size={18} />}
            colorClass="text-rose-500"
            bgClass="bg-rose-50"
            borderClass="border-rose-100"
          />
          <SummaryCard
            label="Saldo"
            value={Math.abs(balance)}
            icon={<Wallet size={18} />}
            colorClass={isPositiveBalance ? 'text-primary-dark' : 'text-orange-500'}
            bgClass={isPositiveBalance ? 'bg-primary-lilac/20' : 'bg-orange-50'}
            borderClass={isPositiveBalance ? 'border-primary-lilac/40' : 'border-orange-100'}
          />
        </section>

        {/* ── Balance Banner ── */}
        <div
          className={`rounded-2xl px-5 py-3 flex items-center gap-3 animate-fade-in border ${
            isPositiveBalance
              ? 'bg-primary-lilac/15 border-primary-lilac/30 text-primary-dark'
              : 'bg-orange-50 border-orange-100 text-orange-700'
          }`}
        >
          <span className="text-lg">{isPositiveBalance ? '🎯' : '⚠️'}</span>
          <p className="text-sm font-medium leading-snug">
            {isPositiveBalance
              ? `Você economizou ${formatBRL(balance)} em ${monthYearLabel(selectedMonth)}.`
              : `Despesas superam entradas em ${formatBRL(Math.abs(balance))}.`}
          </p>
        </div>

        {/* ── Gráfico de barras ── */}
        <FinanceChart
          totalIncome={totalIncome}
          totalExpense={totalExpense}
          balance={balance}
        />

        {/* ── Add Button ── */}
        <button
          onClick={() => setShowModal(true)}
          className="w-full bg-primary text-white py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 animate-fade-in"
        >
          <PlusCircle size={18} />
          Adicionar Registro
        </button>

        {/* ── Listas ── */}
        <RecordList
          title="Entradas do Mês"
          type="income"
          records={records}
          onDelete={deleteRecord}
          accentClass="text-emerald-700"
          dotClass="bg-emerald-400"
        />

        <RecordList
          title="Despesas do Mês"
          type="expense"
          records={records}
          onDelete={deleteRecord}
          accentClass="text-rose-600"
          dotClass="bg-rose-400"
        />

        {/* ── Nota do Mês ── */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 animate-fade-in">
          <div className="flex items-center gap-2 mb-3">
            <StickyNote size={18} className="text-primary-light" />
            <h2 className="font-serif text-lg font-bold text-primary-dark">Nota do Mês</h2>
            <span className="ml-auto text-[10px] text-gray-400 font-medium">
              {monthYearLabel(selectedMonth)}
            </span>
          </div>
          <textarea
            rows={4}
            placeholder="Observações, metas financeiras, lembretes… Escreva aqui."
            value={monthNote}
            onChange={(e) => saveMonthNote(e.target.value)}
            className="w-full text-sm text-gray-700 resize-none focus:outline-none placeholder-gray-300 leading-relaxed"
          />
          <p className="text-[10px] text-gray-300 mt-2 text-right">
            Salvo automaticamente
          </p>
        </div>

      </div>

      {/* ── Modal ── */}
      {showModal && (
        <AddModal
          onClose={() => setShowModal(false)}
          onAdd={addRecord}
        />
      )}
    </>
  );
}
